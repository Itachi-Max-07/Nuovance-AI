/** @type {import('next').NextConfig} */

// Next.js dev mode executes webpack chunks via eval(); without 'unsafe-eval'
// the browser blocks all client JS and hydration never runs.
const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // @phosphor-icons/react ships a 45MB barrel (~4.5k modules, every icon at
    // every weight) and is NOT in Next's built-in optimizePackageImports list.
    // The Navbar imports from it, and the Navbar lives in the root layout, so
    // without this every route — /blog and /case-studies included — pulls the
    // whole barrel through webpack on each dev compile. Listing it here makes
    // Next rewrite the barrel imports into direct per-icon imports.
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
