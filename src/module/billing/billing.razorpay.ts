import { TRPCError } from "@trpc/server";
import { serverEnv } from "@/shared/config/env.server";

type RazorpaySubscriptionResponse = {
  id: string;
  status: string;
  plan_id: string;
  charge_at?: number;
  current_start?: number;
  current_end?: number;
  total_count?: number;
  paid_count?: number;
  remaining_count?: number;
  short_url?: string;
  notes?: Record<string, string>;
};

type RazorpayPaymentResponse = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  subscription_id?: string;
  notes?: Record<string, string>;
};

function getRazorpayAuthHeader() {
  if (!serverEnv.RAZORPAY_KEY_ID || !serverEnv.RAZORPAY_KEY_SECRET) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Razorpay credentials are not configured",
    });
  }

  const credentials = `${serverEnv.RAZORPAY_KEY_ID}:${serverEnv.RAZORPAY_KEY_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

async function razorpayFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: payload?.error?.description ?? "Failed to communicate with Razorpay",
    });
  }

  return payload as T;
}

export async function createRazorpaySubscription(input: {
  planId: string;
  customerEmail: string;
  customerName: string;
  userId: string;
  planCode: string;
}) {
  return razorpayFetch<RazorpaySubscriptionResponse>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: input.planId,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: input.userId,
        planCode: input.planCode,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
      },
    }),
  });
}

export async function getRazorpaySubscription(providerSubscriptionId: string) {
  return razorpayFetch<RazorpaySubscriptionResponse>(`/subscriptions/${providerSubscriptionId}`);
}

export async function getRazorpayPayment(razorpayPaymentId: string) {
  return razorpayFetch<RazorpayPaymentResponse>(`/payments/${razorpayPaymentId}`);
}

export async function cancelRazorpaySubscription(providerSubscriptionId: string) {
  return razorpayFetch<{ id: string; status: string }>(`/subscriptions/${providerSubscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      cancel_at_cycle_end: 1,
    }),
  });
}

export function verifyRazorpayWebhookSignature(body: string, signature: string | null) {
  if (!signature || !serverEnv.RAZORPAY_WEBHOOK_SECRET) {
    return false;
  }

  const crypto = require("node:crypto") as typeof import("node:crypto");
  const expected = crypto.createHmac("sha256", serverEnv.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function verifyRazorpayCheckoutSignature(input: {
  providerSubscriptionId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
}) {
  if (!input.razorpaySignature || !serverEnv.RAZORPAY_KEY_SECRET) {
    return false;
  }

  const crypto = require("node:crypto") as typeof import("node:crypto");
  const expected = crypto
    .createHmac("sha256", serverEnv.RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayPaymentId}|${input.providerSubscriptionId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(input.razorpaySignature));
  } catch {
    return false;
  }
}
