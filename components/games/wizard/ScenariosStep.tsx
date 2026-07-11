import { motion } from "framer-motion"
import { Plus, Trash2, CheckCircle2 } from "lucide-react"
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
  const activeScenario = scenarios.find(s => s.id === activeScenarioId)

  return (
    <motion.div 
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
    >
      {/* Questions List Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 text-lg">الأسئلة ({scenarios.length})</h3>
            <button 
              onClick={addScenario}
              className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {scenarios.map((scenario, index) => {
              const hasError = Object.keys(errors).some(k => k.startsWith(`scenario_${scenario.id}`))
              return (
                <div 
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex items-center gap-4 group
                    ${activeScenarioId === scenario.id 
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                      : hasError ? 'border-red-300 bg-red-50' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-2xl shrink-0">
                    {scenario.icon || "❓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold mb-1 ${hasError ? 'text-red-600' : 'text-emerald-600'}`}>السؤال {index + 1}</div>
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {scenario.description || "سؤال جديد..."}
                    </div>
                  </div>
                  {scenarios.length > 1 && (
                    <button 
                      onClick={(e) => removeScenario(scenario.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
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
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-start gap-6 pb-8 border-b border-gray-100">
              <div className="flex flex-col items-center gap-1 shrink-0 self-center md:self-start">
                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border ${
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
              <div className="flex-1 space-y-3 pt-1 w-full">
                <input 
                  type="text" 
                  value={activeScenario.title}
                  onChange={(e) => updateActiveScenario('title', e.target.value)}
                  placeholder="عنوان السؤال (مثال: السؤال الأول)"
                  className={`w-full text-lg font-bold outline-none placeholder:text-gray-300 ${
                    errors[`scenario_${activeScenario.id}_title`] ? 'text-red-500 placeholder:text-red-300' : 'text-gray-400'
                  }`}
                />
                {errors[`scenario_${activeScenario.id}_title`] && <p className="text-red-500 text-sm font-bold">{errors[`scenario_${activeScenario.id}_title`]}</p>}
                <textarea 
                  value={activeScenario.description}
                  onChange={(e) => updateActiveScenario('description', e.target.value)}
                  placeholder="اكتب نص السؤال هنا..."
                  rows={2}
                  className={`w-full text-2xl md:text-3xl font-black outline-none resize-none leading-tight ${
                    errors[`scenario_${activeScenario.id}_desc`] ? 'text-red-600 placeholder:text-red-200' : 'text-gray-900 placeholder:text-gray-200'
                  }`}
                />
                {errors[`scenario_${activeScenario.id}_desc`] && <p className="text-red-500 text-sm font-bold">{errors[`scenario_${activeScenario.id}_desc`]}</p>}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <h3 className="font-black text-gray-800 text-xl">الخيارات المتاحة</h3>
                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full inline-block w-fit">
                  يجب تحديد إجابة صحيحة واحدة
                </span>
              </div>
              
              <div className="space-y-4">
                {activeScenario.choices.map((choice, index) => {
                  const choiceError = errors[`scenario_${activeScenario.id}_choice_${index}`];
                  const feedbackError = errors[`scenario_${activeScenario.id}_feedback_${index}`];

                  return (
                    <div 
                      key={index} 
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 md:gap-5
                        ${choice.isCorrect ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}
                        ${(choiceError || feedbackError) && !choice.isCorrect ? 'border-red-300 bg-red-50/30' : ''}
                      `}
                    >
                      {/* Top Row: Answer Text & Correct Toggle */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 text-xl ${
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
                              placeholder={`الخيار ${index + 1}`}
                              className={`w-full bg-transparent font-black text-lg outline-none placeholder:text-gray-300 ${
                                choiceError ? 'text-red-600' : 'text-gray-900'
                              }`}
                            />
                            {choiceError && <p className="text-red-500 text-xs font-bold mt-1">{choiceError}</p>}
                          </div>
                        </div>
                        <button 
                          onClick={() => updateChoice(index, 'isCorrect', 'true')}
                          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all w-full sm:w-auto shrink-0
                            ${choice.isCorrect 
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                            }
                          `}
                        >
                          <CheckCircle2 className={`w-5 h-5 ${choice.isCorrect ? 'opacity-100' : 'opacity-50'}`} />
                          <span>{choice.isCorrect ? 'إجابة صحيحة' : 'تحديد كصحيحة'}</span>
                        </button>
                      </div>

                      {/* Feedback Input */}
                      <div className={`sm:mr-16 sm:pr-5 sm:border-r-4 py-1 space-y-2 ${
                        feedbackError ? 'border-red-200' : 'border-gray-100'
                      }`}>
                        <label className={`text-xs font-bold block ${feedbackError ? 'text-red-400' : 'text-gray-400'}`}>
                          التغذية الراجعة (تظهر عند اختيار الطالب لهذا الخيار)
                        </label>
                        <input 
                          type="text"
                          value={choice.feedback.message}
                          onChange={(e) => updateChoice(index, 'feedback.message', e.target.value)}
                          placeholder="اكتب التغذية الراجعة هنا..."
                          className={`w-full bg-transparent text-sm font-bold outline-none placeholder:text-gray-300 ${
                            feedbackError ? 'text-red-600' : 'text-gray-600'
                          }`}
                        />
                        {feedbackError && <p className="text-red-500 text-xs font-bold mt-1">{feedbackError}</p>}
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
