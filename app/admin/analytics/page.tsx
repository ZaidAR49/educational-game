export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"
import {
  KpisSection,
  AiUsageSection,
  EventSummarySection,
  TrafficChartsSection,
  TeacherActivityChartsSection,
  PlayerJourneyChartsSection,
  ErrorTrackingChartsSection,
} from "./Sections"

import {
  KpisSkeleton,
  AiUsageSkeleton,
  EventsSummarySkeleton,
  ChartsGridSkeleton,
} from "./Skeletons"

export default function AnalyticsPage() {
  return (
    <div className="space-y-10 pb-12 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">لوحة تحكم التحليلات</h2>
        <p className="mt-1 text-slate-500">نظرة شاملة على أداء المنصة وأحداث PostHog خلال آخر 30 يوماً</p>
      </div>

      {/* Platform KPIs */}
      <Suspense fallback={<KpisSkeleton />}>
        <KpisSection />
      </Suspense>

      {/* AI Token Usage Platform-wide */}
      <Suspense fallback={<AiUsageSkeleton />}>
        <AiUsageSection />
      </Suspense>

      {/* All PostHog Events Summary */}
      <Suspense fallback={<EventsSummarySkeleton />}>
        <EventSummarySection />
      </Suspense>

      {/* Traffic Charts */}
      <Suspense fallback={<ChartsGridSkeleton count={3} />}>
        <TrafficChartsSection />
      </Suspense>

      {/* Teacher Activity */}
      <Suspense fallback={<ChartsGridSkeleton count={2} />}>
        <TeacherActivityChartsSection />
      </Suspense>

      {/* Player Journey */}
      <Suspense fallback={<ChartsGridSkeleton count={2} />}>
        <PlayerJourneyChartsSection />
      </Suspense>

      {/* Error Tracking */}
      <Suspense fallback={<ChartsGridSkeleton count={2} />}>
        <ErrorTrackingChartsSection />
      </Suspense>
    </div>
  )
}
