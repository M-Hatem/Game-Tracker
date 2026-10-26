import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  // The shared package ships TypeScript source; let Next compile it.
  transpilePackages: ["@gt/core"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Hosts our sources serve thumbnails from. Anything else renders unoptimized.
    remotePatterns: [
      { protocol: "https", hostname: "**.steamstatic.com" },
      { protocol: "https", hostname: "**.akamaihd.net" },
      { protocol: "https", hostname: "www.gamerpower.com" },
      { protocol: "https", hostname: "**.gog-statics.com" },
      { protocol: "https", hostname: "**.cheapshark.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
