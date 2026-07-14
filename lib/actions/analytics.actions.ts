"use server";

export {
  getTrafficOverviewAction,
  getUniqueVisitorsPerDayAction,
  getVisitsPerDayAction,
  getDeviceTypeBreakdownAction,
  getSessionDurationPerDayAction,
  getErrorsPerDayAction,
  getErrorBreakdownAction,
  getGeoVisitsAction
} from "./analytics/traffic.actions";

export {
  getAllEventsSummaryAction,
  getEventsTrendAction,
  getTeacherActivityTrendAction,
  getPlayerJourneyTrendAction,
  getPlayerFunnelAction
} from "./analytics/events.actions";

export {
  getAdminKpiAction,
  getGameStatusBreakdownAction,
  getPlatformAiUsageAction
} from "./analytics/kpi.actions";
