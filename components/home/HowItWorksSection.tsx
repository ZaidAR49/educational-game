"use client"

import { motion } from "framer-motion"
import { UserPlus, Settings2, Rocket } from "lucide-react"

const steps = [
  {
    title: "1. أنشئ حسابك",
    description: "سجل كمعلم في ثوانٍ للوصول إلى لوحة التحكم الخاصة بك والبدء في إنشاء الألعاب.",
    icon: UserPlus,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "2. صمم اللعبة أو الاختبار",
    description: "استخدم محررنا البسيط لإضافة الأسئلة، الخيارات، والتغذية الراجعة التفاعلية لكل سؤال.",
    icon: Settings2,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    title: "3. انشر وشارك",
    description: "احصل على رابط مباشر للعبتك وشاركه مع طلابك ليلعبوا فوراً دون الحاجة لتسجيل الدخول.",
    icon: Rocket,
    color: "from-purple-400 to-purple-600",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            كيف <span className="text-emerald-600">تعمل المنصة؟</span>
          </h2>
          <p className="text-lg text-gray-600">
            ثلاث خطوات بسيطة تفصلك عن إنشاء تجربة تعليمية لا تُنسى لطلابك.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 -translate-y-1/2 z-0 rounded-full"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 text-center relative group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-0`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
