import Link from "next/link"
import { 
  Wand2, 
  QrCode, 
  Smartphone, 
  BarChart3, 
  Lightbulb, 
  Play, 
  Sparkles, 
  Plus, 
  Building2,
  HelpCircle,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  History,
  XOctagon
} from "lucide-react"

export const dynamic = "force-dynamic"

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right pb-16" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">دليل الاستخدام السريع</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm mr-13">
            دليلك الشامل لإطلاق أول لعبة تفاعلية وإشراك طلابك بنجاح من البداية وحتى التحليل النهائي.
          </p>
        </div>
        
        <Link 
          href="/dashboard/games/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0 self-start md:self-auto animate-pulse"
        >
          <Plus className="w-5 h-5" />
          <span>أنشئ لعبتك الأولى</span>
        </Link>
      </div>

      {/* Main Workflow Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>سير العمل الأساسي (The Core Journey)</span>
        </h2>

        {/* Timeline Steps */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-slate-400"></div>
            <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">١</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>إنشاء مؤسسة تعليمية أولاً</span>
                <Building2 className="w-4 h-4 text-slate-550" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                لكي تتمكن من إنشاء ألعابك وإدارتها، <strong>يجب أولاً الانضمام أو إنشاء مؤسسة تعليمية</strong> (مثل المدرسة، المركز التعليمي، أو الصف الدراسي).
              </p>
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-gray-100 text-sm">
                <span className="font-bold text-gray-900 block mb-1">لماذا المؤسسة؟</span>
                <span className="text-gray-500 leading-relaxed block text-xs">
                  تُستخدم المؤسسات لتنظيم الألعاب والتحليلات الخاصة بك. كما يمكنك رفع شعار مدرستك أو علامتك التجارية الخاصة ليتم استعراضها للطلاب بشكل احترافي أثناء اللعب.
                </span>
                <Link 
                  href="/dashboard/organizations"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-650 hover:text-emerald-700 mt-3"
                >
                  <span>اذهب لصفحة المؤسسات الآن</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">٢</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>إنشاء وتصميم اللعبة</span>
                <Wand2 className="w-4 h-4 text-blue-500" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                داخل مؤسستك، يمكنك النقر على <strong>"إنشاء لعبة جديدة"</strong>. نوفر لك أدوات ذكية لتصميم محتواك التعليمي بمرونة فائقة:
              </p>
              
              {/* AI & Creation features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-2xl text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">🪄 التوليد بالذكاء الاصطناعي (Auto AI)</span>
                  <span className="text-gray-650 leading-relaxed block">
                    أدخل موضوع الدرس (مثل: دورة حياة الماء) وسيقوم الذكاء الاصطناعي المدمج (Gemini) بتوليد أسئلة صحيحة وخيارات وتفسيرات كاملة في ثوانٍ.
                  </span>
                </div>
                <div className="bg-purple-50/30 border border-purple-100/50 p-4 rounded-2xl text-xs">
                  <span className="font-bold text-purple-900 block mb-1">🤖 البناء عبر الموجه (BYO Prompt)</span>
                  <span className="text-gray-650 leading-relaxed block">
                    انسخ نموذج الموجه التعليمي المهندس مسبقاً، واستخدمه مع ChatGPT أو Claude الخارجي، ثم الصق كود JSON الناتج هنا لتوليد اللعبة فوراً.
                  </span>
                </div>
              </div>

              {/* Pedagogical elements */}
              <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-blue-900 block flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-current" />
                  ميزات تعزيز الفهم (البعد التعليمي)
                </span>
                <p className="text-gray-650 leading-relaxed">
                  عند مراجعة أو كتابة أسئلتك، يمكنك ضبط:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 mr-2">
                  <li><strong>التغذية الراجعة التفسيرية:</strong> شرح مفصل يظهر للطالب بمجرد اختيار إجابة معينة ليوضح سبب صحتها أو خطئها.</li>
                  <li><strong>التلميحات التعليمية:</strong> نصائح أو معلومات مثرية تظهر لدعم الفهم وتثبيت المعلومة.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">٣</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>بدء الجلسة وإشراك الطلاب</span>
                <Play className="w-4 h-4 text-purple-500 fill-current" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                بعد الانتهاء من إعداد اللعبة، احفظها كمسودة. لبدء اللعب مع طلابك، <strong>قم بنشر اللعبة</strong>:
              </p>
              <div className="bg-purple-50/50 border border-purple-100 p-4.5 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-700" />
                  إطلاق الجلسة المباشرة
                </span>
                <p className="text-gray-600 leading-relaxed">
                  تغيير حالة اللعبة إلى "منشورة" يطلق جلسة لعب صفية حية. اعرض رمز الاستجابة السريعة (QR Code) أو انسخ رابط الانضمام المباشر على السبورة ليقوم الطلاب بالمسح والدخول.
                </p>
                <div className="border-t border-purple-100/50 pt-2 text-gray-500 font-bold flex items-center gap-1 text-[10px]">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  <span>دخول فوري بدون حسابات: يدخل الطلاب بكتبة أسمائهم فقط، دون تسجيل حسابات أو تذكر كلمات مرور.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">٤</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>متابعة البيانات والتحليلات الحية</span>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                بمجرد أن يبدأ الطلاب في اللعب، راقب التحديث الفوري للبيانات على لوحة الإحصاءات الخاصة بك:
              </p>
              <div className="bg-emerald-50/20 border border-emerald-100/50 p-4.5 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-emerald-950 block">ماذا تراقب أثناء الجلسة؟</span>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>نسب الإكمال المباشرة:</strong> معرفة كم طالباً انتهى من الأسئلة.</li>
                  <li><strong>توزيع درجات الطلاب:</strong> تتبع مستويات التفوق والنقاط الإجمالية للصف.</li>
                  <li><strong>دقة الإجابات لكل سؤال:</strong> تحديد الأسئلة التي تعثر فيها الطلاب لإعادة شرحها فورياً.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">٥</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>إنهاء الجلسة وعرض نتائج السجلات</span>
                <XOctagon className="w-4 h-4 text-amber-600" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                بعد اكتمال إجابات الطلاب، قم <strong>بإغلاق الجلسة</strong> لإنهاء البث وتجميد درجات الطلاب النهائية.
              </p>
              
              <div className="bg-amber-50/30 border border-amber-100 p-4.5 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1">
                    <History className="w-4 h-4 text-amber-700" />
                    صفحة الجلسات التاريخية (Sessions)
                  </span>
                  <span className="text-gray-600 leading-relaxed block">
                    يمكنك الوصول في أي وقت لجميع الجلسات السابقة المغلقة من التبويب الجانبي <strong>"الجلسات"</strong> لمراجعة تقارير الطلاب النهائية وتصدير الدرجات.
                  </span>
                </div>
                
                {/* 30 Days Retention Notice */}
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-red-900">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <span className="font-bold block mb-0.5">ملاحظة هامة جداً حول حفظ البيانات</span>
                    <span className="text-[10px] text-red-800 leading-relaxed block">
                      يتم حفظ بيانات الجلسات التفصيلية وإجابات الطلاب وتخزينها في خوادم المنصة لمدة <strong>٣٠ يوماً فقط</strong> من تاريخ إنهاء الجلسة، وبعدها يتم تنظيف البيانات تلقائياً. تأكد من مراجعة الإحصاءات أو رصد الدرجات خلال هذه الفترة.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-100">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3.5 rounded-xl font-bold transition-all text-sm"
        >
          <span>الذهاب لنظرة عامة</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <Link 
          href="/dashboard/organizations"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3.5 rounded-xl font-bold transition-all text-sm"
        >
          <Building2 className="w-4 h-4 text-gray-600" />
          <span>المؤسسات التعليمية</span>
        </Link>
      </div>

    </div>
  )
}
