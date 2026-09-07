"use client"

import { Loader2 } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export default function Loading() {
  const { messages: t, isRTL } = useLocale()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm z-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl animate-pulse opacity-40"></div>
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin relative z-10" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-gray-900 font-bold text-base animate-pulse">
            {t?.common?.loading || (isRTL ? "جاري التحميل" : "Loading")}
          </p>
          <p className="text-gray-400 text-sm">
            {t?.common?.pleaseWait || (isRTL ? "يرجى الانتظار قليلاً..." : "Please wait a moment...")}
          </p>
        </div>
      </div>
    </div>
  )
}
