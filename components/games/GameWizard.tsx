"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

import { GameFormData, Scenario } from "./wizard/types"
import { BasicInfoStep, OrganizationOption } from "./wizard/BasicInfoStep"
import { ScenariosStep } from "./wizard/ScenariosStep"
import { PublishStep } from "./wizard/PublishStep"
import { GameWizardHeader } from "./wizard/GameWizardHeader"
import { GameWizardFooter } from "./wizard/GameWizardFooter"
import { GameSuccessModal } from "./wizard/GameSuccessModal"
import { useGameWizard } from "./wizard/useGameWizard"

interface GameWizardProps {
  isEdit?: boolean;
  gameId?: string;
  initialGame?: Partial<GameFormData>;
  initialScenarios?: Scenario[];
  organizations: OrganizationOption[];
  customTopActions?: React.ReactNode;
}

export function GameWizard({ 
  isEdit = false, 
  gameId, 
  initialGame, 
  initialScenarios, 
  organizations,
  customTopActions
}: GameWizardProps) {
  
  const {
    step,
    setStep,
    errorMsg,
    setErrorMsg,
    errors,
    showSuccessPopup,
    setShowSuccessPopup,
    createdGameId,
    isPending,
    formData,
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    handleFormChange,
    addScenario,
    removeScenario,
    updateActiveScenario,
    updateChoice,
    handleNextStep,
    handleSave,
  } = useGameWizard({ gameId, initialGame, initialScenarios })

  const finalGameId = createdGameId || gameId;
  const gameUrl = finalGameId 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/game/${finalGameId}`
    : "";

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement
    if (!canvas) return
    const pngFile = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.download = `QR-${formData.slug || 'game'}.png`
    downloadLink.href = pngFile
    downloadLink.click()
  }

  const selectedOrg = organizations.find(org => org.id === formData.organizationId)
  const qrLogo = selectedOrg?.logo || "/logo.png"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-28">
      
      {/* Top Navigation & Wizard Header */}
      <GameWizardHeader 
        isEdit={isEdit} 
        step={step} 
        customTopActions={customTopActions} 
      />

      {/* Error Message Display */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <BasicInfoStep 
              formData={formData} 
              onChange={handleFormChange} 
              errors={errors} 
              organizations={organizations}
            />
          )}
          {step === 2 && (
            <ScenariosStep 
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              setActiveScenarioId={setActiveScenarioId}
              addScenario={addScenario}
              removeScenario={removeScenario}
              updateActiveScenario={updateActiveScenario}
              updateChoice={updateChoice}
              errors={errors}
            />
          )}
          {step === 3 && (
            <PublishStep 
              formData={formData} 
              onChange={handleFormChange} 
              isEdit={isEdit} 
              scenariosLength={scenarios.length} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Bar */}
      <GameWizardFooter 
        step={step}
        isPending={isPending}
        onPrevStep={() => { setStep(step - 1); setErrorMsg(null); }}
        onNextStep={handleNextStep}
        onSave={handleSave}
      />

      {/* Success Popup */}
      <GameSuccessModal 
        show={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        gameTitle={formData.title}
        gameSlug={formData.slug}
        gameUrl={gameUrl}
        qrLogo={qrLogo}
        onDownloadQR={downloadQR}
      />
    </div>
  )
}
