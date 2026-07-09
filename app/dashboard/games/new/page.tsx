"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  ArrowRight, ArrowLeft, Save, 
  Gamepad2, ListChecks, Send, 
  Plus, Trash2, CheckCircle2, AlertCircle, Link as LinkIcon, Download,
  ChevronDown
} from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

type Choice = {
  text: string
  icon: string
  isCorrect: boolean
  feedback: {
    title: string
    message: string
    tip: string
  }
}

type Scenario = {
  id: string
  icon: string
  title: string
  description: string
  choices: Choice[]
}

const generateDefaultChoices = (): Choice[] => {
  return [
    { text: "", icon: "🎯", isCorrect: true, feedback: { title: "إجابة صحيحة! 🌟", message: "أحسنت الاختيار!", tip: "استمر على هذا المنوال." } },
    { text: "", icon: "🤔", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
    { text: "", icon: "💡", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
    { text: "", icon: "🧩", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
  ]
}

const MOCK_ORGANIZATIONS = [
  { id: "org-1", name: "جمعية حماية الأسرة والطفولة", logo: "/logo.png" },
  { id: "org-2", name: "مدارس الإبداع الأهلية", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" },
  { id: "org-3", name: "مؤسسة بدون شعار", logo: "" },
]

export default function GameWizard() {
  const [step, setStep] = useState(1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  // Game State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    icon: "🎮",
    status: "draft",
    organizationId: "",
  })

  // Scenarios State
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "1",
      icon: "❓",
      title: "السؤال الأول",
      description: "",
      choices: generateDefaultChoices()
    }
  ])

  const [activeScenarioId, setActiveScenarioId] = useState<string>("1")

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errorMsg) setErrorMsg(null)
  }

  const addScenario = () => {
    const newId = Date.now().toString()
    setScenarios([...scenarios, {
      id: newId,
      icon: "❓",
      title: `السؤال ${scenarios.length + 1}`,
      description: "",
      choices: generateDefaultChoices()
    }])
    setActiveScenarioId(newId)
    if (errorMsg) setErrorMsg(null)
  }

  const removeScenario = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (scenarios.length <= 1) return alert("يجب أن تحتوي اللعبة على سؤال واحد على الأقل.")
    const filtered = scenarios.filter(s => s.id !== id)
    setScenarios(filtered)
    if (activeScenarioId === id) {
      setActiveScenarioId(filtered[0].id)
    }
  }

  const updateActiveScenario = (field: string, value: any) => {
    setScenarios(scenarios.map(s => s.id === activeScenarioId ? { ...s, [field]: value } : s))
    if (errorMsg) setErrorMsg(null)
  }

  const updateChoice = (choiceIndex: number, field: string, value: string) => {
    setScenarios(scenarios.map(s => {
      if (s.id !== activeScenarioId) return s
      const updatedChoices = [...s.choices]
      
      if (field === 'isCorrect') {
        updatedChoices.forEach((c, idx) => {
          c.isCorrect = (idx === choiceIndex)
          c.feedback.title = (idx === choiceIndex) ? "إجابة صحيحة! 🌟" : "إجابة غير صحيحة! 🤔"
        })
      } else {
        if (field.startsWith('feedback.')) {
          const feedbackField = field.split('.')[1]
          updatedChoices[choiceIndex].feedback = { ...updatedChoices[choiceIndex].feedback, [feedbackField]: value }
        } else {
          updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], [field]: value }
        }
      }
      return { ...s, choices: updatedChoices }
    }))
    if (errorMsg) setErrorMsg(null)
  }

  const validateStep1 = () => {
    if (!formData.title.trim()) return "الرجاء إدخال عنوان اللعبة."
    if (!formData.description.trim()) return "الرجاء إدخال وصف اللعبة."
    if (!formData.slug.trim()) return "الرجاء إدخال الرابط المختصر (الاسم اللطيف)."
    if (!formData.icon.trim()) return "الرجاء إدخال أيقونة اللعبة."
    return null
  }

  const validateStep2 = () => {
    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i]
      if (!s.title.trim() || !s.description.trim() || !s.icon.trim()) {
        setActiveScenarioId(s.id)
        return `الرجاء إكمال بيانات "السؤال ${i + 1}" (العنوان، النص، الأيقونة).`
      }
      for (let j = 0; j < s.choices.length; j++) {
        const c = s.choices[j]
        if (!c.text.trim() || !c.icon.trim() || !c.feedback.message.trim()) {
          setActiveScenarioId(s.id)
          return `الرجاء إكمال جميع حقول الخيارات (النص، الأيقونة، التغذية الراجعة) في "السؤال ${i + 1}".`
        }
      }
    }
    return null
  }

  const handleNextStep = () => {
    if (step === 1) {
      const err = validateStep1()
      if (err) {
        setErrorMsg(err)
        return
      }
    } else if (step === 2) {
      const err = validateStep2()
      if (err) {
        setErrorMsg(err)
        return
      }
    }
    setErrorMsg(null)
    setStep(step + 1)
  }

  const handleSave = () => {
    if (formData.status === 'published') {
      setShowSuccessPopup(true)
    } else {
      alert("تم حفظ اللعبة كمسودة بنجاح! سيتم ربط هذا بقاعدة البيانات لاحقاً.")
    }
  }

  const gameUrl = `https://your-domain.com/game/${formData.slug || 'slug'}`

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement
    if (!canvas) return
    const pngFile = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.download = `QR-${formData.slug || 'game'}.png`
    downloadLink.href = pngFile
    downloadLink.click()
  }

  const activeScenario = scenarios.find(s => s.id === activeScenarioId)

  const selectedOrg = MOCK_ORGANIZATIONS.find(org => org.id === formData.organizationId)
  const qrLogo = selectedOrg?.logo || "/logo.png"

  // -- RENDER HELPERS --
  
  const renderStep1 = () => (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] mx-auto flex items-center justify-center mb-6 text-5xl shadow-inner border border-emerald-100/50">
          {formData.icon}
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">المعلومات الأساسية</h2>
        <p className="text-gray-500 font-medium text-lg">ابدأ بإعطاء لعبتك اسماً ووصفاً جذاباً للطلاب.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-4 space-y-3">
            <label className="text-sm font-bold text-gray-700 block">عنوان اللعبة</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="مثال: تحدي المسار المهني"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-right font-black text-xl placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block text-center">أيقونة اللعبة</label>
            <input 
              type="text" 
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-center text-3xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block">المؤسسة / الجمعية التابعة لها اللعبة</label>
            <div className="relative">
              <select 
                name="organizationId"
                value={formData.organizationId}
                onChange={handleFormChange}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-right font-black text-xl text-gray-700 bg-white appearance-none cursor-pointer placeholder:text-gray-300"
              >
                <option value="">اختيار المؤسسة (اختياري)</option>
                {MOCK_ORGANIZATIONS.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-6 h-6" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block">رابط اللعبة (الاسم اللطيف)</label>
            <div className="flex shadow-sm rounded-2xl overflow-hidden" dir="ltr">
              <span className="inline-flex items-center px-4 border-2 border-r-0 border-gray-100 bg-gray-50 text-gray-500 font-sans text-sm font-bold">
                app.com/
              </span>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleFormChange}
                placeholder="career-path"
                className="flex-1 min-w-0 px-4 py-4 border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-sans font-bold text-emerald-700 text-lg placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 block">الوصف أو الهدف من اللعبة</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
            placeholder="اكتب وصفاً مختصراً يشرح للطالب ما سيتعلمه من هذه اللعبة..."
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-right text-gray-600 resize-none leading-relaxed text-lg placeholder:text-gray-300"
          />
        </div>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
    >
      
      {/* Questions List Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 text-lg">الأسئلة ({scenarios.length})</h3>
            <button 
              onClick={addScenario}
              className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {scenarios.map((scenario, index) => (
              <div 
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex items-center gap-4 group
                  ${activeScenarioId === scenario.id 
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                    : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                  }`}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-2xl shrink-0">
                  {scenario.icon || "❓"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-600 mb-1">السؤال {index + 1}</div>
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {scenario.description || "سؤال جديد..."}
                  </div>
                </div>
                {scenarios.length > 1 && (
                  <button 
                    onClick={(e) => removeScenario(scenario.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Editor */}
      <div className="lg:col-span-8">
        {activeScenario && (
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-start gap-6 pb-8 border-b border-gray-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-blue-100 shrink-0 self-center md:self-start">
                <input 
                  type="text" 
                  value={activeScenario.icon}
                  onChange={(e) => updateActiveScenario('icon', e.target.value)}
                  className="w-full bg-transparent text-center outline-none"
                />
              </div>
              <div className="flex-1 space-y-3 pt-1 w-full">
                <input 
                  type="text" 
                  value={activeScenario.title}
                  onChange={(e) => updateActiveScenario('title', e.target.value)}
                  placeholder="عنوان السؤال (مثال: السؤال الأول)"
                  className="w-full text-lg font-bold text-gray-400 outline-none placeholder:text-gray-300"
                />
                <textarea 
                  value={activeScenario.description}
                  onChange={(e) => updateActiveScenario('description', e.target.value)}
                  placeholder="اكتب نص السؤال هنا..."
                  rows={2}
                  className="w-full text-2xl md:text-3xl font-black text-gray-900 outline-none resize-none placeholder:text-gray-200 leading-tight"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <h3 className="font-black text-gray-800 text-xl">الخيارات المتاحة</h3>
                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full inline-block w-fit">
                  يجب تحديد إجابة صحيحة واحدة
                </span>
              </div>
              
              <div className="space-y-4">
                {activeScenario.choices.map((choice, index) => (
                  <div 
                    key={index} 
                    className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 md:gap-5
                      ${choice.isCorrect ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}
                    `}
                  >
                    {/* Top Row: Answer Text & Correct Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 text-xl">
                          <input 
                            type="text" 
                            value={choice.icon}
                            onChange={(e) => updateChoice(index, 'icon', e.target.value)}
                            className="w-full bg-transparent text-center outline-none"
                          />
                        </div>
                        <input 
                          type="text"
                          value={choice.text}
                          onChange={(e) => updateChoice(index, 'text', e.target.value)}
                          placeholder={`الخيار ${index + 1}`}
                          className="flex-1 min-w-0 bg-transparent text-gray-900 font-black text-lg outline-none placeholder:text-gray-300"
                        />
                      </div>
                      <button 
                        onClick={() => updateChoice(index, 'isCorrect', 'true')}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all w-full sm:w-auto shrink-0
                          ${choice.isCorrect 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                          }
                        `}
                      >
                        <CheckCircle2 className={`w-5 h-5 ${choice.isCorrect ? 'opacity-100' : 'opacity-50'}`} />
                        <span>{choice.isCorrect ? 'إجابة صحيحة' : 'تحديد كصحيحة'}</span>
                      </button>
                    </div>

                    {/* Feedback Input */}
                    <div className="sm:mr-16 sm:pr-5 sm:border-r-4 border-gray-100 py-1 space-y-2">
                      <label className="text-xs font-bold text-gray-400 block">التغذية الراجعة (تظهر عند اختيار الطالب لهذا الخيار)</label>
                      <input 
                        type="text"
                        value={choice.feedback.message}
                        onChange={(e) => updateChoice(index, 'feedback.message', e.target.value)}
                        placeholder="اكتب التغذية الراجعة هنا..."
                        className="w-full bg-transparent text-sm font-bold text-gray-600 outline-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-lg shadow-gray-200/40 space-y-10 max-w-3xl mx-auto text-center"
    >
      
      <div className="w-28 h-28 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
        <Send className="w-12 h-12" />
      </div>
      
      <div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">أنت جاهز تقريباً!</h2>
        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed">
          لقد قمت بإنشاء اللعبة بنجاح بـ <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">{scenarios.length} أسئلة</span>. اختر حالة النشر لنتمكن من حفظها.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className={`cursor-pointer p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'published' ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100' : 'border-gray-200 hover:border-emerald-200 bg-white hover:bg-emerald-50/30'}`}>
          <input 
            type="radio" 
            name="status" 
            value="published" 
            checked={formData.status === 'published'}
            onChange={handleFormChange}
            className="sr-only"
          />
          <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-colors ${formData.status === 'published' ? 'border-emerald-500' : 'border-gray-300'}`}>
            {formData.status === 'published' && <div className="w-4 h-4 rounded-full bg-emerald-500" />}
          </div>
          <div className="text-2xl font-black text-emerald-700">نشر مباشر</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">اللعبة ستكون متاحة فوراً للطلاب باستخدام الرابط.</p>
        </label>

        <label className={`cursor-pointer p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'draft' ? 'border-gray-800 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'}`}>
          <input 
            type="radio" 
            name="status" 
            value="draft" 
            checked={formData.status === 'draft'}
            onChange={handleFormChange}
            className="sr-only"
          />
          <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-colors ${formData.status === 'draft' ? 'border-gray-800' : 'border-gray-300'}`}>
            {formData.status === 'draft' && <div className="w-4 h-4 rounded-full bg-gray-800" />}
          </div>
          <div className="text-2xl font-black text-gray-800">حفظ كمسودة</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">لن تكون اللعبة متاحة للطلاب حتى تقوم بنشرها لاحقاً.</p>
        </label>
      </div>

    </motion.div>
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      
      {/* Top Navigation */}
      <div>
        <Link 
          href="/dashboard/games" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للألعاب</span>
        </Link>
      </div>

      {/* Wizard Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">إنشاء لعبة جديدة</h1>
          
          {/* Stepper Progress */}
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { num: 1, label: "المعلومات الأساسية", icon: Gamepad2 },
              { num: 2, label: "بناء الأسئلة", icon: ListChecks },
              { num: 3, label: "النشر", icon: Send },
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

      {/* Error Message Display */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:right-64 p-6 md:p-10 flex items-center justify-between z-30 pointer-events-none">
        
        <button 
          onClick={() => { setStep(step - 1); setErrorMsg(null); }}
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
            onClick={handleNextStep}
            className="pointer-events-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95"
          >
            <span>المتابعة للخطوة التالية</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="pointer-events-auto flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-black text-lg transition-all shadow-2xl shadow-gray-900/40 hover:scale-105 active:scale-95"
          >
            <Save className="w-6 h-6 text-emerald-400" />
            <span>حفظ واعتماد اللعبة</span>
          </button>
        )}
        
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessPopup(false)}
              className="absolute inset-0 bg-black/40 pointer-events-auto"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 md:p-10 w-full max-w-xl shadow-2xl flex flex-col items-center text-center space-y-8 z-10 pointer-events-auto"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">تم نشر اللعبة بنجاح! 🎉</h3>
                <p className="text-gray-500 font-medium text-base max-w-sm mx-auto">
                  لعبتك "{formData.title}" أصبحت متاحة الآن للعب باستخدام الرابط أو رمز الاستجابة السريعة (QR).
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 w-full">
                <div className="p-4 rounded-2xl border-2 border-gray-100 flex justify-center items-center bg-white">
                  <QRCodeCanvas
                    id="qr-code-canvas"
                    value={gameUrl}
                    size={200}
                    level="H"
                    fgColor="#064e3b"
                    bgColor="#ffffff"
                    imageSettings={{
                      src: qrLogo,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>
                
                <button 
                  onClick={downloadQR}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto justify-center"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل كصورة (QR)</span>
                </button>
              </div>

              <div className="w-full space-y-2">
                <label className="text-sm font-bold text-gray-500 block text-right">رابط اللعبة المباشر</label>
                <div className="flex rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                  <div className="flex-1 px-4 py-3 bg-transparent text-gray-600 font-sans text-left min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" dir="ltr">
                    {gameUrl}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(gameUrl);
                      alert("تم نسخ الرابط!");
                    }}
                    className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 rounded-xl font-bold transition-colors shrink-0"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>نسخ</span>
                  </button>
                </div>
              </div>

              <div className="w-full pt-6">
                <Link 
                  href="/dashboard/games"
                  className="flex items-center justify-center w-full bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-gray-900/20 hover:scale-105 active:scale-95"
                >
                  العودة لقائمة الألعاب
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
