/**
 * Fix imported article imagery:
 * - strip forced width/height/style on body <img> tags
 * - prefer original (non -NxN) WP media URLs for body images
 * - re-download cover images at full resolution
 *
 * Usage: node scripts/fix-blog-image-sizing.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "src", "content", "blog-posts.json");
const imageRoot = path.join(root, "public", "images", "blog");
const UA = "Mozilla/5.0 (compatible; VigiTrustSiteImporter/1.0)";

function preferFullSize(url) {
  return url
    .replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp|gif))/i, "")
    .replace(/-scaled(?=\.(?:jpe?g|png|webp|gif))/i, "");
}

function extFromUrl(url) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".webp")) return ".webp";
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".gif")) return ".gif";
  if (clean.endsWith(".jpeg") || clean.endsWith(".jpg")) return ".jpg";
  return ".jpg";
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

function fixBodyHtml(html) {
  if (!html) return html;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src) return tag;
    let nextSrc = src;
    if (/vigitrust\.com\/wp-content\//i.test(src)) {
      nextSrc = preferFullSize(src);
    }
    let out = tag.replace(/\bsrc=["'][^"']+["']/i, `src="${nextSrc}"`);
    out = out.replace(/\bsrcset=["'][^"']*["']/gi, "");
    out = out.replace(/\bsizes=["'][^"']*["']/gi, "");
    out = out.replace(/\bwidth=["'][^"']*["']/gi, "");
    out = out.replace(/\bheight=["'][^"']*["']/gi, "");
    out = out.replace(/\bstyle=["'][^"']*["']/gi, "");
    if (!/\bclass=/i.test(out)) out = out.replace("<img", '<img class="article-image"');
    else if (!/article-image/i.test(out)) {
      out = out.replace(/\bclass=["']([^"']*)["']/i, 'class="$1 article-image"');
    }
    return out;
  });
}

async function refreshCover(post) {
  if (!post.sourceUrl) return post.image;
  let html;
  try {
    const res = await fetch(post.sourceUrl, { headers: { "User-Agent": UA } });
    if (!res.ok) return post.image;
    html = await res.text();
  } catch {
    return post.image;
  }

  const og =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ||
    post.bodyHtml?.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
    "";
  if (!og) return post.image;

  const absolute = og.startsWith("//") ? `https:${og}` : og.startsWith("/") ? `https://vigitrust.com${og}` : og;
  if (!/^https?:\/\/vigitrust\.com\//i.test(absolute)) return post.image;

  const candidates = [preferFullSize(absolute), absolute].filter((u, i, a) => a.indexOf(u) === i);
  for (const url of candidates) {
    try {
      const ext = extFromUrl(url);
      const destRel = `/images/blog/${post.slug}/cover${ext}`;
      const destAbs = path.join(root, "public", destRel);
      // Remove previous cover.* variants so we don't leave stale formats.
      const dir = path.join(imageRoot, post.slug);
      try {
        const existing = await fs.readdir(dir);
        await Promise.all(
          existing
            .filter((f) => /^cover\./i.test(f))
            .map((f) => fs.unlink(path.join(dir, f))),
        );
      } catch {
        /* dir may not exist yet */
      }
      await download(url, destAbs);
      return destRel;
    } catch {
      /* try next */
    }
  }
  return post.image;
}

async function main() {
  const posts = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  console.log(`Fixing ${posts.length} posts…`);
  let i = 0;
  for (const post of posts) {
    i += 1;
    post.bodyHtml = fixBodyHtml(post.bodyHtml);
    process.stdout.write(`\r[${i}/${posts.length}] ${post.slug.slice(0, 60).padEnd(60)}`);
    post.image = await refreshCover(post);
  }
  process.stdout.write("\n");
  await fs.writeFile(jsonPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log("Updated blog-posts.json and cover images.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
