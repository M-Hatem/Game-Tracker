import type { DealKind, Platform, Price } from "./types";

export const PLATFORM_LABELS: Record<Platform, string> = {
  pc: "PC",
  playstation: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  mobile: "Mobile",
  other: "Other",
};

export const KIND_LABELS: Record<DealKind, string> = {
  sale: "On sale",
  free: "Free",
  giveaway: "Giveaway",
  news: "News",
};

const money = new Map<string, Intl.NumberFormat>();

export function formatMoney(amount: number, currency = "USD", locale = "en-US"): string {
  const key = `${locale}|${currency}`;
  let fmt = money.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
    money.set(key, fmt);
  }
  return fmt.format(amount);
}

/** "Free", "$4.99", or undefined when no price is known. */
export function formatPrice(price?: Price, locale?: string): string | undefined {
  if (!price || price.current === undefined) return undefined;
  return price.current === 0 ? "Free" : formatMoney(price.current, price.currency, locale);
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "3 hours ago" / "in 2 days". `now` is injectable for tests. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const diffSec = Math.round((new Date(iso).getTime() - now) / 1000);
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diffSec) >= secs) return rtf.format(Math.round(diffSec / secs), unit);
  }
  return "just now";
}
