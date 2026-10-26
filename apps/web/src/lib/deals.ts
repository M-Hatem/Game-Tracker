import "server-only";
import { type DealsSnapshot, type Fetcher, getDealsSnapshot } from "@gt/core";
import { cache } from "react";
import { DEALS_CACHE_TAG, DEALS_REVALIDATE_SECONDS, site } from "./site";

const userAgent = `${site.name.replace(/\s+/g, "")}/0.1 (${process.env.DEALS_CONTACT_EMAIL ?? "contact unset"})`;

/** Wrap fetch with Next.js data-cache options so every source is ISR-cached. */
const cachedFetch: Fetcher = (url, init) =>
  fetch(url, {
    ...init,
    headers: { "User-Agent": userAgent, ...init?.headers },
    next: { revalidate: DEALS_REVALIDATE_SECONDS, tags: [DEALS_CACHE_TAG] },
  });

/** Deduped per request via React `cache`; cached across requests via the fetch cache. */
export const getDeals = cache(
  (): Promise<DealsSnapshot> => getDealsSnapshot({ fetcher: cachedFetch }),
);
