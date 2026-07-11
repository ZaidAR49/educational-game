"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Copy, CheckCircle2, ArrowRight, AlertCircle, Wand2 } from "lucide-react"
import { GameWizard } from "./GameWizard"
import { OrganizationOption } from "./wizard/BasicInfoStep"
import { GameFormData, Scenario } from "./wizard/types"

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
  
  // State for parsed game data
  const [parsedGame, setParsedGame] = useState<Partial<GameFormData> | null>(null)
  const [parsedScenarios, setParsedScenarios] = useState<Scenario[] | null>(null)

  const promptTemplate = `You are an expert educational game designer. Your task is to generate a highly engaging, interactive quiz game in Arabic about the following topic:
"${idea || '[أدخل فكرتك هنا]'}"

CRITICAL RULES:
1. Generate exactly ${questionCount} scenarios (questions).
2. For each scenario, provide exactly 4 choices.
3. Only ONE choice can be correct (isCorrect: true). The other 3 must be false.
4. Each correct choice must award exactly 10 points.
5. Provide detailed, encouraging feedback for each choice in Arabic.
6. Use appropriate emojis for icons.

You MUST respond ONLY with a raw JSON object that perfectly matches the structure below. Do NOT include any markdown wrappers (like \`\`\`json), do NOT include any introductory or concluding text. Just the raw JSON object.

{
  "title": "A catchy title for the game in Arabic",
  "description": "A short, engaging description in Arabic",
  "slug": "a-url-friendly-slug-in-english",
  "icon": "🎮",
  "scenarios": [
    {
      "icon": "❓",
      "title": "The question text in Arabic",
      "description": "Additional context or instruction for the question in Arabic",
      "choices": [
        {
          "text": "Choice text in Arabic",
          "icon": "📝",
          "isCorrect": true,
          "points": 10,
          "feedback": {
            "title": "Feedback title (e.g., إجابة صحيحة! / محاولة جيدة!)",
            "message": "Detailed explanation of why it is correct or incorrect in Arabic",
            "tip": "A helpful tip or fun fact in Arabic"
          }
        }
      ]
    }
  ]
}`

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
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={'{\n  "title": "...",\n  "scenarios": [...]\n}'}
            dir="ltr"
            className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-mono text-sm resize-none min-h-[250px]"
          />

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
        </div>
      </div>

    </div>
  )
}
