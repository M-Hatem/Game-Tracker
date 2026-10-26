export default function Loading() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Loading deals…</span>
      <div className="h-12 max-w-2xl animate-pulse rounded-lg bg-surface-2" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-surface-2" />
        ))}
      </div>
    </div>
  );
}
