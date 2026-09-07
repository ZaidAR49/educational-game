"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ArrowLeft, Wand2, AlertCircle, Globe, ChevronDown } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { GameWizard } from "./GameWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"
import { GameFormData, Scenario } from "./wizard/types"

interface AutoAiWizardProps {
  organizations: OrganizationOption[];
  onBack: () => void;
}

export function AutoAiWizard({ organizations, onBack }: AutoAiWizardProps) {
  const { t, isRTL, locale } = useLocale()
  const [idea, setIdea] = useState("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [targetLanguage, setTargetLanguage] = useState<string>(locale || "ar")
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // State for parsed game data
  const [parsedGame, setParsedGame] = useState<Partial<GameFormData> | null>(null)
  const [parsedScenarios, setParsedScenarios] = useState<Scenario[] | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setErrorMsg(null)
    setLoadingText(t.gameCreation.autoAiLoadingAnalyzing)
    
    // Simple mock text progression for UX
    const timers = [
      setTimeout(() => setLoadingText(t.gameCreation.autoAiLoadingConnecting), 1000),
      setTimeout(() => setLoadingText(t.gameCreation.autoAiLoadingWriting), 3000),
    ]
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, questionCount, locale: targetLanguage }),
      });
      
      timers.forEach(clearTimeout) // Clear UX timers
      
      if (!res.ok) {
        throw new Error(t.gameCreation.autoAiGenFailed);
      }
      if (!res.body) {
        throw new Error(t.gameCreation.autoAiNoData);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedJson = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        streamedJson += chunk;
        
        // Update loading text to show progress
        setLoadingText(t.gameCreation.autoAiLoadingChars.replace('{count}', String(streamedJson.length)));
      }

      let parsed;
      try {
        const jsonMatch = streamedJson.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : streamedJson;
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("Failed to parse JSON:", streamedJson);
        throw new Error(t.gameCreation.autoAiParseFailed);
      }

      const newGameData: Partial<GameFormData> = {
        title: parsed.title || (isRTL ? "بدون عنوان" : "Untitled Game"),
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
      setLoadingText(t.gameCreation.autoAiLoadingAnalyzing)
    }
  }

  // If generated successfully, render the GameWizard
  if (parsedGame && parsedScenarios) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold border border-emerald-100">
          <Wand2 className="w-6 h-6 shrink-0" />
          <span>{t.gameCreation.autoAiSuccess}</span>
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
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.gameCreation.autoAiBackToGenerator}</span>
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-6 disabled:opacity-50"
          disabled={isGenerating}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.gameCreation.backToMethods}</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.gameCreation.autoAiTitle}</h1>
        </div>
        <p className="text-gray-500 font-medium text-base ms-16">
          {t.gameCreation.autoAiSubhead}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

        {!isGenerating ? (
          <div className="space-y-5 relative z-10">
            {/* Topic Input */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">
                {t.gameCreation.byoIdeaLabel}
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.gameCreation.autoAiIdeaPlaceholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium resize-none text-sm md:text-base leading-relaxed placeholder:text-gray-400 shadow-xs"
              />
            </div>

            {/* Parameters Row: Language & Question Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language Selector */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  {t.gameCreation.gameLanguage}
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-emerald-600 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-semibold text-sm bg-white shadow-xs text-gray-800 cursor-pointer appearance-none"
                  >
                    <option value="ar">{t.gameCreation.langArabic}</option>
                    <option value="en">{t.gameCreation.langEnglish}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Question Count Stepper */}
              <div>
                <label className="block text-gray-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                  {t.gameCreation.byoQuestionsCount}
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 transition-all shadow-xs h-[42px]">
                  <button
                    type="button"
                    onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                    className="w-11 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 font-bold transition-colors text-lg select-none"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                    className="flex-1 text-center font-black text-gray-900 outline-none text-base bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuestionCount(Math.min(20, questionCount + 1))}
                    className="w-11 h-full flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 font-bold transition-colors text-lg select-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!idea.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-4 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 text-base"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.gameCreation.autoAiGenerateBtn}</span>
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">
              {t.gameCreation.byoAiDisclaimer}
            </p>
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
              {loadingText || t.gameCreation.autoAiLoadingAnalyzing}
            </motion.div>
            <p className="text-gray-500 font-medium text-center">{t.gameCreation.autoAiWaitNotice}</p>
          </div>
        )}

      </div>
    </div>
  )
}
