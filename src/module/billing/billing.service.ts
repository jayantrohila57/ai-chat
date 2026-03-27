import { TRPCError } from "@trpc/server";
import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/core/db/db";
import { billingOrder, paymentEvent, subscription, subscriptionPlan } from "@/core/db/db.schema";
import { getViewerAnalyticsSummary } from "@/module/analytics/analytics.service";
import {
  ensureWalletForUser,
  getWalletSummary,
  grantStarterCreditsIfEligible,
  grantSubscriptionCredits,
  listLedgerEntries,
} from "@/module/credits/credits.service";
import {
  BILLING_PLANS,
  type BillingPlanCode,
  getBillingPlanByCode,
  getBillingPlanByProviderPlanId,
} from "./billing.catalog";
import {
  cancelRazorpaySubscription,
  createRazorpaySubscription,
  getRazorpayPayment,
  getRazorpaySubscription,
  verifyRazorpayCheckoutSignature,
} from "./billing.razorpay";

export type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    subscription?: {
      entity?: {
        id?: string;
        plan_id?: string;
        status?: string;
        current_start?: number;
        current_end?: number;
        notes?: {
          userId?: string;
          planCode?: string;
        };
      };
    };
    payment?: {
      entity?: {
        id?: string;
        subscription_id?: string;
        status?: string;
        amount?: number;
        currency?: string;
        notes?: {
          userId?: string;
          planCode?: string;
        };
      };
    };
  };
};

function createId() {
  return crypto.randomUUID();
}

function isMissingDatabaseFieldError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("column") ||
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("failed query")
  );
}

function isUniqueConstraintError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("unique") || message.includes("duplicate") || message.includes("23505");
}

function mapProviderSubscriptionStatus(status: string | null | undefined) {
  switch (status) {
    case "authenticated":
      return "trialing" as const;
    case "active":
      return "active" as const;
    case "halted":
      return "past_due" as const;
    case "cancelled":
    case "completed":
      return "cancelled" as const;
    default:
      return "inactive" as const;
  }
}

function mapOrderStatus(input: { subscriptionStatus?: string | null; paymentStatus?: string | null }) {
  const paymentStatus = String(input.paymentStatus ?? "").toLowerCase();
  const subscriptionStatus = String(input.subscriptionStatus ?? "").toLowerCase();

  if (paymentStatus === "captured") return "completed" as const;
  if (paymentStatus === "authorized") return "authenticated" as const;
  if (paymentStatus === "failed") return "failed" as const;
  if (subscriptionStatus === "active") return "active" as const;
  if (subscriptionStatus === "trialing" || subscriptionStatus === "authenticated") return "authenticated" as const;
  if (subscriptionStatus === "cancelled") return "cancelled" as const;
  return "created" as const;
}

async function bootstrapBillingForUser(userId: string) {
  await ensureWalletForUser(userId);
  await grantStarterCreditsIfEligible(userId);
  await syncBillingPlans();
}

async function getLocalPlanForCode(planCode: string) {
  return db.query.subscriptionPlan.findFirst({
    where: eq(subscriptionPlan.code, planCode),
  });
}

async function getLatestSubscriptionRecord(userId: string) {
  return db.query.subscription.findFirst({
    where: eq(subscription.userId, userId),
    orderBy: desc(subscription.updatedAt),
    with: {
      plan: true,
    },
  });
}

async function getCurrentSubscriptionRecord(userId: string) {
  return (await getActiveSubscription(userId)) ?? (await getLatestSubscriptionRecord(userId));
}

