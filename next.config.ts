import type { NextConfig } from "next";

/**
 * Server rejimi — ödəniş, admin panel və verilənlər bazası üçün.
 * (Statik ixrac Faza 1-də idi; artıq API marşrutları var.)
 */
const nextConfig: NextConfig = {
  // Docker üçün: kiçik icra paketi (.next/standalone)
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
