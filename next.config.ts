import type { NextConfig } from "next";

/**
 * Statik ixrac — GitHub Pages üçün.
 * Alt qovluqda yayımlananda BASE_PATH verilir (məs. /specialcrafts.store);
 * öz domenində boş qalır və sayt kökdən işləyir.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // statik ixracda Next-in şəkil optimizasiyası server tələb edir
    unoptimized: true,
  },
};

export default nextConfig;
