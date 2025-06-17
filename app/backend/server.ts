import { Hono, type Context } from "hono";
import { contextStorage } from "hono/context-storage";
import { createRequestHandler } from "react-router";
import { logger } from "hono/logger";
import { createRouterClient, type RouterClient } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { BatchHandlerPlugin } from "@orpc/server/plugins";
import { openApiHandler } from "./api";
import { router } from "./router";
import { requestId } from "hono/request-id";

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

const requestHandler = createRequestHandler(() => import("virtual:react-router/server-build"), import.meta.env.MODE);

const app = new Hono<{ Bindings: Env; Variables: { requestId: string } }>();

app.use(requestId());
app.use(contextStorage());
app.use(logger());

// app.use("*", async (c, next) => {
//   const start = Date.now();
//   await next();
//   const duration = Date.now() - start;
//   const log = {
//     level: "info",
//     time: dayjs().toISOString(),
//     requestId: c.get("requestId"),
//     request: {
//       method: c.req.method,
//       url: c.req.url,
//     },
//     response: {
//       status: c.res.status,
//     },
//     duration: `${duration}ms`,
//   };
//   console.log(log);
// });

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

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
