# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server on port 3000
pnpm build        # production build
pnpm test         # run tests (vitest)
pnpm lint         # eslint
pnpm format       # prettier --write + eslint --fix
pnpm check        # prettier format check

pnpm db:generate  # generate drizzle migrations from schema
pnpm db:migrate   # run pending migrations
pnpm db:push      # push schema directly to DB (dev only)
pnpm db:studio    # open Drizzle Studio
```

Run a single test file: `pnpm vitest run src/path/to/file.test.ts`

## Architecture

This is a **TanStack Start** full-stack React app (SSR + file-based routing via `@tanstack/react-router`). Server functions run inside route files using `createServerFn` or route `server.handlers`.

### Key layers

- **Routing** — `src/routes/` uses file-based routing. `__root.tsx` is the shell. Pathless route groups like `(app)/` provide shared layouts without affecting the URL. `src/routeTree.gen.ts` is auto-generated; never edit it manually.
- **Router setup** — `src/router.tsx` creates the router with SSR-aware TanStack Query integration (`setupRouterSsrQueryIntegration`). The `QueryClient` is passed as router context so loaders and queries share the same cache.
- **Database** — Drizzle ORM over PostgreSQL (`pg`). Schema lives in `src/db/schema.ts`; the client is exported from `src/db/index.ts`. Requires `DATABASE_URL` env var.
- **Auth** — Better Auth (`src/lib/auth.ts`) with email/password and the `tanstackStartCookies` plugin. The API catch-all is at `src/routes/api/auth/$.ts`. The client-side helper is `src/lib/auth-client.ts`.
- **UI components** — shadcn/ui (New York style, zinc base, CSS variables). Add components with `pnpm dlx shadcn@latest add <component>`. Path alias `#/components/ui`.

### Path aliases

`#/*` maps to `src/*` (configured in `package.json` imports and `tsconfig`). Use `#/lib/utils`, `#/components/ui`, etc.

### Environment variables

- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — required for Better Auth (generate with `npx @better-auth/cli secret`)
