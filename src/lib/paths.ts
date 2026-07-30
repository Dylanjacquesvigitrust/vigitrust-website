/**
 * Prefix public asset paths with the GitHub Pages basePath when present.
 * Next.js correctly prefixes `/_next/*`, but unoptimized `next/image` srcs
 * under `public/` are emitted without the basePath on static export.
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path || !base) return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith(`${base}/`) || path === base) return path;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
