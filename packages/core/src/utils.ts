import type { Platform } from "./types";

/** Parse a date-ish string to ISO, or undefined if it isn't a real date. */
export function toIso(value: unknown): string | undefined {
  if (typeof value === "number") {
    // Unix seconds (CheapShark) vs milliseconds.
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  if (typeof value !== "string" || value.trim() === "" || value === "N/A") return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function toNumber(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Strip HTML tags and collapse whitespace. Good enough for feed summaries. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

const PLATFORM_KEYWORDS: Array<[Platform, RegExp]> = [
  ["playstation", /\b(ps[345]|playstation|psn|ps plus)\b/i],
  ["xbox", /\b(xbox|game pass)\b/i],
  ["nintendo", /\b(nintendo|switch|eshop)\b/i],
  ["mobile", /\b(android|ios|iphone|ipad|google play|app store)\b/i],
  [
    "pc",
    /\b(pc|steam|gog|epic|humble|fanatical|itch\.?io|ubisoft|ea app|origin|battle\.net|windows|green ?man)\b/i,
  ],
];

/** Guess platforms from free text such as a feed title or a tag list. */
export function detectPlatforms(...texts: Array<string | undefined>): Platform[] {
  const haystack = texts.filter(Boolean).join(" ");
  const found = PLATFORM_KEYWORDS.filter(([, re]) => re.test(haystack)).map(([p]) => p);
  return found.length > 0 ? found : ["other"];
}

/** `[Steam] Some Game (80% off)` → `Steam` — the r/GameDeals title convention. */
export function storeFromBracketTitle(title: string): string | undefined {
  return /^\s*\[([^\]]{1,40})\]/.exec(title)?.[1]?.trim();
}

export function percentFromText(text: string): number | undefined {
  const m = /(\d{1,3})\s*%\s*off/i.exec(text) ?? /-\s*(\d{1,3})\s*%/.exec(text);
  const n = m?.[1] ? Number.parseInt(m[1], 10) : undefined;
  return n !== undefined && n > 0 && n <= 100 ? n : undefined;
}
