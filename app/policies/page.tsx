import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/shared/Navbar"
import uiContent from "@/data/ui-content-general.json"
export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto mt-4">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-right">شروط الخدمة وسياسة الخصوصية</h1>
          
          <div className="prose prose-emerald max-w-none text-gray-600 space-y-8 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">1. مقدمة</h2>
              <p>
                مرحباً بك في منصتنا. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والسياسات. تم تصميم هذه المنصة لتوفير بيئة تعليمية تفاعلية وآمنة للمعلمين والطلاب باستخدام أحدث تقنيات الذكاء الاصطناعي والتحليل الفوري.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">2. سياسة الخصوصية وجمع البيانات</h2>
              <p>
                نحن نلتزم بحماية خصوصيتك ومعالجة البيانات بشفافية تامة:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2.5 mr-4">
                <li>
                  <strong>خصوصية الطلاب أولاً:</strong> لا نطلب من الطلاب إنشاء حسابات، تسجيل دخول، أو تقديم أي بيانات شخصية (مثل البريد الإلكتروني أو كلمات المرور) للعب الألعاب. ينضم الطلاب بأسماء مستعارة يختارونها بأنفسهم.
                </li>
                <li>
                  <strong>بيانات المعلمين:</strong> نجمع معلومات التسجيل الأساسية من المعلمين (مثل الاسم والبريد الإلكتروني والصورة الشخصية) لتأمين حساباتهم وإدارة ألعابهم ومؤسساتهم.
                </li>
                <li>
                  <strong>ملفات تعريف الارتباط (Cookies):</strong> نستخدم ملفات تعريف الارتباط الأساسية للحفاظ على جلسة تسجيل الدخول الخاصة بالمعلم عبر نظام <em>NextAuth (Auth.js)</em>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">3. تكامل الخدمات والذكاء الاصطناعي (Integrations & AI)</h2>
              <p>
                لتقديم خدماتنا المتقدمة، ندمج التقنيات التالية:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2.5 mr-4">
                <li>
                  <strong>الذكاء الاصطناعي (Google Gemini API):</strong> عند استخدام ميزة التوليد التلقائي للأسئلة، يتم إرسال فكرة أو عنوان الدرس لمعالجتها بواسطة نماذج Google الذكية. لا يتم إرسال أي بيانات شخصية للطلاب أو المعلمين إلى خوادم الذكاء الاصطناعي.
                </li>
                <li>
                  <strong>تحليلات سلوك المستخدمين (PostHog):</strong> نستخدم تحليلات PostHog لمراقبة سلوك المعلمين داخل لوحة التحكم (مثل إنشاء الألعاب، إدارة المؤسسات) لتحسين واجهة الاستخدام والأداء. لا نقوم بتتبع أي سلوك للطلاب خارج إحصاءات اللعبة الصفية.
                </li>
                <li>
                  <strong>الملفات والشعارات (AWS S3):</strong> يتم تخزين الشعارات والصور المرفوعة من قبل المؤسسات التعليمية بأمان في وحدات تخزين السحابة.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">4. سياسة الاحتفاظ بالبيانات (Data Retention)</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-gray-950 text-sm">
                <span className="font-bold block mb-1">تنظيف وحذف بيانات الجلسات تلقائياً:</span>
                يتم حفظ وتخزين نتائج الطلاب التفصيلية وإجاباتهم المسجلة أثناء الجلسات الصفية الحية في خوادمنا لمدة <strong>٣٠ يوماً فقط</strong> من تاريخ إنهاء الجلسة. بعد انقضاء هذه المدة، يتم حذف هذه السجلات والبيانات نهائياً للمحافظة على أداء الخوادم وحماية الخصوصية. يرجى رصد الدرجات أو تسجيلها قبل انقضاء هذه الفترة.
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">5. شروط الاستخدام للمعلمين</h2>
              <p>
                بصفتك معلماً، أنت مسؤول بالكامل عن المحتوى والأسئلة والتلميحات التي تنشئها وتشاركها مع الطلاب عبر المنصة. يُمنع منعاً باتاً إنشاء أو مشاركة أي محتوى غير لائق، مسيء، مخرب، أو ينتهك حقوق الملكية الفكرية. تحتفظ المنصة بالحق في إزالة أي محتوى أو تجميد أي حساب يخالف هذه الشروط.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">6. التعديلات على الشروط والسياسات</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط وسياسة الخصوصية في أي وقت لمواكبة التحديثات التقنية والقوانين التنظيمية. استمرارك في استخدام المنصة بعد تعديل الشروط يعتبر موافقة ضمنية منك عليها.
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">{uiContent.app.copyrightText}</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/policies" className="hover:text-white transition-colors">
              سياسة الخصوصية وشروط الخدمة
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
