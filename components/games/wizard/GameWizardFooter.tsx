import { ArrowRight, ArrowLeft, Save, Loader2 } from "lucide-react"

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
  return (
    <div className="fixed bottom-0 left-0 right-0 md:right-64 p-6 md:p-10 flex items-center justify-between z-30 pointer-events-none">
      <button 
        onClick={onPrevStep}
        disabled={step === 1}
        className={`pointer-events-auto flex items-center justify-center gap-2 w-full sm:w-[240px] px-6 py-4 rounded-xl font-bold text-lg transition-all
          ${step === 1 
            ? "opacity-0" 
            : "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 shadow-md hover:shadow-lg"
          }`}
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للسابق</span>
      </button>

      {step < 3 ? (
        <button 
          onClick={onNextStep}
          className="pointer-events-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95"
        >
          <span>التالي</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      ) : (
        <button 
          onClick={onSave}
          disabled={isPending}
          className="pointer-events-auto flex items-center justify-center gap-3 bg-gray-900 hover:bg-black disabled:bg-gray-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-black text-lg transition-all shadow-2xl shadow-gray-900/40 hover:scale-105 active:scale-95"
        >
          {isPending ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : <Save className="w-6 h-6 text-emerald-400" />}
          <span>{isPending ? "جاري الحفظ..." : "حفظ واعتماد اللعبة"}</span>
        </button>
      )}
    </div>
  );
}
