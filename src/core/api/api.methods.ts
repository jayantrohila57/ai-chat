import "server-only";

import { initTRPC, TRPCError } from "@trpc/server";
import { forbidden } from "next/navigation";
import superjson from "superjson";
import { ZodError } from "zod/v3";
import { STATUS } from "@/shared/config/api.config";
import { API_RESPONSE, prettyZodError, zodErrorObject } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { canUseGuard } from "../auth/auth.guard";
import { normalizeRole } from "../auth/auth.roles";
import { getServerSession } from "../auth/auth.server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session, user } = await getServerSession();

  return {
    session,
    user,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    if (error.cause instanceof ZodError) {
      return API_RESPONSE(STATUS.FAILED, String(prettyZodError(error.cause)), zodErrorObject(error.cause));
    }
    return API_RESPONSE(STATUS.ERROR, String(error.message || "Something went wrong"), shape.data.code);
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const enforceUser = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

const enforceRole = (guard: "admin" | "staff" | "customer") =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    const currentRole = normalizeRole(ctx.user.role);

    if (!canUseGuard(guard, currentRole)) {
      debugError(
        "ACCESS_DENIED",
        `User ${ctx.user?.id} attempted to access ${guard} resource with role ${currentRole}`,
      );
      forbidden();
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          ...ctx.user,
          role: currentRole,
        },
      },
    });
  });

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUser);
export const adminProcedure = t.procedure.use(enforceUser).use(enforceRole("admin"));
export const customerProcedure = t.procedure.use(enforceUser).use(enforceRole("customer"));
export const staffProcedure = t.procedure.use(enforceUser).use(enforceRole("staff"));
