import { z } from "zod";
import { API_URLS } from "../sources";
import type { Deal, Fetcher } from "../types";
import { detectPlatforms, isHttpUrl, toIso, toNumber } from "../utils";

const giveawaySchema = z.object({
  id: z.number(),
  title: z.string(),
  worth: z.string().optional(),
  thumbnail: z.string().optional(),
  image: z.string().optional(),
  type: z.string().optional(),
  platforms: z.string().optional(),
  open_giveaway_url: z.string().optional(),
  gamerpower_url: z.string().optional(),
  published_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
});

export function normalizeGamerPower(data: unknown): Deal[] {
  // The API returns an object (not an array) when there are no giveaways.
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) => {
    const r = giveawaySchema.safeParse(row);
    if (!r.success) return [];
    const g = r.data;
    if (g.status && g.status.toLowerCase() !== "active") return [];

    const url = [g.open_giveaway_url, g.gamerpower_url].find(isHttpUrl);
    if (!url) return [];

    const worth = toNumber(g.worth?.replace("$", ""));
    const isGame = (g.type ?? "").toLowerCase() === "game";
    const deal: Deal = {
      id: `gamerpower:${g.id}`,
      sourceId: "gamerpower",
      kind: isGame ? "free" : "giveaway",
      title: g.title,
      url,
      store: g.platforms?.split(",")[0]?.trim(),
      platforms: detectPlatforms(g.platforms),
      price: { current: 0, regular: worth, discountPct: worth ? 100 : undefined, currency: "USD" },
      imageUrl: [g.thumbnail, g.image].find(isHttpUrl),
      publishedAt: toIso(g.published_date),
      endsAt: toIso(g.end_date),
      meta: g.type,
    };
    return [deal];
  });
}

export async function fetchGamerPower(fetcher: Fetcher, init?: RequestInit): Promise<Deal[]> {
  const res = await fetcher(API_URLS.gamerpowerGiveaways, init);
  if (!res.ok) throw new Error(`GamerPower HTTP ${res.status}`);
  return normalizeGamerPower(await res.json());
}
