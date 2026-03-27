import { createTRPCRouter, publicProcedure, withApiSuccess } from "@/core/api/api.methods";
import { site } from "@/shared/config/site";

export const systemRouter = createTRPCRouter({
  health: publicProcedure.query(() =>
    withApiSuccess(
      {
        ok: true,
        appName: site.name,
        version: site.apiVersion,
        timestamp: new Date().toISOString(),
      },
      "System health retrieved successfully.",
    ),
  ),
});
