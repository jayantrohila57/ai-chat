import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createQueryClient } from "../query/client";
import { createTRPCContext } from "./api.methods";
import { type AppRouter, createCaller } from "./api.routes";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: apiServer, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
