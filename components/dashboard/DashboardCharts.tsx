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
import { useLocale } from "@/lib/i18n/LanguageContext"

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
  const { t, isRTL } = useLocale()
  const c = t.dashboardCharts

  const totalScorePlayers = scoreDistribution.reduce((sum, item) => sum + item.count, 0)
  const totalAnswers = accuracyData.reduce((sum, item) => sum + item.value, 0)
  const totalStarts = completionData.reduce((sum, item) => sum + item.value, 0)

  const localizedAccuracyData = accuracyData.map(item => ({
    ...item,
    name: item.name === "إجابات صحيحة" 
      ? (c?.correctAnswers || (isRTL ? "إجابات صحيحة" : "Correct answers")) 
      : (c?.wrongAnswers || (isRTL ? "إجابات خاطئة" : "Incorrect answers"))
  }))

  const localizedCompletionData = completionData.map(item => ({
    ...item,
    name: item.name === "أكملوا اللعب" 
      ? (c?.completed || (isRTL ? "أكملوا اللعب" : "Completed")) 
      : (c?.unfinished || (isRTL ? "لم يكملوا اللعب" : "Unfinished"))
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Score Distribution (Bar Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {c?.scoreDistributionTitle || (isRTL ? "توزيع درجات الطلاب" : "Student Score Distribution")}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              {c?.scoreDistributionDesc || (isRTL ? "عدد الطلاب الحاصلين على نسب درجات محددة" : "Number of students scoring in specific brackets")}
            </CardDescription>
          </div>
          <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalScorePlayers > 0 ? (
            <ChartContainer
              config={{
                count: { label: c?.studentsLabel || (isRTL ? "الطلاب" : "Students"), color: "#6366f1" },
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
              <p className="text-sm font-medium">
                {c?.noScoresYet || (isRTL ? "لا توجد بيانات درجات للطلاب بعد" : "No student score data yet")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Answer Accuracy Rate (Donut Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {c?.accuracyTitle || (isRTL ? "دقة إجابات الطلاب" : "Student Answer Accuracy")}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              {c?.accuracyDesc || (isRTL ? "نسبة الإجابات الصحيحة مقابل الخاطئة" : "Percentage of correct vs incorrect answers")}
            </CardDescription>
          </div>
          <Percent className="h-5 w-5 text-emerald-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalAnswers > 0 ? (
            <ChartContainer
              config={{
                correct: { label: c?.correctAnswers || (isRTL ? "إجابات صحيحة" : "Correct answers"), color: "#10b981" },
                wrong: { label: c?.wrongAnswers || (isRTL ? "إجابات خاطئة" : "Incorrect answers"), color: "#ef4444" },
              }}
              className="mx-auto h-[220px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={localizedAccuracyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {localizedAccuracyData.map((_, i) => (
                    <Cell key={i} fill={ACCURACY_COLORS[i % ACCURACY_COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center text-center text-gray-400">
              <Percent className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">
                {c?.noAnswersYet || (isRTL ? "لا توجد إجابات مسجلة بعد" : "No recorded answers yet")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Session Completion & Drop-out (Radial/Pie Chart) */}
      <Card className="rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {c?.completionTitle || (isRTL ? "معدل إكمال الألعاب" : "Game Completion Rate")}
            </CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500">
              {c?.completionDesc || (isRTL ? "نسبة الطلاب الذين أكملوا اللعب للنهاية" : "Percentage of students who finished the game")}
            </CardDescription>
          </div>
          <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0" />
        </CardHeader>
        <CardContent className="pt-4">
          {totalStarts > 0 ? (
            <ChartContainer
              config={{
                completed: { label: c?.completed || (isRTL ? "أكملوا اللعب" : "Completed"), color: "#6366f1" },
                unfinished: { label: c?.unfinished || (isRTL ? "لم يكملوا اللعب" : "Unfinished"), color: "#f59e0b" },
              }}
              className="mx-auto h-[220px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={localizedCompletionData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={0}
                  outerRadius={85}
                  paddingAngle={0}
                >
                  {localizedCompletionData.map((_, i) => (
                    <Cell key={i} fill={COMPLETION_COLORS[i % COMPLETION_COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[220px] flex-col items-center justify-center text-center text-gray-400">
              <CheckCircle className="mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm font-medium">
                {c?.noSessionsYet || (isRTL ? "لا توجد جلسات لعب مسجلة بعد" : "No play sessions recorded yet")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
