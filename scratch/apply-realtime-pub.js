const postgres = require('postgres');

async function fixRealtime() {
  const sql = postgres('postgresql://postgres.uakvpneohrxcrrijfnbr:c5pRQ44ozCLjfaWv@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', {
    prepare: false,
    max: 1
  });
  
  try {
    console.log("Adding players to supabase_realtime publication...");
    // We catch the error if the publication already has the table
    await sql`ALTER PUBLICATION supabase_realtime ADD TABLE players;`;
    console.log("Successfully added players to realtime publication!");
  } catch (err) {
    if (err.message && err.message.includes("already in publication")) {
      console.log("Table is already in publication. All good.");
    } else {
      console.error("Error adding to publication:", err);
    }
  } finally {
    await sql.end();
  }
}

fixRealtime();
