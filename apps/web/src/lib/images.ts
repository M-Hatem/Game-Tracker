// Keep in sync with `images.remotePatterns` in next.config.ts.
const OPTIMIZED_HOST_SUFFIXES = [
  "steamstatic.com",
  "akamaihd.net",
  "gamerpower.com",
  "gog-statics.com",
  "cheapshark.com",
];

/** Images from unknown feed hosts are shown as-is instead of failing the optimizer. */
export function canOptimize(src: string): boolean {
  try {
    const { hostname, protocol } = new URL(src);
    return protocol === "https:" && OPTIMIZED_HOST_SUFFIXES.some((s) => hostname.endsWith(s));
  } catch {
    return false;
  }
}
