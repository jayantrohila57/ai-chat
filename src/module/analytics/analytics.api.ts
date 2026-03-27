import { createTRPCRouter, customerProcedure } from "@/core/api/api.methods";
import { getViewerAnalyticsSummary } from "./analytics.service";

export const analyticsRouter = createTRPCRouter({
  summary: customerProcedure.query(async ({ ctx }) => {
    return getViewerAnalyticsSummary(ctx.user.id);
  }),
});
