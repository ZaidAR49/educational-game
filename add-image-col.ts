import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";

const envText = fs.readFileSync(".env.local", "utf-8");
const dbUrlMatch = envText.match(/DATABASE_URL="?([^"\n]+)"?/);
if (dbUrlMatch) {
  process.env.DATABASE_URL = dbUrlMatch[1].trim();
}

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function main() {
  await client`ALTER TABLE users ADD COLUMN IF NOT EXISTS image text;`;
  console.log("Added image column!");
  process.exit(0);
}

main().catch(console.error);
