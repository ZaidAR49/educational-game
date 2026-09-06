"use client"

import React from "react"
import {
  Users,
  CreditCard,
  Gamepad2,
  Activity,
  Sparkles,
  TrendingUp,
  Gamepad2 as GameIcon,
  Building2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { TeacherActivityCharts } from "../charts/TeacherActivityCharts"
import { PlayerJourneyCharts } from "../charts/PlayerJourneyCharts"

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}

function KpiCard({
  icon: Icon,
  value,
  label,
  sub,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label: string
  sub?: string
  iconBg: string
  iconColor: string
}) {
  return (
    <Card className="transition-transform hover:scale-[1.01]">
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">
            {typeof value === "number" ? value.toLocaleString("en-US") : value}
          </div>
          <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
          {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  game_created: Gamepad2,
  game_published: GameIcon,
  ai_game_generated: Sparkles,
  ai_organization_improved: Building2,
}

export function KpisClient({ kpis }: { kpis: any }) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  const publishedSub = a?.publishedGames
    ? a.publishedGames.replace("{count}", String(kpis.publishedGames))
    : `${kpis.publishedGames} ${isRTL ? "منشورة" : "published"}`

  const completionSub = a?.completionRate
    ? a.completionRate.replace("{rate}", String(kpis.completionRate))
    : `${kpis.completionRate}% ${isRTL ? "إكمال" : "completion"}`

  return (
    <section>
      <SectionTitle 
        title={a?.kpisTitle || (isRTL ? "مؤشرات المنصة" : "Platform Indicators")} 
        description={a?.kpisSubtitle || (isRTL ? "إحصائيات قاعدة البيانات" : "Database Statistics")} 
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          value={kpis.totalUsers}
          label={a?.totalUsers || (isRTL ? "إجمالي المستخدمين" : "Total Users")}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          icon={CreditCard}
          value={kpis.proUsers}
          label={a?.proUsers || (isRTL ? "مشتركي برو" : "Pro Subscribers")}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KpiCard
          icon={Gamepad2}
          value={kpis.totalGames}
          label={a?.totalGames || (isRTL ? "إجمالي الألعاب" : "Total Games")}
          sub={publishedSub}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          icon={Activity}
          value={kpis.totalPlayers}
          label={a?.totalPlayers || (isRTL ? "إجمالي اللاعبين" : "Total Players")}
          sub={completionSub}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>
    </section>
  )
}

export function AiUsageClient({ usage }: { usage: number }) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  return (
    <section>
      <SectionTitle 
        title={a?.aiUsageTitle || (isRTL ? "استهلاك الذكاء الاصطناعي" : "AI Token Usage")} 
        description={a?.aiUsageSubtitle || (isRTL ? "إجمالي الاستهلاك على مستوى المنصة" : "Platform-wide total consumption")} 
      />
      <Card className="w-full">
        <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-50">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-800 flex items-baseline gap-1">
                {usage.toLocaleString("en-US")}{" "}
                <span className="text-sm font-bold text-slate-500">
                  {a?.tokens || (isRTL ? "توكنز" : "Tokens")}
                </span>
              </div>
              <div className="mt-1 text-sm font-medium text-slate-600">
                {a?.aiTotalUsage || (isRTL ? "إجمالي الاستخدام الشامل" : "Total Comprehensive Usage")}
              </div>
              <div className="mt-0.5 text-xs text-slate-400 max-w-md">
                {a?.aiUsageDesc || (isRTL 
                  ? "يعكس هذا الرقم إجمالي التوكنز المستهلكة عبر جميع ميزات الذكاء الاصطناعي في المنصة (توليد الألعاب، تحسين المؤسسات)."
                  : "This number reflects the total tokens consumed across all AI features on the platform (game generation, organization enhancement).")}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
            <Activity className="h-5 w-5 text-slate-400" />
            <div className="text-xs font-semibold text-slate-500">
              {a?.liveTracking || (isRTL ? "تتبع مباشر للاستخدام الكلي" : "Live tracking of total usage")}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export function EventSummaryClient({ eventSummary }: { eventSummary: any[] }) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  return (
    <section>
      <SectionTitle 
        title={a?.eventsTitle || (isRTL ? "جميع أحداث PostHog" : "All PostHog Events")} 
        description={a?.eventsSubtitle || (isRTL ? "إجمالي كل حدث مخصص خلال آخر 30 يوم" : "Total custom events over the last 30 days")} 
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {eventSummary.map(({ event, label, count }) => {
          const Icon = EVENT_ICONS[event] ?? TrendingUp
          const localizedLabel = (a?.eventNames as any)?.[event] || label || event
          return (
            <Card key={event} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-xl font-bold text-slate-800">{count.toLocaleString("en-US")}</div>
                <div className="mt-0.5 text-xs font-medium text-slate-500">{localizedLabel}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export function TeacherActivitySectionClient({
  teacherActivity,
  gameStatus,
}: {
  teacherActivity: any[]
  gameStatus: any[]
}) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  const teacherChartConfig = {
    game_created: { label: a?.eventNames?.game_created || (isRTL ? "إنشاء لعبة" : "Create Game"), color: "hsl(142.1 76.2% 36.3%)" },
    game_published: { label: a?.eventNames?.game_published || (isRTL ? "نشر لعبة" : "Publish Game"), color: "hsl(221.2 83.2% 53.3%)" },
    game_session_closed: { label: a?.eventNames?.game_session_closed || (isRTL ? "إغلاق جلسة" : "Close Session"), color: "hsl(215.4 16.3% 46.9%)" },
    game_deleted: { label: a?.eventNames?.game_deleted || (isRTL ? "حذف لعبة" : "Delete Game"), color: "hsl(0 84.2% 60.2%)" },
    sessions_deleted: { label: a?.eventNames?.sessions_deleted || (isRTL ? "حذف جلسات" : "Delete Sessions"), color: "hsl(25 95% 53%)" },
    ai_game_generated: { label: a?.eventNames?.ai_game_generated || (isRTL ? "ذكاء اصطناعي" : "AI Generation"), color: "hsl(262.1 83.3% 57.8%)" },
  }

  return (
    <TeacherActivityCharts
      teacherActivity={teacherActivity}
      gameStatus={gameStatus}
      teacherChartConfig={teacherChartConfig}
    />
  )
}

export function PlayerJourneySectionClient({
  playerJourney,
  playerFunnel,
}: {
  playerJourney: any[]
  playerFunnel: any[]
}) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  const playerChartConfig = {
    game_joined: { label: a?.eventNames?.game_joined || (isRTL ? "انضمام" : "Join"), color: "hsl(221.2 83.2% 53.3%)" },
    game_started: { label: a?.eventNames?.game_started || (isRTL ? "بدء اللعب" : "Start Game"), color: "hsl(142.1 76.2% 36.3%)" },
    choice_selected: { label: a?.eventNames?.choice_selected || (isRTL ? "اختيار إجابة" : "Select Choice"), color: "hsl(262.1 83.3% 57.8%)" },
    question_skipped: { label: a?.eventNames?.question_skipped || (isRTL ? "تخطي سؤال" : "Skip Question"), color: "hsl(47.9 95.8% 53.1%)" },
    game_completed: { label: a?.eventNames?.game_completed || (isRTL ? "إكمال" : "Complete"), color: "hsl(173 58% 39%)" },
    game_result_shared: { label: a?.eventNames?.game_result_shared || (isRTL ? "مشاركة" : "Share"), color: "hsl(330 81% 60%)" },
  }

  return (
    <PlayerJourneyCharts
      playerJourney={playerJourney}
      playerFunnel={playerFunnel}
      playerChartConfig={playerChartConfig}
    />
  )
}
