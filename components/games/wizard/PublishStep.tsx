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
      className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-lg shadow-gray-200/40 space-y-8 max-w-3xl mx-auto text-center"
    >
      <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
        <Send className="w-10 h-10" />
      </div>
      
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">{t.gameWizard.almostReady}</h2>
        <p className="text-gray-500 font-medium text-base mb-8 leading-relaxed">
          {t.gameWizard.publishSummary
            .replace('{action}', isEdit ? t.gameWizard.actionEdited : t.gameWizard.actionCreated)
            .replace('{count}', String(scenariosLength))}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'published' ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100' : 'border-gray-200 hover:border-emerald-200 bg-white hover:bg-emerald-50/30'}`}>
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
          <div className="text-xl font-black text-emerald-700">{t.gameWizard.publishDirect}</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{t.gameWizard.publishDirectDesc}</p>
        </label>

        <label className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${formData.status === 'draft' ? 'border-gray-800 bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50'}`}>
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
          <div className="text-xl font-black text-gray-800">{t.gameWizard.saveAsDraft}</div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{t.gameWizard.saveAsDraftDesc}</p>
        </label>
      </div>
    </motion.div>
  )
}
