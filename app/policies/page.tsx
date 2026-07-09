import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors group"
        >
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">شروط الخدمة وسياسة الخصوصية</h1>
          
          <div className="prose prose-emerald max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. مقدمة</h2>
              <p>
                مرحباً بك في منصتنا. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والسياسات. تم تصميم هذه المنصة لتوفير بيئة تعليمية تفاعلية وآمنة للمعلمين والطلاب.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. سياسة الخصوصية</h2>
              <p>
                نحن نأخذ خصوصيتك على محمل الجد:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>لا نطلب من الطلاب إنشاء حسابات أو تقديم أي معلومات شخصية للعب الألعاب.</li>
                <li>يتم جمع معلومات أساسية فقط من المعلمين (مثل البريد الإلكتروني) لتوفير خدمات إدارة الألعاب.</li>
                <li>لا نقوم ببيع أو مشاركة بياناتك مع أي أطراف ثالثة لأغراض تسويقية.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. شروط الاستخدام للمعلمين</h2>
              <p>
                بصفتك معلماً، أنت مسؤول عن المحتوى الذي تنشئه عبر المنصة. يُمنع منعاً باتاً إنشاء أو مشاركة أي محتوى غير لائق، أو مسيء، أو ينتهك حقوق الملكية الفكرية للآخرين. تحتفظ المنصة بالحق في إزالة أي محتوى يخالف هذه الشروط.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. توافر الخدمة</h2>
              <p>
                نحن نسعى جاهدين لضمان توافر المنصة على مدار الساعة، ولكننا لا نضمن خلو الخدمة من الانقطاعات أو الأخطاء. قد نقوم بإيقاف الخدمة مؤقتاً لأغراض الصيانة أو التحديثات.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. التعديلات على الشروط</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية. استمرارك في استخدام المنصة بعد أي تغييرات يعتبر قبولاً منك للشروط المعدلة.
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
