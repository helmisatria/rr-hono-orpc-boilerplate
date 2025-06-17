# React Router + Hono + oRPC

A modern, production-ready template for building full-stack React applications using React Router, Hono, and oRPC.

## Features

- 🐴 [Hono](https://hono.dev/) for the server
- 🔮 [oRPC](https://orpc.unnoq.com/) for end-to-end typesafe APIs
- ☁️ Deploy to [Cloudflare Workers](https://workers.cloudflare.com/)
- 🚀 Full-stack React with Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
pnpm run preview
```

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
pnpm run deploy
```

To deploy a preview URL:

```sh
pnpm exec wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
pnpm exec wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
