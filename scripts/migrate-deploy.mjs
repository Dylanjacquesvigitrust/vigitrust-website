import { spawn } from "node:child_process";

function pickDatabaseUrl() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL
  );
}

/** Neon pooled hosts are `ep-xxx-pooler.region.aws.neon.tech` and block advisory locks. */
function toDirectUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.replace("-pooler.", ".");
    parsed.searchParams.delete("pgbouncer");
    return parsed.toString();
  } catch {
    return url;
  }
}

const databaseUrl = pickDatabaseUrl();

if (!databaseUrl) {
  console.warn("[migrate] No database URL set; skipping prisma migrate deploy.");
  process.exit(0);
}

const directUrl = toDirectUrl(databaseUrl);
console.log(
  `[migrate] using ${directUrl.includes("-pooler.") ? "pooled" : "direct"} database host`,
);

function migrate() {
  return new Promise((resolve) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        DATABASE_URL: directUrl,
        // Serverless/pooler Postgres cannot hold Prisma's advisory lock.
        PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1",
      },
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const code = await migrate();
if (code !== 0) {
  console.error("[migrate] prisma migrate deploy failed.");
  process.exit(code);
}
