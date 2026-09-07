"use client"

import { useLocale } from "@/lib/i18n/LanguageContext"

type StartScreenProps = {
  game: any
  playerName: string
  gameStart?: any
  onStartGame: () => void
}

export function StartScreen({
  game,
  playerName,
  gameStart,
  onStartGame,
}: StartScreenProps) {
  const { messages: t } = useLocale()
  const intro = game.organization?.introduction

  const title = game.isDemo
    ? t.game.demo.title
    : intro?.title || game.title
  const subtitle = game.isDemo
    ? t.game.demo.description
    : intro?.subtitle || game.description || t.game.start.defaultSubtitle

  // Use localized welcome text and button label
  const welcomeText = game.isDemo
    ? t.game.start.welcomeBox
    : intro?.welcome_box?.description || t.game.start.welcomeBox

  const buttonLabel = game.isDemo
    ? t.game.start.startButton
    : intro?.button_text || t.game.start.startButton

  const emojis = intro?.decorative_emojis || ["⭐", "🌟", "✨"]
  const icon = emojis[0] || "👋"

  const greeting = t.game.start.greeting.replace("{playerName}", playerName)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl text-center animate-in fade-in duration-500">
      {game.organization?.logoPath && (
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <img
            src={game.organization.logoPath}
            alt="Logo"
            className="w-full h-full border-2 border-black rounded-full object-contain"
          />
        </div>
      )}
      <h1 className="text-2xl font-black text-emerald-600 mb-2">
        {title}
      </h1>
      <p className="text-gray-500 mb-2 font-bold">{subtitle}</p>
      <p className="text-emerald-600 mb-6 font-bold text-sm">{greeting}</p>

      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-4 mb-6 text-start">
        <div className="mb-4 text-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-line text-center text-sm">
          {welcomeText}
        </p>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
      >
        {buttonLabel}
      </button>

      <div className="flex justify-center gap-4 mt-6">
        <span className="text-xl animate-pulse">{emojis[1] || "⭐"}</span>
        <span className="text-xl animate-pulse" style={{ animationDelay: "0.3s" }}>
          {emojis[2] || "☀️"}
        </span>
        <span className="text-xl animate-pulse" style={{ animationDelay: "0.6s" }}>
          {emojis[0] || "✨"}
        </span>
      </div>
    </div>
  )
}
