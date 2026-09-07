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
    <div className="w-full max-w-4xl mx-auto mt-6 pt-2 flex items-center justify-between z-20">
      <button 
        onClick={onPrevStep}
        disabled={step === 1}
        className={`flex items-center justify-center gap-2 w-auto sm:w-[160px] px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all
          ${step === 1 
            ? "opacity-0 pointer-events-none" 
            : "bg-white border border-gray-200 hover:border-gray-300 text-gray-700 shadow-sm hover:shadow"
          }`}
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.gameWizard.prevStep}</span>
      </button>

      {step < 3 ? (
        <button 
          onClick={onNextStep}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-auto sm:w-[160px] px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{t.gameWizard.nextStep}</span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      ) : (
        <button 
          onClick={onSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-700 text-white w-auto sm:w-[180px] px-2 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Save className="w-4 h-4 text-emerald-400" />}
          <span>{isPending ? t.gameWizard.saving : t.gameWizard.saveAndConfirm}</span>
        </button>
      )}
    </div>
  );
}
