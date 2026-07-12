import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionTitle } from "./TrafficCharts"

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
  return (
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
  );
}
