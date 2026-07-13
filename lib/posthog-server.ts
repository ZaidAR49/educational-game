import { PostHog } from "posthog-node"

export function getPostHogClient(): PostHog {
  if (process.env.NODE_ENV !== "production") {
    // Return a no-op client in dev to avoid ETIMEDOUT noise from network restrictions
    return { capture: () => {}, shutdown: async () => {} } as unknown as PostHog
  }
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}
