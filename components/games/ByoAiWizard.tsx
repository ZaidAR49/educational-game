"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Copy, CheckCircle2, ArrowRight, AlertCircle, Wand2 } from "lucide-react"
import { GameWizard } from "./GameWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"
import { GameFormData, Scenario } from "./wizard/types"
import { gameGeneratorConfig } from "@/lib/ai/game-generator.config"

interface ByoAiWizardProps {
  organizations: OrganizationOption[];
  onBack: () => void;
}

export function ByoAiWizard({ organizations, onBack }: ByoAiWizardProps) {
  const [idea, setIdea] = useState("")
  const [questionCount, setQuestionCount] = useState<number>(5)
  const [copied, setCopied] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  
  // State for parsed game data
  const [parsedGame, setParsedGame] = useState<Partial<GameFormData> | null>(null)
  const [parsedScenarios, setParsedScenarios] = useState<Scenario[] | null>(null)

  const promptTemplate = gameGeneratorConfig.getCustomUserPrompt(
    idea || '[أدخل فكرتك هنا]',
    questionCount
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
        throw new Error("JSON لا يحتوي على الحقول الأساسية المطلوبة (title, scenarios).")
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
      setErrorMsg("الـ JSON المدخل غير صالح. يرجى التأكد من نسخه بالكامل وتطابقه مع الصيغة المطلوبة. " + e.message)
    }
  }

  // If successfully parsed, render the standard GameWizard but pre-filled!
  if (parsedGame && parsedScenarios) {
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 text-purple-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-bold border border-purple-100">
          <Wand2 className="w-6 h-6" />
          تم استيراد اللعبة بنجاح! يمكنك الآن مراجعتها وتعديلها قبل النشر.
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
              <ArrowRight className="w-4 h-4" />
              <span>العودة لإعدادات الذكاء الاصطناعي</span>
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20" dir="rtl">
      
      {/* Header */}
      <div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لطرق الإنشاء</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">بناء عبر موجه (Prompt)</h1>
        </div>
        <p className="text-gray-500 font-medium text-lg mr-16">
          استخدم قوة أي ذكاء اصطناعي تفضله لتوليد محتوى لعبتك. اتبع الخطوتين أدناه!
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black">1</span>
          تجهيز الموجه (Prompt)
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          اكتب فكرة اللعبة التي تريدها بشكل مبسط، وسنقوم بتجهيز أمر احترافي لنسخه.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-gray-700 font-bold mb-2">عن ماذا تتحدث لعبتك؟</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="مثال: لعبة عن مخاطر التدخين وأثره على الصحة بطريقة تفاعلية لطلاب الإعدادي..."
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium resize-none min-h-[100px]"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">عدد الأسئلة</label>
              <input
                type="number"
                min="1"
                max="30"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value) || 5)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-bold text-center h-[100px] text-2xl"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative group">
            <div className="absolute top-4 left-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "تم النسخ!" : "نسخ الموجه"}
              </button>
            </div>
            <label className="block text-gray-500 font-bold mb-3 text-sm">الموجه الجاهز (انسخه والصقه في ChatGPT أو Gemini):</label>
            <pre className="text-left font-mono text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto" dir="ltr">
              {promptTemplate}
            </pre>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">2</span>
          استيراد النتيجة (JSON)
        </h2>
        <p className="text-gray-600 mb-6 font-medium">
          بعد أن يقوم الذكاء الاصطناعي بتوليد النتيجة، قم بنسخ كود الـ JSON فقط والصقه هنا.
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
            معالجة الـ JSON وإنشاء اللعبة
          </button>
          <p className="text-center text-xs text-gray-400 font-medium mt-3">
            قد يخطئ الذكاء الاصطناعي أحياناً. يرجى مراجعة الأسئلة والأجوبة والتأكد من صحتها قبل نشر اللعبة.
          </p>
        </div>
      </div>

    </div>
  )
}
