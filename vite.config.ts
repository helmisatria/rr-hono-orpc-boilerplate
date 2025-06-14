import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";

export default defineConfig({
  plugins: [
    reactRouterHonoServer({ flag: { force_react_19: true }, runtime: "cloudflare" }),
    // cloudflare({ viteEnvironment: { name: "ssr" } }),
    cloudflareDevProxy(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
