"use server";

import { db } from "@/lib/db";
import { users, games, classroomPlays, players, usageEvents } from "@/lib/db/schema";
import { eq, count, and, sql } from "drizzle-orm";
import { requireDashboardAccess } from "@/lib/auth/rbac";

const POSTHOG_API = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const ANALYTICS_DAYS = 30;

const CUSTOM_EVENTS = [
  "game_created",
  "game_published",
  "game_session_closed",
  "game_deleted",
  "sessions_deleted",
  "ai_game_generated",
  "game_joined",
  "game_started",
  "choice_selected",
  "question_skipped",
  "game_completed",
  "game_result_shared",
] as const;

type CustomEventName = (typeof CUSTOM_EVENTS)[number];

const EVENT_LABELS: Record<CustomEventName, string> = {
  game_created: "إنشاء لعبة",
  game_published: "نشر لعبة",
  game_session_closed: "إغلاق جلسة",
  game_deleted: "حذف لعبة",
  sessions_deleted: "حذف جلسات",
  ai_game_generated: "توليد بالذكاء الاصطناعي",
  game_joined: "انضمام لاعب",
  game_started: "بدء اللعب",
  choice_selected: "اختيار إجابة",
  question_skipped: "تخطي سؤال",
  game_completed: "إكمال اللعبة",
  game_result_shared: "مشاركة النتيجة",
};

type HogQLRow = unknown[];

async function runHogQL(query: string) {
  if (!PROJECT_ID || !API_KEY) {
    console.warn("Missing PostHog credentials, returning empty data.");
    return { results: [] as HogQLRow[] };
  }

  const res = await fetch(`${POSTHOG_API}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("PostHog API Error:", await res.text());
    return { results: [] as HogQLRow[] };
  }

  return res.json() as Promise<{ results: HogQLRow[] }>;
}

function lastNDays(): string[] {
  const dates: string[] = [];
  for (let i = ANALYTICS_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function fillDailySeries<T extends Record<string, number>>(
  data: ({ date: string } & T)[],
  defaults: T
): ({ date: string } & T)[] {
  const map = new Map(data.map((row) => [row.date, row]));
  return lastNDays().map((date) => {
    const existing = map.get(date);
    if (existing) return existing;
    return { date, ...defaults };
  });
}

function eventListSql(): string {
  return CUSTOM_EVENTS.map((e) => `'${e}'`).join(", ");
}

/** KPI stat cards (DB for absolute totals) */
export async function getAdminKpiAction() {
  await requireDashboardAccess();

  const [
    totalUsers,
    proUsers,
    totalGames,
    publishedGames,
    totalSessions,
    totalPlayers,
    completedPlayers,
  ] = await Promise.all([
    db.select({ count: count() }).from(users).where(eq(users.role, "user")),
    db.select({ count: count() }).from(users).where(and(eq(users.role, "user"), eq(users.isSubscribed, true))),
    db.select({ count: count() }).from(games),
    db.select({ count: count() }).from(games).where(eq(games.status, "published")),
    db.select({ count: count() }).from(classroomPlays),
    db.select({ count: count() }).from(players),
    db.select({ count: count() }).from(players).where(eq(players.isFinished, true)),
  ]);

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

/** PostHog traffic overview — unique visitors, pageviews, session duration, errors */
export async function getTrafficOverviewAction() {
  await requireDashboardAccess();

  const [visitors, pageviews, duration, errors] = await Promise.all([
    runHogQL(`
      SELECT count(DISTINCT person_id)
      FROM events
      WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    `),
    runHogQL(`
      SELECT count()
      FROM events
      WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    `),
    runHogQL(`
      SELECT avg($session_duration)
      FROM sessions
      WHERE $start_timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    `),
    runHogQL(`
      SELECT count()
      FROM events
      WHERE event = '$exception' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    `),
  ]);

  const avgSeconds = Number(duration.results[0]?.[0] ?? 0);

  return {
    uniqueVisitors: Number(visitors.results[0]?.[0] ?? 0),
    totalPageviews: Number(pageviews.results[0]?.[0] ?? 0),
    avgSessionDurationSeconds: Math.round(avgSeconds),
    totalErrors: Number(errors.results[0]?.[0] ?? 0),
  };
}

/** Unique visitors per day */
export async function getUniqueVisitorsPerDayAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT toDate(timestamp) as day, count(DISTINCT person_id)
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  const rows = data.results.map((row) => ({
    date: String(row[0]),
    visitors: Number(row[1]),
  }));

  return fillDailySeries(rows, { visitors: 0 });
}

/** Pageviews per day */
export async function getVisitsPerDayAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT toDate(timestamp) as day, count()
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  const rows = data.results.map((row) => ({
    date: String(row[0]),
    visits: Number(row[1]),
  }));

  return fillDailySeries(rows, { visits: 0 });
}

/** Device type breakdown */
export async function getDeviceTypeBreakdownAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT
      if(empty(properties.$device_type), 'Unknown', properties.$device_type) as device,
      count() as total
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY device
    ORDER BY total DESC
  `);

  const DEVICE_LABELS: Record<string, string> = {
    Desktop: "سطح المكتب",
    Mobile: "جوال",
    Tablet: "جهاز لوحي",
    Unknown: "غير معروف",
  };

  return data.results.map((row) => ({
    name: DEVICE_LABELS[String(row[0])] ?? String(row[0]),
    value: Number(row[1]),
  }));
}

