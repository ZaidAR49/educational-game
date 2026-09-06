"use client"

import { useLocale } from "@/lib/i18n/LanguageContext"

export function AdminAccountsHeader() {
  const { t } = useLocale()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t.adminNav.pageTitleAccounts}</h2>
        <p className="text-slate-500 mt-1">{t.adminNav.pageSubtitleAccounts}</p>
      </div>
    </div>
  )
}
