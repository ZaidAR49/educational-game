"use client"

import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionTitle } from "./TrafficCharts"
import { useLocale } from "@/lib/i18n/LanguageContext"

const STATUS_COLORS: Record<string, string> = {
  draft: "#f59e0b",
  published: "#10b981",
  archived: "#64748b",
}

function formatDateTick(value: string) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

interface TeacherActivityChartsProps {
  teacherActivity: any[];
  gameStatus: any[];
  teacherChartConfig: any;
}

export function TeacherActivityCharts({
  teacherActivity,
  gameStatus,
  teacherChartConfig
}: TeacherActivityChartsProps) {
  const { t, isRTL } = useLocale()
  const a = t.adminAnalytics

  const localizedGameStatus = gameStatus.map((s) => {
    let name = s.name
    if (s.key === "draft" || s.name === "مسودة") {
      name = a?.draft || (isRTL ? "مسودة" : "Draft")
    } else if (s.key === "published" || s.name === "منشورة") {
      name = a?.published || (isRTL ? "منشورة" : "Published")
    } else if (s.key === "archived" || s.name === "مؤرشفة") {
      name = a?.archived || (isRTL ? "مؤرشفة" : "Archived")
    }
    return {
      ...s,
      name,
      fill: STATUS_COLORS[s.key] ?? "#94a3b8"
    }
  })

  return (
    <section>
      <SectionTitle 
        title={a?.teacherActivityTitle || (isRTL ? "نشاط المعلمين" : "Teacher Activity")} 
        description={a?.teacherActivityDesc || (isRTL ? "أحداث إنشاء وإدارة الألعاب" : "Game creation and management events")} 
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{a?.teacherActivityTrend || (isRTL ? "اتجاه نشاط المعلمين" : "Teacher Activity Trend")}</CardTitle>
            <CardDescription>{a?.teacherActivity30Days || (isRTL ? "جميع أحداث المعلم خلال 30 يوم" : "All teacher events over 30 days")}</CardDescription>
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
            <CardTitle>{a?.gameStatus || (isRTL ? "حالة الألعاب" : "Game Status")}</CardTitle>
            <CardDescription>{a?.gameStatusDesc || (isRTL ? "توزيع حالة الألعاب في قاعدة البيانات" : "Game status distribution in database")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                draft: { label: a?.draft || (isRTL ? "مسودة" : "Draft"), color: STATUS_COLORS.draft },
                published: { label: a?.published || (isRTL ? "منشورة" : "Published"), color: STATUS_COLORS.published },
                archived: { label: a?.archived || (isRTL ? "مؤرشفة" : "Archived"), color: STATUS_COLORS.archived },
              }}
              className="mx-auto h-[260px] w-full max-w-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={localizedGameStatus}
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
  );
}
