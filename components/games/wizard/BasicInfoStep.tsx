"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
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
  const { t, isRTL } = useLocale()

  return (
    <motion.div 
      key="step1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-5 max-w-4xl mx-auto"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-500 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center mb-2.5 text-2xl sm:text-3xl shadow-inner border border-emerald-100/50">
          {formData.icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">{t.gameWizard.step1Label}</h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base">{t.gameWizard.basicInfoSubtitle}</p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{t.gameWizard.gameTitle}</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder={t.gameWizard.gameTitlePlaceholder}
              className={`w-full px-4 py-2.5 rounded-xl border-2 focus:ring-4 outline-none transition-all text-start font-bold text-sm sm:text-base placeholder:text-gray-300 ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                  : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs sm:text-sm font-bold text-start">{errors.title}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-gray-700 block text-center">{t.gameWizard.gameIcon}</label>
            <input 
              type="text" 
              name="icon"
              value={formData.icon}
              onChange={onChange}
              className={`w-full px-3 py-2.5 rounded-xl border-2 focus:ring-4 outline-none transition-all text-center text-xl sm:text-2xl ${
                errors.icon 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                  : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
              }`}
            />
            {errors.icon && <p className="text-red-500 text-xs sm:text-sm font-bold text-center">{errors.icon}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{t.gameWizard.gameOrg}</label>
            <div className="relative">
              <select 
                name="organizationId"
                value={formData.organizationId}
                onChange={onChange}
                className={`w-full px-4 py-2.5 rounded-xl border-2 focus:ring-4 outline-none transition-all text-start font-bold text-sm sm:text-base text-gray-700 bg-white appearance-none cursor-pointer placeholder:text-gray-300 ${
                  errors.organizationId 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                    : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
                }`}
              >
                <option value="">{t.gameWizard.selectOrg}</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <ChevronDown className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4`} />
            </div>
            {errors.organizationId && <p className="text-red-500 text-xs sm:text-sm font-bold text-start">{errors.organizationId}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{t.gameWizard.gameSlug}</label>
            <div className={`flex shadow-sm rounded-xl overflow-hidden border-2 ${
                errors.slug ? 'border-red-500' : 'border-gray-100'
              }`} dir="ltr">
              <span className="inline-flex items-center px-3.5 border-r-0 bg-gray-50 text-gray-500 font-sans text-xs sm:text-sm font-bold">
                app.com/
              </span>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={onChange}
                placeholder="career-path"
                className={`flex-1 min-w-0 px-3.5 py-2.5 focus:ring-4 outline-none transition-all font-sans font-bold text-emerald-700 text-sm sm:text-base placeholder:text-gray-300 ${
                  errors.slug ? 'focus:ring-red-500/10 bg-red-50/10' : 'focus:ring-emerald-500/10'
                }`}
              />
            </div>
            {errors.slug && <p className="text-red-500 text-xs sm:text-sm font-bold text-start">{errors.slug}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-gray-700 block text-start">{t.gameWizard.gameDesc}</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={3}
            placeholder={t.gameWizard.gameDescPlaceholder}
            className={`w-full px-4 py-2.5 rounded-xl border-2 focus:ring-4 outline-none transition-all text-start text-gray-600 resize-none leading-relaxed text-sm sm:text-base placeholder:text-gray-300 ${
              errors.description 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                : 'border-gray-100 focus:border-emerald-500 focus:ring-emerald-500/10'
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs sm:text-sm font-bold text-start">{errors.description}</p>}
        </div>
      </div>
    </motion.div>
  )
}
