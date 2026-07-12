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
  Monitor,
  Share2,
  Trash2,
  Play,
  MousePointerClick,
  SkipForward,
  CheckCircle2,
  LogIn,
  XCircle,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <section>
        <SectionTitle title="تحليل الزيارات" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>مشاهدات الصفحات</CardDescription>
              <CardTitle className="text-3xl font-bold">{traffic.totalPageviews.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ visits: { label: "مشاهدات", color: "hsl(217.2 91.2% 59.8%)" } }} className="h-[280px] w-full">
                <AreaChart data={visits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="visits" stroke="var(--color-visits)" fill="url(#fillVisits)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>الزوار الفريدون</CardDescription>
              <CardTitle className="text-3xl font-bold">{traffic.uniqueVisitors.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ visitors: { label: "زوار فريدون", color: "hsl(262.1 83.3% 57.8%)" } }} className="h-[280px] w-full">
                <AreaChart data={uniqueVisitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="visitors" stroke="var(--color-visitors)" fill="url(#fillVisitors)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-500" />
                نوع الجهاز
              </CardTitle>
              <CardDescription>توزيع الأجهزة المستخدمة للزيارة</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  desktop: { label: "سطح المكتب", color: "#6366f1" },
                  mobile: { label: "جوال", color: "#10b981" },
                  tablet: { label: "جهاز لوحي", color: "#f59e0b" },
                }}
                className="mx-auto h-[280px] w-full max-w-[320px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie data={deviceTypes} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                    {deviceTypes.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
              {deviceTypes.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">لا توجد بيانات أجهزة بعد</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-500" />
                متوسط مدة الجلسة
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{formatDuration(traffic.avgSessionDurationSeconds)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ duration: { label: "مدة (ث)", color: "hsl(173 58% 39%)" } }} className="h-[280px] w-full">
                <LineChart data={sessionDuration} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${v}ث`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => [formatDuration(Number(value)), "مدة الجلسة"]} />
                    }
                  />
                  <Line type="monotone" dataKey="duration" stroke="var(--color-duration)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>التوزيع الجغرافي</CardTitle>
              <CardDescription>أعلى 10 دول حسب عدد الزيارات</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ visits: { label: "زيارات", color: "hsl(142.1 76.2% 36.3%)" } }} className="h-[280px] w-full">
                <BarChart layout="vertical" data={geoVisits} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill="var(--color-visits)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Teacher Activity */}
      <section>
        <SectionTitle title="نشاط المعلمين" description="أحداث إنشاء وإدارة الألعاب" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>اتجاه نشاط المعلمين</CardTitle>
              <CardDescription>جميع أحداث المعلم خلال 30 يوم</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={teacherChartConfig} className="h-[320px] w-full">
                <LineChart data={teacherActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {Object.keys(teacherChartConfig).map((key) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>



          <Card>
            <CardHeader>
              <CardTitle>حالة الألعاب</CardTitle>
              <CardDescription>توزيع حالة الألعاب في قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  draft: { label: "مسودة", color: STATUS_COLORS.draft },
                  published: { label: "منشورة", color: STATUS_COLORS.published },
                  archived: { label: "مؤرشفة", color: STATUS_COLORS.archived },
                }}
                className="mx-auto h-[260px] w-full max-w-[280px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={gameStatus.map((s) => ({ ...s, fill: STATUS_COLORS[s.key] ?? "#94a3b8" }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Player Journey */}
      <section>
        <SectionTitle title="رحلة اللاعب" description="أحداث اللعب من الانضمام إلى المشاركة" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>اتجاه أحداث اللاعب</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={playerChartConfig} className="h-[320px] w-full">
                <LineChart data={playerJourney} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {Object.keys(playerChartConfig).map((key) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>قمع اللاعب</CardTitle>
              <CardDescription>انضمام ← بدء ← إكمال</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ count: { label: "عدد", color: "hsl(221.2 83.2% 53.3%)" } }} className="h-[320px] w-full">
                <BarChart data={playerFunnel} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="step" tickLine={false} axisLine={false} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>


        </div>
      </section>

      {/* Error Tracking */}
      <section>
        <SectionTitle title="تتبع الأخطاء" description="أحداث $exception من PostHog" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                أخطاء مسجّلة
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{traffic.totalErrors.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ errors: { label: "أخطاء", color: "hsl(0 84.2% 60.2%)" } }} className="h-[280px] w-full">
                <AreaChart data={errorsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="url(#fillErrors)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أكثر الأخطاء شيوعاً</CardTitle>
              <CardDescription>أعلى 8 رسائل خطأ</CardDescription>
            </CardHeader>
            <CardContent>
              {errorBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {errorBreakdown.map((err, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
                      <p className="flex-1 truncate text-sm text-slate-700" title={err.message}>
                        {err.message}
                      </p>
                      <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                        {err.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <AlertTriangle className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">لا توجد أخطاء مسجّلة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
