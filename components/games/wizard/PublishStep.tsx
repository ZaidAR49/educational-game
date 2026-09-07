"use client"

import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { GameFormData } from "./types"

interface PublishStepProps {
  formData: GameFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  isEdit: boolean
  scenariosLength: number
}

export function PublishStep({ formData, onChange, isEdit, scenariosLength }: PublishStepProps) {
  const { t, isRTL } = useLocale()

  return (
    <motion.div 
      key="step3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5 max-w-3xl mx-auto text-center"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-2 shadow-inner">
        <Send className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1.5">{t.gameWizard.almostReady}</h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base mb-4 leading-relaxed">
          {t.gameWizard.publishSummary
            .replace('{action}', isEdit ? t.gameWizard.actionEdited : t.gameWizard.actionCreated)
            .replace('{count}', String(scenariosLength))}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2.5 ${formData.status === 'published' ? 'border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100' : 'border-gray-200 hover:border-emerald-200 bg-white hover:bg-emerald-50/30'}`}>
          <input 
            type="radio" 
            name="status" 
            value="published" 
            checked={formData.status === 'published'}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${formData.status === 'published' ? 'border-emerald-500' : 'border-gray-300'}`}>
            {formData.status === 'published' && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
          </div>
          <div className="text-base font-bold text-emerald-700">{t.gameWizard.publishDirect}</div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{t.gameWizard.publishDirectDesc}</p>
        </label>

        <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2.5 ${formData.status === 'draft' ? 'border-gray-800 bg-gray-50 shadow-sm' : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'}`}>
          <input 
            type="radio" 
            name="status" 
            value="draft" 
            checked={formData.status === 'draft'}
            onChange={onChange}
            className="sr-only"
          />
          <div className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${formData.status === 'draft' ? 'border-gray-800' : 'border-gray-300'}`}>
            {formData.status === 'draft' && <div className="w-3 h-3 rounded-full bg-gray-800" />}
          </div>
          <div className="text-base font-bold text-gray-800">{t.gameWizard.saveAsDraft}</div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{t.gameWizard.saveAsDraftDesc}</p>
        </label>
      </div>
    </motion.div>
  )
}
