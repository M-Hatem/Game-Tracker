import { SOURCES, type SourceStatus as Status } from "@gt/core";

export function SourceStatus({ sources }: { sources: Status[] }) {
  return (
    <ul aria-label="Source status" className="flex flex-wrap gap-2 text-xs">
      {sources.map((s) => (
        <li
          key={s.id}
          title={s.ok ? `${s.count} items` : s.error}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1"
        >
          <span aria-hidden className={`size-1.5 rounded-full ${s.ok ? "bg-free" : "bg-sale"}`} />
          {SOURCES[s.id].name}
          <span className="text-muted">{s.ok ? s.count : "unavailable"}</span>
        </li>
      ))}
    </ul>
  );
}
