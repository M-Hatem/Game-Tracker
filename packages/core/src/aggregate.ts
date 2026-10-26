import { fetchCheapShark } from "./adapters/cheapshark";
import { fetchGamerPower } from "./adapters/gamerpower";
import { fetchRss } from "./adapters/rss";
import { FEED_URLS } from "./sources";
import type { Deal, DealsSnapshot, Fetcher, SourceId, SourceStatus } from "./types";

type Loader = (fetcher: Fetcher, init?: RequestInit) => Promise<Deal[]>;

/** Registry of loaders. Order here is the order sources appear in status lists. */
export const LOADERS: Record<SourceId, Loader> = {
  cheapshark: fetchCheapShark,
  gamerpower: fetchGamerPower,
  lootscraper: (f, i) =>
    fetchRss({ sourceId: "lootscraper", url: FEED_URLS.lootscraper, defaultKind: "free" }, f, i),
  "ggdeals-freebies": (f, i) =>
    fetchRss(
      { sourceId: "ggdeals-freebies", url: FEED_URLS["ggdeals-freebies"], defaultKind: "free" },
      f,
      i,
    ),
  "reddit-gamedeals": (f, i) =>
    fetchRss(
      { sourceId: "reddit-gamedeals", url: FEED_URLS["reddit-gamedeals"], defaultKind: "sale" },
      f,
      i,
    ),
};

export interface AggregateOptions {
  fetcher?: Fetcher;
  init?: RequestInit;
  /** Abort a single slow source after this many ms (default 8s). */
  timeoutMs?: number;
  sources?: SourceId[];
}

function withTimeout(fetcher: Fetcher, ms: number): Fetcher {
  return (url, init) => fetcher(url, { ...init, signal: AbortSignal.timeout(ms) });
}

/** Normalize a title for cross-source de-duplication. */
export function dedupeKey(d: Deal): string {
  const title = d.title
    .toLowerCase()
    .replace(/^\s*\[[^\]]*\]\s*/, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return `${d.kind}|${title}`;
}

/** Most recent first; undated items sink to the bottom. Removes duplicates. */
export function mergeDeals(lists: Deal[][]): Deal[] {
  const seen = new Set<string>();
  const merged: Deal[] = [];
  for (const deal of lists.flat()) {
    const key = dedupeKey(deal);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(deal);
  }
  return merged.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

/**
 * Fetch every source in parallel. A failing source never fails the page;
 * it's reported in `sources` so the UI can show it as unavailable.
 */
export async function getDealsSnapshot(options: AggregateOptions = {}): Promise<DealsSnapshot> {
  const fetcher = withTimeout(options.fetcher ?? fetch, options.timeoutMs ?? 8000);
  const ids = options.sources ?? (Object.keys(LOADERS) as SourceId[]);

  const results = await Promise.allSettled(ids.map((id) => LOADERS[id](fetcher, options.init)));

  const sources: SourceStatus[] = results.map((r, i) => {
    const id = ids[i] as SourceId;
    return r.status === "fulfilled"
      ? { id, ok: true, count: r.value.length }
      : { id, ok: false, error: r.reason instanceof Error ? r.reason.message : String(r.reason) };
  });

  const deals = mergeDeals(results.map((r) => (r.status === "fulfilled" ? r.value : [])));
  return { deals, sources, fetchedAt: new Date().toISOString() };
}
