# Roadmap

## Phase 1 — Sales landing page (web, no database) ✅ in progress
- [x] Monorepo, CI, lint, tests
- [x] Aggregate sales + giveaways from 5 sources, ISR every 30 min
- [x] Platform / type / search filters
- [ ] Deploy (Vercel) and connect a domain
- [ ] Brand: name, logo, colors, font → update tokens in `apps/web/src/app/globals.css` and `site.ts`
- [ ] More console coverage (PlayStation / Xbox / Nintendo price sources — see RESOURCES.md)
- [ ] Region + currency selector (CheapShark is USD; console stores are regional)

## Phase 2 — Accounts + progress tracker (web)
- [ ] Database (Postgres via Supabase or Neon) + Drizzle ORM
- [ ] Auth (Better Auth or Supabase Auth)
- [ ] Game metadata from IGDB or RAWG
- [ ] Library: playing / completed / backlog / wishlist, hours, completion %
- [ ] Import from Steam, PSN, Xbox, RetroAchievements
- [ ] Wishlist price alerts (email / push / Telegram)

## Phase 3 — Mobile (Expo / React Native)
- [ ] `apps/mobile` reusing `@gt/core`
- [ ] Push notifications for wishlist drops and new freebies
- [ ] Shared UI tokens with web

## Phase 4 — Desktop (Tauri)
- [ ] `apps/desktop` wrapping the web UI or a shared React UI
- [ ] Local game detection (Steam/Epic/GOG libraries) for automatic play-time tracking
