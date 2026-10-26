import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-lg bg-accent text-accent-fg text-sm"
          >
            GT
          </span>
          {site.name}
        </Link>
        <nav aria-label="Primary" className="text-muted text-sm">
          <span className="rounded-full border border-border px-2.5 py-1">Tracker coming soon</span>
        </nav>
      </div>
    </header>
  );
}
