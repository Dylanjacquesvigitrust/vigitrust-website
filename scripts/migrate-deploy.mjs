import { spawn } from "node:child_process";

const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.warn("[migrate] No database URL set; skipping prisma migrate deploy.");
  process.exit(0);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function migrate() {
  return new Promise((resolve) => {
    const child = spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

for (let attempt = 1; attempt <= 3; attempt += 1) {
  console.log(`[migrate] prisma migrate deploy (attempt ${attempt}/3)`);
  const code = await migrate();
  if (code === 0) process.exit(0);
  if (attempt < 3) {
    console.warn("[migrate] retrying after advisory lock / connection timeout…");
    await sleep(5000);
  }
}

process.exit(1);
