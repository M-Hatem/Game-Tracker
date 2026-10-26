import type { SourceDefinition, SourceId } from "./types";

/**
 * Every place deals come from. Add a source here, write (or reuse) an
 * adapter, and register it in `aggregate.ts`. Nothing else changes.
 */
export const SOURCES = {
  cheapshark: {
    id: "cheapshark",
    name: "CheapShark",
    format: "json-api",
    homepage: "https://www.cheapshark.com",
    attribution: "PC prices from CheapShark",
    platforms: ["pc"],
  },
  gamerpower: {
    id: "gamerpower",
    name: "GamerPower",
    format: "json-api",
    homepage: "https://www.gamerpower.com",
    attribution: "Giveaways from GamerPower",
    platforms: ["pc", "playstation", "xbox", "nintendo", "mobile"],
  },
  lootscraper: {
    id: "lootscraper",
    name: "LootScraper",
    format: "rss",
    homepage: "https://eikowagenknecht.com/lootscraper/",
    attribution: "Free games tracked by LootScraper",
    platforms: ["pc", "mobile"],
  },
  "ggdeals-freebies": {
    id: "ggdeals-freebies",
    name: "GG.deals Freebies",
    format: "rss",
    homepage: "https://gg.deals/news/freebies/",
    attribution: "Freebie news from GG.deals",
    platforms: ["pc", "playstation", "xbox", "nintendo"],
  },
  "reddit-gamedeals": {
    id: "reddit-gamedeals",
    name: "r/GameDeals",
    format: "rss",
    homepage: "https://www.reddit.com/r/GameDeals/",
    attribution: "Community deals from r/GameDeals",
    platforms: ["pc", "playstation", "xbox", "nintendo"],
  },
  "steam-news": {
    id: "steam-news",
    name: "Steam News",
    format: "rss",
    homepage: "https://store.steampowered.com/news/app/593110",
    attribution: "Sale & event announcements from Steam",
    platforms: ["pc"],
  },
} as const satisfies Record<SourceId, SourceDefinition>;

export const SOURCE_LIST: SourceDefinition[] = Object.values(SOURCES);

/** Feed URLs used by the RSS adapter. Kept separate so they're easy to swap. */
export const FEED_URLS = {
  lootscraper: "https://feed.phenx.de/lootscraper.xml",
  "ggdeals-freebies": "https://gg.deals/news/freebies/feed/",
  "reddit-gamedeals": "https://www.reddit.com/r/GameDeals/new/.rss",
  // Valve's official "Steam News" hub (app 593110): seasonal sales, fests, store events.
  // Same pattern works for any game: /feeds/news/app/<appid>/
  "steam-news": "https://store.steampowered.com/feeds/news/app/593110/?cc=US&l=english",
} as const satisfies Partial<Record<SourceId, string>>;

export const API_URLS = {
  cheapsharkDeals:
    "https://www.cheapshark.com/api/1.0/deals?onSale=1&sortBy=Deal%20Rating&pageSize=60&AAA=0",
  cheapsharkStores: "https://www.cheapshark.com/api/1.0/stores",
  cheapsharkRedirect: (dealId: string) =>
    `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(dealId)}`,
  gamerpowerGiveaways: "https://www.gamerpower.com/api/giveaways?sort-by=date",
} as const;
