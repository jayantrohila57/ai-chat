"use client";

import { MutationCache, QueryCache, type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";
import {
  type AppApiResponse,
  extractAppApiError,
  extractAppApiMessage,
  isAuthApiError,
  isRetryableApiError,
} from "@/shared/config/api.utils";
import { clientEnv } from "@/shared/config/env.client";
import { debugWarn } from "@/shared/utils/lib/logger.utils";
import { createQueryClient } from "../query/client";
import type { AppRouter } from "./api.routes";

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient();
  clientQueryClientSingleton ??= createQueryClient();
  return clientQueryClientSingleton;
};

export const apiClient = createTRPCReact<AppRouter>();
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type UnwrapApiData<T> = T extends AppApiResponse<infer D> ? D : never;

export function getApiResponseData<TResponse extends AppApiResponse<unknown> | null | undefined>(
  response: TResponse,
): TResponse extends AppApiResponse<infer D> ? D | null : null {
  return (response && response.ok ? response.data : null) as TResponse extends AppApiResponse<infer D>
    ? D | null
    : null;
}

export function getApiResponseMessage(response: unknown, fallback = "Something went wrong") {
  return extractAppApiMessage(response, fallback);
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  return extractAppApiMessage(error, fallback);
}

export function getApiError(error: unknown) {
  return extractAppApiError(error);
}

export function shouldRedirectForApiError(error: unknown) {
  return isAuthApiError(error);
}

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (isAuthApiError(error)) return false;

  const appError = extractAppApiError(error);
  if (!appError) return failureCount < 1;
  if (["validation", "forbidden", "not_found", "conflict"].includes(appError.kind)) return false;
  return appError.retryable ? failureCount < 2 : failureCount < 1;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() =>
    createQueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          debugWarn("QUERY_ERROR", {
            queryKey: query.queryKey,
            message: extractAppApiMessage(error, "Query failed"),
            appError: extractAppApiError(error),
          });
        },
      }),
      mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
          debugWarn("MUTATION_ERROR", {
            mutationKey: mutation.options.mutationKey,
            message: extractAppApiMessage(error, "Mutation failed"),
            appError: extractAppApiError(error),
          });
        },
      }),
    }),
  );

  const [trpcClient] = useState(() =>
    apiClient.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            clientEnv.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/v1`,
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  queryClient.setDefaultOptions({
    queries: {
      retry: shouldRetryQuery,
      throwOnError: false,
    },
    mutations: {
      retry: (failureCount, error) => isRetryableApiError(error) && failureCount < 1,
      throwOnError: false,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <apiClient.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </apiClient.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return clientEnv.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
