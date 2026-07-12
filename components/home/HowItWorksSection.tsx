"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Wand2, 
  QrCode, 
  Smartphone, 
  BarChart3, 
  Trophy, 
  Users, 
  Sparkles,
  CheckCircle2,
  ChevronLeft
} from "lucide-react"

const steps = [
  {
    title: "1. صمّم بالذكاء الاصطناعي",
    description: "أدخل عنوان درسك، وسيتكفل المولد الذكي ببناء الأسئلة والخيارات والتعليقات التفسيرية بدقة فائقة في ثوانٍ.",
    icon: Wand2,
    gradient: "from-blue-500 to-indigo-600",
    colorText: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100"
  },
  {
    title: "2. أطلق جلسة مباشرة",
    description: "بنقرة واحدة، أنشئ جلسة لعب نشطة واعرض رمز الاستجابة السريعة (QR) أو انسخ الرابط المباشر لطلابك.",
    icon: QrCode,
    gradient: "from-emerald-500 to-teal-600",
    colorText: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100"
  },
  {
    title: "3. العب وتعلّم فوراً",
    description: "ينضم الطلاب في ثانيتين بمسح الرمز دون تسجيل حساب. يختارون الإجابات ويتلقون تعليقات تعليمية فورية.",
    icon: Smartphone,
    gradient: "from-amber-500 to-orange-600",
    colorText: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100"
  },
  {
    title: "4. حلّل النتائج لحظياً",
    description: "شاهد لوحات التوزيع البياني للدرجات ونسب الدقة مباشرة لتحديد الفجوات المعرفية ومعالجتها فوراً.",
    icon: BarChart3,
    gradient: "from-purple-500 to-pink-600",
    colorText: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100"
  },
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  // Render mock visual depending on active step
  const renderVisual = () => {
    switch(activeStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-slate-900 rounded-[2rem] border border-slate-800 p-6 font-mono text-xs text-slate-300 text-right space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-slate-500 text-[10px]">المساعد الذكي - توليد فوري</span>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block mb-1">موضوع اللعبة المقترح:</span>
                <span className="text-white font-bold text-sm block">أجزاء الزهرة وظيفتها في التكاثر 🌺</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-950/60 relative overflow-hidden space-y-2">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold">
                  <span>تم التوليد بنجاح!</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-white font-bold text-xs truncate">س١: أي جزء في الزهرة ينتج حبوب اللقاح؟</div>
                <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                  <div className="bg-emerald-950/40 border border-emerald-800/40 p-1.5 rounded text-emerald-300">المتك (صحيح) ✅</div>
                  <div className="bg-slate-900 border border-slate-800 p-1.5 rounded">الميسم 📝</div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-white rounded-[2rem] border border-gray-100 p-6 text-right space-y-4 shadow-xl flex flex-col justify-between min-h-[250px]"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-xs font-bold text-gray-800">إطلاق الجلسة المباشرة</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">نشط الآن</span>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              {/* QR representation */}
              <div className="w-24 h-24 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center p-2 relative group">
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-2xl"></div>
                <QrCode className="w-full h-full text-gray-850" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-gray-400 block">رابط الانضمام السريع</span>
                <span className="text-sm font-black text-gray-900 tracking-wider">eduplay.com/play/842-192</span>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>28 طالب في الصف</span>
              </div>
              <span className="text-gray-450 font-bold">جلسة العلوم - أ1</span>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[280px] mx-auto bg-gray-950 rounded-[2.5rem] border-[6px] border-slate-800 p-4 pt-8 text-right shadow-2xl relative min-h-[320px] flex flex-col justify-between"
          >
            {/* Phone speaker / camera notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full"></div>
            
            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">نقاط: +10</span>
                <span className="text-[9px] text-gray-500">الزهرة والتكاثر</span>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-[11px] font-black text-white leading-normal">أي جزء يحمل حبوب اللقاح؟</h5>
                <div className="space-y-1.5">
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[10px] text-gray-400 font-bold">أ. الكأس</div>
                  <div className="bg-emerald-900/40 border-2 border-emerald-500 p-2.5 rounded-xl text-[10px] text-emerald-100 font-bold flex justify-between items-center">
                    <span>ب. المتك</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-2xl text-[9px] text-slate-350 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-0.5">أحسنت! 🌟</span>
              المتك هو الجزء الذكري المسؤول عن تصنيع حبوب اللقاح.
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-white rounded-[2rem] border border-gray-100 p-6 text-right space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <span className="text-xs font-bold text-gray-850">تحليلات الجلسة الحية</span>
              <span className="text-[10px] font-bold text-gray-400">تحديث فوري</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="bg-blue-50 border border-blue-100/50 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-blue-500 block mb-1">متوسط الدقة</span>
                <span className="text-2xl font-black text-blue-900">82%</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100/50 p-3.5 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-500 block mb-1">نسبة الإكمال</span>
                <span className="text-2xl font-black text-emerald-900">100%</span>
              </div>
            </div>

            {/* Mock Mini Chart */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-400 block">توزيع درجات الطلاب</span>
              <div className="flex items-end justify-between gap-1.5 h-20 pt-2 bg-gray-50/50 rounded-xl px-4 border border-gray-100/50">
                <div className="bg-red-400 w-full rounded-t" style={{height: '25%'}}></div>
                <div className="bg-amber-400 w-full rounded-t" style={{height: '40%'}}></div>
                <div className="bg-blue-400 w-full rounded-t" style={{height: '65%'}}></div>
                <div className="bg-emerald-500 w-full rounded-t" style={{height: '90%'}}></div>
              </div>
              <div className="flex justify-between text-[8px] text-gray-400 font-bold px-2">
                <span>0-5</span>
                <span>6-8</span>
                <span>9-10</span>
                <span>متفوق</span>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <section id="how-it-works" className="py-24 bg-gray-50/50 relative overflow-hidden">
      
      {/* Accent Blurs */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-purple-400/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-4"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>بساطة مطلقة مع كفاءة تعليمية</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            كيف <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600">تعمل المنصة؟</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            خطوات ميسرة تأخذك من مجرد فكرة للدرس إلى إشراك كامل الطلاب وتحليل أدائهم لحظة بلحظة.
          </p>
        </div>

        {/* Desktop Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Right Side: Step Selection Buttons */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1 text-right">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-right p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-start gap-5 relative group ${
                    isActive 
                      ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5 translate-x-2" 
                      : "bg-white/40 hover:bg-white border-transparent hover:border-gray-200"
                  }`}
                >
                  {/* Step counter badge */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive 
                      ? `bg-gradient-to-br ${step.gradient} text-white scale-110` 
                      : `${step.bgColor} ${step.colorText} group-hover:scale-105`
                  }`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className={`text-lg font-black transition-colors ${
                        isActive ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {step.title}
                      </h4>
                      {isActive && (
                        <ChevronLeft className="w-4 h-4 text-emerald-500 mr-2 shrink-0 hidden lg:block" />
                      )}
                    </div>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${
                      isActive ? "text-gray-600 font-medium" : "text-gray-505"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Left Side: Mockups Visualization Frame */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center items-center relative min-h-[360px] bg-gradient-to-tr from-gray-100 to-gray-50/20 rounded-[3rem] border border-gray-100 p-8">
            {/* Ambient glows behind mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_60%)]"></div>
            
            <div className="w-full max-w-sm relative z-10">
              <AnimatePresence mode="wait">
                {renderVisual()}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

