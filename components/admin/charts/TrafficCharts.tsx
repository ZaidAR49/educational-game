"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Monitor } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

const DEVICE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#94a3b8"]

function formatDateTick(value: string) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function formatDuration(seconds: number, isRTL: boolean): string {
  if (seconds <= 0) return "—"
  if (seconds < 60) return isRTL ? `${seconds} ث` : `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) {
    return secs > 0 
      ? (isRTL ? `${mins}د ${secs}ث` : `${mins}m ${secs}s`)
      : (isRTL ? `${mins}د` : `${mins}m`)
  }
  const hours = Math.floor(mins / 60)
  const remMins = mins % 60
  return isRTL ? `${hours}س ${remMins}د` : `${hours}h ${remMins}m`
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}

interface TrafficChartsProps {
  traffic: any;
  visits: any[];
  uniqueVisitors: any[];
  deviceTypes: any[];
  sessionDuration: any[];
  geoVisits: any[];
}

export function TrafficCharts({
  traffic,
  visits,
  uniqueVisitors,
  deviceTypes,
  sessionDuration,
  geoVisits
}: TrafficChartsProps) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  const localizedDeviceTypes = deviceTypes.map((d) => {
    let name = d.name
    if (d.name === "سطح المكتب" || d.name === "Desktop") {
      name = a?.desktop || (isRTL ? "سطح المكتب" : "Desktop")
    } else if (d.name === "جوال" || d.name === "Mobile") {
      name = a?.mobile || (isRTL ? "جوال" : "Mobile")
    } else if (d.name === "جهاز لوحي" || d.name === "Tablet") {
      name = a?.tablet || (isRTL ? "جهاز لوحي" : "Tablet")
    } else if (d.name === "غير معروف" || d.name === "Unknown") {
      name = isRTL ? "غير معروف" : "Unknown"
    }
    return { ...d, name }
  })

  return (
    <section>
      <SectionTitle title={a?.trafficTitle || (isRTL ? "تحليل الزيارات" : "Traffic Analysis")} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{a?.pageViews || (isRTL ? "مشاهدات الصفحات" : "Page Views")}</CardDescription>
            <CardTitle className="text-3xl font-bold">{traffic.totalPageviews.toLocaleString('en-US')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ visits: { label: a?.views || (isRTL ? "مشاهدات" : "Views"), color: "hsl(217.2 91.2% 59.8%)" } }} className="h-[280px] w-full">
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
            <CardDescription>{a?.uniqueVisitors || (isRTL ? "الزوار الفريدون" : "Unique Visitors")}</CardDescription>
            <CardTitle className="text-3xl font-bold">{traffic.uniqueVisitors.toLocaleString('en-US')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ visitors: { label: a?.uniqueVisitorsLabel || (isRTL ? "زوار فريدون" : "Unique Visitors"), color: "hsl(262.1 83.3% 57.8%)" } }} className="h-[280px] w-full">
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
              {a?.deviceType || (isRTL ? "نوع الجهاز" : "Device Type")}
            </CardTitle>
            <CardDescription>{a?.deviceTypeDesc || (isRTL ? "توزيع الأجهزة المستخدمة للزيارة" : "Distribution of visitor devices")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                desktop: { label: a?.desktop || (isRTL ? "سطح المكتب" : "Desktop"), color: "#6366f1" },
                mobile: { label: a?.mobile || (isRTL ? "جوال" : "Mobile"), color: "#10b981" },
                tablet: { label: a?.tablet || (isRTL ? "جهاز لوحي" : "Tablet"), color: "#f59e0b" },
              }}
              className="mx-auto h-[280px] w-full max-w-[320px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={localizedDeviceTypes} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {localizedDeviceTypes.map((_, i) => (
                    <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
            {localizedDeviceTypes.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                {a?.noDeviceData || (isRTL ? "لا توجد بيانات أجهزة بعد" : "No device data yet")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-500" />
              {a?.avgSessionDuration || (isRTL ? "متوسط مدة الجلسة" : "Average Session Duration")}
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{formatDuration(traffic.avgSessionDurationSeconds, isRTL)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ duration: { label: a?.sessionDurationSec || (isRTL ? "مدة (ث)" : "Duration (s)"), color: "hsl(173 58% 39%)" } }} className="h-[280px] w-full">
              <LineChart data={sessionDuration} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDateTick} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => isRTL ? `${v}ث` : `${v}s`} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatter={(value) => [formatDuration(Number(value), isRTL), a?.sessionDurationLabel || (isRTL ? "مدة الجلسة" : "Session Duration")]} />
                  }
                />
                <Line type="monotone" dataKey="duration" stroke="var(--color-duration)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{a?.geoDistribution || (isRTL ? "التوزيع الجغرافي" : "Geographic Distribution")}</CardTitle>
            <CardDescription>{a?.geoDistributionDesc || (isRTL ? "أعلى 10 دول حسب عدد الزيارات" : "Top 10 countries by visits")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ visits: { label: a?.visits || (isRTL ? "زيارات" : "Visits"), color: "hsl(142.1 76.2% 36.3%)" } }} className="h-[280px] w-full">
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
  );
}
