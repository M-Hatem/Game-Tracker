import { DealExplorer } from "@/components/deal-explorer";
import { SourceStatus } from "@/components/source-status";
import { getDeals } from "@/lib/deals";
import { site } from "@/lib/site";

// Static page regenerated in the background every 30 min (ISR).
// Next requires a literal here; keep it equal to DEALS_REVALIDATE_SECONDS.
export const revalidate = 1800;

export default async function HomePage() {
  const { deals, sources, fetchedAt } = await getDeals();
  const now = Date.parse(fetchedAt);
  const freeCount = deals.filter((d) => d.kind === "free" || d.kind === "giveaway").length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="max-w-3xl font-bold text-3xl tracking-tight sm:text-5xl">
          Game sales on <span className="text-accent">every platform</span>, in one place.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          {site.tagline}{" "}
          {deals.length > 0 && `${deals.length} deals right now, ${freeCount} of them free.`}
        </p>
        <div className="flex flex-col gap-2 text-muted text-xs">
          <SourceStatus sources={sources} />
          <p>
            Updated <time dateTime={fetchedAt}>{new Date(fetchedAt).toUTCString()}</time>
          </p>
        </div>
      </header>

      <DealExplorer deals={deals} now={now} />
    </div>
  );
}
