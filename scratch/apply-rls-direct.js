const postgres = require('postgres');

async function applyRLS() {
  const sql = postgres('postgresql://postgres.uakvpneohrxcrrijfnbr:c5pRQ44ozCLjfaWv@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', {
    prepare: false,
    max: 1
  });
  
  try {
    console.log("Applying RLS Policy to players table...");
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'players' AND policyname = 'Enable read access for realtime'
        ) THEN
            CREATE POLICY "Enable read access for realtime" ON "players" FOR SELECT USING (true);
        END IF;
      END
      $$;
    `;
    console.log("RLS Policy applied successfully!");
  } catch (err) {
    console.error("Error applying RLS:", err);
  } finally {
    await sql.end();
  }
}

applyRLS();
