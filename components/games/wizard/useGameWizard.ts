import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GameFormData, Scenario } from "./types"
import { generateDefaultChoices } from "./constants"
import { saveFullGameAction } from "@/lib/actions/game-wizard.actions"

type UseGameWizardProps = {
  gameId?: string
  initialGame?: Partial<GameFormData>
  initialScenarios?: Scenario[]
}

export function useGameWizard({ gameId, initialGame, initialScenarios }: UseGameWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [createdGameId, setCreatedGameId] = useState<string | null>(null)
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
  const [scenarios, setScenarios] = useState<Scenario[]>(
    initialScenarios || [
      {
        id: "1",
        icon: "❓",
        title: "السؤال الأول",
        description: "",
        choices: generateDefaultChoices(),
      },
    ]
  )

  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || "1")

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }
    if (errorMsg) setErrorMsg(null)
  }

  const addScenario = () => {
    const newId = Date.now().toString()
    setScenarios([
      ...scenarios,
      {
        id: newId,
        icon: "❓",
        title: `السؤال ${scenarios.length + 1}`,
        description: "",
        choices: generateDefaultChoices(),
      },
    ])
    setActiveScenarioId(newId)
    if (errorMsg) setErrorMsg(null)
  }

  const removeScenario = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (scenarios.length <= 1) return toast.error("يجب أن تحتوي اللعبة على سؤال واحد على الأقل.")
    const filtered = scenarios.filter((s) => s.id !== id)
    setScenarios(filtered)
    if (activeScenarioId === id) {
      setActiveScenarioId(filtered[0].id)
    }
  }

  const updateActiveScenario = (field: string, value: any) => {
    setScenarios(
      scenarios.map((s) => (s.id === activeScenarioId ? { ...s, [field]: value } : s))
    )
    if (errors[`scenario_${activeScenarioId}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`scenario_${activeScenarioId}_${field}`]: "" }))
    }
    if (errorMsg) setErrorMsg(null)
  }

  const updateChoice = (choiceIndex: number, field: string, value: string) => {
    setScenarios(
      scenarios.map((s) => {
        if (s.id !== activeScenarioId) return s
        const updatedChoices = [...s.choices]

        if (field === "isCorrect") {
          updatedChoices.forEach((c, idx) => {
            c.isCorrect = idx === choiceIndex
            c.feedback.title = idx === choiceIndex ? "إجابة صحيحة! 🌟" : "إجابة غير صحيحة! 🤔"
          })
        } else {
          if (field.startsWith("feedback.")) {
            const feedbackField = field.split(".")[1]
            updatedChoices[choiceIndex].feedback = {
              ...updatedChoices[choiceIndex].feedback,
              [feedbackField]: value,
            }
            if (errors[`scenario_${activeScenarioId}_feedback_${choiceIndex}`]) {
              setErrors((prev) => ({
                ...prev,
                [`scenario_${activeScenarioId}_feedback_${choiceIndex}`]: "",
              }))
            }
          } else {
            updatedChoices[choiceIndex] = { ...updatedChoices[choiceIndex], [field]: value }
            if (errors[`scenario_${activeScenarioId}_choice_${choiceIndex}`]) {
              setErrors((prev) => ({
                ...prev,
                [`scenario_${activeScenarioId}_choice_${choiceIndex}`]: "",
              }))
            }
          }
        }
        return { ...s, choices: updatedChoices }
      })
    )
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
          scenarios.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            icon: s.icon,
            choices: s.choices,
          })),
          gameId
        )

        if (result.success) {
          if (formData.status === "published") {
            if (result.gameId) setCreatedGameId(result.gameId)
            setShowSuccessPopup(true)
          } else {
            router.push("/dashboard/games")
          }
        }
      } catch (error) {
        console.error("Failed to save game", error)
        setErrorMsg("حدث خطأ أثناء حفظ اللعبة. يرجى المحاولة مرة أخرى.")
      }
    })
  }

  return {
    step,
    setStep,
    errorMsg,
    setErrorMsg,
    errors,
    showSuccessPopup,
    setShowSuccessPopup,
    createdGameId,
    isPending,
    formData,
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    handleFormChange,
    addScenario,
    removeScenario,
    updateActiveScenario,
    updateChoice,
    handleNextStep,
    handleSave,
  }
}
