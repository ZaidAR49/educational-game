"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Wand2, QrCode, Smartphone, BarChart3,
  Trophy, ChevronLeft,
} from "lucide-react"
import { StepVisual } from "./StepVisual"

const steps = [
  {
    title: "1. صمّم بالذكاء الاصطناعي",
    description: "أدخل عنوان درسك، وسيتكفل المولد الذكي ببناء الأسئلة والخيارات والتعليقات التفسيرية بدقة فائقة في ثوانٍ.",
    icon: Wand2,
    gradient: "from-blue-500 to-indigo-600",
    colorText: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "2. أطلق جلسة مباشرة",
    description: "بنقرة واحدة، أنشئ جلسة لعب نشطة واعرض رمز الاستجابة السريعة (QR) أو انسخ الرابط المباشر لطلابك.",
    icon: QrCode,
    gradient: "from-emerald-500 to-teal-600",
    colorText: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "3. العب وتعلّم فوراً",
    description: "ينضم الطلاب في ثانيتين بمسح الرمز دون تسجيل حساب. يختارون الإجابات ويتلقون تعليقات تعليمية فورية.",
    icon: Smartphone,
    gradient: "from-amber-500 to-orange-600",
    colorText: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "4. حلّل النتائج لحظياً",
    description: "شاهد لوحات التوزيع البياني للدرجات ونسب الدقة مباشرة لتحديد الفجوات المعرفية ومعالجتها فوراً.",
    icon: BarChart3,
    gradient: "from-purple-500 to-pink-600",
    colorText: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Accent blurs */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-purple-400/5 rounded-full blur-[80px] pointer-events-none" />

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

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

          {/* Step selector */}
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
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? `bg-gradient-to-br ${step.gradient} text-white scale-110`
                      : `${step.bgColor} ${step.colorText} group-hover:scale-105`
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className={`text-lg font-black transition-colors ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                        {step.title}
                      </h4>
                      {isActive && <ChevronLeft className="w-4 h-4 text-emerald-500 mr-2 shrink-0 hidden lg:block" />}
                    </div>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                      {step.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Mockup frame */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center items-center relative min-h-[360px] bg-gradient-to-tr from-gray-100 to-gray-50/20 rounded-[3rem] border border-gray-100 p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_60%)]" />
            <div className="w-full max-w-sm relative z-10">
              <AnimatePresence mode="wait">
                <StepVisual activeStep={activeStep} />
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