function getFreePlanFallback() {
  const freePlan = getBillingPlanByCode("free");
  if (!freePlan) {
    return null;
  }

  return {
    id: "free",
    code: freePlan.code,
    name: freePlan.name,
    creditsPerCycle: freePlan.creditsPerCycle,
    priceCents: freePlan.priceCents,
    currency: freePlan.currency,
    billingInterval: freePlan.billingInterval,
    providerPlanId: freePlan.providerPlanId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function buildUsageBreakdown(ledger: Awaited<ReturnType<typeof listLedgerEntries>>, totalCreditCost: number) {
  const starterCreditsGranted = ledger
    .filter((entry) => entry.kind === "starter_grant")
    .reduce((sum, entry) => sum + Math.max(entry.deltaCredits, 0), 0);
  const subscriptionCreditsGranted = ledger
    .filter((entry) => entry.kind === "subscription_grant")
    .reduce((sum, entry) => sum + Math.max(entry.deltaCredits, 0), 0);
  const refundCredits = ledger
    .filter((entry) => entry.kind === "refund")
    .reduce((sum, entry) => sum + Math.max(entry.deltaCredits, 0), 0);
  const manualCredits = ledger
    .filter((entry) => entry.kind === "manual_adjustment")
    .reduce((sum, entry) => sum + entry.deltaCredits, 0);

  return {
    starterCreditsGranted,
    subscriptionCreditsGranted,
    refundCredits,
    manualCredits,
    usageCreditsSpent: totalCreditCost,
  };
}

async function upsertBillingOrder(input: {
  userId: string;
  subscriptionId: string;
  planId: string;
  planCode: string;
  providerSubscriptionId: string;
  amountCents: number;
  currency: string;
  status: "created" | "authenticated" | "active" | "completed" | "cancelled" | "failed";
  metadata?: string;
}) {
  const existingOrder = await db.query.billingOrder.findFirst({
    where: eq(billingOrder.providerOrderId, input.providerSubscriptionId),
  });

  if (!existingOrder) {
    await db.insert(billingOrder).values({
      id: createId(),
      userId: input.userId,
      subscriptionId: input.subscriptionId,
      planId: input.planId,
      planCode: input.planCode,
      provider: "razorpay",
      providerOrderId: input.providerSubscriptionId,
      providerSubscriptionId: input.providerSubscriptionId,
      status: input.status,
      amountCents: input.amountCents,
      currency: input.currency,
      notes: `order:${input.providerSubscriptionId}`,
      metadata: input.metadata,
    });
    return;
  }

  await db
    .update(billingOrder)
    .set({
      status: input.status,
      metadata: input.metadata,
      subscriptionId: input.subscriptionId,
      planId: input.planId,
      planCode: input.planCode,
      amountCents: input.amountCents,
      currency: input.currency,
      providerSubscriptionId: input.providerSubscriptionId,
    })
    .where(eq(billingOrder.id, existingOrder.id));
}

async function upsertPaymentEvent(input: {
  userId: string;
  subscriptionId: string;
  providerEventId: string;
  eventType: string;
  status: string;
  amountCents: number;
  currency: string;
  payload: string;
}) {
  const existingPayment = await db.query.paymentEvent.findFirst({
    where: eq(paymentEvent.providerEventId, input.providerEventId),
  });

  if (!existingPayment) {
    await db.insert(paymentEvent).values({
      id: createId(),
      userId: input.userId,
      subscriptionId: input.subscriptionId,
      provider: "razorpay",
      providerEventId: input.providerEventId,
      eventType: input.eventType,
      status: input.status,
      amountCents: input.amountCents,
      currency: input.currency,
      payload: input.payload,
    });
    return;
  }

  await db
    .update(paymentEvent)
    .set({
      subscriptionId: input.subscriptionId,
      eventType: input.eventType,
      status: input.status,
      amountCents: input.amountCents,
      currency: input.currency,
      payload: input.payload,
    })
    .where(eq(paymentEvent.id, existingPayment.id));
}

async function ensureLocalSubscription(input: { userId: string; providerSubscriptionId: string; planCode: string }) {
  const localPlan = await getLocalPlanForCode(input.planCode);
  if (!localPlan) {
    throw new TRPCError({ code: "NOT_FOUND", message: `Local plan not found for code ${input.planCode}` });
  }

  let localSubscription = await db.query.subscription.findFirst({
    where: and(
      eq(subscription.userId, input.userId),
      eq(subscription.providerSubscriptionId, input.providerSubscriptionId),
    ),
    with: {
      plan: true,
    },
  });

  if (!localSubscription) {
    const id = createId();
    await db.insert(subscription).values({
      id,
      userId: input.userId,
      planId: localPlan.id,
      provider: "razorpay",
      providerSubscriptionId: input.providerSubscriptionId,
      status: "inactive",
    });

    localSubscription = await db.query.subscription.findFirst({
      where: eq(subscription.id, id),
      with: {
        plan: true,
      },
    });
  }

  if (!localSubscription) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to initialize subscription" });
  }

  if (localSubscription.planId !== localPlan.id) {
    await db
      .update(subscription)
      .set({
        planId: localPlan.id,
      })
      .where(eq(subscription.id, localSubscription.id));

    localSubscription = await db.query.subscription.findFirst({
      where: eq(subscription.id, localSubscription.id),
      with: {
        plan: true,
      },
    });
  }

  if (!localSubscription) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Subscription vanished during sync" });
  }

  return { localPlan, localSubscription };
}

