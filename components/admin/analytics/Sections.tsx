import {
  getAdminKpiAction,
  getPlatformAiUsageAction,
  getGameStatusBreakdownAction,
} from "@/lib/actions/analytics/kpi.actions"

import {
  getAllEventsSummaryAction,
  getTeacherActivityTrendAction,
  getPlayerJourneyTrendAction,
  getPlayerFunnelAction,
} from "@/lib/actions/analytics/events.actions"

import {
  getTrafficOverviewAction,
  getVisitsPerDayAction,
  getUniqueVisitorsPerDayAction,
  getDeviceTypeBreakdownAction,
  getSessionDurationPerDayAction,
  getGeoVisitsAction,
  getErrorsPerDayAction,
  getErrorBreakdownAction,
} from "@/lib/actions/analytics/traffic.actions"

import { TrafficCharts } from "../charts/TrafficCharts"
import { ErrorTrackingCharts } from "../charts/ErrorTrackingCharts"
import {
  KpisClient,
  AiUsageClient,
  EventSummaryClient,
  TeacherActivitySectionClient,
  PlayerJourneySectionClient,
} from "./AnalyticsSectionsClient"

export async function KpisSection() {
  const kpis = await getAdminKpiAction()
  return <KpisClient kpis={kpis} />
}

export async function AiUsageSection() {
  const usage = await getPlatformAiUsageAction()
  return <AiUsageClient usage={usage} />
}

export async function EventSummarySection() {
  const eventSummary = await getAllEventsSummaryAction()
  return <EventSummaryClient eventSummary={eventSummary} />
}

export async function TrafficChartsSection() {
  const [traffic, visits, uniqueVisitors, deviceTypes, sessionDuration, geoVisits] = await Promise.all([
    getTrafficOverviewAction(),
    getVisitsPerDayAction(),
    getUniqueVisitorsPerDayAction(),
    getDeviceTypeBreakdownAction(),
    getSessionDurationPerDayAction(),
    getGeoVisitsAction(),
  ])

  return (
    <TrafficCharts
      traffic={traffic}
      visits={visits}
      uniqueVisitors={uniqueVisitors}
      deviceTypes={deviceTypes}
      sessionDuration={sessionDuration}
      geoVisits={geoVisits}
    />
  )
}

export async function TeacherActivityChartsSection() {
  const [teacherActivity, gameStatus] = await Promise.all([
    getTeacherActivityTrendAction(),
    getGameStatusBreakdownAction(),
  ])

  return (
    <TeacherActivitySectionClient
      teacherActivity={teacherActivity}
      gameStatus={gameStatus}
    />
  )
}

export async function PlayerJourneyChartsSection() {
  const [playerJourney, playerFunnel] = await Promise.all([
    getPlayerJourneyTrendAction(),
    getPlayerFunnelAction(),
  ])

  return (
    <PlayerJourneySectionClient
      playerJourney={playerJourney}
      playerFunnel={playerFunnel}
    />
  )
}

export async function ErrorTrackingChartsSection() {
  const [traffic, errorsPerDay, errorBreakdown] = await Promise.all([
    getTrafficOverviewAction(),
    getErrorsPerDayAction(),
    getErrorBreakdownAction(),
  ])

  return (
    <ErrorTrackingCharts
      totalErrors={traffic.totalErrors}
      errorsPerDay={errorsPerDay}
      errorBreakdown={errorBreakdown}
    />
  )
}
