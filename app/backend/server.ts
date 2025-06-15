import { Hono, type Context } from "hono";
import { contextStorage } from "hono/context-storage";
import { logger } from "hono/logger";
import { createRequestHandler } from "react-router";
import { cache } from "hono/cache";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    context: Context;
    client: RouterClient<typeof router>;
  }
}

declare global {
  var $orpcClient: RouterClient<typeof router>;
}

import { createRouterClient, type RouterClient } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { openApiHandler } from "./api";
import { router } from "./router";

const requestHandler = createRequestHandler(() => import("virtual:react-router/server-build"), import.meta.env.MODE);

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use(contextStorage());

const handler = new RPCHandler(router, {
  plugins: [new BatchHandlerPlugin()],
});

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: {
      headers: c.req.raw.headers,
      KV: c.env.KV,
    },
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

app.use("/api/*", async (c, next) => {
  const { matched, response } = await openApiHandler.handle(c.req.raw, {
    prefix: "/api",
    context: {
      headers: c.req.raw.headers,
      KV: c.env.KV,
    },
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

app.all("*", async (c) => {
  globalThis.$orpcClient = createRouterClient(router, {
    context: () => ({
      headers: c.req.raw.headers,
      KV: c.env.KV,
    }),
  });

  const response = await requestHandler(c.req.raw, {
    cloudflare: {
      env: c.env,
      ctx: c.executionCtx as ExecutionContext,
    },
    context: c,
    client: createRouterClient(router, {
      context: () => ({
        headers: c.req.raw.headers,
        KV: c.env.KV,
      }),
    }),
  });

  return c.newResponse(response.body, response);
});

export default app;
