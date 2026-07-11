"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowRight, ArrowLeft, Save, 
  Gamepad2, ListChecks, Send, 
  CheckCircle2, AlertCircle, Link as LinkIcon, Download, Loader2
} from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

import { GameFormData, Scenario } from "./wizard/types"
import { generateDefaultChoices } from "./wizard/constants"
import { BasicInfoStep, OrganizationOption } from "./wizard/BasicInfoStep"
import { ScenariosStep } from "./wizard/ScenariosStep"
import { PublishStep } from "./wizard/PublishStep"
import { saveFullGameAction } from "@/lib/actions/game-wizard.actions"

interface GameWizardProps {
  isEdit?: boolean;
  gameId?: string;
  initialGame?: Partial<GameFormData>;
  initialScenarios?: Scenario[];
  organizations: OrganizationOption[];
}

export function GameWizard({ 
  isEdit = false, 
  gameId, 
  initialGame, 
  initialScenarios, 
  organizations 
}: GameWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  // Game State
  const [formData, setFormData] = useState<GameFormData>({
    title: initialGame?.title || "",
    description: initialGame?.description || "",
    slug: initialGame?.slug || "",
    icon: initialGame?.icon || "🎮",
    status: initialGame?.status || "draft",
    organizationId: initialGame?.organizationId || "",
  })

  // Scenarios State
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios || [
    {
      id: "1",
      icon: "❓",
      title: "السؤال الأول",
      description: "",
      choices: generateDefaultChoices()
    }
  ])

  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || "1")

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }))
    }
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
    if (errors[`scenario_${activeScenarioId}_${field}`]) {
      setErrors(prev => ({ ...prev, [`scenario_${activeScenarioId}_${field}`]: "" }))
    }
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
          if (errors[`scenario_${activeScenarioId}_feedback_${choiceIndex}`]) {
             setErrors(prev => ({ ...prev, [`scenario_${activeScenarioId}_feedback_${choiceIndex}`]: "" }))
          }
        } else {
          updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], [field]: value }
          if (errors[`scenario_${activeScenarioId}_choice_${choiceIndex}`]) {
            setErrors(prev => ({ ...prev, [`scenario_${activeScenarioId}_choice_${choiceIndex}`]: "" }))
          }
        }
      }
      return { ...s, choices: updatedChoices }
    }))
    if (errorMsg) setErrorMsg(null)
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "الرجاء إدخال عنوان اللعبة."
    if (!formData.description.trim()) newErrors.description = "الرجاء إدخال وصف اللعبة."
    if (!formData.slug.trim()) newErrors.slug = "الرجاء إدخال الرابط المختصر."
    if (!formData.icon.trim()) newErrors.icon = "الرجاء إدخال أيقونة."
    if (!formData.organizationId) newErrors.organizationId = "الرجاء اختيار المؤسسة التابعة لها اللعبة."
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return "يرجى تعبئة جميع الحقول المطلوبة."
    }
    return null
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    let firstErrorScenarioId = ""

    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i]
      if (!s.title.trim()) newErrors[`scenario_${s.id}_title`] = "مطلوب"
      if (!s.description.trim()) newErrors[`scenario_${s.id}_desc`] = "مطلوب"
      if (!s.icon.trim()) newErrors[`scenario_${s.id}_icon`] = "مطلوب"
      
      let hasError = !s.title.trim() || !s.description.trim() || !s.icon.trim()

      for (let j = 0; j < s.choices.length; j++) {
        const c = s.choices[j]
        if (!c.text.trim()) {
           newErrors[`scenario_${s.id}_choice_${j}`] = "مطلوب"
           hasError = true
        }
        if (!c.feedback.message.trim()) {
           newErrors[`scenario_${s.id}_feedback_${j}`] = "مطلوب"
           hasError = true
        }
      }

      if (hasError && !firstErrorScenarioId) {
        firstErrorScenarioId = s.id
      }
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      if (firstErrorScenarioId) setActiveScenarioId(firstErrorScenarioId)
      return "يوجد حقول غير مكتملة في الأسئلة، يرجى مراجعتها."
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
    setErrors({})
    setStep(step + 1)
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await saveFullGameAction(
          {
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            icon: formData.icon,
            status: formData.status as any,
            organizationId: formData.organizationId || null,
          },
          scenarios.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            icon: s.icon,
            choices: s.choices,
          })),
          gameId
        );

        if (result.success) {
          if (formData.status === 'published') {
            setShowSuccessPopup(true)
          } else {
            router.push("/dashboard/games");
          }
        }
      } catch (error) {
        console.error("Failed to save game", error);
        setErrorMsg("حدث خطأ أثناء حفظ اللعبة. يرجى المحاولة مرة أخرى.");
      }
    });
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

  const selectedOrg = organizations.find(org => org.id === formData.organizationId)
  const qrLogo = selectedOrg?.logo || "/logo.png"

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
          <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">{isEdit ? "تعديل اللعبة" : "إنشاء لعبة جديدة"}</h1>
          
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
          {step === 1 && (
            <BasicInfoStep 
              formData={formData} 
              onChange={handleFormChange} 
              errors={errors} 
              organizations={organizations}
            />
          )}
          {step === 2 && (
            <ScenariosStep 
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              setActiveScenarioId={setActiveScenarioId}
              addScenario={addScenario}
              removeScenario={removeScenario}
              updateActiveScenario={updateActiveScenario}
              updateChoice={updateChoice}
              errors={errors}
            />
          )}
          {step === 3 && (
            <PublishStep 
              formData={formData} 
              onChange={handleFormChange} 
              isEdit={isEdit} 
              scenariosLength={scenarios.length} 
            />
          )}
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
            <span>التالي</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="pointer-events-auto flex items-center justify-center gap-3 bg-gray-900 hover:bg-black disabled:bg-gray-700 text-white w-full sm:w-[240px] px-6 py-4 rounded-xl font-black text-lg transition-all shadow-2xl shadow-gray-900/40 hover:scale-105 active:scale-95"
          >
            {isPending ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : <Save className="w-6 h-6 text-emerald-400" />}
            <span>{isPending ? "جاري الحفظ..." : "حفظ واعتماد اللعبة"}</span>
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
