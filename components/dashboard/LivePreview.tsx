"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface LivePreviewProps {
  previewMode: "welcome" | "result"
  institutionName: string
  logo?: string | null
  mainTitle: string
  subtitle: string
  welcomeMessage: string
  buttonText: string
  icon: string
  // Result screen props
  resultTitlePass: string
  resultSubtitlePass: string
  resultMessagePass: string
  resultTitleFail: string
  resultSubtitleFail: string
  resultMessageFail: string
  orgMessage: string
  resultPrimaryButtonText: string
  resultSecondaryButtonText: string
  resultPreviewState?: "pass" | "fail"
  onResultPreviewStateChange?: (state: "pass" | "fail") => void
}

export function LivePreview({
  previewMode,
  institutionName,
  logo,
  mainTitle,
  subtitle,
  welcomeMessage,
  buttonText,
  icon,
  resultTitlePass,
  resultSubtitlePass,
  resultMessagePass,
  resultTitleFail,
  resultSubtitleFail,
  resultMessageFail,
  orgMessage,
  resultPrimaryButtonText,
  resultSecondaryButtonText,
  resultPreviewState = "pass",
  onResultPreviewStateChange,
}: LivePreviewProps) {
  const { t, locale, isRTL } = useLocale()
  const o = t.orgForm

  const defaultWelcomeMsg = locale === 'ar'
    ? "مرحباً بك!\n\nستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة.\n\nاختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!\n\nهل أنت مستعد لاختبار معلوماتك؟"
    : "Welcome!\n\nIn this quiz, you will face various engaging questions.\n\nChoose the correct answer in each question to earn the highest score!\n\nAre you ready to test your knowledge?"

  const defaultOrgMsg = locale === 'ar'
    ? "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟"
    : "Well done on participating! Every question is a new opportunity to learn and grow. Keep expanding your knowledge! 🌟"

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-gray-500 font-bold mb-6">{o.livePreviewTitle}</h3>
      
      {/* Phone Mockup Frame */}
      <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
        
        {/* Screen */}
        <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col pt-10">
          
          {/* Notch / Dynamic Island */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-3xl w-40 mx-auto z-10" />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col">
            
            <AnimatePresence mode="wait">
              {previewMode === "welcome" && (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="text-center mb-6 pt-4 flex flex-col items-center justify-center gap-2">
                    {logo && (
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white">
                        <Image src={logo} alt="Logo" fill className="object-contain p-1" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-500">
                      {institutionName || (locale === 'ar' ? "اسم المؤسسة" : "Organization Name")}
                    </span>
                  </div>

                  {/* Main Title & Subtitle */}
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-emerald-700 mb-2 leading-tight">
                      {mainTitle || (locale === 'ar' ? "اختبر معلوماتك" : "Test Your Knowledge")}
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                      {subtitle || (locale === 'ar' ? "لعبة تفاعلية تعليمية للجميع" : "Interactive educational game for everyone")}
                    </p>
                  </div>

                  {/* Welcome Box */}
                  <div className="bg-emerald-50 rounded-3xl p-5 text-center border border-emerald-100 shadow-sm mb-auto">
                    <div className="mb-4">
                      <span className="text-xl">{icon || "👋"}</span>
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-line text-sm">
                      {welcomeMessage || defaultWelcomeMsg}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex flex-col gap-6">
                    <button type="button" className="w-full bg-emerald-600 text-white rounded-2xl py-3 font-bold text-base shadow-lg shadow-emerald-600/30">
                      {buttonText || (locale === 'ar' ? "ابدأ الاختبار 🚀" : "Start Quiz 🚀")}
                    </button>
                    
                    {/* Decorative Stars */}
                    <div className="flex justify-center items-center gap-4 text-amber-400">
                      <span className="text-xl">⭐</span>
                      <span className="text-2xl">☀️</span>
                      <span className="text-xl">✨</span>
                    </div>
                    
                    {/* Back Link */}
                    <button type="button" className="text-gray-400 text-xs font-bold mt-2">
                      {locale === 'ar' ? "العودة للرئيسية" : "Back to Home"}
                    </button>
                  </div>
                </motion.div>
              )}

              {previewMode === "result" && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                  className="flex flex-col h-full gap-4 pt-2"
                >
                  {/* Preview Toggle */}
                  <div className="flex justify-center mb-2">
                    <div className="bg-gray-100 rounded-lg p-1 flex text-[10px] font-bold">
                      <button 
                        type="button"
                        onClick={() => onResultPreviewStateChange?.("pass")}
                        className={`px-3 py-1 rounded-md ${resultPreviewState === "pass" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
                      >
                        {locale === 'ar' ? "نجاح" : "Pass"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => onResultPreviewStateChange?.("fail")}
                        className={`px-3 py-1 rounded-md ${resultPreviewState === "fail" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"}`}
                      >
                        {locale === 'ar' ? "رسوب" : "Retry"}
                      </button>
                    </div>
                  </div>

                  {/* Result Header icon */}
                  <div className="text-center">
                    <span className="text-4xl">{resultPreviewState === "pass" ? "🏆" : "🌱"}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="text-center mb-2">
                    <h1 className={`text-2xl font-black mb-1 leading-tight ${resultPreviewState === "pass" ? "text-emerald-600" : "text-amber-600"}`}>
                      {resultPreviewState === "pass" 
                        ? (resultTitlePass || (locale === 'ar' ? "ممتاز!" : "Excellent!")) 
                        : (resultTitleFail || (locale === 'ar' ? "لا بأس، استمر!" : "Keep Going!"))}
                    </h1>
                    <p className="text-gray-500 font-medium text-xs">
                      {resultPreviewState === "pass" 
                        ? (resultSubtitlePass || (locale === 'ar' ? "لقد أثبتّ جدارتك!" : "You proved yourself!")) 
                        : (resultSubtitleFail || (locale === 'ar' ? "كل محاولة تعلّم جديد!" : "Every attempt is learning!"))}
                    </p>
                  </div>

                  {/* Score Box */}
                  <div className={`${resultPreviewState === "pass" ? "bg-emerald-600" : "bg-amber-500"} text-white rounded-2xl p-4 text-center shadow-md`}>
                    <div className="text-xs font-bold mb-1 opacity-90">{locale === 'ar' ? "نتيجتك النهائية" : "Your Final Score"}</div>
                    <div className="flex items-baseline justify-center gap-1" dir="ltr">
                      <span className="text-3xl font-black tracking-tighter">{resultPreviewState === "pass" ? "100" : "10"}</span>
                      <span className="text-lg opacity-80">/ 110 {locale === 'ar' ? "نقطة" : "pts"}</span>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className={`bg-gray-50 text-gray-800 rounded-xl p-3 text-center text-xs font-bold leading-relaxed shadow-sm border ${resultPreviewState === "pass" ? "border-emerald-200" : "border-amber-200"}`}>
                    {resultPreviewState === "pass" ? "🌟 " : "📚 "} 
                    {resultPreviewState === "pass" 
                      ? (resultMessagePass || (locale === 'ar' ? "أحسنت صنعاً! لقد أتممت الاختبار بنجاح مبهر." : "Well done! You passed the quiz with flying colors.")) 
                      : (resultMessageFail || (locale === 'ar' ? "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!" : "Never give up! Every mistake is a chance to learn. Try again!"))}
                  </div>

                  {/* Org Message Box */}
                  <div className="border-2 border-emerald-400 bg-emerald-50/50 rounded-2xl p-4 text-center mt-2 shadow-sm relative">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-sm relative">
                      {logo ? (
                        <Image src={logo} alt="Logo" fill className="object-contain p-0.5" />
                      ) : (
                        <span className="text-xs text-gray-300 font-bold">{locale === 'ar' ? "شعار" : "Logo"}</span>
                      )}
                    </div>
                    <h3 className="text-emerald-700 font-bold text-sm mb-2">{locale === 'ar' ? `رسالة من ${institutionName || "المؤسسة"}` : `Message from ${institutionName || "Organization"}`}</h3>
                    <p className="text-gray-600 text-[10px] leading-relaxed font-medium">
                      {orgMessage || defaultOrgMsg}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <button type="button" className="w-full bg-emerald-600 text-white rounded-xl py-3 font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2">
                      <span>{resultPrimaryButtonText || (locale === 'ar' ? "العب مرة أخرى 🔄" : "Play Again 🔄")}</span>
                    </button>
                    <button type="button" className="w-full bg-white text-emerald-600 border-2 border-emerald-500 rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2">
                      <span>{resultSecondaryButtonText || (locale === 'ar' ? "شارك نتيجتك 📊" : "Share Score 📊")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </div>
  )
}
