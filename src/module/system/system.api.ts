import { createTRPCRouter, publicProcedure } from "@/core/api/api.methods";
import { site } from "@/shared/config/site";

export const systemRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({
    ok: true,
    appName: site.name,
    version: site.apiVersion,
    timestamp: new Date().toISOString(),
  })),
});
