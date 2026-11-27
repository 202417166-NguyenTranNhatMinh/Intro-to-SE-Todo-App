import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const args = process.argv.slice(2);
  const baseline = args[0] === "--baseline";
  if (args.length && (!baseline || args.length < 2)) throw new Error("Usage: npm run db:migrate [-- --baseline <filename> ...]");
  const directory = path.join(__dirname, "../db/migrations");
  const files = fs.readdirSync(directory).filter(f => /^\d+.*\.sql$/.test(f)).sort();
  if (baseline && args.slice(1).some(f => !files.includes(f))) throw new Error("Unknown migration filename");
  const selected = new Set(args.slice(1));
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [71482036]);
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (filename TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
    const existing = await client.query<{ filename: string; checksum: string }>("SELECT filename, checksum FROM schema_migrations");
    const applied = new Map(existing.rows.map(row => [row.filename, row.checksum]));
    for (const file of files) {
      const sql = fs.readFileSync(path.join(directory, file), "utf8").replace(/\r\n/g, "\n");
      const checksum = crypto.createHash("sha256").update(sql).digest("hex");
      if (applied.has(file)) {
        if (applied.get(file) !== checksum) throw new Error(`Applied migration has changed: ${file}`);
        continue;
      }
      if (baseline && !selected.has(file)) continue;
      await client.query("BEGIN");
      try {
        if (!baseline) await client.query(sql);
        await client.query("INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)", [file, checksum]);
        await client.query("COMMIT");
        console.log(`${baseline ? "Baselined" : "Applied"}: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
    console.log("Migration finished.");
  } finally {
    await client.end();
  }
}
main().catch((error: unknown) => {
  console.error("Migration failed:", error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
