import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function applyRLS() {
  try {
    console.log("Applying RLS Policy to players table...");
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Enable read access for realtime'
        ) THEN
            CREATE POLICY "Enable read access for realtime" ON "players" FOR SELECT USING (true);
        END IF;
      END
      $$;
    `);
    console.log("RLS Policy applied successfully!");
  } catch (err) {
    console.error("Error applying RLS:", err);
  }
  process.exit(0);
}

applyRLS();
