import { createTRPCRouter, customerProcedure, staffProcedure, withApiSuccess } from "@/core/api/api.methods";
import { listLedgerInputSchema, walletAdjustmentInputSchema } from "./credits.schema";
import { adjustCredits, getWalletSummary, listLedgerEntries } from "./credits.service";

export const creditsRouter = createTRPCRouter({
  wallet: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await getWalletSummary(ctx.user.id), "Wallet retrieved successfully."),
  ),
  ledger: customerProcedure
    .input(listLedgerInputSchema)
    .query(async ({ ctx, input }) =>
      withApiSuccess(await listLedgerEntries(ctx.user.id, input.limit), "Ledger entries retrieved successfully."),
    ),
  adjust: staffProcedure.input(walletAdjustmentInputSchema).mutation(async ({ input }) =>
    withApiSuccess(
      await adjustCredits({
        userId: input.userId,
        amountCredits: input.amountCredits,
        note: input.note,
      }),
      "Credits adjusted successfully.",
    ),
  ),
});
