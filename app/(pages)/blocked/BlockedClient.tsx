"use client"

import Link from "next/link"
import { Ban, ShieldAlert, ArrowRight, Home } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"

export function BlockedClient({ supportEmail }: { supportEmail: string }) {
  const { messages: t } = useLocale()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Top Floating Bar */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.blocked.backHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden pt-12 sm:pt-0">
        <div className="bg-red-50 p-8 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 relative">
            <ShieldAlert className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">
            {t.blocked.title}
          </h1>
          <p className="text-gray-600 text-center text-sm max-w-xs leading-relaxed">
            {t.blocked.description}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-start">
            <h3 className="font-bold text-gray-900 mb-1">
              {t.blocked.whatDoesThisMean}
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>{t.blocked.item1}</li>
              <li>{t.blocked.item2}</li>
              <li>{t.blocked.item3}</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href={`mailto:${supportEmail}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              <span>{t.blocked.contactSupport}</span>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>{t.blocked.backHome}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
