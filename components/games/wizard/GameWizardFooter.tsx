"use client"

import { ArrowRight, ArrowLeft, Save, Loader2 } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

interface GameWizardFooterProps {
  step: number;
  isPending: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSave: () => void;
}

export function GameWizardFooter({
  step,
  isPending,
  onPrevStep,
  onNextStep,
  onSave
}: GameWizardFooterProps) {
  const { t, isRTL } = useLocale()

  return (
    <div className={`fixed bottom-0 ${isRTL ? 'right-0 md:right-64 left-0' : 'left-0 md:left-64 right-0'} p-6 md:p-10 flex items-center justify-between z-30 pointer-events-none`}>
      <button 
        onClick={onPrevStep}
        disabled={step === 1}
        className={`pointer-events-auto flex items-center justify-center gap-2 w-full sm:w-[240px] px-6 py-4 rounded-xl font-bold text-lg transition-all
          ${step === 1 
            ? "opacity-0" 
            : "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 shadow-md hover:shadow-lg"
          }`}
      >
        {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        <span>{t.gameWizard.prevStep}</span>
      </button>

      {step < 3 ? (
        <button 
          onClick={onNextStep}
          className="pointer-events-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95"
        >
          <span>{t.gameWizard.nextStep}</span>
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      ) : (
        <button 
          onClick={onSave}
          disabled={isPending}
          className="pointer-events-auto flex items-center justify-center gap-3 bg-gray-900 hover:bg-black disabled:bg-gray-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-black text-lg transition-all shadow-2xl shadow-gray-900/40 hover:scale-105 active:scale-95"
        >
          {isPending ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : <Save className="w-6 h-6 text-emerald-400" />}
          <span>{isPending ? t.gameWizard.saving : t.gameWizard.saveAndConfirm}</span>
        </button>
      )}
    </div>
  );
}
