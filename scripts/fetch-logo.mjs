import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "../public/brand");

const urls = [
  "https://vigitrust.com/wp-content/themes/vigitrust-website-theme/assets/images/logo.png",
  "https://vigitrust.com/wp-content/uploads/2020/01/vigitrust-logo.png",
  "https://vigitrust.com/wp-content/uploads/2019/11/logo.png",
  "https://www.vigitrust.com/wp-content/themes/vigitrust-website-theme/assets/images/logo.png",
];

for (const url of urls) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    const head = buf.slice(0, 8).toString("hex");
    const ok = head.startsWith("89504e47") || buf.slice(0, 5).toString() === "<?xml" || buf.slice(0, 4).toString() === "<svg";
    console.log(url, res.status, buf.length, head, ok ? "OK" : "NOT_IMAGE");
    if (ok) {
      const ext = head.startsWith("89504e47") ? "png" : "svg";
      const out = path.join(brandDir, `logo-fetched.${ext}`);
      fs.writeFileSync(out, buf);
      fs.writeFileSync(path.join(brandDir, `vigitrust-logo.${ext === "svg" ? "svg" : "png"}`), buf);
      console.log("wrote", out);
      break;
    }
  } catch (e) {
    console.log(url, "ERR", e.message);
  }
}
