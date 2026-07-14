import { db } from "@/lib/db";
import { games, scenarios, choices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const gameId = '00000000-0000-0000-0000-000000000003';
  const gameResult = await db.select().from(games).where(eq(games.id, gameId)).limit(1);
  const game = gameResult[0];
  
  if (!game) {
    console.log("Game not found!");
    return;
  }
  
  const scenariosResult = await db.query.scenarios.findMany({
    where: eq(scenarios.gameId, gameId),
    orderBy: [scenarios.orderIndex],
    with: {
      choices: {
        orderBy: [choices.orderIndex],
      },
    },
  });
  
  console.log(JSON.stringify({ game, scenarios: scenariosResult }, null, 2));
}

run().catch(console.error).finally(() => process.exit(0));
