"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertOctagon, RotateCcw, Home } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { messages: t } = useLocale()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-12 relative">
      {/* Top Floating Bar */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.errorPage.backHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden pt-12 sm:pt-10">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="flex justify-center relative">
          <div className="w-24 h-24 bg-red-50 rounded-[1.5rem] flex items-center justify-center border-4 border-red-100 relative shadow-inner">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse rounded-[1.25rem]"></div>
            <AlertOctagon className="w-12 h-12 text-red-500 relative z-10 drop-shadow-sm" />
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {t.errorPage.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {t.errorPage.description}
          </p>
        </div>

        <div className="pt-6 relative z-10 space-y-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.errorPage.tryAgain}</span>
          </button>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>{t.errorPage.backHome}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
