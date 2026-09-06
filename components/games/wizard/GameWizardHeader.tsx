"use client"

import { Gamepad2, ListChecks, Send, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface GameWizardHeaderProps {
  isEdit: boolean;
  step: number;
  customTopActions?: React.ReactNode;
}

export function GameWizardHeader({ isEdit, step, customTopActions }: GameWizardHeaderProps) {
  const { t, isRTL } = useLocale()

  return (
    <>
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/games" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.gameWizard.backToGames}</span>
        </Link>
        {customTopActions}
      </div>

      {/* Wizard Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
            {isEdit ? t.gameWizard.editGameTitle : t.gameWizard.newGameTitle}
          </h1>
          
          {/* Stepper Progress */}
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { num: 1, label: t.gameWizard.step1Label, icon: Gamepad2 },
              { num: 2, label: t.gameWizard.step2Label, icon: ListChecks },
              { num: 3, label: t.gameWizard.step3Label, icon: Send },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-3 md:gap-4 shrink-0">
                <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition-all
                  ${step === s.num 
                    ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105" 
                    : step > s.num 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-white text-gray-400 border-2 border-gray-100"
                  }`}
                >
                  <s.icon className={`w-5 h-5 ${step === s.num ? "text-emerald-400" : ""}`} />
                  <span>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-8 md:w-12 h-1.5 rounded-full transition-colors ${step > s.num ? "bg-emerald-300" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