/** Average session duration per day (seconds) */
export async function getSessionDurationPerDayAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT toDate($start_timestamp) as day, avg($session_duration) as avg_duration
    FROM sessions
    WHERE $start_timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  const rows = data.results.map((row) => ({
    date: String(row[0]),
    duration: Math.round(Number(row[1] ?? 0)),
  }));

  return fillDailySeries(rows, { duration: 0 });
}

/** Errors per day */
export async function getErrorsPerDayAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT toDate(timestamp) as day, count()
    FROM events
    WHERE event = '$exception' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY day
    ORDER BY day ASC
  `);

  const rows = data.results.map((row) => ({
    date: String(row[0]),
    errors: Number(row[1]),
  }));

  return fillDailySeries(rows, { errors: 0 });
}

/** Top error messages */
export async function getErrorBreakdownAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT
      if(empty(properties.$exception_message), 'Unknown error', properties.$exception_message) as message,
      count() as total
    FROM events
    WHERE event = '$exception' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY message
    ORDER BY total DESC
    LIMIT 8
  `);

  return data.results.map((row) => ({
    message: String(row[0]).slice(0, 80),
    count: Number(row[1]),
  }));
}

/** Total counts for all custom PostHog events */
export async function getAllEventsSummaryAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT event, count() as total
    FROM events
    WHERE event IN (${eventListSql()})
      AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY event
    ORDER BY total DESC
  `);

  const counts: Record<string, number> = {};
  for (const event of CUSTOM_EVENTS) counts[event] = 0;

  for (const row of data.results) {
    counts[String(row[0])] = Number(row[1]);
  }

  return CUSTOM_EVENTS.map((event) => ({
    event,
    label: EVENT_LABELS[event],
    count: counts[event],
  }));
}

/** Multi-event daily trend (pivoted for charts) */
export async function getEventsTrendAction(events: CustomEventName[]) {
  await requireDashboardAccess();

  const eventSql = events.map((e) => `'${e}'`).join(", ");
  const data = await runHogQL(`
    SELECT toDate(timestamp) as day, event, count() as cnt
    FROM events
    WHERE event IN (${eventSql})
      AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY day, event
    ORDER BY day ASC
  `);

  const map: Record<string, Record<string, number>> = {};
  for (const row of data.results) {
    const day = String(row[0]);
    const event = String(row[1]);
    if (!map[day]) map[day] = {};
    map[day][event] = Number(row[2]);
  }

  const defaults = Object.fromEntries(events.map((e) => [e, 0]));
  return lastNDays().map((date) => ({
    date,
    ...defaults,
    ...map[date],
  }));
}


/** Teacher activity trend */
export async function getTeacherActivityTrendAction() {
  await requireDashboardAccess();
  return getEventsTrendAction([
    "game_created",
    "game_published",
    "game_session_closed",
    "game_deleted",
    "sessions_deleted",
    "ai_game_generated",
  ]);
}

/** Player journey trend */
export async function getPlayerJourneyTrendAction() {
  await requireDashboardAccess();
  return getEventsTrendAction([
    "game_joined",
    "game_started",
    "choice_selected",
    "question_skipped",
    "game_completed",
    "game_result_shared",
  ]);
}

/** Game status breakdown (DB) */
export async function getGameStatusBreakdownAction() {
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

/** Geographic visits — top 10 countries */
export async function getGeoVisitsAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT
      properties.$geoip_country_name as country,
      count() as visits
    FROM events
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY country
    ORDER BY visits DESC
    LIMIT 10
  `);

  return data.results.map((row) => {
    const countryVal = row[0];
    const isUnknown = !countryVal || countryVal === "null" || countryVal === "Unknown";
    return {
      country: isUnknown ? "غير معروف" : String(countryVal),
      visits: Number(row[1]),
    };
  });
}

/** Player funnel totals (joined → started → completed) */
export async function getPlayerFunnelAction() {
  await requireDashboardAccess();

  const data = await runHogQL(`
    SELECT event, count() as total
    FROM events
    WHERE event IN ('game_joined', 'game_started', 'game_completed')
      AND timestamp >= now() - INTERVAL ${ANALYTICS_DAYS} DAY
    GROUP BY event
  `);

  const counts: Record<string, number> = {};
  for (const row of data.results) counts[String(row[0])] = Number(row[1]);

  return [
    { step: "انضمام", count: counts.game_joined ?? 0 },
    { step: "بدء اللعب", count: counts.game_started ?? 0 },
    { step: "إكمال", count: counts.game_completed ?? 0 },
  ];
}

/** Total AI tokens used platform-wide */
export async function getPlatformAiUsageAction() {
  await requireDashboardAccess();

  const data = await db
    .select({
      totalTokens: sql<number>`COALESCE(SUM(${usageEvents.tokensUsed}), 0)`,
    })
    .from(usageEvents)
    .where(eq(usageEvents.activity, "ai_generation"));

  return data[0]?.totalTokens || 0;
}
