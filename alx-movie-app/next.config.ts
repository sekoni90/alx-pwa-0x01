// next.config.ts
import type { NextConfig } from "next";

let withPWAInit: any;
try {
  // try ESM default then CJS
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require("@ducanh2912/next-pwa");
  withPWAInit = pkg && pkg.default ? pkg.default : pkg;
} catch (e) {
  // If the package isn't present or cannot be loaded, log and provide a typed no-op fallback.
  // The types below avoid "implicitly has an 'any' type" compile errors.
  // withPWAInit signature: (opts?: Record<string, any>) => (config: NextConfig) => NextConfig
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withPWAInit = (opts: Record<string, any> = {}) => (config: NextConfig): NextConfig => ({ ...config });
}

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["m.media-amazon.com", "image.tmdb.org"],
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withPWA(nextConfig);