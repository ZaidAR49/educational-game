"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  PlayCircle, 
  GraduationCap, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Trophy,
  Gamepad2,
  Lightbulb
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
        tip: "تلميحة: عملية صنع الغذاء في النبات تسمى البناء الضوئي."
      }
    },
    {
      id: 2,
      text: "يذبل ويموت تدريجياً لعدم قدرته على صنع الغذاء",
      isCorrect: true,
      feedback: {
        title: "إجابة صحيحة وممتازة! 🏆",
        message: "بدون ضوء الشمس، لا يمكن للنبات القيام بعملية البناء الضوئي لإنتاج الطاقة (الجلوكوز) اللازمة لبقائه ونموه.",
        tip: "معلومة إضافية: مادة الكلوروفيل الخضراء هي التي تمتص الضوء وتبدأ التفاعل الكيميائي لإنتاج الغذاء."
      }
    },
    {
      id: 3,
      text: "يتغير لون أوراقه إلى الأزرق الداكن",
      isCorrect: false,
      feedback: {
        title: "محاولة خاطئة 💡",
        message: "يتغير لون الأوراق إلى الأصفر وليس الأزرق، بسبب تحلل مادة الكلوروفيل الخضراء لغياب الضوء.",
        tip: "تلميحة: اصفرار الأوراق هو أولى علامات نقص الإضاءة في النباتات."
      }
    },
    {
      id: 4,
      text: "يستمر بالنمو بشكل طبيعي دون أي تأثر",
      isCorrect: false,
      feedback: {
        title: "إجابة خاطئة ❌",
        message: "الضوء هو شريان الحياة للنبات. لا يمكن لأي نبات أخضر أن يعيش وينمو طبيعياً في الظلام الدامس.",
        tip: "معلومة: بعض الفطريات تنمو في الظلام، لكنها ليست نباتات حقيقية ولا تقوم بالبناء الضوئي."
      }
    }
  ]
}

export function HeroSection({ content }: { content: any }) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)

  const handleChoiceSelect = (choice: typeof demoQuestion.choices[0]) => {
    if (selectedChoiceId !== null) return
    setSelectedChoiceId(choice.id)
    if (choice.isCorrect) {
      setScore(10)
      setAnsweredCorrectly(true)
    } else {
      setAnsweredCorrectly(false)
    }
  }

  const handleReset = () => {
    setSelectedChoiceId(null)
    setScore(0)
    setAnsweredCorrectly(false)
  }

  const selectedChoice = demoQuestion.choices.find(c => c.id === selectedChoiceId)

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-blue-50/30 to-white min-h-[90vh] flex items-center pt-28 pb-20">
      
      {/* Abstract Glowing Blobs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute top-[30%] -left-[10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] animate-pulse duration-[10s]" />
        <div className="absolute -bottom-[20%] right-[20%] w-[450px] h-[450px] bg-teal-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-16 2xl:px-24 mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Right Side: Copywriting & CTA */}
          <div className="text-right flex flex-col items-start w-full lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-bold mb-6 text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin duration-[4s]" />
              <span>ألعاب تعليمية تفاعلية مدعومة بالذكاء الاصطناعي</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.15] mb-6 tracking-tight"
            >
              اصنع ألعابك التعليمية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600">
                بلمسة ذكاء اصطناعي
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              منصة <span className="font-bold text-emerald-600">{content.app.name}</span> تمكّن المعلمين من توليد سيناريوهات تفاعلية مذهلة واختبارات شيقة في ثوانٍ. انضمام فوري للطلاب بلمح البصر دون أي حسابات أو تعقيدات.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 py-4.5 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>ابدأ مجاناً كمعلم</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/game/demo"
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 hover:border-gray-200 px-8 py-4.5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span>جرب اللعب كطالب</span>
              </Link>
            </motion.div>
          </div>

          {/* Left Side: Interactive Mockup Game Card */}
          <div className="w-full lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-lg mx-auto"
            >
              {/* Decorative back plate */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-[2.5rem] rotate-2 shadow-2xl opacity-10 blur-sm"></div>
              
              {/* Main Card Container */}
              <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 overflow-hidden">
                
                {/* Top stats bar */}
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

                {/* Scenario details */}
                <div className="mb-6 text-right">
                  <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
                    {demoQuestion.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">
                    {demoQuestion.description}
                  </p>
                </div>

                {/* Choices list */}
                <div className="space-y-3">
                  {demoQuestion.choices.map((choice) => {
                    const isSelected = selectedChoiceId === choice.id
                    const isCorrectChoice = choice.isCorrect
                    const hasSelectedAny = selectedChoiceId !== null
                    
                    let choiceStyle = "border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
                    
                    if (isSelected) {
                      if (isCorrectChoice) {
                        choiceStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-900 shadow-md shadow-emerald-500/10"
                      } else {
                        choiceStyle = "border-red-500 bg-red-50/80 text-red-900 shadow-md shadow-red-500/10"
                      }
                    } else if (hasSelectedAny) {
                      if (isCorrectChoice) {
                        choiceStyle = "border-emerald-200 bg-emerald-50/30 text-emerald-800 opacity-80"
                      } else {
                        choiceStyle = "border-gray-100 bg-gray-50/20 text-gray-400 opacity-50"
                      }
                    }

                    return (
                      <button
                        key={choice.id}
                        disabled={hasSelectedAny}
                        onClick={() => handleChoiceSelect(choice)}
                        className={`w-full flex items-center justify-between p-4.5 rounded-2xl border-2 font-bold transition-all duration-300 text-right ${choiceStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected && isCorrectChoice && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                          {isSelected && !isCorrectChoice && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                          <span className="text-sm md:text-base">{choice.text}</span>
                        </div>
                        <span className="text-gray-400 text-xs shrink-0 bg-white/80 w-6 h-6 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                          {choice.id}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Animated Feedback Box */}
                <AnimatePresence>
                  {selectedChoice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: 10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      className="mt-6 pt-5 border-t border-gray-100 text-right"
                    >
                      <div className={`p-5 rounded-2xl border ${
                        selectedChoice.isCorrect 
                          ? "bg-emerald-50/60 border-emerald-100 text-emerald-950" 
                          : "bg-red-50/60 border-red-100 text-red-950"
                      }`}>
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
                          <p className="text-xs font-bold text-gray-700 leading-normal">
                            {selectedChoice.feedback.tip}
                          </p>
                        </div>
                      </div>

                      {/* Try again control */}
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
          </div>

        </div>
      </div>

      {/* Scroll Down Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#features" className="flex flex-col items-center text-emerald-600 hover:text-emerald-700 transition-colors">
          <span className="text-xs font-bold mb-1 opacity-70">اكتشف الميزات بالكامل</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}

