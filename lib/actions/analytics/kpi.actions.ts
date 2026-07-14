"use server";

import { db } from "@/lib/db";
import { users, games, classroomPlays, players, usageEvents } from "@/lib/db/schema";
import { eq, count, and, sql } from "drizzle-orm";
import { requireDashboardAccess } from "@/lib/auth/rbac";
import { unstable_noStore as noStore } from "next/cache";

/** KPI stat cards (DB for absolute totals) */
export async function getAdminKpiAction() {
  noStore();
  await requireDashboardAccess();

  const totalUsers = await db.select({ count: count() }).from(users).where(eq(users.role, "user"));
  const proUsers = await db.select({ count: count() }).from(users).where(and(eq(users.role, "user"), eq(users.isSubscribed, true)));
  const totalGames = await db.select({ count: count() }).from(games);
  const publishedGames = await db.select({ count: count() }).from(games).where(eq(games.status, "published"));
  const totalSessions = await db.select({ count: count() }).from(classroomPlays);
  const totalPlayers = await db.select({ count: count() }).from(players);
  const completedPlayers = await db.select({ count: count() }).from(players).where(eq(players.isFinished, true));

  return {
    totalUsers: totalUsers[0].count,
    proUsers: proUsers[0].count,
    totalGames: totalGames[0].count,
    publishedGames: publishedGames[0].count,
    totalSessions: totalSessions[0].count,
    totalPlayers: totalPlayers[0].count,
    completionRate:
      totalPlayers[0].count > 0
        ? Math.round((completedPlayers[0].count / totalPlayers[0].count) * 100)
        : 0,
  };
}

/** Game status breakdown (DB) */
export async function getGameStatusBreakdownAction() {
  noStore();
  await requireDashboardAccess();

  const rows = await db
    .select({ status: games.status, count: count() })
    .from(games)
    .groupBy(games.status);

  const STATUS_LABELS: Record<string, string> = {
    draft: "مسودة",
    published: "منشورة",
    archived: "مؤرشفة",
  };

  return rows.map((r) => ({
    name: STATUS_LABELS[r.status] ?? r.status,
    key: r.status,
    value: r.count,
  }));
}

/** Total AI tokens used platform-wide */
export async function getPlatformAiUsageAction() {
  noStore();
  await requireDashboardAccess();

  const data = await db
    .select({
      totalTokens: sql<number>`COALESCE(SUM(${usageEvents.tokensUsed}), 0)`,
    })
    .from(usageEvents)
    .where(eq(usageEvents.activity, "ai_generation"));

  return data[0]?.totalTokens || 0;
}
