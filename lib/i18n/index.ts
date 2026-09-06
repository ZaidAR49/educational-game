/**
 * i18n — Core types and message loader
 *
 * Add a new locale by:
 *  1. Adding it to the `Locale` union type below
 *  2. Creating `messages/<locale>.json` with all the same keys
 *
 * Messages are imported statically so they are bundled and never fetched
 * over the network at runtime.
 */

import ar from "@/messages/ar.json"
import en from "@/messages/en.json"

export type Locale = "ar" | "en"

export const DEFAULT_LOCALE: Locale = "ar"

export const LOCALE_STORAGE_KEY = "eduplay_locale"

/** Human-readable labels shown in the language switcher */
export const LOCALE_LABELS: Record<Locale, string> = {
  ar: "عربي",
  en: "English",
}

/** dir attribute for each locale */
export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
}

/** All message bundles, keyed by locale */
const messages = { ar, en } as const

export type Messages = typeof ar

/** Return the message bundle for a given locale */
export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
