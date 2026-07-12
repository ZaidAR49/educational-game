const fs = require("fs");

for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const POSTHOG_API = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

async function runHogQL(name, query) {
  const res = await fetch(`${POSTHOG_API}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log("FAIL", name, res.status, text.slice(0, 400));
    return false;
  }
  const data = JSON.parse(text);
  console.log("OK", name, "- rows:", data.results?.length ?? 0, "| sample:", JSON.stringify(data.results?.slice(0, 3)));
  return true;
}

(async () => {
  const queries = {
    unique_visitors: `SELECT count(DISTINCT person_id) FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY`,
    device_type: `SELECT if(empty(properties.$device_type), 'Unknown', properties.$device_type) as device, count() as total FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY device ORDER BY total DESC`,
    session_duration_avg: `SELECT avg($session_duration) FROM sessions WHERE $start_timestamp >= now() - INTERVAL 30 DAY`,
    session_duration_daily: `SELECT toDate($start_timestamp) as day, avg($session_duration) FROM sessions WHERE $start_timestamp >= now() - INTERVAL 30 DAY GROUP BY day ORDER BY day ASC LIMIT 3`,
    errors: `SELECT count() FROM events WHERE event = '$exception' AND timestamp >= now() - INTERVAL 30 DAY`,
    error_breakdown: `SELECT if(empty(toString(properties.$exception_functions)), toString(properties.$exception_types), toString(properties.$exception_functions)) as error_type, count() as total FROM events WHERE event = '$exception' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY error_type ORDER BY total DESC LIMIT 8`,
    geo: `SELECT if(empty(properties.$geoip_country_name), 'Unknown', properties.$geoip_country_name) as country, count() as visits FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY country ORDER BY visits DESC LIMIT 3`,
  };

  for (const [name, query] of Object.entries(queries)) {
    await runHogQL(name, query);
  }
})();
