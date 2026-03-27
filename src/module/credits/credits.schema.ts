import { z } from "zod/v3";

export const ledgerKindSchema = z.enum([
  "starter_grant",
  "reservation",
  "settlement",
  "refund",
  "subscription_grant",
  "purchase_grant",
  "manual_adjustment",
]);

export const walletAdjustmentInputSchema = z.object({
  userId: z.string().min(1),
  amountCredits: z.number().int(),
  note: z.string().max(500).optional(),
});

export const listLedgerInputSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
});

export type LedgerKind = z.infer<typeof ledgerKindSchema>;