async function applyProviderSubscriptionState(input: {
  userId: string;
  providerSubscriptionId: string;
  providerStatus?: string | null;
  currentStart?: number;
  currentEnd?: number;
  planCode: string;
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    payload: string;
  } | null;
  metadata?: string;
}) {
  const { localPlan, localSubscription } = await ensureLocalSubscription({
    userId: input.userId,
    providerSubscriptionId: input.providerSubscriptionId,
    planCode: input.planCode,
  });

  const nextStatus = mapProviderSubscriptionStatus(input.providerStatus);

  await db
    .update(subscription)
    .set({
      planId: localPlan.id,
      status: nextStatus,
      currentPeriodStart: input.currentStart ? new Date(input.currentStart * 1000) : null,
      currentPeriodEnd: input.currentEnd ? new Date(input.currentEnd * 1000) : null,
      cancelAtPeriodEnd: input.providerStatus === "cancelled",
    })
    .where(eq(subscription.id, localSubscription.id));

  await upsertBillingOrder({
    userId: input.userId,
    subscriptionId: localSubscription.id,
    planId: localPlan.id,
    planCode: localPlan.code,
    providerSubscriptionId: input.providerSubscriptionId,
    amountCents: localPlan.priceCents,
    currency: localPlan.currency,
    status: mapOrderStatus({ subscriptionStatus: nextStatus, paymentStatus: input.payment?.status }),
    metadata: input.metadata,
  });

  if (input.payment) {
    await upsertPaymentEvent({
      userId: input.userId,
      subscriptionId: localSubscription.id,
      providerEventId: `payment:${input.payment.id}`,
      eventType: input.payment.status === "captured" ? "payment.captured" : "payment.authorized",
      status: input.payment.status,
      amountCents: input.payment.amount,
      currency: input.payment.currency,
      payload: input.payment.payload,
    });

    if (input.payment.status === "captured" || input.payment.status === "authorized") {
      await grantSubscriptionCredits({
        userId: input.userId,
        amountCredits: localPlan.creditsPerCycle,
        source: "razorpay:checkout-confirm",
        sourceRef: `subscription-charge:${input.payment.id}`,
        note: `${localPlan.name} monthly credits granted`,
      });
    }
  }

  return db.query.subscription.findFirst({
    where: eq(subscription.id, localSubscription.id),
    with: {
      plan: true,
    },
  });
}

export async function syncBillingPlans() {
  for (const plan of BILLING_PLANS) {
    await db
      .insert(subscriptionPlan)
      .values({
        id: createId(),
        code: plan.code,
        name: plan.name,
        creditsPerCycle: plan.creditsPerCycle,
        priceCents: plan.priceCents,
        currency: plan.currency,
        billingInterval: plan.billingInterval,
        providerPlanId: plan.providerPlanId,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: subscriptionPlan.code,
        set: {
          name: plan.name,
          creditsPerCycle: plan.creditsPerCycle,
          priceCents: plan.priceCents,
          currency: plan.currency,
          billingInterval: plan.billingInterval,
          providerPlanId: plan.providerPlanId,
          isActive: true,
        },
      })
      .catch((error) => {
        if (isMissingDatabaseFieldError(error) || isUniqueConstraintError(error)) return null;
        throw error;
      });
  }
}

