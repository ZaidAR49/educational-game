"use server";

import { eq, inArray, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, organizations, scenarios, classroomPlays, players } from "@/lib/db/schema";
import { requireAuth } from "./utils";

import { unstable_cache } from "next/cache";

export async function getDashboardOverviewAction() {
  const user = await requireAuth();

  const getCachedOverview = unstable_cache(
    async () => {
      // 1. Fetch user's games
      const userGames = await db
        .select()
        .from(games)
        .where(eq(games.ownerId, user.id))
        .orderBy(desc(games.createdAt));

      const totalGames = userGames.length;
      
      // Calculate total players from games.playCount
      const totalPlayers = userGames.reduce((sum, game) => sum + game.playCount, 0);

      // 2. Fetch user's organizations
      const userOrgs = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.ownerId, user.id));
      
      const totalOrgs = userOrgs.length;

      // 3. Fetch total scenarios for these games
      let totalScenarios = 0;
      if (userGames.length > 0) {
        const gameIds = userGames.map(g => g.id);
        const scenariosResult = await db
          .select({ id: scenarios.id })
          .from(scenarios)
          .where(inArray(scenarios.gameId, gameIds));
        totalScenarios = scenariosResult.length;
      }

      // 4. Format Recent Games (Top 5)
      const recentGames = userGames.slice(0, 5).map(game => ({
        id: game.id,
        title: game.title,
        status: game.status,
        plays: game.playCount,
        date: game.createdAt.toISOString().split('T')[0]
      }));

      return {
        stats: {
          totalGames,
          totalPlayers,
          totalOrgs,
          totalScenarios,
        },
        recentGames,
      };
    },
    [`dashboard-${user.id}`],
    { tags: [`dashboard-${user.id}`] }
  );

  return getCachedOverview();
}
