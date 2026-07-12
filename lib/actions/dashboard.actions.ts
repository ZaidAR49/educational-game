"use server";

import { eq, inArray, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, organizations, scenarios, classroomPlays, players } from "@/lib/db/schema";
import { requireAuth } from "./utils";

export async function getDashboardOverviewAction() {
  const user = await requireAuth();

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

  // 5. Fetch score distribution
  const teacherPlayers = await db
    .select({
      totalScore: players.totalScore,
      maxPoints: games.maxPoints,
    })
    .from(players)
    .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
    .innerJoin(games, eq(classroomPlays.gameId, games.id))
    .where(eq(games.ownerId, user.id));

  const scoreBrackets = {
    "0-20%": 0,
    "21-40%": 0,
    "41-60%": 0,
    "61-80%": 0,
    "81-100%": 0,
  };

  teacherPlayers.forEach((p: { totalScore: number; maxPoints: number }) => {
    const max = p.maxPoints || 100;
    const pct = max > 0 ? (p.totalScore / max) * 100 : 0;
    if (pct <= 20) scoreBrackets["0-20%"]++;
    else if (pct <= 40) scoreBrackets["21-40%"]++;
    else if (pct <= 60) scoreBrackets["41-60%"]++;
    else if (pct <= 80) scoreBrackets["61-80%"]++;
    else scoreBrackets["81-100%"]++;
  });

  const scoreDistribution = Object.entries(scoreBrackets).map(([bracket, count]) => ({
    bracket,
    count,
  }));

  // 6. Fetch answer accuracy
  const accuracyResult = await db
    .select({
      correct: sql<number>`COALESCE(SUM(${players.totalCorrectAnswers}), 0)`,
      wrong: sql<number>`COALESCE(SUM(${players.totalWrongAnswers}), 0)`,
    })
    .from(players)
    .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
    .innerJoin(games, eq(classroomPlays.gameId, games.id))
    .where(eq(games.ownerId, user.id));

  const accuracyData = [
    { name: "إجابات صحيحة", value: Number(accuracyResult[0]?.correct || 0) },
    { name: "إجابات خاطئة", value: Number(accuracyResult[0]?.wrong || 0) },
  ];

  // 7. Fetch completion vs drop-out
  const completionResult = await db
    .select({
      finished: sql<number>`COALESCE(COUNT(CASE WHEN ${players.isFinished} = true THEN 1 END), 0)`,
      unfinished: sql<number>`COALESCE(COUNT(CASE WHEN ${players.isFinished} = false THEN 1 END), 0)`,
    })
    .from(players)
    .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
    .innerJoin(games, eq(classroomPlays.gameId, games.id))
    .where(eq(games.ownerId, user.id));

  const completionData = [
    { name: "أكملوا اللعب", value: Number(completionResult[0]?.finished || 0) },
    { name: "لم يكملوا اللعب", value: Number(completionResult[0]?.unfinished || 0) },
  ];

  return {
    stats: {
      totalGames,
      totalPlayers,
      totalOrgs,
      totalScenarios,
    },
    recentGames,
    scoreDistribution,
    accuracyData,
    completionData,
  };
}

