import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;