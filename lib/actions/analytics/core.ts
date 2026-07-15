import "server-only";

export const POSTHOG_API = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
export const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
export const API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
export const ANALYTICS_DAYS = 30;

export const CUSTOM_EVENTS = [
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
  "ai_organization_improved",
] as const;

export type CustomEventName = (typeof CUSTOM_EVENTS)[number];

export const EVENT_LABELS: Record<CustomEventName, string> = {
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
  ai_organization_improved: "تحسين المؤسسة بالذكاء الاصطناعي",
};

export type HogQLRow = unknown[];

export async function runHogQL(query: string) {
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

export function lastNDays(): string[] {
  const dates: string[] = [];
  for (let i = ANALYTICS_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function fillDailySeries<T extends Record<string, number>>(
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

export function eventListSql(): string {
  return CUSTOM_EVENTS.map((e) => `'${e}'`).join(", ");
}
