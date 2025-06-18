# Project Rules Summary

## What was created

This `.cursor/rules/` directory now contains comprehensive guidelines for your React Router v7 + Hono + oRPC + Cloudflare Workers project.

## Key Architecture Patterns Captured

### 🏗️ **Core Stack**

- **Frontend**: React Router v7 (Framework Mode with File-Based Routing)
- **Backend**: Hono + oRPC + Zod
- **Deployment**: Cloudflare Workers + KV
- **Data**: TanStack Query + oRPC integration
- **Build**: Vite + Cloudflare plugin
- **Package Manager**: pnpm only

### 🎯 **Critical Principles**

1. **Domain-Driven Design**: Business logic organized in `app/backend/features/[domain]/`
2. **Feature-based frontend**: UI logic organized in `app/features/[domain]/`
3. **oRPC for API calls**: Never use fetch/axios directly
4. **Loaders for caching only**: Prefetch with TanStack Query, return `dehydratedState`
5. **End-to-end type safety**: Zod schemas → oRPC → Frontend types
6. **File-based routing**: Use React Router v7 file naming conventions (dots for nesting, $ for params)

### 📁 **Project Structure**

```
app/
├── backend/
│   ├── features/           # 🚨 DDD: Domain logic by feature
│   │   ├── users/          # User domain
│   │   │   ├── handlers.ts # oRPC handlers
│   │   │   ├── schemas.ts  # Zod schemas
│   │   │   └── types.ts    # TypeScript types
│   │   └── products/       # Product domain
│   └── router.ts           # Aggregates all features
├── features/               # 🚨 DDD: Frontend logic by feature
│   ├── users/
│   │   ├── components/     # User-specific UI
│   │   ├── hooks/          # User-specific hooks
│   │   ├── queries/        # User-specific queries
│   │   └── index.ts        # Barrel export
│   └── products/
├── lib/                    # oRPC client + utilities
├── hooks/                  # useDehydratedState SSR pattern
├── routes/                 # 🚨 React Router v7 file-based routes
│   ├── _index.tsx          # / (root route)
│   ├── users._index.tsx    # /users (users listing)
│   ├── users.$id.tsx       # /users/:id (user details)
│   ├── users.new.tsx       # /users/new (create user)
│   ├── products._index.tsx # /products
│   └── $.tsx               # Catch-all (404)
├── components/             # shadcn/ui (shared components)
└── root.tsx                # App shell with providers
```

### 🔄 **Data Flow Pattern**

1. **Backend**: Define domain schemas and handlers in `features/[domain]/`
2. **Router**: Aggregate feature handlers in main router
3. **Frontend**: Organize UI logic by feature in `app/features/[domain]/`
4. **Loader**: Prefetch using oRPC client, return dehydratedState
5. **Component**: Use feature-specific hooks and components
6. **SSR Hydration**: useDehydratedState merges server/client data

## AI Assistant Guidelines

The rules now ensure AI assistants will:

- Always use oRPC for API operations
- Use file-based routing with React Router v7 conventions (dots for nesting, $ for params)
- Organize backend logic by features/domains
- Organize frontend logic by features/domains
- Follow SSR hydration patterns
- Maintain end-to-end type safety
- Use pnpm exclusively
- Suggest shadcn/ui for shared components, feature-specific in features folders
- Respect Cloudflare Workers constraints
- Follow DDD principles and maintain feature boundaries

## Next Steps

With these rules in place, you can now confidently ask AI assistants to:

- Add new domain features in `app/backend/features/[domain]/`
- Create feature-specific frontend logic in `app/features/[domain]/`
- Implement shared UI components with shadcn/ui in `app/components/ui/`
- Create feature-specific components within feature folders
- Maintain DDD boundaries and established architecture patterns

The rules capture your specific implementation and ensure consistent development practices across your team and AI assistance.
