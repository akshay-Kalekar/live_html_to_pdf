import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Turbopack configuration (Next.js 16 uses Turbopack by default)
    // Puppeteer is only used server-side in API routes, so no special config needed
    turbopack: {},
};

export default nextConfig;
