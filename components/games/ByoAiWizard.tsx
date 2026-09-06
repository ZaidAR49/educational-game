"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Copy, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Wand2, Globe, ChevronDown } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { GameWizard } from "./GameWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"
import { GameFormData, Scenario } from "./wizard/types"
import { gameGeneratorConfig } from "@/lib/ai/game-generator.config"

interface ByoAiWizardProps {
  organizations: OrganizationOption[];
  onBack: () => void;
}

export function ByoAiWizard({ organizations, onBack }: ByoAiWizardProps) {
  const { t, isRTL, locale } = useLocale()
  const [idea, setIdea] = useState("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [targetLanguage, setTargetLanguage] = useState<string>(locale || "ar")
  const [copied, setCopied] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  
  // State for parsed game data
  const [parsedGame, setParsedGame] = useState<Partial<GameFormData> | null>(null)
  const [parsedScenarios, setParsedScenarios] = useState<Scenario[] | null>(null)

  const promptTemplate = gameGeneratorConfig.getCustomUserPrompt(
    idea || (targetLanguage === 'ar' ? '[أدخل فكرتك هنا]' : '[Enter your idea here]'),
    questionCount,
    targetLanguage
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(promptTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleParseJSON = () => {
    try {
      setErrorMsg(null)
      // Clean the input in case the AI added markdown anyway
      let cleanJson = jsonInput.trim()
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json/g, '')
      }
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```/g, '')
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.replace(/```/g, '')
      }
      
      const parsed = JSON.parse(cleanJson.trim())

      // Basic validation
      if (!parsed.title || !parsed.scenarios || !Array.isArray(parsed.scenarios)) {
        throw new Error(isRTL ? "JSON لا يحتوي على الحقول الأساسية المطلوبة (title, scenarios)." : "JSON does not contain required fields (title, scenarios).")
      }

      const newGameData: Partial<GameFormData> = {
        title: parsed.title,
        description: parsed.description || "",
        slug: parsed.slug || Date.now().toString(),
        icon: parsed.icon || "🎮",
        status: "draft",
        organizationId: "",
      }

      const newScenarios: Scenario[] = parsed.scenarios.map((s: any, idx: number) => ({
        id: Date.now().toString() + idx,
        title: s.title || "",
        description: s.description || "",
        icon: s.icon || "❓",
        choices: (s.choices || []).map((c: any, cIdx: number) => ({
          id: Date.now().toString() + idx + cIdx,
          text: c.text || "",
          icon: c.icon || "📝",
          isCorrect: !!c.isCorrect,
          points: Number(c.points) || 0,
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
      setErrorMsg((t.gameCreation.byoInvalidJson || "Invalid JSON. ") + " " + e.message)
    }
  }

  // If successfully parsed, render the standard GameWizard but pre-filled!
  if (parsedGame && parsedScenarios) {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 text-purple-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold border border-purple-100">
          <Wand2 className="w-6 h-6 shrink-0" />
          <span>{t.gameCreation.byoSuccess}</span>
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
              }}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl border border-purple-100"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.gameCreation.byoBackToSettings}</span>
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t.gameCreation.backToMethods}</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t.gameCreation.byoTitle}</h1>
        </div>
        <p className="text-gray-500 font-medium text-lg ms-16">
          {t.gameCreation.byoDesc}
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 start-0 w-2 h-full bg-purple-500"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black">1</span>
          {t.gameCreation.byoStep1Title}
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          {t.gameCreation.byoStep1Desc}
        </p>

        <div className="space-y-5">
          {/* Topic Input */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm md:text-base">{t.gameCreation.byoIdeaLabel}</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={t.gameCreation.byoIdeaPlaceholder}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium resize-none text-sm md:text-base leading-relaxed placeholder:text-gray-400 shadow-xs"
            />
          </div>

          {/* Parameters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-xs uppercase tracking-wider">{t.gameCreation.gameLanguage}</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-purple-600 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-semibold text-sm bg-white shadow-xs text-gray-800 cursor-pointer appearance-none"
                >
                  <option value="ar">{t.gameCreation.langArabic}</option>
                  <option value="en">{t.gameCreation.langEnglish}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5 text-xs uppercase tracking-wider">{t.gameCreation.byoQuestionsCount}</label>
              <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all shadow-xs h-[42px]">
                <button
                  type="button"
                  onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                  className="w-11 h-full flex items-center justify-center text-gray-500 hover:text-purple-700 hover:bg-purple-50 font-bold transition-colors text-lg select-none"
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
                  className="w-11 h-full flex items-center justify-center text-gray-500 hover:text-purple-700 hover:bg-purple-50 font-bold transition-colors text-lg select-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative group">
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.gameCreation.byoCopied : t.gameCreation.byoCopyPrompt}</span>
              </button>
            </div>
            <label className="block text-gray-500 font-bold mb-3 text-sm">{t.gameCreation.byoPromptReady}</label>
            <pre className="text-left font-mono text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto" dir="ltr">
              {promptTemplate}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 start-0 w-2 h-full bg-emerald-500"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">2</span>
          {t.gameCreation.byoStep2Title}
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          {t.gameCreation.byoStep2Desc}
        </p>

        <div className="space-y-4">
          <div className="relative flex rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 transition-all font-mono text-sm h-[400px]" dir="ltr">
            <div 
              className="w-12 bg-gray-100 text-gray-400 flex flex-col items-end pr-3 py-4 select-none overflow-hidden shrink-0 border-r border-gray-200"
            >
              <div style={{ transform: `translateY(-${scrollTop}px)` }}>
                {Array.from({ length: Math.max(1, jsonInput.split('\n').length) }).map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
              placeholder={'{\n  "title": "...",\n  "scenarios": [...]\n}'}
              spellCheck={false}
              wrap="off"
              className="flex-1 w-full bg-transparent px-4 py-4 outline-none resize-none leading-6 whitespace-pre overflow-auto"
            />
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl font-bold flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleParseJSON}
            disabled={!jsonInput.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:hover:bg-emerald-600"
          >
            {t.gameCreation.byoParseBtn}
          </button>
          <p className="text-center text-xs text-gray-400 font-medium mt-3">
            {t.gameCreation.byoAiDisclaimer}
          </p>
        </div>
      </div>

    </div>
  )
}
