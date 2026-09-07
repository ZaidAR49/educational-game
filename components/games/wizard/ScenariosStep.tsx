"use client"

import { motion } from "framer-motion"
import { Plus, Trash2, CheckCircle2 } from "lucide-react"
import { useLocale } from "@/lib/i18n/LanguageContext"
import { Scenario } from "./types"

interface ScenariosStepProps {
  scenarios: Scenario[]
  activeScenarioId: string
  setActiveScenarioId: (id: string) => void
  addScenario: () => void
  removeScenario: (id: string, e: React.MouseEvent) => void
  updateActiveScenario: (field: string, value: any) => void
  updateChoice: (choiceIndex: number, field: string, value: string) => void
  errors?: Record<string, string>
}

export function ScenariosStep({
  scenarios,
  activeScenarioId,
  setActiveScenarioId,
  addScenario,
  removeScenario,
  updateActiveScenario,
  updateChoice,
  errors = {}
}: ScenariosStepProps) {
  const { t, isRTL } = useLocale()
  const activeScenario = scenarios.find(s => s.id === activeScenarioId)

  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 h-full"
    >
      {/* Questions List Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-100 shadow-sm sticky top-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {t.gameWizard.questionsList} ({scenarios.length})
            </h3>
            <button 
              onClick={addScenario}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors shadow-sm"
              title={t.gameWizard.addScenario}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto rtl:pr-2 ltr:pl-2 custom-scrollbar">
            {scenarios.map((scenario, index) => {
              const hasError = Object.keys(errors).some(k => k.startsWith(`scenario_${scenario.id}`))
              return (
                <div 
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-3 group
                    ${activeScenarioId === scenario.id 
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                      : hasError ? 'border-red-300 bg-red-50' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-lg shrink-0">
                    {scenario.icon || "❓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] sm:text-xs font-bold mb-0.5 ${hasError ? 'text-red-600' : 'text-emerald-600'}`}>
                      {t.gameWizard.questionNum.replace('{num}', String(index + 1))}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {scenario.description || t.gameWizard.newQuestionPlaceholder}
                    </div>
                  </div>
                  {scenarios.length > 1 && (
                    <button 
                      onClick={(e) => removeScenario(scenario.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Question Editor */}
      <div className="lg:col-span-8">
        {activeScenario && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-5">
            
            <div className="flex flex-col md:flex-row md:items-start gap-4 pb-4 border-b border-gray-100">
              <div className="flex flex-col items-center gap-1 shrink-0 self-center md:self-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner border ${
                  errors[`scenario_${activeScenario.id}_icon`] ? 'bg-red-50 text-red-500 border-red-200' : 'bg-blue-50 text-blue-500 border-blue-100'
                }`}>
                  <input 
                    type="text" 
                    value={activeScenario.icon}
                    onChange={(e) => updateActiveScenario('icon', e.target.value)}
                    className="w-full bg-transparent text-center outline-none"
                  />
                </div>
                {errors[`scenario_${activeScenario.id}_icon`] && <p className="text-red-500 text-xs font-bold">{errors[`scenario_${activeScenario.id}_icon`]}</p>}
              </div>
              <div className="flex-1 space-y-2 pt-0.5 w-full">
                <input 
                  type="text" 
                  value={activeScenario.title}
                  onChange={(e) => updateActiveScenario('title', e.target.value)}
                  placeholder={t.gameWizard.scenarioTitlePlaceholder}
                  className={`w-full text-sm sm:text-base font-bold outline-none placeholder:text-gray-300 ${
                    errors[`scenario_${activeScenario.id}_title`] ? 'text-red-500 placeholder:text-red-300' : 'text-gray-400'
                  }`}
                />
                {errors[`scenario_${activeScenario.id}_title`] && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors[`scenario_${activeScenario.id}_title`]}</p>}
                <textarea 
                  value={activeScenario.description}
                  onChange={(e) => updateActiveScenario('description', e.target.value)}
                  placeholder={t.gameWizard.scenarioDescPlaceholder}
                  rows={2}
                  className={`w-full text-base sm:text-lg font-bold outline-none resize-none leading-snug ${
                    errors[`scenario_${activeScenario.id}_desc`] ? 'text-red-600 placeholder:text-red-200' : 'text-gray-900 placeholder:text-gray-200'
                  }`}
                />
                {errors[`scenario_${activeScenario.id}_desc`] && <p className="text-red-500 text-xs sm:text-sm font-bold">{errors[`scenario_${activeScenario.id}_desc`]}</p>}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">{t.gameWizard.choicesTitle}</h3>
                <span className="text-xs sm:text-sm font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full inline-block w-fit">
                  {t.gameWizard.oneCorrectWarning}
                </span>
              </div>
              
              <div className="space-y-3">
                {activeScenario.choices.map((choice, index) => {
                  const choiceError = errors[`scenario_${activeScenario.id}_choice_${index}`];
                  const feedbackError = errors[`scenario_${activeScenario.id}_feedback_${index}`];

                  return (
                    <div 
                      key={index} 
                      className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all flex flex-col gap-3
                        ${choice.isCorrect ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}
                        ${(choiceError || feedbackError) && !choice.isCorrect ? 'border-red-300 bg-red-50/30' : ''}
                      `}
                    >
                      {/* Top Row: Answer Text & Correct Toggle */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2.5 flex-1">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 text-base ${
                            choiceError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                          }`}>
                            <input 
                              type="text" 
                              value={choice.icon}
                              onChange={(e) => updateChoice(index, 'icon', e.target.value)}
                              className="w-full bg-transparent text-center outline-none"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input 
                              type="text" 
                              value={choice.text}
                              onChange={(e) => updateChoice(index, 'text', e.target.value)}
                              placeholder={t.gameWizard.choicePlaceholder.replace('{num}', String(index + 1))}
                              className={`w-full bg-transparent font-bold text-sm sm:text-base outline-none placeholder:text-gray-300 ${
                                choiceError ? 'text-red-600' : 'text-gray-900'
                              }`}
                            />
                            {choiceError && <p className="text-red-500 text-xs font-bold mt-0.5">{choiceError}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => updateChoice(index, 'isCorrect', 'true')}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all w-full sm:w-auto shrink-0
                            ${choice.isCorrect 
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                            }
                          `}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${choice.isCorrect ? 'opacity-100' : 'opacity-50'}`} />
                          <span>{choice.isCorrect ? t.gameWizard.isCorrect : t.gameWizard.markAsCorrect}</span>
                        </button>
                      </div>

                      {/* Feedback Input */}
                      <div className={`rtl:sm:mr-12 rtl:sm:pr-4 rtl:sm:border-r-2 ltr:sm:ml-12 ltr:sm:pl-4 ltr:sm:border-l-2 py-0.5 space-y-1 ${
                        feedbackError ? 'border-red-200' : 'border-gray-100'
                      }`}>
                        <label className={`text-[11px] sm:text-xs font-bold block ${feedbackError ? 'text-red-400' : 'text-gray-400'}`}>
                          {t.gameWizard.feedbackHint}
                        </label>
                        <input 
                          type="text" 
                          value={choice.feedback.message}
                          onChange={(e) => updateChoice(index, 'feedback.message', e.target.value)}
                          placeholder={t.gameWizard.feedbackPlaceholder}
                          className={`w-full bg-transparent text-xs sm:text-sm font-medium outline-none placeholder:text-gray-300 ${
                            feedbackError ? 'text-red-600' : 'text-gray-600'
                          }`}
                        />
                        {feedbackError && <p className="text-red-500 text-xs font-bold mt-0.5">{feedbackError}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  )
}
