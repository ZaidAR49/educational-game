"use client"

import { Globe, ChevronDown, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LOCALE_LABELS, type Locale } from "@/lib/i18n"

const LOCALES = Object.keys(LOCALE_LABELS) as Locale[]

export function LanguageDropdown({ 
  compact = false,
  variant = "default" 
}: { 
  compact?: boolean
  variant?: "default" | "glass" | "subtle" | "compact"
}) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isCompact = compact || variant === "compact"

  const buttonClasses = (() => {
    if (isCompact) {
      return "px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs"
    }
    if (variant === "glass") {
      return "px-3.5 py-2 bg-white/90 hover:bg-white text-gray-700 shadow-sm border border-gray-200/80 backdrop-blur-md text-sm"
    }
    return "px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
  })()

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 ${buttonClasses}`}
        aria-expanded={open}
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{LOCALE_LABELS[locale]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className={`absolute z-[100] mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[140px] animate-in fade-in zoom-in-95 duration-150 ${
            isCompact ? "start-0" : "end-0"
          }`}
        >
          {LOCALES.map((loc) => {
            const isActive = locale === loc
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocale(loc)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{LOCALE_LABELS[loc]}</span>
                {isActive && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
