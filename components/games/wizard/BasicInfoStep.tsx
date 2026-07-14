import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { GameFormData } from "./types"

export interface OrganizationOption {
  id: string;
  name: string;
  logo: string | null;
}

interface BasicInfoStepProps {
  formData: GameFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  errors?: Record<string, string>
  organizations: OrganizationOption[]
}

export function BasicInfoStep({ formData, onChange, errors = {}, organizations = [] }: BasicInfoStepProps) {
  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[1.5rem] mx-auto flex items-center justify-center mb-4 text-4xl shadow-inner border border-emerald-100/50">
          {formData.icon}
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">المعلومات الأساسية</h2>
        <p className="text-gray-500 font-medium text-base">ابدأ بإعطاء لعبتك اسماً ووصفاً جذاباً للطلاب.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-4 space-y-3">
            <label className="text-sm font-bold text-gray-700 block">عنوان اللعبة</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="مثال: تحدي المسار المهني"
              className={`w-full px-5 py-3.5 rounded-2xl border-2 focus:ring-4 outline-none transition-all text-right font-black text-lg placeholder:text-gray-300 ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                  : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm font-bold">{errors.title}</p>}
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block text-center">أيقونة</label>
            <input 
              type="text" 
              name="icon"
              value={formData.icon}
              onChange={onChange}
              className={`w-full px-4 py-3.5 rounded-2xl border-2 focus:ring-4 outline-none transition-all text-center text-2xl ${
                errors.icon 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                  : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
              }`}
            />
            {errors.icon && <p className="text-red-500 text-sm font-bold text-center">{errors.icon}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block">المؤسسة / الجمعية</label>
            <div className="relative">
              <select 
                name="organizationId"
                value={formData.organizationId}
                onChange={onChange}
                className={`w-full px-5 py-3.5 rounded-2xl border-2 focus:ring-4 outline-none transition-all text-right font-black text-lg text-gray-700 bg-white appearance-none cursor-pointer placeholder:text-gray-300 ${
                  errors.organizationId 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                    : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
                }`}
              >
                <option value="">اختيار المؤسسة</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-6 h-6" />
            </div>
            {errors.organizationId && <p className="text-red-500 text-sm font-bold">{errors.organizationId}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 block">الرابط المختصر</label>
            <div className={`flex shadow-sm rounded-2xl overflow-hidden border-2 ${
                errors.slug ? 'border-red-500' : 'border-gray-100'
              }`} dir="ltr">
              <span className="inline-flex items-center px-4 border-r-0 bg-gray-50 text-gray-500 font-sans text-sm font-bold">
                app.com/
              </span>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={onChange}
                placeholder="career-path"
                className={`flex-1 min-w-0 px-4 py-3.5 focus:ring-4 outline-none transition-all font-sans font-bold text-emerald-700 text-base placeholder:text-gray-300 ${
                  errors.slug ? 'focus:ring-red-500/10 bg-red-50/10' : 'focus:ring-emerald-500/10'
                }`}
              />
            </div>
            {errors.slug && <p className="text-red-500 text-sm font-bold text-left" dir="ltr">{errors.slug}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 block">الوصف أو الهدف</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            placeholder="اكتب وصفاً مختصراً يشرح للطالب ما سيتعلمه من هذه اللعبة..."
            className={`w-full px-5 py-3.5 rounded-2xl border-2 focus:ring-4 outline-none transition-all text-right text-gray-600 resize-none leading-relaxed text-base placeholder:text-gray-300 ${
              errors.description 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm font-bold">{errors.description}</p>}
        </div>
      </div>
    </motion.div>
  )
}
