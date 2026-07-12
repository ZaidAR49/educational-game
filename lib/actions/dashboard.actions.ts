"use server";

import { eq, inArray, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, organizations, scenarios, classroomPlays, players } from "@/lib/db/schema";
import { requireAuth } from "./utils";
import { getAiUsageAndLimit } from "@/lib/services/usage.service";

export async function getDashboardOverviewAction() {
  const user = await requireAuth();

  // Fetch all dashboard stats in parallel
  const [
    aiUsage,
    userGames,
    userOrgs,
    scenariosResult,
    teacherPlayers,
    accuracyResult,
    completionResult,
  ] = await Promise.all([
    // 0. Fetch AI Usage
    getAiUsageAndLimit(user.id),

    // 1. Fetch user's games
    db
      .select()
      .from(games)
      .where(eq(games.ownerId, user.id))
      .orderBy(desc(games.createdAt)),

    // 2. Fetch user's organizations
    db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.ownerId, user.id)),

    // 3. Fetch scenarios using an inner join to decouple it from games query resolution
    db
      .select({ id: scenarios.id })
      .from(scenarios)
      .innerJoin(games, eq(scenarios.gameId, games.id))
      .where(eq(games.ownerId, user.id)),

    // 5. Fetch score distribution
    db
      .select({
        totalScore: players.totalScore,
        maxPoints: games.maxPoints,
      })
      .from(players)
      .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
      .innerJoin(games, eq(classroomPlays.gameId, games.id))
      .where(eq(games.ownerId, user.id)),

    // 6. Fetch answer accuracy
    db
      .select({
        correct: sql<number>`COALESCE(SUM(${players.totalCorrectAnswers}), 0)`,
        wrong: sql<number>`COALESCE(SUM(${players.totalWrongAnswers}), 0)`,
      })
      .from(players)
      .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
      .innerJoin(games, eq(classroomPlays.gameId, games.id))
      .where(eq(games.ownerId, user.id)),

    // 7. Fetch completion vs drop-out
    db
      .select({
        finished: sql<number>`COALESCE(COUNT(CASE WHEN ${players.isFinished} = true THEN 1 END), 0)`,
        unfinished: sql<number>`COALESCE(COUNT(CASE WHEN ${players.isFinished} = false THEN 1 END), 0)`,
      })
      .from(players)
      .innerJoin(classroomPlays, eq(players.classroomPlayId, classroomPlays.id))
      .innerJoin(games, eq(classroomPlays.gameId, games.id))
      .where(eq(games.ownerId, user.id)),
  ]);

  const totalGames = userGames.length;
  const totalPlayers = userGames.reduce((sum, game) => sum + game.playCount, 0);
  const totalOrgs = userOrgs.length;
  const totalScenarios = scenariosResult.length;

  // 4. Format Recent Games (Top 5)
  const recentGames = userGames.slice(0, 5).map(game => ({
    id: game.id,
    title: game.title,
    status: game.status,
    plays: game.playCount,
    date: game.createdAt.toISOString().split('T')[0]
  }));

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

  const accuracyData = [
    { name: "إجابات صحيحة", value: Number(accuracyResult[0]?.correct || 0) },
    { name: "إجابات خاطئة", value: Number(accuracyResult[0]?.wrong || 0) },
  ];

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
    aiUsage,
  };
}

