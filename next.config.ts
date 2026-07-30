import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Hide the bottom-left "Rendering" / route indicator in development.
  // Real compile/runtime errors still surface.
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Prefer fewer round-trips for static marketing pages.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
