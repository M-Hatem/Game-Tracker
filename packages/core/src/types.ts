/**
 * Shared domain types. Kept free of any web/React/Node specifics so the
 * mobile (Expo) and desktop (Tauri) apps can import them unchanged.
 */

export const PLATFORMS = ["pc", "playstation", "xbox", "nintendo", "mobile", "other"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const DEAL_KINDS = ["sale", "free", "giveaway", "news"] as const;
export type DealKind = (typeof DEAL_KINDS)[number];

export interface Price {
  /** Current price in `currency`. 0 means free; undefined when only the discount is known (RSS). */
  current?: number;
  /** Regular price before discount, when known. */
  regular?: number;
  /** Discount in whole percent (0–100), when known. */
  discountPct?: number;
  currency: string;
}

export interface Deal {
  /** Stable id, unique across all sources: `${sourceId}:${nativeId}`. */
  id: string;
  sourceId: SourceId;
  kind: DealKind;
  title: string;
  /** Outbound link the user should open. */
  url: string;
  /** Storefront name, e.g. "Steam", "Epic Games Store". */
  store?: string;
  platforms: Platform[];
  price?: Price;
  imageUrl?: string;
  /** ISO 8601 */
  publishedAt?: string;
  /** ISO 8601 */
  endsAt?: string;
  /** Extra short line, e.g. a Steam rating or giveaway worth. */
  meta?: string;
}

export type SourceId =
  | "cheapshark"
  | "gamerpower"
  | "lootscraper"
  | "ggdeals-freebies"
  | "reddit-gamedeals";

export type SourceFormat = "json-api" | "rss";

export interface SourceDefinition {
  id: SourceId;
  name: string;
  format: SourceFormat;
  homepage: string;
  /** Short attribution line shown in the UI (some APIs require it). */
  attribution: string;
  platforms: Platform[];
}

export type SourceStatus =
  | { id: SourceId; ok: true; count: number }
  | { id: SourceId; ok: false; error: string };

export interface DealsSnapshot {
  deals: Deal[];
  sources: SourceStatus[];
  /** ISO 8601 time the snapshot was assembled. */
  fetchedAt: string;
}

/**
 * Minimal fetch signature. The web app wraps `fetch` to add Next.js cache
 * options; React Native and Tauri can pass the platform `fetch` directly.
 */
export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;
