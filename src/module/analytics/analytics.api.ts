import { createTRPCRouter, customerProcedure, withApiSuccess } from "@/core/api/api.methods";
import { getViewerAnalyticsSummary } from "./analytics.service";

export const analyticsRouter = createTRPCRouter({
  summary: customerProcedure.query(async ({ ctx }) =>
    withApiSuccess(await getViewerAnalyticsSummary(ctx.user.id), "Analytics summary retrieved successfully."),
  ),
});
