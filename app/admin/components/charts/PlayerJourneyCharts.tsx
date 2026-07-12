import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionTitle } from "./TrafficCharts"

function formatDateTick(value: string) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

interface PlayerJourneyChartsProps {
  playerJourney: any[];
  playerFunnel: any[];
  playerChartConfig: any;
}

export function PlayerJourneyCharts({
  playerJourney,
  playerFunnel,
  playerChartConfig
}: PlayerJourneyChartsProps) {
  return (
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
  );
}
