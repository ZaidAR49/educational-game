"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Gamepad2, LineChart, Sparkles, MonitorSmartphone, Users } from "lucide-react"

const features = [
  {
    title: "صناعة الألعاب التعليمية",
    description: "قم بإنشاء سيناريوهات واختبارات تفاعلية بسهولة باستخدام أدوات بسيطة ومتقدمة في نفس الوقت.",
    icon: Gamepad2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "بدون حسابات للطلاب",
    description: "لا يحتاج الطلاب إلى إنشاء حسابات. فقط شارك الرابط وابدأ اللعب فوراً للحفاظ على خصوصيتهم.",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "إحصائيات فورية",
    description: "تتبع أداء الطلاب واستجاباتهم بشكل لحظي لتحديد نقاط القوة والضعف.",
    icon: LineChart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "متوافق مع كل الأجهزة",
    description: "المنصة مصممة لتعمل بسلاسة على الهواتف، الأجهزة اللوحية، والشاشات الذكية.",
    icon: MonitorSmartphone,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "تغذية راجعة ذكية",
    description: "احصل على تعليقات مخصصة بعد كل اختيار لمساعدة الطالب على التعلم من أخطائه.",
    icon: Sparkles,
    color: "bg-teal-100 text-teal-600",
  },
  {
    title: "مشاركة المجتمع",
    description: "شارك ألعابك مع معلمين آخرين واستفد من مكتبة الألعاب العامة المتاحة.",
    icon: Users,
    color: "bg-rose-100 text-rose-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            كل ما تحتاجه لإدارة تجربة <span className="text-emerald-600">تعليمية ناجحة</span>
          </h2>
          <p className="text-lg text-gray-600">
            صممنا المنصة لتكون المساعد الأول للمعلم في إنشاء محتوى تفاعلي يجذب انتباه الطلاب ويحقق الأهداف التعليمية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-right">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
