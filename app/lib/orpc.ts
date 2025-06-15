import { router } from "~/backend/router";
import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { BatchLinkPlugin } from "@orpc/client/plugins";

/**
 * Client-side oRPC client setup for React Router v7
 */
function getORPCClient(): RouterClient<typeof router> {
  if (typeof window === "undefined") {
    return globalThis.$orpcClient;
  }

  // Client-side: create HTTP client
  const link = new RPCLink({
    url: `${window.location.origin}/rpc`,
    plugins: [
      new BatchLinkPlugin({
        groups: [{ condition: () => true, context: {} }],
      }),
    ],
  });

  return createORPCClient(link);
}

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
