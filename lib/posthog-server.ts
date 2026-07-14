import { PostHog } from "posthog-node"

// No-op stub used in development so server actions don't send events to PostHog.
const noopClient = {
  capture: () => {},
  shutdown: async () => {},
} as unknown as PostHog;

export function getPostHogClient(): PostHog {
  // Use the new ENV variable to determine if we should send analytics
  if (process.env.NEXT_PUBLIC_ENV === "dev" || process.env.NODE_ENV !== "production") {
    return noopClient;
  }
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}
