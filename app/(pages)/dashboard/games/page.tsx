import { getMyGamesAction, getTotalGamesCountAction } from "@/lib/actions/games.actions"
import { getScenariosByGameId } from "@/lib/services/scenarios.service"
import { GamesClient } from "@/components/dashboard/games/GamesClient"
import { SearchAndFilter } from "@/components/shared/SearchAndFilter"

export default async function GamesListPage(props: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const search = searchParams?.search;
  const status = searchParams?.status;

  const absoluteTotal = await getTotalGamesCountAction();
  const { data: dbGames, total } = await getMyGamesAction(currentPage, search, status);

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
        createdAt: game.createdAt ? new Date(game.createdAt).toISOString().split('T')[0] : "Unknown",
        organizationName: game.organization?.name || undefined
      };
    })
  );

  const totalPages = Math.ceil(total / 3); // pageSize is 3

  return (
    <GamesClient 
      initialGames={gamesWithCounts} 
      totalPages={totalPages} 
      currentPage={currentPage} 
      showSearchAndFilter={absoluteTotal > 10}
    />
  );
}