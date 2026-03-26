import { createCallerFactory, createTRPCRouter } from "@/core/api/api.methods";
import { systemRouter } from "@/module/system/system.api";
import { viewerRouter } from "@/module/viewer/viewer.api";

export const appRouter = createTRPCRouter({
  system: systemRouter,
  viewer: viewerRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
