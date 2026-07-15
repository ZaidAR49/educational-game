"use client"

import {
  Users,
  CreditCard,
  Activity,
  Gamepad2,
  Clock,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Share2,
  Trash2,
  Play,
  MousePointerClick,
  SkipForward,
  CheckCircle2,
  LogIn,
  XCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TrafficCharts } from "./charts/TrafficCharts"
import { TeacherActivityCharts } from "./charts/TeacherActivityCharts"
import { PlayerJourneyCharts } from "./charts/PlayerJourneyCharts"
import { ErrorTrackingCharts } from "./charts/ErrorTrackingCharts"

export type CustomEventName =
  | "game_created"
  | "game_published"
  | "game_session_closed"
  | "game_deleted"
  | "sessions_deleted"
  | "ai_game_generated"
  | "game_joined"
  | "game_started"
  | "choice_selected"
  | "question_skipped"
  | "game_completed"
  | "game_result_shared";

interface AnalyticsClientProps {
  kpis: {
    totalUsers: number
    proUsers: number
    totalGames: number
    publishedGames: number
    totalSessions: number
    totalPlayers: number
    completionRate: number
  }
  traffic: {
    uniqueVisitors: number
    totalPageviews: number
    avgSessionDurationSeconds: number
    totalErrors: number
  }
  eventSummary: { event: CustomEventName; label: string; count: number }[]
  gameStatus: { name: string; key: string; value: number }[]
  visits: { date: string; visits: number }[]
  uniqueVisitors: { date: string; visitors: number }[]
  deviceTypes: { name: string; value: number }[]
  sessionDuration: { date: string; duration: number }[]
  errorsPerDay: { date: string; errors: number }[]
  errorBreakdown: { message: string; count: number }[]
  teacherActivity: Record<string, string | number>[]
  playerJourney: Record<string, string | number>[]
  playerFunnel: { step: string; count: number }[]
  geoVisits: { country: string; visits: number }[]
  platformAiUsage: number
}

const DEVICE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#94a3b8"]
const STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  published: "#10b981",
  archived: "#64748b",
}

const EVENT_ICONS: Partial<Record<CustomEventName, React.ComponentType<{ className?: string }>>> = {
  game_created: Gamepad2,
  game_published: Play,
  game_session_closed: XCircle,
  game_deleted: Trash2,
  sessions_deleted: Trash2,
  ai_game_generated: Sparkles,
  game_joined: LogIn,
  game_started: Play,
  choice_selected: MousePointerClick,
  question_skipped: SkipForward,
  game_completed: CheckCircle2,
  game_result_shared: Share2,
}

function formatDateTick(value: string) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—"
  if (seconds < 60) return `${seconds} ث`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins}د ${secs}ث` : `${mins}د`
  const hours = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hours}س ${remMins}د`
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
          <div className="text-2xl font-bold text-slate-800">{typeof value === "number" ? value.toLocaleString() : value}</div>
          <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
          {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}

export function AnalyticsClient({
  kpis,
  traffic,
  eventSummary,
  gameStatus,
  visits,
  uniqueVisitors,
  deviceTypes,
  sessionDuration,
  errorsPerDay,
  errorBreakdown,
  teacherActivity,
  playerJourney,
  playerFunnel,
  geoVisits,
  platformAiUsage,
}: AnalyticsClientProps) {
  const teacherChartConfig = {
    game_created: { label: "إنشاء لعبة", color: "hsl(142.1 76.2% 36.3%)" },
    game_published: { label: "نشر لعبة", color: "hsl(221.2 83.2% 53.3%)" },
    game_session_closed: { label: "إغلاق جلسة", color: "hsl(215.4 16.3% 46.9%)" },
    game_deleted: { label: "حذف لعبة", color: "hsl(0 84.2% 60.2%)" },
    sessions_deleted: { label: "حذف جلسات", color: "hsl(25 95% 53%)" },
    ai_game_generated: { label: "ذكاء اصطناعي", color: "hsl(262.1 83.3% 57.8%)" },
  }

  const playerChartConfig = {
    game_joined: { label: "انضمام", color: "hsl(221.2 83.2% 53.3%)" },
    game_started: { label: "بدء اللعب", color: "hsl(142.1 76.2% 36.3%)" },
    choice_selected: { label: "اختيار إجابة", color: "hsl(262.1 83.3% 57.8%)" },
    question_skipped: { label: "تخطي سؤال", color: "hsl(47.9 95.8% 53.1%)" },
    game_completed: { label: "إكمال", color: "hsl(173 58% 39%)" },
    game_result_shared: { label: "مشاركة", color: "hsl(330 81% 60%)" },
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">لوحة تحكم التحليلات</h2>
        <p className="mt-1 text-slate-500">نظرة شاملة على أداء المنصة وأحداث PostHog خلال آخر 30 يوماً</p>
      </div>

      {/* Platform KPIs */}
      <section>
        <SectionTitle title="مؤشرات المنصة" description="إحصائيات قاعدة البيانات" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Users} value={kpis.totalUsers} label="إجمالي المستخدمين" iconBg="bg-indigo-50" iconColor="text-indigo-600" />
          <KpiCard icon={CreditCard} value={kpis.proUsers} label="مشتركي برو" iconBg="bg-amber-50" iconColor="text-amber-600" />
          <KpiCard
            icon={Gamepad2}
            value={kpis.totalGames}
            label="إجمالي الألعاب"
            sub={`${kpis.publishedGames} منشورة`}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <KpiCard
            icon={Activity}
            value={kpis.totalPlayers}
            label="إجمالي اللاعبين"
            sub={`${kpis.completionRate}% إكمال`}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
      </section>

      {/* AI Token Usage Platform-wide */}
      <section>
        <SectionTitle title="استهلاك الذكاء الاصطناعي" description="إجمالي الاستهلاك على مستوى المنصة" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard 
            icon={Sparkles} 
            value={platformAiUsage.toLocaleString()} 
            label="إجمالي التوكنز المستخدمة" 
            sub="لتوليد الألعاب"
            iconBg="bg-purple-50" 
            iconColor="text-purple-600" 
          />
        </div>
      </section>

      {/* All PostHog Events Summary */}
      <section>
        <SectionTitle title="جميع أحداث PostHog" description="إجمالي كل حدث مخصص خلال آخر 30 يوم" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {eventSummary.map(({ event, label, count }) => {
            const Icon = EVENT_ICONS[event] ?? TrendingUp
            return (
              <Card key={event} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800">{count.toLocaleString()}</div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Traffic Charts */}
      <TrafficCharts 
        traffic={traffic}
        visits={visits}
        uniqueVisitors={uniqueVisitors}
        deviceTypes={deviceTypes}
        sessionDuration={sessionDuration}
        geoVisits={geoVisits}
      />

      {/* Teacher Activity */}
      <TeacherActivityCharts 
        teacherActivity={teacherActivity}
        gameStatus={gameStatus}
        teacherChartConfig={teacherChartConfig}
      />

      {/* Player Journey */}
      <PlayerJourneyCharts 
        playerJourney={playerJourney}
        playerFunnel={playerFunnel}
        playerChartConfig={playerChartConfig}
      />

      {/* Error Tracking */}
      <ErrorTrackingCharts 
        totalErrors={traffic.totalErrors}
        errorsPerDay={errorsPerDay}
        errorBreakdown={errorBreakdown}
      />
    </div>
  )
}
