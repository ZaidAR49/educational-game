import posthog from "posthog-js"

// Only initialize PostHog in production — keeps dev logs clean and avoids
// polluting analytics data with local development events.
if (process.env.NEXT_PUBLIC_ENV !== "dev" && process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
  })
}
