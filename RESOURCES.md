# Resources

Checked October 2026. Feeds move; if one breaks, the app marks it "unavailable" and keeps going.

## Sale & freebie RSS feeds

| Feed | URL | Covers | In app |
| --- | --- | --- | --- |
| LootScraper — all free offers | https://feed.phenx.de/lootscraper.xml | Epic, Steam, GOG, Amazon Prime, Humble, itch.io, iOS, Android | ✅ |
| LootScraper — Epic | https://feed.phenx.de/lootscraper_epic_game.xml | Epic Games Store | |
| LootScraper — Steam games | https://feed.phenx.de/lootscraper_steam_game.xml | Steam | |
| LootScraper — Steam loot | https://feed.phenx.de/lootscraper_steam_loot.xml | Steam in-game items | |
| LootScraper — GOG | https://feed.phenx.de/lootscraper_gog_game.xml | GOG | |
| LootScraper — Amazon Prime games | https://feed.phenx.de/lootscraper_amazon_game.xml | Prime Gaming | |
| LootScraper — Humble | https://feed.phenx.de/lootscraper_humble_game.xml | Humble | |
| LootScraper — Android | https://feed.phenx.de/lootscraper_google_game.xml | Google Play | |
| LootScraper — iOS | https://feed.phenx.de/lootscraper_apple_game.xml | App Store | |
| GG.deals — freebies | https://gg.deals/news/freebies/feed/ | All platforms incl. consoles | ✅ |
| GG.deals — news (US) | https://gg.deals/us/news/feed/ | Deal news, sales events | |
| GG.deals — news (EU) | https://gg.deals/eu/news/feed/ | Same, EU pricing | |
| r/GameDeals — new | https://www.reddit.com/r/GameDeals/new/.rss | Community deals, all stores | ✅ |
| r/FreeGameFindings — new | https://www.reddit.com/r/FreeGameFindings/new/.rss | Free games | |
| r/PS5 deals / r/NintendoSwitchDeals | `https://www.reddit.com/r/<sub>/new/.rss` | Console-specific | |

Any subreddit works as RSS by appending `/new/.rss`. For sites without a feed (e.g. Deku Deals, PSPrices), an RSS bridge like rss-bridge.org or rss.app can generate one.

## Deal & game data APIs (JSON)

| API | What | Key needed |
| --- | --- | --- |
| CheapShark — https://apidocs.cheapshark.com | PC prices across ~30 stores, price history | No (use their redirect links) — ✅ in app |
| GamerPower — https://www.gamerpower.com/api-read | Giveaways for PC, PS, Xbox, Switch, mobile | No (attribute them) — ✅ in app |
| IsThereAnyDeal API — https://docs.isthereanydeal.com | PC prices, historical lows, bundles, waitlists | Free key |
| IGDB (Twitch) — https://api-docs.igdb.com | Game metadata, covers, release dates | Free Twitch app |
| RAWG — https://rawg.io/apidocs | Game metadata (simpler than IGDB) | Free key |
| Steam Web API — https://steamcommunity.com/dev | Owned games, playtime, achievements | Free key |
| RetroAchievements — https://api-docs.retroachievements.org | Retro progress | Free key |

## GitHub repos worth bookmarking

**Starters & architecture**
- https://github.com/vercel/next.js — framework + `examples/` folder
- https://github.com/vercel/turborepo — monorepo tooling, has Next + Expo examples
- https://github.com/t3-oss/create-t3-turbo — Next.js + Expo monorepo template (closest to this project's future shape)
- https://github.com/alan2207/bulletproof-react — scalable React project structure

**UI & design**
- https://github.com/shadcn-ui/ui — copy-in components on Radix + Tailwind (great fit once the brand exists)
- https://github.com/radix-ui/primitives — accessible unstyled primitives
- https://github.com/tailwindlabs/tailwindcss — styling
- https://github.com/lucide-icons/lucide — icons
- https://github.com/motiondivision/motion — animation (formerly Framer Motion)
- https://github.com/magicuidesign/magicui — animated landing-page components
- https://github.com/tremorlabs/tremor — dashboard / chart components (stats for the tracker)
- https://github.com/bradtraversy/design-resources-for-developers — huge list of free design assets

**State, data, forms**
- https://github.com/TanStack/query — server-state caching (web + React Native)
- https://github.com/pmndrs/zustand — tiny client state
- https://github.com/colinhacks/zod — validation (used here)
- https://github.com/react-hook-form/react-hook-form — forms

**Backend (phase 2)**
- https://github.com/drizzle-team/drizzle-orm — type-safe SQL ORM
- https://github.com/supabase/supabase — Postgres + auth + storage
- https://github.com/better-auth/better-auth — auth library

**Mobile & desktop (phases 3–4)**
- https://github.com/expo/expo — React Native framework
- https://github.com/nativewind/nativewind — Tailwind for React Native
- https://github.com/tauri-apps/tauri — small, fast desktop apps
- https://github.com/electron/electron — the heavier alternative

**Quality**
- https://github.com/biomejs/biome — lint + format (used here)
- https://github.com/vitest-dev/vitest — tests (used here)
- https://github.com/microsoft/playwright — end-to-end tests
- https://github.com/storybookjs/storybook — component workshop for the design system

**Gaming-specific**
- https://github.com/eikowagenknecht/lootscraper — the free-games scraper behind the LootScraper feeds
- https://github.com/achievements-app/psn-api — PlayStation trophies / library
- https://github.com/claabs/epicgames-freegames-node — Epic free-game automation (reference)

**Lists**
- https://github.com/public-apis/public-apis — free APIs (has a Games section)
- https://github.com/sindresorhus/awesome — index of awesome lists
- https://github.com/kamranahmedse/developer-roadmap — learning paths
