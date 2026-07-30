import sharp from "sharp";
import fs from "fs";
import path from "path";

async function sm(src, q) {
  if (!fs.existsSync(src)) {
    console.log("missing", src);
    return null;
  }
  const out = src.replace(/\.webp$/i, "-sm.webp").replace(/\.png$/i, "-sm.webp");
  const buf = await sharp(src).webp({ quality: q, effort: 5 }).toBuffer();
  fs.writeFileSync(out, buf);
  console.log(
    path.basename(src),
    "->",
    path.basename(out),
    `${(buf.length / 1024).toFixed(1)}KB`,
  );
  return out;
}

const mark = "public/brand/vigitrust-mark.svg";

await sm("public/images/product/dashboard-1.webp", 68);
await sm("public/images/product/dashboard-2.webp", 68);
await sm("public/images/product/assessment-template.webp", 68);
await sm("public/images/product/elearning-menu.webp", 68);
await sm("public/images/product/five-pillars.webp", 68);
await sm("public/images/product/assessment-menu.webp", 68);
await sm("public/images/product/dashboard-3.webp", 68);
await sm("public/images/product/assessment-360.webp", 68);
await sm("public/images/heroes/office.webp", 70);
await sm("public/images/heroes/team.webp", 70);
await sm("public/images/heroes/security.webp", 70);
await sm("public/images/heroes/datacenter.webp", 70);
await sm("public/images/people/mathieu-gorge-portrait.png", 72);
await sm("public/images/people/mathieu-gorge-formal.png", 72);

for (const [size, dest] of [
  [32, "public/favicon-32.png"],
  [48, "public/favicon-48.png"],
  [64, "public/favicon.png"],
  [180, "public/apple-touch-icon.png"],
]) {
  await sharp(mark).resize(size, size).png({ compressionLevel: 9 }).toFile(dest);
  console.log("favicon", dest, `${(fs.statSync(dest).size / 1024).toFixed(1)}KB`);
}

const del = [
  "public/images/product/assessment-360-infographic.png",
  "public/images/product/five-pillars-source.png",
  "public/brand/logo-from-theme.png",
  "public/brand/logo-upload.png",
  "public/brand/logo-from-pptx.png",
  "public/brand/logo-pptx.png",
  "public/brand/logo-user-upload.png",
  "public/brand/logo-site.png",
  "public/brand/vigitrust-logo-header.png",
  "public/brand/vigitrust-mark.png",
  "public/brand/vigitrust-mark-hq.png",
  "public/brand/vigitrust-mark-transparent.png",
  "public/favicon.ico.png",
  "public/next.svg",
  "public/vercel.svg",
  "public/globe.svg",
  "public/file.svg",
  "public/window.svg",
];

for (const f of del) {
  try {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
      console.log("deleted", f);
    }
  } catch (e) {
    console.log("skip del", f, e.code);
  }
}
