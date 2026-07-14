"use server";

import { requireDashboardAccess } from "@/lib/auth/rbac";
import { runHogQL, CUSTOM_EVENTS, EVENT_LABELS, CustomEventName, ANALYTICS_DAYS, eventListSql, lastNDays } from "./core";

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

  const invalidEvents = events.filter((e) => !CUSTOM_EVENTS.includes(e));
  if (invalidEvents.length > 0) {
    throw new Error(`Invalid event name(s): ${invalidEvents.join(', ')}`);
  }

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
