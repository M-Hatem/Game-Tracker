import {
  type Deal,
  formatMoney,
  formatPrice,
  formatRelative,
  KIND_LABELS,
  PLATFORM_LABELS,
} from "@gt/core";
import Image from "next/image";
import { canOptimize } from "@/lib/images";

const KIND_STYLES: Record<Deal["kind"], string> = {
  free: "bg-free/15 text-free",
  giveaway: "bg-free/15 text-free",
  sale: "bg-sale/15 text-sale",
  news: "bg-surface-2 text-muted",
};

export function DealCard({ deal, now }: { deal: Deal; now: number }) {
  const price = formatPrice(deal.price);
  const regular =
    deal.price?.regular && deal.price.regular > (deal.price.current ?? 0)
      ? formatMoney(deal.price.regular, deal.price.currency)
      : undefined;
  const discount = deal.price?.discountPct;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <div className="relative aspect-[16/9] bg-surface-2">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized={!canOptimize(deal.imageUrl)}
          />
        ) : (
          <div aria-hidden className="grid h-full place-items-center text-3xl text-muted">
            🎮
          </div>
        )}
        {discount ? (
          <span className="absolute top-2 right-2 rounded-md bg-accent px-2 py-0.5 font-semibold text-accent-fg text-sm tabular-nums">
            −{discount}%
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${KIND_STYLES[deal.kind]}`}>
            {KIND_LABELS[deal.kind]}
          </span>
          {deal.platforms
            .filter((p) => p !== "other")
            .map((p) => (
              <span key={p} className="rounded-full border border-border px-2 py-0.5 text-muted">
                {PLATFORM_LABELS[p]}
              </span>
            ))}
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug">
          {/* Stretched link: the whole card is clickable, but there's one link for screen readers. */}
          <a
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="after:absolute after:inset-0"
          >
            {deal.title}
          </a>
        </h3>

        {deal.meta ? <p className="line-clamp-2 text-muted text-sm">{deal.meta}</p> : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2 text-sm">
          <div className="flex items-baseline gap-2">
            {price ? <span className="font-semibold text-base tabular-nums">{price}</span> : null}
            {regular ? <s className="text-muted tabular-nums">{regular}</s> : null}
          </div>
          <div className="text-right text-muted text-xs">
            {deal.store ? <div>{deal.store}</div> : null}
            {deal.endsAt ? (
              <time dateTime={deal.endsAt}>ends {formatRelative(deal.endsAt, now)}</time>
            ) : deal.publishedAt ? (
              <time dateTime={deal.publishedAt}>{formatRelative(deal.publishedAt, now)}</time>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
