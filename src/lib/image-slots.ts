export type ImageOverrideMap = Record<string, string>;

export function normalizeImageSlot(src: string): string {
  const withoutQuery = src.split("?")[0]?.trim() ?? "";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  let path = withoutQuery;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
}

export function mediaUrlForSlot(slot: string, updatedAt?: Date | string): string {
  const version =
    updatedAt instanceof Date ? updatedAt.getTime() : updatedAt ? new Date(updatedAt).getTime() : Date.now();
  return `/api/media?slot=${encodeURIComponent(slot)}&v=${version}`;
}
