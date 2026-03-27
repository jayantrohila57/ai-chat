import { createTRPCRouter, customerProcedure, staffProcedure } from "@/core/api/api.methods";
import { listLedgerInputSchema, walletAdjustmentInputSchema } from "./credits.schema";
import { adjustCredits, getWalletSummary, listLedgerEntries } from "./credits.service";

export const creditsRouter = createTRPCRouter({
  wallet: customerProcedure.query(async ({ ctx }) => {
    return getWalletSummary(ctx.user.id);
  }),
  ledger: customerProcedure.input(listLedgerInputSchema).query(async ({ ctx, input }) => {
    return listLedgerEntries(ctx.user.id, input.limit);
  }),
  adjust: staffProcedure.input(walletAdjustmentInputSchema).mutation(async ({ input }) => {
    return adjustCredits({
      userId: input.userId,
      amountCredits: input.amountCredits,
      note: input.note,
    });
  }),
});
