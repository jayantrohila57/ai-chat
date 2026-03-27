import { createTRPCRouter, customerProcedure, publicProcedure, withApiSuccess } from "@/core/api/api.methods";
import { cancelSubscriptionInputSchema, checkoutConfirmInputSchema, checkoutCreateInputSchema } from "./billing.schema";
import {
  cancelCustomerSubscription,
  confirmCheckoutForUser,
  createCheckoutForPlan,
  getActiveSubscription,
  getBillingOverview,
  getBillingSummary,
  getBillingUsage,
  listBillingOrders,
  listBillingPlans,
  listPaymentEvents,
} from "./billing.service";

export const billingRouter = createTRPCRouter({
  plans: publicProcedure.query(async () => withApiSuccess(await listBillingPlans(), "Plans retrieved successfully.")),
  overview: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await getBillingOverview(ctx.user.id), "Billing overview retrieved successfully."),
  ),
  summary: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await getBillingSummary(ctx.user.id), "Billing summary retrieved successfully."),
  ),
  usage: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await getBillingUsage(ctx.user.id), "Billing usage retrieved successfully."),
  ),
  subscription: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return withApiSuccess(null, "No authenticated subscription available.");
    }

    return withApiSuccess((await getActiveSubscription(ctx.user.id)) ?? null, "Subscription retrieved successfully.");
  }),
  payments: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await listPaymentEvents(ctx.user.id), "Payment history retrieved successfully."),
  ),
  orders: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await listBillingOrders(ctx.user.id), "Order history retrieved successfully."),
  ),
  createCheckout: customerProcedure.input(checkoutCreateInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await createCheckoutForPlan({
        userId: ctx.user.id,
        userName: ctx.user.name,
        userEmail: ctx.user.email,
        planCode: input.planCode,
      }),
      "Checkout created successfully.",
    ),
  ),
  confirmCheckout: customerProcedure.input(checkoutConfirmInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await confirmCheckoutForUser({
        userId: ctx.user.id,
        providerSubscriptionId: input.providerSubscriptionId,
        razorpayPaymentId: input.razorpayPaymentId,
        razorpaySignature: input.razorpaySignature,
      }),
      "Checkout confirmed successfully.",
    ),
  ),
  cancelSubscription: customerProcedure.input(cancelSubscriptionInputSchema).mutation(async ({ ctx, input }) =>
    withApiSuccess(
      await cancelCustomerSubscription({
        userId: ctx.user.id,
        subscriptionId: input.subscriptionId,
      }),
      "Subscription cancellation processed successfully.",
    ),
  ),
});
