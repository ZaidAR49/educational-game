"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, XCircle, RotateCcw, Sparkles, Trophy, Gamepad2, Lightbulb,
} from "lucide-react"

const demoQuestion = {
  title: "ما الذي يحدث للنبات إذا تم حجبه عن ضوء الشمس تماماً؟",
  description: "اختبر التغذية الراجعة الفورية التفاعلية التي يراها الطلاب أثناء اللعب! 👇",
  choices: [
    {
      id: 1,
      text: "ينمو بشكل أسرع للبحث عن مصدر الضوء",
      isCorrect: false,
      feedback: {
        title: "محاولة خاطئة 💡",
        message: "قد يتجه النبات للأعلى مؤقتاً ولكنه سرعان ما يذبل. النباتات بحاجة ماسة للضوء لصناعة الغذاء.",
        tip: "تلميحة: عملية صنع الغذاء في النبات تسمى البناء الضوئي.",
      },
    },
    {
      id: 2,
      text: "يذبل ويموت تدريجياً لعدم قدرته على صنع الغذاء",
      isCorrect: true,
      feedback: {
        title: "إجابة صحيحة وممتازة! 🏆",
        message: "بدون ضوء الشمس، لا يمكن للنبات القيام بعملية البناء الضوئي لإنتاج الطاقة (الجلوكوز) اللازمة لبقائه ونموه.",
        tip: "معلومة إضافية: مادة الكلوروفيل الخضراء هي التي تمتص الضوء وتبدأ التفاعل الكيميائي لإنتاج الغذاء.",
      },
    },
    {
      id: 3,
      text: "يتغير لون أوراقه إلى الأزرق الداكن",
      isCorrect: false,
      feedback: {
        title: "محاولة خاطئة 💡",
        message: "يتغير لون الأوراق إلى الأصفر وليس الأزرق، بسبب تحلل مادة الكلوروفيل الخضراء لغياب الضوء.",
        tip: "تلميحة: اصفرار الأوراق هو أولى علامات نقص الإضاءة في النباتات.",
      },
    },
    {
      id: 4,
      text: "يستمر بالنمو بشكل طبيعي دون أي تأثر",
      isCorrect: false,
      feedback: {
        title: "إجابة خاطئة ❌",
        message: "الضوء هو شريان الحياة للنبات. لا يمكن لأي نبات أخضر أن يعيش وينمو طبيعياً في الظلام الدامس.",
        tip: "معلومة: بعض الفطريات تنمو في الظلام، لكنها ليست نباتات حقيقية ولا تقوم بالبناء الضوئي.",
      },
    },
  ],
}

export function DemoGameCard() {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  const handleChoiceSelect = (choice: (typeof demoQuestion.choices)[0]) => {
    if (selectedChoiceId !== null) return
    setSelectedChoiceId(choice.id)
    if (choice.isCorrect) setScore(10)
  }

  const handleReset = () => {
    setSelectedChoiceId(null)
    setScore(0)
  }

  const selectedChoice = demoQuestion.choices.find((c) => c.id === selectedChoiceId)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Decorative back plate */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-[2.5rem] rotate-2 shadow-2xl opacity-10 blur-sm" />

      <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 overflow-hidden">
        {/* Stats bar */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-bold text-sm">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>{score} نقاط</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
            <span>السؤال 1 من 1</span>
            <Gamepad2 className="w-4 h-4 text-blue-500" />
          </div>
        </div>

        {/* Scenario */}
        <div className="mb-6 text-right">
          <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">{demoQuestion.title}</h3>
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">
            {demoQuestion.description}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {demoQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id
            const hasSelectedAny = selectedChoiceId !== null

            let style = "border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
            if (isSelected) {
              style = choice.isCorrect
                ? "border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-md shadow-emerald-500/10"
                : "border-red-500 bg-red-50/80 text-red-900 shadow-md shadow-red-500/10"
            } else if (hasSelectedAny) {
              style = choice.isCorrect
                ? "border-emerald-200 bg-emerald-50/30 text-emerald-800 opacity-80"
                : "border-gray-100 bg-gray-50/20 text-gray-400 opacity-50"
            }

            return (
              <button
                key={choice.id}
                disabled={hasSelectedAny}
                onClick={() => handleChoiceSelect(choice)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 font-bold transition-all duration-300 text-right ${style}`}
              >
                <div className="flex items-center gap-3">
                  {isSelected && choice.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isSelected && !choice.isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                  <span className="text-sm md:text-base">{choice.text}</span>
                </div>
                <span className="text-gray-400 text-xs shrink-0 bg-white/80 w-6 h-6 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                  {choice.id}
                </span>
              </button>
            )
          })}
        </div>

        {/* Animated feedback */}
        <AnimatePresence>
          {selectedChoice && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              className="mt-6 pt-5 border-t border-gray-100 text-right"
            >
              <div
                className={`p-5 rounded-2xl border ${
                  selectedChoice.isCorrect
                    ? "bg-emerald-50/60 border-emerald-100 text-emerald-950"
                    : "bg-red-50/60 border-red-100 text-red-950"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-base">
                  {selectedChoice.isCorrect ? (
                    <Trophy className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lightbulb className="w-5 h-5 text-red-600" />
                  )}
                  <span>{selectedChoice.feedback.title}</span>
                </div>
                <p className="text-xs md:text-sm font-medium leading-relaxed mb-3">
                  {selectedChoice.feedback.message}
                </p>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-100/50 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-gray-700 leading-normal">{selectedChoice.feedback.tip}</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 border border-gray-200/60 hover:border-emerald-200 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>جرب خياراً آخر</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
