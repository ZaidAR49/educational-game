"use client"

/**
 * LanguageContext — provides locale state and toggle to the whole app.
 *
 * Locale priority (highest → lowest):
 *  1. Value stored in localStorage (user's explicit past choice)
 *  2. Browser language (navigator.language)
 *  3. DEFAULT_LOCALE ("ar") — fallback
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getMessages,
  type Locale,
  type Messages,
} from "@/lib/i18n"
import { updateUserLocaleAction } from "@/lib/actions/users.actions"

export interface LanguageContextValue {
  locale: Locale
  messages: Messages
  t: Messages
  isRTL: boolean
  toggleLocale: () => void
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const SUPPORTED_LOCALES: Locale[] = ["ar", "en"]

/** Map a raw browser language tag (e.g. "en-US", "ar-SA") to a supported locale. */
function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE
  // navigator.languages is preferred; fall back to navigator.language
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  for (const lang of candidates) {
    const prefix = lang.split("-")[0].toLowerCase() as Locale
    if (SUPPORTED_LOCALES.includes(prefix)) return prefix
  }
  return DEFAULT_LOCALE
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
      if (stored && SUPPORTED_LOCALES.includes(stored)) {
        if (stored !== locale) {
          setLocaleState(stored)
        }
        document.cookie = `${LOCALE_STORAGE_KEY}=${stored}; path=/; max-age=31536000; SameSite=Lax`
      } else if (initialLocale && SUPPORTED_LOCALES.includes(initialLocale)) {
        localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale)
        document.cookie = `${LOCALE_STORAGE_KEY}=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`
      } else {
        const detected = detectBrowserLocale()
        setLocaleState(detected)
        localStorage.setItem(LOCALE_STORAGE_KEY, detected)
        document.cookie = `${LOCALE_STORAGE_KEY}=${detected}; path=/; max-age=31536000; SameSite=Lax`
      }
    } catch {
      // ignore
    }
  }, [initialLocale])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    }
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
        document.cookie = `${LOCALE_STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      } catch {
        // ignore
      }
    }
    // Update user locale in DB if logged in
    updateUserLocaleAction(newLocale).catch(() => {})
  }, [])

  const toggleLocale = useCallback(() => {
    const idx = SUPPORTED_LOCALES.indexOf(locale)
    setLocale(SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length])
  }, [locale, setLocale])

  const messages = getMessages(locale)
  const isRTL = locale === "ar"

  return (
    <LanguageContext.Provider
      value={{ locale, messages, t: messages, isRTL, toggleLocale, setLocale }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLocale must be used inside <LanguageProvider>")
  return ctx
}