export async function listBillingPlans() {
  await syncBillingPlans();

  const plans = await db.query.subscriptionPlan
    .findMany({
      where: eq(subscriptionPlan.isActive, true),
      orderBy: subscriptionPlan.priceCents,
    })
    .catch((error) => {
      if (isMissingDatabaseFieldError(error)) return [];
      throw error;
    });

  const source =
    plans.length > 0
      ? plans
      : BILLING_PLANS.map((plan) => ({
          id: plan.code,
          code: plan.code,
          name: plan.name,
          creditsPerCycle: plan.creditsPerCycle,
          priceCents: plan.priceCents,
          currency: plan.currency,
          billingInterval: plan.billingInterval,
          providerPlanId: plan.providerPlanId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

  return source.map((plan) => {
    const configPlan = getBillingPlanByCode(plan.code);

    return {
      ...plan,
      tagline: configPlan?.tagline ?? "",
      description: configPlan?.description ?? "",
      highlighted: configPlan?.highlighted ?? false,
      ctaLabel: configPlan?.ctaLabel ?? "Choose plan",
      features: configPlan?.features ?? [],
    };
  });
}

export async function getActiveSubscription(userId: string) {
  return db.query.subscription
    .findFirst({
      where: and(
        eq(subscription.userId, userId),
        or(eq(subscription.status, "active"), eq(subscription.status, "trialing"), eq(subscription.status, "past_due")),
      ),
      orderBy: desc(subscription.updatedAt),
      with: {
        plan: true,
      },
    })
    .catch((error) => {
      if (isMissingDatabaseFieldError(error)) return null;
      throw error;
    });
}

export async function listPaymentEvents(userId: string, limit = 50) {
  return db.query.paymentEvent
    .findMany({
      where: eq(paymentEvent.userId, userId),
      orderBy: desc(paymentEvent.createdAt),
      limit,
    })
    .catch((error) => {
      if (isMissingDatabaseFieldError(error)) return [];
      throw error;
    });
}

export async function listBillingOrders(userId: string, limit = 50) {
  return db.query.billingOrder
    .findMany({
      where: eq(billingOrder.userId, userId),
      orderBy: desc(billingOrder.createdAt),
      limit,
      with: {
        plan: true,
        subscription: true,
      },
    })
    .catch((error) => {
      if (isMissingDatabaseFieldError(error)) return [];
      throw error;
    });
}

export async function getBillingSummary(userId: string) {
  await bootstrapBillingForUser(userId);

  const [wallet, currentSubscription, recentOrders, recentPayments] = await Promise.all([
    getWalletSummary(userId),
    getCurrentSubscriptionRecord(userId),
    listBillingOrders(userId, 10),
    listPaymentEvents(userId, 10),
  ]);

  const currentPlan = currentSubscription?.plan ?? getFreePlanFallback();
  const hasPaidPlan = Boolean(currentPlan && currentPlan.code !== "free");

  return {
    wallet,
    activeSubscription: currentSubscription,
    currentPlan,
    subscriptionStatus: currentSubscription?.status ?? "free",
    nextRenewalAt: currentSubscription?.currentPeriodEnd ?? null,
    recentOrders,
    recentPayments,
    canStartCheckout: !hasPaidPlan,
    hasPaidPlan,
  };
}

export async function getBillingUsage(userId: string) {
  await bootstrapBillingForUser(userId);

  const [analytics, ledger] = await Promise.all([getViewerAnalyticsSummary(userId), listLedgerEntries(userId, 50)]);

  return {
    analytics,
    ledger,
    breakdown: buildUsageBreakdown(ledger, analytics.totalCreditCost),
  };
}

export async function getBillingOverview(userId: string) {
  const [plans, summary, usage, orders, payments] = await Promise.all([
    listBillingPlans(),
    getBillingSummary(userId),
    getBillingUsage(userId),
    listBillingOrders(userId),
    listPaymentEvents(userId),
  ]);

  return {
    plans,
    summary,
    usage,
    orders,
    payments,
    activeSubscription: summary.activeSubscription,
    analytics: usage.analytics,
    ledger: usage.ledger,
    wallet: summary.wallet,
  };
}

export async function createCheckoutForPlan(input: {
  userId: string;
  userName: string;
  userEmail: string;
  planCode: BillingPlanCode;
}) {
  await bootstrapBillingForUser(input.userId);

  const currentSubscription = await getCurrentSubscriptionRecord(input.userId);
  if (currentSubscription && ["active", "trialing", "past_due"].includes(currentSubscription.status)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "You already have an active paid subscription. Manage the current plan instead of starting a new checkout.",
    });
  }

  const planDefinition = getBillingPlanByCode(input.planCode);
  if (!planDefinition) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });
  }

  if (planDefinition.code === "free") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Free plan does not require checkout" });
  }

  if (!planDefinition.providerPlanId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `Razorpay plan ID missing for ${planDefinition.name}`,
    });
  }

  const localPlan = await db.query.subscriptionPlan.findFirst({
    where: eq(subscriptionPlan.code, planDefinition.code),
  });

  if (!localPlan) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Local plan configuration missing" });
  }

  const razorpaySubscription = await createRazorpaySubscription({
    planId: planDefinition.providerPlanId,
    customerEmail: input.userEmail,
    customerName: input.userName,
    userId: input.userId,
    planCode: input.planCode,
  });

  const localSubscriptionId = createId();

  await db
    .insert(subscription)
    .values({
      id: localSubscriptionId,
      userId: input.userId,
      planId: localPlan.id,
      provider: "razorpay",
      providerSubscriptionId: razorpaySubscription.id,
      status: mapProviderSubscriptionStatus(razorpaySubscription.status),
    })
    .catch((error) => {
      if (isUniqueConstraintError(error)) return null;
      throw error;
    });

  await upsertBillingOrder({
    userId: input.userId,
    subscriptionId: localSubscriptionId,
    planId: localPlan.id,
    planCode: input.planCode,
    providerSubscriptionId: razorpaySubscription.id,
    amountCents: localPlan.priceCents,
    currency: localPlan.currency,
    status: "created",
    metadata: JSON.stringify({ razorpayStatus: razorpaySubscription.status }),
  });

  await upsertPaymentEvent({
    userId: input.userId,
    subscriptionId: localSubscriptionId,
    providerEventId: `checkout:${razorpaySubscription.id}`,
    eventType: "checkout.created",
    status: razorpaySubscription.status,
    amountCents: localPlan.priceCents,
    currency: localPlan.currency,
    payload: JSON.stringify(razorpaySubscription),
  });

  return {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
    providerSubscriptionId: razorpaySubscription.id,
    localSubscriptionId,
    planCode: input.planCode,
    planName: planDefinition.name,
    amountCents: localPlan.priceCents,
    currency: localPlan.currency,
    prefill: {
      name: input.userName,
      email: input.userEmail,
    },
    notes: {
      userId: input.userId,
      planCode: input.planCode,
      localSubscriptionId,
    },
  };
}

