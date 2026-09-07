"use client"

import Link from "next/link"
import { Home, Compass } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"

export function NotFoundClient() {
  const { messages: t } = useLocale()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 relative">
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.notFound.backHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="max-w-md w-full text-center space-y-8 pt-12 sm:pt-0">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-200/40 blur-3xl rounded-full scale-150 -z-10"></div>
          <div className="relative flex justify-center">
            <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center rotate-[15deg] hover:rotate-0 transition-all duration-500 ease-out group">
              <Compass className="w-14 h-14 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black text-gray-900 tracking-tighter drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            {t.notFound.title}
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
            {t.notFound.description}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <Home className="w-5 h-5" />
            <span>{t.notFound.backHome}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
