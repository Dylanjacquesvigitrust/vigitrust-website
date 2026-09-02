/**
 * Import news + blog articles (text, featured images, in-article imagery)
 * from vigitrust.com into src/content/blog-posts.json and public/images/blog/.
 *
 * Usage: node scripts/import-vigitrust-articles.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "src", "content", "blog-posts.json");
const outTs = path.join(root, "src", "content", "blog-posts.ts");
const imageRoot = path.join(root, "public", "images", "blog");

const UA =
  "Mozilla/5.0 (compatible; VigiTrustSiteImporter/1.0; +https://github.com/Dylanjacquesvigitrust/vigitrust-website)";

function decodeEntities(text) {
  return text
    .replace(/&#8217;|&#039;|&apos;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function slugFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    let slug = parts[parts.length - 1] || "article";
    try {
      slug = decodeURIComponent(slug);
    } catch {
      /* keep */
    }
    slug = slug
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return slug || `article-${Date.now()}`;
  } catch {
    return `article-${Date.now()}`;
  }
}

function extFromUrl(url, contentType = "") {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".webp")) return ".webp";
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".gif")) return ".gif";
  if (clean.endsWith(".jpeg") || clean.endsWith(".jpg")) return ".jpg";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xml,*/*" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`IMG ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, buf);
  return destPath;
}

function preferFullSize(url) {
  // Prefer original over WP resized (-1024x768 etc.) when possible.
  return url
    .replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp|gif))/i, "")
    .replace(/-scaled(?=\.(?:jpe?g|png|webp|gif))/i, "");
}

async function collectListingLinks(basePath, { maxPages = 40, linkPattern = null } = {}) {
  const links = new Set();
  const re =
    linkPattern ||
    new RegExp(`href="(https://vigitrust.com${basePath}[^"#?]+)"`, "gi");
  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? `https://vigitrust.com${basePath}` : `https://vigitrust.com${basePath}page/${page}/`;
    let html;
    try {
      html = await fetchText(url);
    } catch {
      break;
    }
    let m;
    let added = 0;
    // Reset lastIndex for global regex reuse
    re.lastIndex = 0;
    while ((m = re.exec(html))) {
      const href = m[1].replace(/\/$/, "") + "/";
      if (href === `https://vigitrust.com${basePath}`) continue;
      if (href.includes("/page/")) continue;
      if (href.includes("/feed")) continue;
      if (!links.has(href)) {
        links.add(href);
        added++;
      }
    }
    console.log(`  ${basePath} page ${page}: +${added} (total ${links.size})`);
    if (added === 0 && page > 1) break;
  }
  return [...links];
}

function extractRssItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml))) {
    const block = m[1];
    const title = decodeEntities((block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
      block.match(/<title>(.*?)<\/title>/)?.[1] ||
      "").trim());
    const link = (block.match(/<link>(.*?)<\/link>/)?.[1] || "").trim().split("?")[0];
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    const encoded =
      block.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || "";
    const description =
      block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      "";
    items.push({ title, link: link.endsWith("/") ? link : `${link}/`, pubDate, encoded, description });
  }
  return items;
}

function extractPostBody(html) {
  const marker = '<div class="section post-body">';
  const start = html.indexOf(marker);
  if (start === -1) return "";
  const from = start + marker.length;
  const endMarkers = [
    '<div class="col-md-3 blog-sidebar">',
    '<div class="blog-sidebar">',
    '<!-- -->',
    '<div class="section post-footer">',
  ];
  let end = html.length;
  for (const markerEnd of endMarkers) {
    const idx = html.indexOf(markerEnd, from);
    if (idx !== -1 && idx < end) end = idx;
  }
  return html.slice(from, end).replace(/<\/div>\s*$/i, "").trim();
}

function parseArticleHtml(html, category) {
  const ogTitle = decodeEntities(
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] || "",
  ).trim();

  const headerTitle = decodeEntities(
    (
      html.match(/<div[^>]*class="[^"]*post-header[^"]*"[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
      html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
      ""
    ).replace(/<[^>]+>/g, ""),
  ).trim();

  const title =
    (headerTitle && !/^Vigi(News|Blog)$/i.test(headerTitle) ? headerTitle : "") ||
    ogTitle ||
    decodeEntities((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "").replace(/<[^>]+>/g, "")).trim();

  const ogImage =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ||
    html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i)?.[1] ||
    "";

  const dateRaw =
    html.match(/<time[^>]*datetime="([^"]+)"/i)?.[1] ||
    html.match(/Posted on\s+(\d{2}-\d{2}-\d{4})/i)?.[1] ||
    "";

  let date = "";
  if (/^\d{4}-\d{2}-\d{2}/.test(dateRaw)) date = dateRaw.slice(0, 10);
  else if (/^\d{2}-\d{2}-\d{4}$/.test(dateRaw)) {
    const [d, m, y] = dateRaw.split("-");
    date = `${y}-${m}-${d}`;
  }

  let content =
    extractPostBody(html) ||
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ||
    "";

  // Trim noisy chrome often appended after main content.
  content = content
    .replace(/<div[^>]*class="[^"]*sharedaddy[\s\S]*$/i, "")
    .replace(/<div[^>]*class="[^"]*jp-relatedposts[\s\S]*$/i, "")
    .replace(/<nav[\s\S]*$/i, "");

  return { title, ogImage, date, contentHtml: content, category };
}

function cleanBodyHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/<\/?(?:iframe|form|input|button|svg|path)[^>]*>/gi, "")
    .trim();
}

function absolutizeVigiUrl(remoteUrl) {
  if (!remoteUrl) return "";
  if (remoteUrl.startsWith("//")) return `https:${remoteUrl}`;
  if (remoteUrl.startsWith("/")) return `https://vigitrust.com${remoteUrl}`;
  return remoteUrl;
}

async function localizeCover(featuredRemote, slug) {
  if (!featuredRemote) return "/images/heroes/team-sm.webp";
  const absolute = absolutizeVigiUrl(featuredRemote);
  if (!/^https?:\/\/vigitrust\.com\//i.test(absolute)) return absolute;

  const dir = path.join(imageRoot, slug);
  await fs.mkdir(dir, { recursive: true });
  // Prefer a reasonably sized WP derivative when present; fall back to original.
  const candidates = [absolute, preferFullSize(absolute)];
  let lastErr;
  for (const tryUrl of candidates) {
    try {
      const ext = extFromUrl(tryUrl);
      const fileName = `cover${ext}`;
      await downloadImage(tryUrl, path.join(dir, fileName));
      return `/images/blog/${slug}/${fileName}`;
    } catch (err) {
      lastErr = err;
    }
  }
  console.warn(`    cover failed: ${absolute} (${lastErr?.message || lastErr})`);
  return absolute;
}

function rewriteBodyImages(html) {
  const rewritten = [];
  const parts = html.split(/(<img\b[^>]*>)/gi);
  for (const part of parts) {
    if (!/^<img\b/i.test(part)) {
      rewritten.push(part);
      continue;
    }
    const src = part.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src) {
      rewritten.push(part);
      continue;
    }
    const absolute = absolutizeVigiUrl(src);
    let tag = part.replace(/\bsrc=["'][^"']+["']/i, `src="${absolute}"`);
    tag = tag.replace(/\bsrcset=["'][^"']*["']/i, "");
    tag = tag.replace(/\bsizes=["'][^"']*["']/i, "");
    if (!/\bclass=/i.test(tag)) tag = tag.replace("<img", '<img class="article-image"');
    else tag = tag.replace(/\bclass=["']([^"']*)["']/i, 'class="$1 article-image"');
    if (!/\bloading=/i.test(tag)) tag = tag.replace("<img", '<img loading="lazy"');
    rewritten.push(tag);
  }
  return cleanBodyHtml(rewritten.join(""));
}

function excerptFrom(html, fallback = "") {
  const text = stripTags(html || fallback);
  if (text.length <= 220) return text;
  return `${text.slice(0, 217).trim()}…`;
}

function dateFromPubDate(pubDate) {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

async function importArticle(url, category, rssHint = null) {
  const slug = slugFromUrl(url);
  console.log(`  [${category}] ${slug}`);
  let html;
  try {
    html = await fetchText(url.split("?")[0]);
  } catch (err) {
    console.warn(`    skip fetch fail: ${err.message}`);
    return null;
  }

  const parsed = parseArticleHtml(html, category);
  const title = decodeEntities(parsed.title || rssHint?.title || slug);
  const date = parsed.date || dateFromPubDate(rssHint?.pubDate) || "2020-01-01";
  // Prefer scraped page body; fall back to RSS when the page shell has no article HTML.
  const scraped = parsed.contentHtml || "";
  const rawBody =
    (stripTags(scraped).length > 40 ? scraped : "") ||
    rssHint?.encoded ||
    rssHint?.description ||
    "";
  if (!rawBody || stripTags(rawBody).length < 20) {
    console.warn("    skip: empty body");
    return null;
  }

  const featuredRemote =
    parsed.ogImage ||
    rawBody.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
    "";

  const featured = await localizeCover(featuredRemote, slug);
  const bodyHtml = rewriteBodyImages(rawBody);
  const excerpt = excerptFrom(rssHint?.description || bodyHtml, title);

  return {
    slug,
    title,
    date,
    category,
    excerpt,
    image: featured,
    bodyHtml,
    sourceUrl: url.split("?")[0],
  };
}

async function main() {
  console.log("Collecting article URLs…");
  const [newsLinks, blogLinks] = await Promise.all([
    collectListingLinks("/news/"),
    collectListingLinks("/blog/", {
      linkPattern: /href="(https:\/\/vigitrust\.com\/\d{4}\/\d{2}\/\d{2}\/[^"#?]+)"/gi,
    }),
  ]);

  console.log("Loading RSS hints…");
  const [newsRss, blogRss] = await Promise.all([
    fetchText("https://vigitrust.com/news/feed/"),
    fetchText("https://vigitrust.com/blog/feed/"),
  ]);
  const rssByLink = new Map();
  for (const item of [...extractRssItems(newsRss), ...extractRssItems(blogRss)]) {
    const key = item.link.split("?")[0].replace(/\/?$/, "/");
    rssByLink.set(key, item);
  }

  // WP REST for blog posts (additional metadata / completeness).
  try {
    const wpPosts = await (await fetch("https://vigitrust.com/wp-json/wp/v2/posts?per_page=100&_embed=1", {
      headers: { "User-Agent": UA },
    })).json();
    for (const p of wpPosts) {
      const link = String(p.link || "").split("?")[0].replace(/\/?$/, "/");
      if (!blogLinks.includes(link) && link.includes("/20")) blogLinks.push(link);
      if (!rssByLink.has(link)) {
        rssByLink.set(link, {
          title: decodeEntities(p.title?.rendered || ""),
          link,
          pubDate: p.date_gmt || p.date,
          encoded: p.content?.rendered || "",
          description: p.excerpt?.rendered || "",
        });
      }
    }
  } catch (err) {
    console.warn("WP REST blog fallback failed:", err.message);
  }

  const jobs = [
    ...newsLinks.map((url) => ({ url, category: "News" })),
    ...blogLinks.map((url) => ({ url, category: "Blog" })),
  ];

  // Prefer blog category when a URL appears under date permalinks on both lists.
  const bySlug = new Map();
  for (const job of jobs) {
    const slug = slugFromUrl(job.url);
    const existing = bySlug.get(slug);
    if (!existing || (existing.category === "News" && job.category === "Blog")) {
      bySlug.set(slug, job);
    }
  }

  console.log(`Importing ${bySlug.size} articles…`);
  const posts = [];
  for (const job of bySlug.values()) {
    const key = job.url.split("?")[0].replace(/\/?$/, "/");
    const post = await importArticle(job.url, job.category, rssByLink.get(key) || null);
    if (post?.title && post.bodyHtml) posts.push(post);
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

  await fs.mkdir(path.dirname(outJson), { recursive: true });
  await fs.writeFile(outJson, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  await fs.writeFile(
    outTs,
    `import type { BlogPost } from "@/lib/cms-types";\nimport data from "./blog-posts.json";\n\nexport const blogPosts = data as BlogPost[];\n`,
    "utf8",
  );

  console.log(`Wrote ${posts.length} posts -> ${path.relative(root, outJson)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
