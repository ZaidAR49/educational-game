"use client"

import { useLocale } from "@/lib/i18n/LanguageContext"

export function AnalyticsHeader() {
  const { isRTL } = useLocale()

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        {isRTL ? "لوحة تحكم التحليلات" : "Analytics Dashboard"}
      </h2>
      <p className="mt-1 text-slate-500">
        {isRTL ? "نظرة شاملة على أداء المنصة وأحداث PostHog خلال آخر 30 يوماً" : "Comprehensive platform performance overview over the last 30 days"}
      </p>
    </div>
  )
}
