"use client";

import { type Deal, type DealKind, KIND_LABELS, PLATFORM_LABELS, type Platform } from "@gt/core";
import { useDeferredValue, useState } from "react";
import { DealCard } from "./deal-card";

const PLATFORM_FILTERS: Array<Platform | "all"> = [
  "all",
  "pc",
  "playstation",
  "xbox",
  "nintendo",
  "mobile",
];
const KIND_FILTERS: Array<DealKind | "all"> = ["all", "sale", "free", "giveaway"];
const PAGE_SIZE = 24;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-surface hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Filtering happens client-side over the server-rendered snapshot, so the page
 * stays fully static (ISR) and filtering is instant with no extra requests.
 */
export function DealExplorer({ deals, now }: { deals: Deal[]; now: number }) {
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [kind, setKind] = useState<DealKind | "all">("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = deals.filter(
    (d) =>
      (platform === "all" || d.platforms.includes(platform)) &&
      (kind === "all" || d.kind === kind) &&
      (!deferredQuery || d.title.toLowerCase().includes(deferredQuery)),
  );
  const visible = filtered.slice(0, limit);

  const reset = () => setLimit(PAGE_SIZE);

  return (
    <section aria-labelledby="deals-heading" className="flex flex-col gap-5">
      <h2 id="deals-heading" className="sr-only">
        Deals
      </h2>

      <div className="flex flex-col gap-3">
        <label className="relative block max-w-md">
          <span className="sr-only">Search deals</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              reset();
            }}
            placeholder="Search games…"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 placeholder:text-muted"
          />
        </label>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Platform</legend>
          {PLATFORM_FILTERS.map((p) => (
            <Chip
              key={p}
              active={platform === p}
              onClick={() => {
                setPlatform(p);
                reset();
              }}
            >
              {p === "all" ? "All platforms" : PLATFORM_LABELS[p]}
            </Chip>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Deal type</legend>
          {KIND_FILTERS.map((k) => (
            <Chip
              key={k}
              active={kind === k}
              onClick={() => {
                setKind(k);
                reset();
              }}
            >
              {k === "all" ? "All types" : KIND_LABELS[k]}
            </Chip>
          ))}
        </fieldset>
      </div>

      <p aria-live="polite" className="text-muted text-sm">
        {filtered.length} {filtered.length === 1 ? "deal" : "deals"}
      </p>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((deal) => (
            <li key={deal.id} className="flex">
              <DealCard deal={deal} now={now} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-border border-dashed p-10 text-center text-muted">
          Nothing matches these filters right now.
        </p>
      )}

      {filtered.length > limit ? (
        <button
          type="button"
          onClick={() => setLimit((l) => l + PAGE_SIZE)}
          className="mx-auto rounded-lg border border-border bg-surface px-4 py-2 hover:bg-surface-2"
        >
          Show more
        </button>
      ) : null}
    </section>
  );
}
