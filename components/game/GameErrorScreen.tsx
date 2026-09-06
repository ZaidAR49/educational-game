"use client"

import { useLocale } from "@/lib/i18n/LanguageContext"
import { LanguageDropdown } from "@/components/shared/LanguageDropdown"
import Link from "next/link"
import { Home } from "lucide-react"

export function GameErrorScreen({ error }: { error?: string }) {
  const { messages: t } = useLocale()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative">
      <div className="fixed top-4 inset-x-4 sm:inset-x-8 max-w-5xl mx-auto flex items-center justify-between pointer-events-none z-40">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-gray-200/80 backdrop-blur-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{t.game.backToHome}</span>
        </Link>
        <div className="pointer-events-auto">
          <LanguageDropdown variant="glass" />
        </div>
      </div>

      <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.game.cannotJoinTitle}
        </h1>
        <p className="text-gray-500 leading-relaxed">
          {error || t.game.cannotJoinDesc}
        </p>
      </div>
    </div>
  )
}
