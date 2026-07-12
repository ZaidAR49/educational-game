<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Decision Hero Game platform. The following changes were made:

- **`instrumentation-client.ts`** (new) — initializes `posthog-js` via Next.js's instrumentation hook, routing events through the `/ingest` reverse proxy with exception capture enabled.
- **`lib/posthog-server.ts`** (new) — exports a `getPostHogClient()` factory for server-side `posthog-node` usage with `flushAt: 1` / `flushInterval: 0` to ensure events send before server actions return.
- **`next.config.mjs`** — added `/ingest/*` reverse proxy rewrites pointing to `eu.i.posthog.com` so client-side events bypass ad blockers.
- **`app/layout.tsx`** — made async to call `auth()` server-side; renders `<PosthogIdentify>` when a teacher session is active.
- **`components/shared/PosthogIdentify.tsx`** (new) — client component that calls `posthog.identify(userId, { name })` on mount to link teacher sessions to their PostHog person profile.
- **`components/shared/NavbarClient.tsx`** — added `posthog.reset()` alongside `signOut()` so the anonymous device ID is unlinked on logout.
- **`app/game/[id]/GameClient.tsx`** — added 6 client-side capture calls covering the full student game flow.
- **`lib/actions/game-wizard.actions.ts`** — server-side `game_created` event when a new game is saved.
- **`lib/actions/games.actions.ts`** — server-side `game_published`, `game_session_closed`, and `game_deleted` events.
- **`lib/actions/sessions.actions.ts`** — server-side `sessions_deleted` event.
- **`lib/actions/ai.actions.ts`** — server-side `ai_game_generated` event when the AI generator succeeds.

| Event | Description | File |
|---|---|---|
| `game_created` | Teacher saves a new game via the wizard | `lib/actions/game-wizard.actions.ts` |
| `game_published` | Teacher publishes a game and opens a live session | `lib/actions/games.actions.ts` |
| `game_session_closed` | Teacher unpublishes a game and closes the session | `lib/actions/games.actions.ts` |
| `game_deleted` | Teacher deletes a game | `lib/actions/games.actions.ts` |
| `sessions_deleted` | Teacher deletes one or more past sessions | `lib/actions/sessions.actions.ts` |
| `ai_game_generated` | AI successfully generates a game from an idea | `lib/actions/ai.actions.ts` |
| `game_joined` | Student successfully joins a live game session | `app/game/[id]/GameClient.tsx` |
| `game_started` | Student clicks start and begins playing | `app/game/[id]/GameClient.tsx` |
| `choice_selected` | Student picks an answer choice for a scenario | `app/game/[id]/GameClient.tsx` |
| `question_skipped` | Student skips a scenario without answering | `app/game/[id]/GameClient.tsx` |
| `game_completed` | Student finishes all scenarios and sees results | `app/game/[id]/GameClient.tsx` |
| `game_result_shared` | Student uses the share button on the results screen | `app/game/[id]/GameClient.tsx` |

## Next steps

We've built a dashboard and insights in PostHog to keep an eye on key metrics:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/221991/dashboard/812366)
- [Player game completion funnel (wizard)](https://eu.posthog.com/project/221991/insights/CR2wVkMN)
- [Games created over time (wizard)](https://eu.posthog.com/project/221991/insights/zH9GeuGc)
- [Active game sessions (wizard)](https://eu.posthog.com/project/221991/insights/IEZ1IOd4)
- [AI game generation usage (wizard)](https://eu.posthog.com/project/221991/insights/BYehP2yx)
- [Choice correctness rate (wizard)](https://eu.posthog.com/project/221991/insights/UgFDCVBJ)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on every page load when a session is present, which handles this, but verify it works as expected after a fresh browser session.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
