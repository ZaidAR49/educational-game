"use client"

import { motion } from "framer-motion"
import { 
  Wand2, 
  Bot, 
  Zap, 
  Lightbulb, 
  BarChart3, 
  Building2, 
  ArrowLeft,
  Copy,
  Sparkles,
  Play
} from "lucide-react"
import { useState } from "react"

export function FeaturesSection() {
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  
  const handleCopyMockPrompt = () => {
    navigator.clipboard.writeText("You are an expert educational game designer. Generate a highly engaging interactive quiz game in Arabic about...")
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ميزات مصممة خصيصاً للتعليم الحديث</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            كل ما تحتاجه لإدارة تجربة <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-blue-600">تعليمية استثنائية</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            تجاوزنا حدود الأسئلة التقليدية. صممنا المنصة لتدمج الذكاء الاصطناعي مع أساليب التعلم النشط لتوفير أداة قوية وسهلة في متناول المعلمين.
          </p>
        </div>

        {/* 1. AI Spotlight Section (Auto AI + Prompting Blueprints) */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Bot className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              ثورة الذكاء الاصطناعي في إعداد الدروس
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: Auto AI Wizard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-[2.5rem] p-8 md:p-10 border border-emerald-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] group hover:shadow-emerald-900/20"
            >
              {/* Glow decor */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Wand2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="text-2xl font-black mb-4">التوليد التلقائي الفوري (Auto AI)</h4>
                <p className="text-emerald-100/80 font-medium leading-relaxed text-sm md:text-base mb-8">
                  لا تحتاج للتفكير في الأسئلة أو صياغة الخيارات بعد الآن. أدخل موضوع درسك فقط، وسيقوم الذكاء الاصطناعي المدمج بتجهيز لعبة تفاعلية كاملة مع تفاصيل التغذية الراجعة والتلميحات في ثوانٍ معدودة.
                </p>
              </div>

              {/* Visual Demo inside Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4.5 relative overflow-hidden text-right z-10">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-3">
                  <span>جاري المعالجة بواسطة Gemini...</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/10 px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-between">
                    <span>موضوع الدرس: سلسلة الغذاء في النظام البيئي</span>
                    <Play className="w-3 h-3 text-emerald-400 fill-current" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-[10px] text-emerald-100 font-bold">1. المنتج (العشب) 🌾</div>
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-[10px] text-emerald-100 font-bold">2. المستهلك (الأرنب) 🐰</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: BYO AI Prompt Engine */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-950 to-purple-900 text-white rounded-[2.5rem] p-8 md:p-10 border border-purple-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px] group hover:shadow-purple-900/20"
            >
              {/* Glow decor */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-purple-400" />
                </div>
                <h4 className="text-2xl font-black mb-4">محرك الموجهات الاحترافية (BYO Prompt)</h4>
                <p className="text-purple-100/80 font-medium leading-relaxed text-sm md:text-base mb-8">
                  هل تفضل استخدام نماذج ذكاء اصطناعي أخرى مثل ChatGPT أو Claude؟ نوفر لك نموذج أمر برمجي (Prompt Blueprint) مهندساً بدقة متناهية. انسخ الموجه واستخدمه خارجياً، ثم الصق كود الـ JSON الناتج هنا لإنشاء اللعبة فوراً!
                </p>
              </div>

              {/* Visual Prompt Copy Demo */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4.5 flex items-center justify-between text-right z-10">
                <div className="overflow-hidden max-w-[70%]">
                  <div className="text-[10px] text-purple-300 font-bold mb-1">الموجّه البرمجي الجاهز للنسخ:</div>
                  <div className="text-xs font-mono text-purple-100 truncate">
                    You are an expert educational game designer. Generate JSON...
                  </div>
                </div>
                <button
                  onClick={handleCopyMockPrompt}
                  className="bg-white text-purple-950 hover:bg-purple-50 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? "تم النسخ!" : "نسخ الموجه"}</span>
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {/* 2. Core Platform Features Grid */}
        <div>
          <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Zap className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              الميزات الفائقة لإدارة صفك التفاعلي
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature 1: Zero Friction Student Entry */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-right"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">دخول فوري للطلاب بدون حسابات</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  لا تعقيد ولا هدر لوقت الحصة. ينضم الطلاب في ثانيتين بمسح الـ QR أو النقر على الرابط المباشر. نحمي خصوصية طلابك تماماً مع توفير انضمام فوري خالٍ من الفوضى.
                </p>
              </div>
            </motion.div>

            {/* Feature 2: Pedagogical Explanatory Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-right"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Lightbulb className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">تغذية راجعة تفصيلية وتلميحات</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  ليست مجرد لعبة أسئلة. عند اختيار الإجابة، يرى الطالب فوراً شرحاً مفصلاً يوضّح له لماذا هذه الإجابة صحيحة أو خاطئة، مدعومة بتلميحات إضافية (Tips) لضمان ترسخ المفهوم التعليمي.
                </p>
              </div>
            </motion.div>

            {/* Feature 3: Realtime Session Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-right"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">تحليلات الأداء لحظة بلحظة</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  راقب مستويات استيعاب طلابك مباشرة أثناء اللعب. رسوم بيانية توضح توزيع الدرجات، نسب الإجابات الصحيحة والخاطئة لكل سؤال، لتتمكن من تعديل مسار الحصة وتحديد نقاط الضعف فوراً.
                </p>
              </div>
            </motion.div>

            {/* Feature 4: Organization Support */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 hover:bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 group flex items-start gap-6 text-right"
            >
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">إدارة المؤسسات والمدارس</h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  قسّم أعمالك وألعابك وإحصاءاتك تحت مظلات تنظيمية (Organizations) متعددة. أضف شعار مدرستك أو علامتك التجارية ليتم استعراضها للطلاب بشكل احترافي أثناء اللعب.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}

