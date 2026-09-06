"use client"

/**
 * HtmlDirSync — client component that keeps <html lang> and <html dir>
 * in sync with the active locale.
 *
 * The root layout is a Server Component, so we can't set these attributes
 * reactively there.  This component is placed once inside RootLayout and
 * runs a useEffect whenever locale changes.
 */

import { useEffect } from "react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { LOCALE_DIR } from "@/lib/i18n"

export function HtmlDirSync() {
  const { locale } = useLocale()

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute("lang", locale)
    html.setAttribute("dir", LOCALE_DIR[locale])
  }, [locale])

  return null
}
