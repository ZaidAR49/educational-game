const postgres = require("postgres");
const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(l => l.startsWith("DATABASE_URL=")).split("=")[1].replace(/"/g, "").replace(/\r/g, "");

const sql = postgres(dbUrl);

async function run() {
  try {
    await sql`ALTER TABLE accounts ALTER COLUMN expires_at TYPE integer USING expires_at::integer;`;
    console.log("Migration successful: expires_at");
  } catch (e) {
    console.error("Migration failed:", e);
  }
  
  try {
    await sql`ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_pkey CASCADE;`;
    await sql`ALTER TABLE sessions ADD PRIMARY KEY ("sessionToken");`;
    console.log("Migration successful: sessions primary key");
  } catch (e) {
    console.error("Migration failed:", e);
  }
  
  process.exit(0);
}
run();
