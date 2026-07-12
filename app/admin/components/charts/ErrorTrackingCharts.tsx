import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { SectionTitle } from "./TrafficCharts"

function formatDateTick(value: string) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

interface ErrorTrackingChartsProps {
  totalErrors: number;
  errorsPerDay: any[];
  errorBreakdown: any[];
}

export function ErrorTrackingCharts({
  totalErrors,
  errorsPerDay,
  errorBreakdown
}: ErrorTrackingChartsProps) {
  return (
    <section>
      <SectionTitle title="تتبع الأخطاء" description="أحداث $exception من PostHog" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              أخطاء مسجّلة
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{totalErrors.toLocaleString()}</CardTitle>
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
  );
}
