import { AnalyticsClient } from "./AnalyticsClient"
import {
  getAdminKpiAction,
  getTrafficOverviewAction,
  getAllEventsSummaryAction,
  getGameStatusBreakdownAction,
  getVisitsPerDayAction,
  getGeoVisitsAction,
  getUniqueVisitorsPerDayAction,
  getDeviceTypeBreakdownAction,
  getSessionDurationPerDayAction,
  getErrorsPerDayAction,
  getErrorBreakdownAction,
  getTeacherActivityTrendAction,
  getPlayerJourneyTrendAction,
  getPlayerFunnelAction,
} from "@/lib/actions/analytics.actions"

export default async function AdminPage() {
  const [
    kpis,
    traffic,
    eventSummary,
    gameStatus,
    visits,
    uniqueVisitors,
    deviceTypes,
    sessionDuration,
    errorsPerDay,
    errorBreakdown,
    teacherActivity,
    playerJourney,
    playerFunnel,
    geoVisits,
  ] = await Promise.all([
    getAdminKpiAction(),
    getTrafficOverviewAction(),
    getAllEventsSummaryAction(),
    getGameStatusBreakdownAction(),
    getVisitsPerDayAction(),
    getUniqueVisitorsPerDayAction(),
    getDeviceTypeBreakdownAction(),
    getSessionDurationPerDayAction(),
    getErrorsPerDayAction(),
    getErrorBreakdownAction(),
    getTeacherActivityTrendAction(),
    getPlayerJourneyTrendAction(),
    getPlayerFunnelAction(),
    getGeoVisitsAction(),
  ])

  return (
    <AnalyticsClient
      kpis={kpis}
      traffic={traffic}
      eventSummary={eventSummary}
      gameStatus={gameStatus}
      visits={visits}
      uniqueVisitors={uniqueVisitors}
      deviceTypes={deviceTypes}
      sessionDuration={sessionDuration}
      errorsPerDay={errorsPerDay}
      errorBreakdown={errorBreakdown}
      teacherActivity={teacherActivity}
      playerJourney={playerJourney}
      playerFunnel={playerFunnel}
      geoVisits={geoVisits}
    />
  )
}
