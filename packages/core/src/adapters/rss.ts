import { XMLParser } from "fast-xml-parser";
import type { Deal, DealKind, Fetcher, Platform, SourceId } from "../types";
import {
  detectPlatforms,
  isHttpUrl,
  percentFromText,
  storeFromBracketTitle,
  stripHtml,
  toIso,
} from "../utils";

/** One normalized entry, independent of RSS 2.0 vs Atom. */
export interface FeedEntry {
  id: string;
  title: string;
  link: string;
  summary?: string;
  imageUrl?: string;
  publishedAt?: string;
  categories: string[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  processEntities: true,
  htmlEntities: true,
  // Never expand DTD entities from remote documents.
  ignoreDeclaration: true,
  ignorePiTags: true,
  isArray: (name) => ["item", "entry", "category", "link", "media:content"].includes(name),
});

type Node = Record<string, unknown>;

function text(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) return text((value as Node)["#text"]);
  return undefined;
}

function attr(value: unknown, name: string): string | undefined {
  if (value && typeof value === "object") return text((value as Node)[`@_${name}`]);
  return undefined;
}

function firstImageInHtml(html?: string): string | undefined {
  const src = html ? /<img[^>]+src=["']([^"']+)["']/i.exec(html)?.[1] : undefined;
  return isHttpUrl(src) ? src : undefined;
}

function atomLink(links: unknown): string | undefined {
  const list = Array.isArray(links) ? links : [links];
  const alt = list.find((l) => !attr(l, "rel") || attr(l, "rel") === "alternate");
  return attr(alt ?? list[0], "href") ?? text(list[0]);
}

/** Parse RSS 2.0 or Atom XML into a flat list of entries. */
export function parseFeed(xml: string): FeedEntry[] {
  const doc = parser.parse(xml) as Node;
  const rss = (doc.rss as Node | undefined)?.channel as Node | undefined;
  const atom = doc.feed as Node | undefined;
  const items = ((rss?.item ?? atom?.entry) as Node[] | undefined) ?? [];

  return items.flatMap((item): FeedEntry[] => {
    const title = stripHtml(text(item.title) ?? "");
    const link = rss ? (text((item.link as unknown[])?.[0]) ?? "") : (atomLink(item.link) ?? "");
    if (!title || !isHttpUrl(link)) return [];

    const html = text(item["content:encoded"]) ?? text(item.content) ?? text(item.description);
    const summaryHtml = text(item.summary) ?? text(item.description) ?? html;
    const media = (item["media:content"] as unknown[] | undefined)?.[0];
    const imageUrl = [
      attr(item["media:thumbnail"], "url"),
      attr(media, "url"),
      attr(item.enclosure, "url"),
      firstImageInHtml(html),
    ].find(isHttpUrl);

    const categories = ((item.category as unknown[] | undefined) ?? [])
      .map((c) => attr(c, "term") ?? text(c))
      .filter((c): c is string => Boolean(c));

    return [
      {
        id: text(item.guid) ?? text(item.id) ?? link,
        title,
        link,
        summary: summaryHtml ? stripHtml(summaryHtml).slice(0, 280) : undefined,
        imageUrl,
        publishedAt: toIso(
          text(item.pubDate) ?? text(item.published) ?? text(item.updated) ?? text(item["dc:date"]),
        ),
        categories,
      },
    ];
  });
}

export interface RssSourceConfig {
  sourceId: SourceId;
  url: string;
  defaultKind: DealKind;
  limit?: number;
  /** Fixed store for single-store feeds (e.g. Steam); otherwise parsed from `[Store]` titles. */
  store?: string;
  /** Fixed platforms for single-platform feeds; otherwise detected from title/categories. */
  platforms?: Platform[];
}

/** Turn generic feed entries into deals, inferring store/platform/discount. */
export function feedEntriesToDeals(entries: FeedEntry[], config: RssSourceConfig): Deal[] {
  return entries.slice(0, config.limit ?? 30).map((e) => {
    const discountPct = percentFromText(e.title);
    const isFree = /\b(free|100\s*%\s*off)\b/i.test(e.title);
    const kind: DealKind = isFree ? "free" : discountPct ? "sale" : config.defaultKind;
    return {
      id: `${config.sourceId}:${e.id}`,
      sourceId: config.sourceId,
      kind,
      title: e.title,
      url: e.link,
      store: config.store ?? storeFromBracketTitle(e.title),
      platforms: config.platforms ?? detectPlatforms(e.title, e.categories.join(" ")),
      price: discountPct ? { discountPct, currency: "USD" } : undefined,
      imageUrl: e.imageUrl,
      publishedAt: e.publishedAt,
      meta: e.summary,
    } satisfies Deal;
  });
}

export async function fetchRss(
  config: RssSourceConfig,
  fetcher: Fetcher,
  init?: RequestInit,
): Promise<Deal[]> {
  const res = await fetcher(config.url, {
    ...init,
    headers: {
      Accept: "application/rss+xml, application/atom+xml, text/xml;q=0.9",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`${config.sourceId} HTTP ${res.status}`);
  return feedEntriesToDeals(parseFeed(await res.text()), config);
}
