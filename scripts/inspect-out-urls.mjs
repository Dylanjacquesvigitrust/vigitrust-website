import fs from "fs";
import https from "https";

function extractSrcs(html) {
  return [...html.matchAll(/src="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((s) => /image|brand|_next|favicon|\.webp|\.png|\.css|\.js/i.test(s));
}

const local = fs.readFileSync("out/training/index.html", "utf8");
console.log("LOCAL:");
console.log(extractSrcs(local).slice(0, 20).join("\n"));

https
  .get("https://dylanjacquesvigitrust.github.io/vigitrust-website/training/", (res) => {
    let data = "";
    res.on("data", (c) => (data += c));
    res.on("end", () => {
      console.log("\nLIVE status", res.statusCode);
      console.log(extractSrcs(data).slice(0, 20).join("\n"));
    });
  })
  .on("error", (e) => console.error(e));
