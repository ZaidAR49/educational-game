export const dynamic = "force-dynamic"
export const revalidate = 0

import { Suspense } from "react"
import { AnalyticsHeader } from "@/components/admin/analytics/AnalyticsHeader"
import {
  KpisSection,
  AiUsageSection,
  EventSummarySection,
  TrafficChartsSection,
  TeacherActivityChartsSection,
  PlayerJourneyChartsSection,
  ErrorTrackingChartsSection,
} from "@/components/admin/analytics/Sections"

import {
  KpisSkeleton,
  AiUsageSkeleton,
  EventsSummarySkeleton,
  ChartsGridSkeleton,
} from "@/components/admin/analytics/Skeletons"

export default function AnalyticsPage() {
  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <AnalyticsHeader />

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