export async function confirmCheckoutForUser(input: {
  userId: string;
  providerSubscriptionId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) {
  await bootstrapBillingForUser(input.userId);

  const existingSubscription = await db.query.subscription.findFirst({
    where: and(
      eq(subscription.userId, input.userId),
      eq(subscription.providerSubscriptionId, input.providerSubscriptionId),
    ),
    with: {
      plan: true,
    },
  });

  const providerSubscription = await getRazorpaySubscription(input.providerSubscriptionId);

  const inferredPlanCode =
    existingSubscription?.plan?.code ?? getBillingPlanByProviderPlanId(providerSubscription.plan_id)?.code ?? null;

  if (!inferredPlanCode) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Unable to determine the subscribed plan" });
  }

  if (input.razorpayPaymentId && input.razorpaySignature) {
    const validSignature = verifyRazorpayCheckoutSignature({
      providerSubscriptionId: input.providerSubscriptionId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
    });

    if (!validSignature) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Razorpay checkout signature" });
    }
  }

  const providerPayment = input.razorpayPaymentId ? await getRazorpayPayment(input.razorpayPaymentId) : null;

  const updatedSubscription = await applyProviderSubscriptionState({
    userId: input.userId,
    providerSubscriptionId: input.providerSubscriptionId,
    providerStatus: providerSubscription.status,
    currentStart: providerSubscription.current_start,
    currentEnd: providerSubscription.current_end,
    planCode: inferredPlanCode,
    payment: providerPayment
      ? {
          id: providerPayment.id,
          status: providerPayment.status,
          amount: providerPayment.amount,
          currency: providerPayment.currency,
          payload: JSON.stringify(providerPayment),
        }
      : null,
    metadata: JSON.stringify({ providerSubscription, providerPayment }),
  });

  return {
    ok: true,
    subscription: updatedSubscription,
    summary: await getBillingSummary(input.userId),
  };
}

