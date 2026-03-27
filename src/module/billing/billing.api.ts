import { createTRPCRouter, customerProcedure, publicProcedure } from "@/core/api/api.methods";
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
  plans: publicProcedure.query(async () => {
    return listBillingPlans();
  }),
  overview: customerProcedure.query(async ({ ctx }) => {
    return getBillingOverview(ctx.user.id);
  }),
  summary: customerProcedure.query(async ({ ctx }) => {
    return getBillingSummary(ctx.user.id);
  }),
  usage: customerProcedure.query(async ({ ctx }) => {
    return getBillingUsage(ctx.user.id);
  }),
  subscription: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    return (await getActiveSubscription(ctx.user.id)) ?? null;
  }),
  payments: customerProcedure.query(async ({ ctx }) => {
    return listPaymentEvents(ctx.user.id);
  }),
  orders: customerProcedure.query(async ({ ctx }) => {
    return listBillingOrders(ctx.user.id);
  }),
  createCheckout: customerProcedure.input(checkoutCreateInputSchema).mutation(async ({ ctx, input }) => {
    return createCheckoutForPlan({
      userId: ctx.user.id,
      userName: ctx.user.name,
      userEmail: ctx.user.email,
      planCode: input.planCode,
    });
  }),
  confirmCheckout: customerProcedure.input(checkoutConfirmInputSchema).mutation(async ({ ctx, input }) => {
    return confirmCheckoutForUser({
      userId: ctx.user.id,
      providerSubscriptionId: input.providerSubscriptionId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
    });
  }),
  cancelSubscription: customerProcedure.input(cancelSubscriptionInputSchema).mutation(async ({ ctx, input }) => {
    return cancelCustomerSubscription({
      userId: ctx.user.id,
      subscriptionId: input.subscriptionId,
    });
  }),
});
