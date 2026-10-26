import { z } from "zod";
import { API_URLS } from "../sources";
import type { Deal, Fetcher } from "../types";
import { isHttpUrl, toIso, toNumber } from "../utils";

const storeSchema = z.object({
  storeID: z.string(),
  storeName: z.string(),
  isActive: z.union([z.number(), z.boolean()]).optional(),
});

const dealSchema = z.object({
  dealID: z.string(),
  storeID: z.string(),
  title: z.string(),
  salePrice: z.string(),
  normalPrice: z.string(),
  savings: z.string().optional(),
  thumb: z.string().optional(),
  steamRatingText: z.string().nullable().optional(),
  steamRatingPercent: z.string().optional(),
  lastChange: z.number().optional(),
});

export type CheapSharkStore = z.infer<typeof storeSchema>;
export type CheapSharkDeal = z.infer<typeof dealSchema>;

/** Validate item-by-item so one malformed row doesn't drop the whole feed. */
function parseEach<T>(schema: z.ZodType<T>, data: unknown): T[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) => {
    const r = schema.safeParse(row);
    return r.success ? [r.data] : [];
  });
}

export function parseCheapSharkStores(data: unknown): Map<string, string> {
  return new Map(parseEach(storeSchema, data).map((s) => [s.storeID, s.storeName]));
}

export function normalizeCheapSharkDeals(data: unknown, stores: Map<string, string>): Deal[] {
  return parseEach(dealSchema, data).map((d) => {
    const current = toNumber(d.salePrice) ?? 0;
    const regular = toNumber(d.normalPrice);
    const savings = toNumber(d.savings);
    const rating =
      d.steamRatingText && d.steamRatingPercent && d.steamRatingPercent !== "0"
        ? `${d.steamRatingText} · ${d.steamRatingPercent}%`
        : undefined;
    return {
      id: `cheapshark:${d.dealID}`,
      sourceId: "cheapshark",
      kind: current === 0 ? "free" : "sale",
      title: d.title,
      // CheapShark's API terms: send users through their redirect link.
      url: API_URLS.cheapsharkRedirect(d.dealID),
      store: stores.get(d.storeID),
      platforms: ["pc"],
      price: {
        current,
        regular,
        discountPct: savings !== undefined ? Math.round(savings) : undefined,
        currency: "USD",
      },
      imageUrl: isHttpUrl(d.thumb) ? d.thumb : undefined,
      publishedAt: toIso(d.lastChange),
      meta: rating,
    } satisfies Deal;
  });
}

export async function fetchCheapShark(fetcher: Fetcher, init?: RequestInit): Promise<Deal[]> {
  const [storesRes, dealsRes] = await Promise.all([
    fetcher(API_URLS.cheapsharkStores, init),
    fetcher(API_URLS.cheapsharkDeals, init),
  ]);
  if (!dealsRes.ok) throw new Error(`CheapShark deals HTTP ${dealsRes.status}`);
  // Store names are nice-to-have; deals still render without them.
  const stores = storesRes.ok ? parseCheapSharkStores(await storesRes.json()) : new Map();
  return normalizeCheapSharkDeals(await dealsRes.json(), stores);
}
