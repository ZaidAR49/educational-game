"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
import { Trophy, CheckCircle, Percent } from "lucide-react"

interface DashboardChartsProps {
  scoreDistribution: { bracket: string; count: number }[]
  accuracyData: { name: string; value: number }[]
  completionData: { name: string; value: number }[]
}

const ACCURACY_COLORS = ["#10b981", "#ef4444"] // Green for correct, Red for wrong
const COMPLETION_COLORS = ["#6366f1", "#f59e0b"] // Indigo for completed, Amber for unfinished

export default function DashboardCharts({
  scoreDistribution,
  accuracyData,
  completionData,
}: DashboardChartsProps) {
  const totalScorePlayers = scoreDistribution.reduce((sum, item) => sum + item.count, 0)
  const totalAnswers = accuracyData.reduce((sum, item) => sum + item.value, 0)
  const totalStarts = completionData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Score Distribution (Bar Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">توزيع درجات الطلاب</CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              عدد الطلاب الحاصلين على نسب درجات محددة
            </CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalScorePlayers > 0 ? (
            <ChartContainer
              config={{
                count: { label: "الطلاب", color: "#6366f1" },
              }}
              className="h-[220px] w-full"
            >
              <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bracket" tickLine={false} axisLine={false} tickMargin={8} className="text-xs text-gray-500 font-bold" />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs text-gray-500" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center text-center text-gray-400">
              <Trophy className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">لا توجد بيانات درجات للطلاب بعد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Answer Accuracy Rate (Donut Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">دقة إجابات الطلاب</CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              نسبة الإجابات الصحيحة مقابل الخاطئة
            </CardDescription>
          </div>
          <Percent className="h-5 w-5 text-emerald-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalAnswers > 0 ? (
            <ChartContainer
              config={{
                correct: { label: "إجابات صحيحة", color: "#10b981" },
                wrong: { label: "إجابات خاطئة", color: "#ef4444" },
              }}
              className="mx-auto h-[220px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={accuracyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {accuracyData.map((_, i) => (
                    <Cell key={i} fill={ACCURACY_COLORS[i % ACCURACY_COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center text-center text-gray-400">
              <Percent className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">لا توجد إجابات مسجلة بعد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Session Completion & Drop-out (Radial/Pie Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">معدل إكمال الألعاب</CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              نسبة الطلاب الذين أكملوا اللعب للنهاية
            </CardDescription>
          </div>
          <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalStarts > 0 ? (
            <ChartContainer
              config={{
                completed: { label: "أكملوا اللعب", color: "#6366f1" },
                unfinished: { label: "لم يكملوا اللعب", color: "#f59e0b" },
              }}
              className="mx-auto h-[220px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={completionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={85}
                  paddingAngle={0}
                >
                  {completionData.map((_, i) => (
                    <Cell key={i} fill={COMPLETION_COLORS[i % COMPLETION_COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center text-center text-gray-400">
              <CheckCircle className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">لا توجد جلسات لعب مسجلة بعد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