export async function cancelCustomerSubscription(input: { userId: string; subscriptionId: string }) {
  const currentSubscription = await db.query.subscription.findFirst({
    where: and(eq(subscription.id, input.subscriptionId), eq(subscription.userId, input.userId)),
    with: {
      plan: true,
    },
  });

  if (!currentSubscription) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Subscription not found" });
  }

  if (!currentSubscription.providerSubscriptionId) {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Provider subscription is missing" });
  }

  const result = await cancelRazorpaySubscription(currentSubscription.providerSubscriptionId);

  await db
    .update(subscription)
    .set({
      status: "cancelled",
      cancelAtPeriodEnd: true,
    })
    .where(eq(subscription.id, currentSubscription.id));

  await upsertPaymentEvent({
    userId: input.userId,
    subscriptionId: currentSubscription.id,
    providerEventId: `cancel:${currentSubscription.providerSubscriptionId}`,
    eventType: "subscription.cancelled",
    status: result.status,
    amountCents: currentSubscription.plan?.priceCents ?? 0,
    currency: currentSubscription.plan?.currency ?? "INR",
    payload: JSON.stringify(result),
  });

  await upsertBillingOrder({
    userId: input.userId,
    subscriptionId: currentSubscription.id,
    planId: currentSubscription.planId,
    planCode: currentSubscription.plan?.code ?? "unknown",
    providerSubscriptionId: currentSubscription.providerSubscriptionId,
    amountCents: currentSubscription.plan?.priceCents ?? 0,
    currency: currentSubscription.plan?.currency ?? "INR",
    status: "cancelled",
    metadata: JSON.stringify(result),
  });

  return {
    ok: true,
    subscriptionId: currentSubscription.id,
    providerSubscriptionId: currentSubscription.providerSubscriptionId,
  };
}

export async function processRazorpayWebhook(payload: RazorpayWebhookPayload) {
  await syncBillingPlans();

  const eventType = String(payload.event ?? "unknown");
  const subscriptionEntity = payload.payload?.subscription?.entity;
  const paymentEntity = payload.payload?.payment?.entity;
  const providerSubscriptionId = subscriptionEntity?.id ?? paymentEntity?.subscription_id ?? null;
  const providerPlanId = subscriptionEntity?.plan_id ?? null;
  const mappedPlan = getBillingPlanByProviderPlanId(providerPlanId);
  const planCode = mappedPlan?.code ?? subscriptionEntity?.notes?.planCode ?? paymentEntity?.notes?.planCode ?? null;
  const userId = subscriptionEntity?.notes?.userId ?? paymentEntity?.notes?.userId ?? null;

  if (!providerSubscriptionId || !userId || !planCode) {
    return {
      ok: true,
      ignored: true,
      reason: "Missing subscription context",
      eventType,
    };
  }

  await bootstrapBillingForUser(userId);

  await applyProviderSubscriptionState({
    userId,
    providerSubscriptionId,
    providerStatus: subscriptionEntity?.status ?? paymentEntity?.status,
    currentStart: subscriptionEntity?.current_start,
    currentEnd: subscriptionEntity?.current_end,
    planCode,
    payment: paymentEntity?.id
      ? {
          id: paymentEntity.id,
          status: String(paymentEntity.status ?? "received"),
          amount: Number(paymentEntity.amount ?? 0),
          currency: String(paymentEntity.currency ?? "INR"),
          payload: JSON.stringify(payload),
        }
      : null,
    metadata: JSON.stringify(payload),
  });

  return {
    ok: true,
    ignored: false,
    eventType,
    providerSubscriptionId,
  };
}
