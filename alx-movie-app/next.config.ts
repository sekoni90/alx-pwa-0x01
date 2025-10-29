// next.config.js (CommonJS — robust import for @ducanh2912/next-pwa)
let withPWAInit;
try {
  // require may return { default: fn } if the package is ESM-transpiled
  // so try to use .default if present, otherwise use the value directly.
  const pkg = require("@ducanh2912/next-pwa");
  withPWAInit = pkg && pkg.default ? pkg.default : pkg;
} catch (e) {
  console.error("Failed to require @ducanh2912/next-pwa:", e);
  // fallback: make a no-op that returns the config unchanged
  withPWAInit = (opts = {}) => (config) => ({ ...config });
}

const withPWA = withPWAInit({
  dest: "public",
  // add other PWA options if needed
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["m.media-amazon.com", "image.tmdb.org"],
    // if you prefer patterns, use remotePatterns instead
    // remotePatterns: [{ protocol: "https", hostname: "m.media-amazon.com", pathname: "/" }],
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

module.exports = withPWA(nextConfig);