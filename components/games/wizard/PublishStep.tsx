import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { GameFormData } from "./types"

interface PublishStepProps {
  formData: GameFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  isEdit: boolean
  scenariosLength: number
}

export function PublishStep({ formData, onChange, isEdit, scenariosLength }: PublishStepProps) {
  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-lg shadow-gray-200/40 space-y-10 max-w-3xl mx-auto text-center"
    >
      <div className="w-28 h-28 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
        <Send className="w-12 h-12" />
      </div>
      
      <div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">أنت جاهز تقريباً!</h2>
        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed">
          لقد قمت ب{isEdit ? "تعديل" : "إنشاء"} اللعبة بنجاح بـ <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">{scenariosLength} أسئلة</span>. اختر حالة النشر لنتمكن من حفظها.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className={`cursor-pointer p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'published' ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100' : 'border-gray-200 hover:border-emerald-200 bg-white hover:bg-emerald-50/30'}`}>
          <input 
            type="radio" 
            name="status" 
            value="published" 
            checked={formData.status === 'published'}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-colors ${formData.status === 'published' ? 'border-emerald-500' : 'border-gray-300'}`}>
            {formData.status === 'published' && <div className="w-4 h-4 rounded-full bg-emerald-500" />}
          </div>
          <div className="text-2xl font-black text-emerald-700">نشر مباشر</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">اللعبة ستكون متاحة فوراً للطلاب باستخدام الرابط.</p>
        </label>

        <label className={`cursor-pointer p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'draft' ? 'border-gray-800 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'}`}>
          <input 
            type="radio" 
            name="status" 
            value="draft" 
            checked={formData.status === 'draft'}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-colors ${formData.status === 'draft' ? 'border-gray-800' : 'border-gray-300'}`}>
            {formData.status === 'draft' && <div className="w-4 h-4 rounded-full bg-gray-800" />}
          </div>
          <div className="text-2xl font-black text-gray-800">حفظ كمسودة</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">لن تكون اللعبة متاحة للطلاب حتى تقوم بنشرها لاحقاً.</p>
        </label>
      </div>
    </motion.div>
  )
}
