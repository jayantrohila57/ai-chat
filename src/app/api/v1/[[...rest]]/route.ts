import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { createTRPCContext } from "@/core/api/api.methods";
import { appRouter } from "@/core/api/api.routes";
import { serverEnv } from "@/shared/config/env.server";
import { debugLog } from "@/shared/utils/lib/logger.utils";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      serverEnv.NODE_ENV === "development"
        ? ({ path, error }) => {
            debugLog(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
