import "server-only";

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v3";
import { apiSuccess, buildApiError, prettyZodError, zodErrorObject } from "@/shared/config/api.utils";
import { debugError } from "@/shared/utils/lib/logger.utils";
import { canUseGuard } from "../auth/auth.guard";
import { normalizeRole } from "../auth/auth.roles";
import { getServerSession } from "../auth/auth.server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  try {
    const { session, user } = await getServerSession();

    return {
      session,
      user,
      ...opts,
    };
  } catch (error) {
    debugError("TRPC_CONTEXT", error);
    return {
      session: null,
      user: null,
      ...opts,
    };
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const isValidationError = error.cause instanceof ZodError;
    const code = error.code || shape.data.code || "INTERNAL_SERVER_ERROR";
    const appError = buildApiError({
      code,
      fieldErrors: isValidationError ? zodErrorObject(error.cause) : undefined,
      retryable: code === "TOO_MANY_REQUESTS" || code === "TIMEOUT" || code === "INTERNAL_SERVER_ERROR",
    });

    return {
      ...shape,
      message: isValidationError
        ? String(prettyZodError(error.cause))
        : String(error.message || "Something went wrong"),
      data: {
        ...shape.data,
        appError,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const enforceUser = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
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
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
    }

    const currentRole = normalizeRole(ctx.user.role);

    if (!canUseGuard(guard, currentRole)) {
      debugError("ACCESS_DENIED", `User ${ctx.user.id} attempted to access ${guard} resource with role ${currentRole}`);
      throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this resource" });
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

export function withApiSuccess<T>(data: T, message?: string) {
  return apiSuccess(data, message);
}

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUser);
export const adminProcedure = t.procedure.use(enforceUser).use(enforceRole("admin"));
export const customerProcedure = t.procedure.use(enforceUser).use(enforceRole("customer"));
export const staffProcedure = t.procedure.use(enforceUser).use(enforceRole("staff"));
