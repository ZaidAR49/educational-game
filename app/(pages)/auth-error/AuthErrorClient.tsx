"use client"

import Link from "next/link"
import { AlertCircle, ArrowRight, Home } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"

export function AuthErrorClient({ error }: { error?: string }) {
  const { messages: t } = useLocale()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.authError.backToHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden pt-12 sm:pt-0">
        <div className="bg-orange-50 p-8 flex flex-col items-center justify-center border-b border-orange-100">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">
            {t.authError.title}
          </h1>
          <p className="text-gray-600 text-center text-sm max-w-xs leading-relaxed">
            {error === "Configuration"
              ? t.authError.configError
              : t.authError.generalError}
          </p>
        </div>

        <div className="p-8 space-y-6 text-center">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md"
          >
            <span>{t.authError.tryAgain}</span>
          </Link>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              <span>{t.authError.backToHome}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
