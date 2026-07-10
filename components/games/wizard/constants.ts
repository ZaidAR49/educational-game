import { Choice } from "./types"

export const MOCK_ORGANIZATIONS = [
  { id: "org-1", name: "جمعية حماية الأسرة والطفولة", logo: "/logo.png" },
  { id: "org-2", name: "مدارس الإبداع الأهلية", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" },
  { id: "org-3", name: "مؤسسة بدون شعار", logo: "" },
]

export const generateDefaultChoices = (): Choice[] => {
  return [
    { text: "", icon: "🎯", isCorrect: true, feedback: { title: "إجابة صحيحة! 🌟", message: "أحسنت الاختيار!", tip: "استمر على هذا المنوال." } },
    { text: "", icon: "🤔", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
    { text: "", icon: "💡", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
    { text: "", icon: "🧩", isCorrect: false, feedback: { title: "إجابة غير صحيحة! 🤔", message: "حاول مرة أخرى في المرات القادمة.", tip: "الخطأ جزء من التعلم." } },
  ]
}
