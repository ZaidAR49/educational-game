"use client"

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
  ChevronRight,
  AlertTriangle,
  History,
  XOctagon
} from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"

export function HelpClient() {
  const { t, locale, isRTL } = useLocale()
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight
  const h = t.help

  // Helper to replace {var} in string with a strong/highlight span
  const renderFormatted = (template: string, replacements: Record<string, string>) => {
    let parts: (string | React.ReactNode)[] = [template]
    for (const [key, val] of Object.entries(replacements)) {
      const placeholder = `{${key}}`
      const newParts: (string | React.ReactNode)[] = []
      for (const part of parts) {
        if (typeof part === 'string') {
          const split = part.split(placeholder)
          for (let i = 0; i < split.length; i++) {
            if (split[i]) newParts.push(split[i])
            if (i < split.length - 1) {
              newParts.push(<strong key={`${key}-${i}`} className="font-black text-gray-900">{val}</strong>)
            }
          }
        } else {
          newParts.push(part)
        }
      }
      parts = newParts
    }
    return parts
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">{h.title}</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">
            {h.subtitle}
          </p>
        </div>
        
        <Link 
          href="/dashboard/games/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shrink-0 self-start md:self-auto animate-pulse"
        >
          <Plus className="w-5 h-5" />
          <span>{h.createFirstGame}</span>
        </Link>
      </div>

      {/* Main Workflow Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{h.coreJourney}</span>
        </h2>

        {/* Timeline Steps */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-2 h-full bg-slate-400`}></div>
            <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">1</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{h.step1Title}</span>
                <Building2 className="w-4 h-4 text-slate-500" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {renderFormatted(h.step1Desc, { mustFirst: h.step1MustFirst })}
              </p>
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-gray-100 text-sm">
                <span className="font-bold text-gray-900 block mb-1">{h.step1WhyTitle}</span>
                <span className="text-gray-500 leading-relaxed block text-xs">
                  {h.step1WhyDesc}
                </span>
                <Link 
                  href="/dashboard/organizations"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-3"
                >
                  <span>{h.step1Link}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-2 h-full bg-blue-500`}></div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">2</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{h.step2Title}</span>
                <Wand2 className="w-4 h-4 text-blue-500" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {renderFormatted(h.step2Desc, { newGameBtn: h.step2NewGameBtn })}
              </p>
              
              {/* AI & Creation features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-2xl text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">{h.step2AutoAiTitle}</span>
                  <span className="text-gray-600 leading-relaxed block">
                    {h.step2AutoAiDesc}
                  </span>
                </div>
                <div className="bg-purple-50/30 border border-purple-100/50 p-4 rounded-2xl text-xs">
                  <span className="font-bold text-purple-900 block mb-1">{h.step2ByoPromptTitle}</span>
                  <span className="text-gray-600 leading-relaxed block">
                    {h.step2ByoPromptDesc}
                  </span>
                </div>
              </div>

              {/* Pedagogical elements */}
              <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-blue-900 block flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-current" />
                  {h.step2PedagogyTitle}
                </span>
                <p className="text-gray-600 leading-relaxed">
                  {h.step2PedagogyDesc}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-500 ps-2">
                  <li><strong>{h.step2FeedbackTitle}</strong> {h.step2FeedbackDesc}</li>
                  <li><strong>{h.step2TipsTitle}</strong> {h.step2TipsDesc}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-2 h-full bg-purple-500`}></div>
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">3</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{h.step3Title}</span>
                <Play className="w-4 h-4 text-purple-500 fill-current" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {renderFormatted(h.step3Desc, { publishGame: h.step3PublishGame })}
              </p>
              <div className="bg-purple-50/50 border border-purple-100 p-4.5 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-700" />
                  {h.step3LiveLaunchTitle}
                </span>
                <p className="text-gray-600 leading-relaxed">
                  {h.step3LiveLaunchDesc}
                </p>
                <div className="border-t border-purple-100/50 pt-2 text-gray-500 font-bold flex items-center gap-1 text-[10px]">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                  <span>{h.step3InstantJoin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-2 h-full bg-emerald-500`}></div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">4</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{h.step4Title}</span>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {h.step4Desc}
              </p>
              <div className="bg-emerald-50/20 border border-emerald-100/50 p-4.5 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-emerald-950 block">{h.step4MonitorTitle}</span>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>{h.step4MonitorItem1Title}</strong> {h.step4MonitorItem1Desc}</li>
                  <li><strong>{h.step4MonitorItem2Title}</strong> {h.step4MonitorItem2Desc}</li>
                  <li><strong>{h.step4MonitorItem3Title}</strong> {h.step4MonitorItem3Desc}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-2 h-full bg-amber-500`}></div>
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">5</span>
            </div>
            <div className="space-y-3 flex-1">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>{h.step5Title}</span>
                <XOctagon className="w-4 h-4 text-amber-600" />
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {renderFormatted(h.step5Desc, { endSession: h.step5EndSession })}
              </p>
              
              <div className="bg-amber-50/30 border border-amber-100 p-4.5 rounded-2xl space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-900 block mb-1 flex items-center gap-1">
                    <History className="w-4 h-4 text-amber-700" />
                    {h.step5HistoryTitle}
                  </span>
                  <span className="text-gray-600 leading-relaxed block">
                    {h.step5HistoryDesc}
                  </span>
                </div>
                
                {/* Retention Notice */}
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start gap-2 text-red-900">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <span className="font-bold block mb-0.5">{h.step5RetentionWarningTitle}</span>
                    <span className="text-[10px] text-red-800 leading-relaxed block">
                      {renderFormatted(h.step5RetentionWarningDesc, { thirtyDays: h.step5ThirtyDays })}
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
          <span>{h.quickNavOverview}</span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
        <Link 
          href="/dashboard/organizations"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3.5 rounded-xl font-bold transition-all text-sm"
        >
          <Building2 className="w-4 h-4 text-gray-600" />
          <span>{h.quickNavOrgs}</span>
        </Link>
      </div>

    </div>
  )
}
