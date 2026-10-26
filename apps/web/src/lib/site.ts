export const site = {
  // Working name until the brand is decided — change it here only.
  name: "Game Tracker",
  tagline: "Every game sale and giveaway, across every platform, in one place.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Revalidate deal data every 30 minutes (ISR). */
export const DEALS_REVALIDATE_SECONDS = 1800;
export const DEALS_CACHE_TAG = "deals";
