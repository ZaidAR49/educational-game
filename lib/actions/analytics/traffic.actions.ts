"use server";

import { requireDashboardAccess } from "@/lib/auth/rbac";
import { unstable_noStore as noStore } from "next/cache";
import { runHogQL, ANALYTICS_DAYS, fillDailySeries } from "./core";

/** PostHog traffic overview — unique visitors, pageviews, session duration, errors */
export async function getTrafficOverviewAction() {
  noStore();
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
  noStore();
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
  noStore();
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
  noStore();
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
  noStore();
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
  noStore();
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
  noStore();
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

/** Geographic visits — top 10 countries */
export async function getGeoVisitsAction() {
  noStore();
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
