import { defaultShouldDehydrateQuery, QueryClient, type QueryClientConfig } from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = (config?: QueryClientConfig) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        throwOnError: false,
      },
      mutations: {
        throwOnError: false,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
    ...config,
  });
