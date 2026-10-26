# Game-Tracker

Game progress tracker and cross-platform sales hub. Phase 1 is a fast, database-free web landing page that aggregates game sales and free-game giveaways from PC, PlayStation, Xbox, Nintendo and mobile. Mobile and desktop apps follow, sharing the same core package.

## Stack

| Layer       | Choice                                                       | Why                                                                  |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Monorepo    | pnpm workspaces + Turborepo                                  | One repo for web, mobile and desktop with cached builds              |
| Web         | Next.js 16 (App Router, Turbopack, React 19, React Compiler) | Server Components + ISR = static speed with fresh data               |
| Language    | TypeScript (strict, `noUncheckedIndexedAccess`)              | Catch data-shape bugs from third-party feeds                         |
| Styling     | Tailwind CSS v4 with CSS-variable design tokens              | Rebrand by editing one block in `globals.css`                        |
| Validation  | Zod                                                          | Every external API row is validated; bad rows are skipped, not fatal |
| Feeds       | fast-xml-parser                                              | Parses RSS 2.0 and Atom                                              |
| Lint/format | Biome                                                        | One fast tool instead of ESLint + Prettier                           |
| Tests       | Vitest                                                       | Adapter tests run on fixtures, no network                            |

## Layout

```
apps/
  web/                 Next.js app (landing page + /api/deals JSON)
  mobile/              (phase 3) Expo / React Native
  desktop/             (phase 4) Tauri
packages/
  core/                Platform-agnostic: types, source registry, adapters, formatting
```

`@gt/core` has no React or Next.js imports, so the mobile and desktop apps can reuse the exact same adapters.

## How the deals page works

1. `getDealsSnapshot()` fetches every source in parallel with an 8 s timeout each.
2. Each adapter validates and normalizes to one `Deal` type; duplicates across sources are merged.
3. A failing source never breaks the page. It shows as "unavailable" in the status row.
4. The page is statically generated and refreshed in the background every 30 minutes (ISR), so visitors never wait on third-party APIs.
5. Filtering (platform, type, search) runs client-side over that snapshot. Instant, no extra requests.

Sources today: CheapShark (PC prices across ~30 stores), GamerPower (giveaways on all platforms), LootScraper (free games), GG.deals freebies, r/GameDeals, Steam News (official sale & event announcements). Add one in `packages/core/src/sources.ts` + `aggregate.ts`.

## Getting started

```bash
nvm use               # Node 22+
corepack enable       # provides pnpm
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev              # http://localhost:3000
```

| Command                       | What it does                         |
| ----------------------------- | ------------------------------------ |
| `pnpm dev`                    | Run all apps in dev mode             |
| `pnpm build`                  | Production build (Turbo-cached)      |
| `pnpm test`                   | Unit tests                           |
| `pnpm typecheck`              | Type-check every package             |
| `pnpm lint` / `pnpm lint:fix` | Biome lint + format check / auto-fix |
| `pnpm ci`                     | Everything CI runs                   |

## Deploying

Vercel is the zero-config option: import the repo, set the root directory to `apps/web`, and add `NEXT_PUBLIC_SITE_URL` and `DEALS_CONTACT_EMAIL` as environment variables.

## Data terms

- **CheapShark**: free API; links must go through CheapShark's redirect (already done).
- **GamerPower**: free API; attribute GamerPower as the source (shown in the footer).
- RSS feeds belong to their publishers; we show titles and link out.

See [ROADMAP.md](ROADMAP.md) for phases and [RESOURCES.md](RESOURCES.md) for feeds, APIs and useful repos.
