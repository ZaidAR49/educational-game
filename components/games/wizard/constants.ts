import { Choice } from "./types"

export const MOCK_ORGANIZATIONS = [
  { id: "org-1", name: "جمعية حماية الأسرة والطفولة", logo: "/logo.png" },
  { id: "org-2", name: "مدارس الإبداع الأهلية", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" },
  { id: "org-3", name: "مؤسسة بدون شعار", logo: "" },
]

export const generateDefaultChoices = (isRTL: boolean = true): Choice[] => {
  return [
    {
      text: isRTL ? "الخيار 1 (الإجابة الصحيحة)" : "Option 1 (Correct Answer)",
      icon: "🎯",
      isCorrect: true,
      feedback: {
        title: isRTL ? "إجابة صحيحة! 🌟" : "Correct answer! 🌟",
        message: isRTL ? "أحسنت الاختيار!" : "Great job!",
        tip: isRTL ? "استمر على هذا المنوال." : "Keep it up."
      }
    },
    {
      text: isRTL ? "الخيار 2" : "Option 2",
      icon: "🤔",
      isCorrect: false,
      feedback: {
        title: isRTL ? "إجابة غير صحيحة! 🤔" : "Incorrect answer! 🤔",
        message: isRTL ? "حاول مرة أخرى في المرات القادمة." : "Try again next time.",
        tip: isRTL ? "الخطأ جزء من التعلم." : "Mistakes are part of learning."
      }
    },
    {
      text: isRTL ? "الخيار 3" : "Option 3",
      icon: "💡",
      isCorrect: false,
      feedback: {
        title: isRTL ? "إجابة غير صحيحة! 🤔" : "Incorrect answer! 🤔",
        message: isRTL ? "حاول مرة أخرى في المرات القادمة." : "Try again next time.",
        tip: isRTL ? "الخطأ جزء من التعلم." : "Mistakes are part of learning."
      }
    },
    {
      text: isRTL ? "الخيار 4" : "Option 4",
      icon: "🧩",
      isCorrect: false,
      feedback: {
        title: isRTL ? "إجابة غير صحيحة! 🤔" : "Incorrect answer! 🤔",
        message: isRTL ? "حاول مرة أخرى في المرات القادمة." : "Try again next time.",
        tip: isRTL ? "الخطأ جزء من التعلم." : "Mistakes are part of learning."
      }
    },
  ]
}

export const DEFAULT_CHOICES_AR: Choice[] = generateDefaultChoices(true)
export const DEFAULT_CHOICES_EN: Choice[] = generateDefaultChoices(false)
