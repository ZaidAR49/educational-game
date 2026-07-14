import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./lib/db/schema.js";

const dbUrl6543 = process.env.DATABASE_URL;
const dbUrl5432 = dbUrl6543.replace(':6543', ':5432');

async function testAdapter(port, url) {
  console.log(`\nTesting Drizzle on port ${port}...`);
  const client = postgres(url, { prepare: false, max: 2, connect_timeout: 10 });
  const db = drizzle(client, { schema });
  
  const start = Date.now();
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, 'test@example.com'),
    });
    console.log(`  ✅ findFirst took ${Date.now() - start}ms`);
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
  } finally {
    await client.end({ timeout: 1 });
  }
}

async function run() {
  await testAdapter(6543, dbUrl6543);
  await testAdapter(5432, dbUrl5432);
}

run();
