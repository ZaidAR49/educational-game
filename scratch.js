const POSTHOG_API = "https://eu.i.posthog.com";
const PROJECT_ID = "221991";
const API_KEY = "phx_MMEn4mqXRkhbxUNwZyn6kXySyx5zZRREEawaFAEuA62kDNUf";

async function runHogQL(query) {
  const res = await fetch(`${POSTHOG_API}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query,
      },
    }),
  });

  if (!res.ok) {
    console.error("PostHog API Error:", await res.text());
    return { results: [] };
  }

  return res.json();
}

async function checkEvents() {
  const data = await runHogQL(`
    SELECT event, count() 
    FROM events 
    WHERE timestamp >= now() - INTERVAL 30 DAY 
    GROUP BY event 
    ORDER BY count() DESC
  `);
  console.log("Events:", data.results);
  
  const geo = await runHogQL(`
    SELECT properties.$geoip_country_name as country, count() as visits 
    FROM events 
    WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY 
    GROUP BY country 
    ORDER BY visits DESC 
    LIMIT 10
  `);
  console.log("Geo:", geo.results);
}

checkEvents();
