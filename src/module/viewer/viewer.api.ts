import { createTRPCRouter, publicProcedure } from "@/core/api/api.methods";

export const viewerRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => ({
    authenticated: Boolean(ctx.session && ctx.user),
    user: ctx.user
      ? {
          id: ctx.user.id,
          name: ctx.user.name,
          email: ctx.user.email,
          role: ctx.user.role,
        }
      : null,
  })),
});
