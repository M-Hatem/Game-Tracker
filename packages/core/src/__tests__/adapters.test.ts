import { describe, expect, it } from "vitest";
import { normalizeCheapSharkDeals, parseCheapSharkStores } from "../adapters/cheapshark";
import { normalizeGamerPower } from "../adapters/gamerpower";
import { feedEntriesToDeals, parseFeed } from "../adapters/rss";
import { getDealsSnapshot, mergeDeals } from "../aggregate";
import { formatPrice, formatRelative } from "../format";
import type { Deal } from "../types";
import { detectPlatforms, percentFromText, storeFromBracketTitle } from "../utils";

const RSS = `<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel>
  <item>
    <title>[Steam] Hollow Knight (50% off)</title>
    <link>https://store.steampowered.com/app/367520</link>
    <guid>abc</guid>
    <pubDate>Mon, 26 Oct 2026 10:00:00 GMT</pubDate>
    <description><![CDATA[<p>Great <img src="https://img.example.com/hk.jpg"> deal</p>]]></description>
  </item>
  <item><title>No link here</title></item>
</channel></rss>`;

const ATOM = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>urn:1</id>
    <title>Epic Games (Game) - Some Game</title>
    <link rel="alternate" href="https://store.epicgames.com/p/some-game"/>
    <updated>2026-10-25T12:00:00Z</updated>
    <category term="epic"/>
  </entry>
</feed>`;

describe("rss adapter", () => {
  it("parses RSS 2.0 and skips entries without a link", () => {
    const entries = parseFeed(RSS);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.imageUrl).toBe("https://img.example.com/hk.jpg");
    expect(entries[0]?.publishedAt).toBe("2026-10-26T10:00:00.000Z");
  });

  it("parses Atom", () => {
    const [e] = parseFeed(ATOM);
    expect(e?.link).toBe("https://store.epicgames.com/p/some-game");
    expect(e?.categories).toEqual(["epic"]);
  });

  it("infers store, discount and platform from titles", () => {
    const [deal] = feedEntriesToDeals(parseFeed(RSS), {
      sourceId: "reddit-gamedeals",
      url: "x",
      defaultKind: "sale",
    });
    expect(deal).toMatchObject({ store: "Steam", kind: "sale", platforms: ["pc"] });
    expect(deal?.price?.discountPct).toBe(50);
  });
});

describe("cheapshark adapter", () => {
  it("normalizes deals and uses the redirect link", () => {
    const stores = parseCheapSharkStores([{ storeID: "1", storeName: "Steam", isActive: 1 }]);
    const [d] = normalizeCheapSharkDeals(
      [
        {
          dealID: "a/b=",
          storeID: "1",
          title: "Celeste",
          salePrice: "4.99",
          normalPrice: "19.99",
          savings: "75.037",
          thumb: "https://cdn.example.com/c.jpg",
          steamRatingText: "Overwhelmingly Positive",
          steamRatingPercent: "97",
          lastChange: 1_790_000_000,
        },
        { broken: true },
      ],
      stores,
    );
    expect(d?.url).toBe("https://www.cheapshark.com/redirect?dealID=a%2Fb%3D");
    expect(d?.store).toBe("Steam");
    expect(d?.price).toMatchObject({ current: 4.99, regular: 19.99, discountPct: 75 });
  });
});

describe("gamerpower adapter", () => {
  it("handles the no-results object and maps platforms", () => {
    expect(normalizeGamerPower({ status: 0 })).toEqual([]);
    const [d] = normalizeGamerPower([
      {
        id: 7,
        title: "Free Thing (PS5)",
        worth: "$19.99",
        type: "Game",
        platforms: "PS5, Xbox Series X|S",
        open_giveaway_url: "https://www.gamerpower.com/open/7",
        status: "Active",
        end_date: "N/A",
      },
    ]);
    expect(d?.kind).toBe("free");
    expect(d?.platforms).toEqual(["playstation", "xbox"]);
    expect(d?.endsAt).toBeUndefined();
  });
});

describe("aggregate", () => {
  const base: Deal = {
    id: "x",
    sourceId: "cheapshark",
    kind: "sale",
    title: "",
    url: "",
    platforms: [],
  };

  it("de-duplicates across sources and sorts newest first", () => {
    const merged = mergeDeals([
      [{ ...base, id: "1", title: "Celeste", publishedAt: "2026-10-01T00:00:00Z" }],
      [
        {
          ...base,
          id: "2",
          title: "[Steam] Celeste (75% off)",
          publishedAt: "2026-10-02T00:00:00Z",
        },
        { ...base, id: "3", title: "Hades", publishedAt: "2026-10-03T00:00:00Z" },
      ],
    ]);
    expect(merged.map((d) => d.id)).toEqual(["3", "1"]);
  });

  it("reports a failing source without failing the snapshot", async () => {
    const snap = await getDealsSnapshot({
      sources: ["gamerpower"],
      fetcher: async () => new Response("nope", { status: 503 }),
    });
    expect(snap.deals).toEqual([]);
    expect(snap.sources[0]).toMatchObject({ id: "gamerpower", ok: false });
  });
});

describe("utils + format", () => {
  it("detects platforms, stores and percents", () => {
    expect(detectPlatforms("Nintendo Switch eShop sale")).toEqual(["nintendo"]);
    expect(detectPlatforms("something")).toEqual(["other"]);
    expect(storeFromBracketTitle("[GOG] Witcher 3")).toBe("GOG");
    expect(percentFromText("Game ($2.99 / -85%)")).toBe(85);
  });

  it("formats prices and relative times", () => {
    expect(formatPrice({ current: 0, currency: "USD" })).toBe("Free");
    expect(formatPrice({ current: 4.5, currency: "USD" })).toBe("$4.50");
    expect(formatPrice({ discountPct: 50, currency: "USD" })).toBeUndefined();
    const now = Date.parse("2026-10-26T12:00:00Z");
    expect(formatRelative("2026-10-26T09:00:00Z", now)).toBe("3 hours ago");
  });
});
