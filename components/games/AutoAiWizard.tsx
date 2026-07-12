"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Wand2, AlertCircle } from "lucide-react"
import { GameWizard } from "./GameWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"
import { GameFormData, Scenario } from "./wizard/types"
import { generateGameAction } from "@/lib/actions/ai.actions"

interface AutoAiWizardProps {
  organizations: OrganizationOption[];
  onBack: () => void;
}

export function AutoAiWizard({ organizations, onBack }: AutoAiWizardProps) {
  const [idea, setIdea] = useState("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingText, setLoadingText] = useState("جاري تحليل الفكرة...")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // State for parsed game data
  const [parsedGame, setParsedGame] = useState<Partial<GameFormData> | null>(null)
  const [parsedScenarios, setParsedScenarios] = useState<Scenario[] | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setErrorMsg(null)
    
    // Simple mock text progression for UX
    const timers = [
      setTimeout(() => setLoadingText("جاري كتابة الأسئلة والخيارات..."), 2000),
      setTimeout(() => setLoadingText("جاري تجهيز التغذية الراجعة..."), 4000),
      setTimeout(() => setLoadingText("اللمسات الأخيرة..."), 7000),
    ]
    
    try {
      const response = await generateGameAction(idea, questionCount);
      
      timers.forEach(clearTimeout) // Clear UX timers
      
      if (!response.success || !response.data) {
        throw new Error(response.error || "فشل التوليد، يرجى المحاولة مرة أخرى.");
      }

      const parsed = response.data;

      const newGameData: Partial<GameFormData> = {
        title: parsed.title || "بدون عنوان",
        description: parsed.description || "",
        slug: parsed.slug || Date.now().toString(),
        icon: parsed.icon || "🎮",
        status: "draft",
        organizationId: "",
      }

      const newScenarios: Scenario[] = (parsed.scenarios || []).map((s: any, idx: number) => ({
        id: Date.now().toString() + idx,
        title: s.title || "",
        description: s.description || "",
        icon: s.icon || "❓",
        choices: (s.choices || []).map((c: any, cIdx: number) => ({
          id: Date.now().toString() + idx + cIdx,
          text: c.text || "",
          icon: c.icon || "📝",
          isCorrect: !!c.isCorrect,
          points: Number(c.points) || 10,
          feedback: {
            title: c.feedback?.title || "",
            message: c.feedback?.message || "",
            tip: c.feedback?.tip || "",
          }
        }))
      }))

      setParsedGame(newGameData)
      setParsedScenarios(newScenarios)

    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      timers.forEach(clearTimeout)
      setIsGenerating(false)
      setLoadingText("جاري تحليل الفكرة...")
    }
  }

  // If generated successfully, render the GameWizard
  if (parsedGame && parsedScenarios) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold border border-emerald-100">
          <Wand2 className="w-6 h-6" />
          تم توليد اللعبة بنجاح! راجع الأسئلة وعدّلها إن لزم الأمر قبل حفظها ونشرها.
        </div>
        <GameWizard 
          isEdit={false} 
          organizations={organizations} 
          initialGame={parsedGame}
          initialScenarios={parsedScenarios}
          customTopActions={
            <button 
              onClick={() => {
                setParsedGame(null)
                setParsedScenarios(null)
                setIdea("")
              }}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-100"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمولد الذكي</span>
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20" dir="rtl">
      
      {/* Header */}
      <div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-6 disabled:opacity-50"
          disabled={isGenerating}
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لطرق الإنشاء</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">المولد الذكي (تلقائي)</h1>
        </div>
        <p className="text-gray-500 font-medium text-lg mr-16">
          أخبرنا بفكرتك، وسنقوم ببناء الأسئلة والخيارات والتغذية الراجعة لك بشكل كامل عبر الذكاء الاصطناعي.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        {!isGenerating ? (
          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-gray-700 font-bold mb-3 text-lg">عن ماذا تتحدث لعبتك؟</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="أدخل موضوع اللعبة أو الدرس، مثلاً: 'جدول الضرب'، 'أجزاء النبات'، 'عواصم الدول العربية'..."
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium resize-none min-h-[150px] shadow-sm text-lg leading-relaxed"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-gray-700 font-bold mb-3 text-lg text-center">عدد الأسئلة</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value) || 5)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold text-center h-[150px] text-4xl shadow-sm text-emerald-700"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl font-bold flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!idea.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="w-6 h-6" />
              <span>توليد اللعبة الآن بواسطة AI</span>
            </button>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center space-y-6 relative z-10 min-h-[300px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 border-t-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
            >
              <Sparkles className="w-8 h-8 text-emerald-500" />
            </motion.div>
            
            <motion.div 
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-gray-900 text-center"
            >
              {loadingText}
            </motion.div>
            <p className="text-gray-500 font-medium text-center">يرجى الانتظار، نحن نستخدم نماذج Google المتقدمة لمعالجة طلبك...</p>
          </div>
        )}

      </div>
    </div>
  )
}
