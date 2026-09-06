"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Wand2, QrCode, Smartphone, BarChart3,
  Trophy, ChevronLeft, ChevronRight,
} from "lucide-react"
import { StepVisual } from "./StepVisual"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const { messages: t } = useLocale()

  const steps = [
    {
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Description,
      icon: Wand2,
      gradient: "from-blue-500 to-indigo-600",
      colorText: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Description,
      icon: QrCode,
      gradient: "from-emerald-500 to-teal-600",
      colorText: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Description,
      icon: Smartphone,
      gradient: "from-amber-500 to-orange-600",
      colorText: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Description,
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-600",
      colorText: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Accent blurs — use logical end/start positioning */}
      <div className="absolute top-[20%] -end-[10%] w-[350px] h-[350px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] -start-[10%] w-[350px] h-[350px] bg-purple-400/5 rounded-full blur-[80px] pointer-events-none" />

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
            <span>{t.howItWorks.sectionBadge}</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            {t.howItWorks.sectionHeading1}{" "}
            <span className="text-transparent bg-clip-text rtl:bg-gradient-to-l ltr:bg-gradient-to-r from-emerald-600 to-blue-600">
              {t.howItWorks.sectionHeading2}
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.howItWorks.sectionDescription}
          </p>
        </div>

        {/* Layout: grid cols flip automatically with dir */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

          {/* Step Selector */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1 text-start">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-start p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-start gap-5 relative group ${
                    isActive
                      ? /* Slide toward the visual panel (inline-end direction) */
                        "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5 rtl:translate-x-2 ltr:-translate-x-2"
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
                      {/* Chevron points toward the visual panel */}
                      {isActive && (
                        <>
                          <ChevronLeft className="w-4 h-4 text-emerald-500 me-2 shrink-0 hidden lg:rtl:block ltr:hidden" />
                          <ChevronRight className="w-4 h-4 text-emerald-500 me-2 shrink-0 hidden lg:ltr:block rtl:hidden" />
                        </>
                      )}
                    </div>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                      {step.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Mockup Frame */}
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
