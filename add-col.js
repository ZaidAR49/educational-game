require("dotenv").config({ path: ".env.local" });
const postgres = require("postgres");
const sql = postgres(process.env.DATABASE_URL);

async function main() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS image text;`;
  console.log("Added image column!");
  process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
