import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

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
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-gray-500 font-bold mb-6">المعاينة المباشرة</h3>
      
      {/* Phone Mockup Frame */}
      <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden">
        
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
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
                      {institutionName || "اسم المؤسسة"}
                    </span>
                  </div>

                  {/* Main Title & Subtitle */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-emerald-700 mb-2 leading-tight">
                      {mainTitle || "اختبر معلوماتك"}
                    </h1>
                    <p className="text-gray-500 font-medium text-sm">
                      {subtitle || "لعبة تفاعلية تعليمية للجميع"}
                    </p>
                  </div>

                  {/* Welcome Box */}
                  <div className="bg-emerald-50 rounded-3xl p-6 text-center border border-emerald-100 shadow-sm mb-auto">
                    <div className="mb-4">
                      <span className="text-2xl">{icon || "👋"}</span>
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-line text-sm">
                      {welcomeMessage || "مرحباً بك!\n\nستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة.\n\nاختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!\n\nهل أنت مستعد لاختبار معلوماتك؟"}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex flex-col gap-6">
                    <button className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-emerald-600/30">
                      {buttonText || "ابدأ الاختبار 🚀"}
                    </button>
                    
                    {/* Decorative Stars */}
                    <div className="flex justify-center items-center gap-4 text-amber-400">
                      <span className="text-xl">⭐</span>
                      <span className="text-2xl">☀️</span>
                      <span className="text-xl">✨</span>
                    </div>
                    
                    {/* Back Link */}
                    <button className="text-gray-400 text-xs font-bold mt-2">
                      العودة للرئيسية
                    </button>
                  </div>
                </motion.div>
              )}

              {previewMode === "result" && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full gap-4 pt-2"
                >
                  {/* Preview Toggle */}
                  <div className="flex justify-center mb-2">
                    <div className="bg-gray-100 rounded-lg p-1 flex text-[10px] font-bold">
                      <button 
                        onClick={() => onResultPreviewStateChange?.("pass")}
                        className={`px-3 py-1 rounded-md ${resultPreviewState === "pass" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
                      >
                        نجاح
                      </button>
                      <button 
                        onClick={() => onResultPreviewStateChange?.("fail")}
                        className={`px-3 py-1 rounded-md ${resultPreviewState === "fail" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"}`}
                      >
                        رسوب
                      </button>
                    </div>
                  </div>

                  {/* Result Header icon */}
                  <div className="text-center">
                    <span className="text-5xl">{resultPreviewState === "pass" ? "🏆" : "🌱"}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="text-center mb-2">
                    <h1 className={`text-2xl font-black mb-1 leading-tight ${resultPreviewState === "pass" ? "text-emerald-600" : "text-amber-600"}`}>
                      {resultPreviewState === "pass" ? (resultTitlePass || "ممتاز!") : (resultTitleFail || "لا بأس، استمر!")}
                    </h1>
                    <p className="text-gray-500 font-medium text-xs">
                      {resultPreviewState === "pass" ? (resultSubtitlePass || "لقد أثبتّ جدارتك!") : (resultSubtitleFail || "كل محاولة تعلّم جديد!")}
                    </p>
                  </div>

                  {/* Score Box */}
                  <div className={`${resultPreviewState === "pass" ? "bg-emerald-600" : "bg-amber-500"} text-white rounded-2xl p-4 text-center shadow-md`}>
                    <div className="text-xs font-bold mb-1 opacity-90">نتيجتك النهائية</div>
                    <div className="flex items-baseline justify-center gap-1 dir-ltr">
                      <span className="text-3xl font-black tracking-tighter">{resultPreviewState === "pass" ? "100" : "10"}</span>
                      <span className="text-lg opacity-80">/ 110 نقطة</span>
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className={`bg-gray-50 text-gray-800 rounded-xl p-3 text-center text-xs font-bold leading-relaxed shadow-sm border ${resultPreviewState === "pass" ? "border-emerald-200" : "border-amber-200"}`}>
                    {resultPreviewState === "pass" ? "🌟 " : "📚 "} 
                    {resultPreviewState === "pass" ? (resultMessagePass || "أحسنت صنعاً! لقد أتممت الاختبار بنجاح مبهر.") : (resultMessageFail || "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!")}
                  </div>

                  {/* Org Message Box */}
                  <div className="border-2 border-emerald-400 bg-emerald-50/50 rounded-2xl p-4 text-center mt-2 shadow-sm relative">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 mx-auto mb-3 flex items-center justify-center overflow-hidden shadow-sm relative">
                      {logo ? (
                        <Image src={logo} alt="Logo" fill className="object-contain p-0.5" />
                      ) : (
                        <span className="text-xs text-gray-300 font-bold">شعار</span>
                      )}
                    </div>
                    <h3 className="text-emerald-700 font-bold text-sm mb-2">رسالة من {institutionName || "المؤسسة"}</h3>
                    <p className="text-gray-600 text-[10px] leading-relaxed font-medium">
                      {orgMessage || "أحسنت على مشاركتك! كل سؤال هو فرصة جديدة للتعلم والنمو. استمر في تطوير معلوماتك ومهاراتك، ونحن واثقون من قدراتك! 🌟"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <button className="w-full bg-emerald-600 text-white rounded-xl py-3 font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2">
                      <span>{resultPrimaryButtonText || "العب مرة أخرى 🔄"}</span>
                    </button>
                    <button className="w-full bg-white text-emerald-600 border-2 border-emerald-500 rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2">
                      <span>{resultSecondaryButtonText || "شارك نتيجتك 📊"}</span>
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
