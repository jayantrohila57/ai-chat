import { z } from "zod/v3";

export const checkoutCreateInputSchema = z.object({
  planCode: z.enum(["starter", "pro"]),
});

export const checkoutConfirmInputSchema = z.object({
  providerSubscriptionId: z.string().min(1),
  razorpayPaymentId: z.string().min(1).optional(),
  razorpaySignature: z.string().min(1).optional(),
});

export const cancelSubscriptionInputSchema = z.object({
  subscriptionId: z.string().uuid(),
});
