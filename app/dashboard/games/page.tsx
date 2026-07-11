import { getMyGamesAction } from "@/lib/actions/games.actions"
import { getScenariosByGameId } from "@/lib/services/scenarios.service"
import { GamesClient } from "./GamesClient"

export default async function GamesListPage() {
  const dbGames = await getMyGamesAction();

  // Fetch scenarios count for each game concurrently to avoid N+1 waterfall
  const gamesWithCounts = await Promise.all(
    dbGames.map(async (game) => {
      const scenarios = await getScenariosByGameId(game.id);
      return {
        id: game.id,
        title: game.title,
        description: game.description || "",
        icon: game.icon || "🎯",
        status: game.status,
        playCount: game.playCount,
        questionsCount: scenarios.length,
        createdAt: game.createdAt ? new Date(game.createdAt).toISOString().split('T')[0] : "Unknown"
      };
    })
  );

  return <GamesClient initialGames={gamesWithCounts} />
}