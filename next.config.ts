import type { NextConfig } from "next";
import path from "path";

/**
 * GitHub Pages (project site) needs a basePath of `/<repo-name>`.
 * Local `npm run dev` / `npm run build` leave basePath empty.
 * CI sets GITHUB_PAGES=true so assets and routes resolve under the repo path.
 */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubPages = process.env.GITHUB_PAGES === "true" && Boolean(repoName);
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  // Static export only for GitHub Pages. Vercel uses serverless routes (Stripe API/webhooks).
  ...(isGithubPages ? { output: "export" as const } : {}),
  trailingSlash: true,
  // Stripe (and other webhooks) POST without a trailing slash and will not follow 308s.
  skipTrailingSlashRedirect: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Used by withBasePath() for public/ image URLs (next/image leaves these unprefixed when unoptimized).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  // Hide the bottom-left "Rendering" / route indicator in development.
  // Real compile/runtime errors still surface.
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // next/image optimizer needs a server; static export must skip it.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
