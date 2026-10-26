# Game-Tracker — working notes for Claude

- Monorepo: pnpm + Turborepo. `apps/web` (Next.js 16 App Router), `packages/core` (shared, framework-free).
- Never import React, Next.js or Node-only APIs into `packages/core`; mobile and desktop reuse it.
- New deal source = entry in `packages/core/src/sources.ts` + loader in `aggregate.ts` + a test with an inline fixture. Validate external data with Zod and skip bad rows; never throw for one bad item.
- Styling: Tailwind v4 utilities backed by the CSS-variable tokens in `apps/web/src/app/globals.css`. No hard-coded colors in components.
- Keep the home page static (ISR). Don't read `searchParams`/cookies in it; do filtering client-side.
- Before finishing: `pnpm lint:fix && pnpm typecheck && pnpm test && pnpm build`.
- Conventional commits (`feat:`, `fix:`, `chore:`…).
