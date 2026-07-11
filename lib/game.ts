import { config } from "@/lib/config"
import uiContent from "@/data/ui-content-general.json"
import { toast } from "sonner"

export type ConfettiPiece = {
  id: string
  left: string
  color: string
  delay: string
  duration: string
}

export function createConfettiPieces(): ConfettiPiece[] {
  const { confettiPieceCount, confettiColors } = config.game
  return Array.from({ length: confettiPieceCount }, () => ({
    id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    left: `${Math.random() * 100}%`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
  }))
}

export function getResultMessage(percentage: number) {
  const { excellent, good } = config.game.resultThresholds
  const { resultLevels } = uiContent.results

  if (percentage >= excellent) return resultLevels.excellent
  if (percentage >= good) return resultLevels.good
  return resultLevels.low
}

export async function shareGameResult(score: number, gameUrl: string) {
  const { shareText, copiedMessage, fallbackPrefix } = uiContent.share
  const text = shareText
    .replace("{appName}", uiContent.app.name)
    .replace("{score}", String(score))
    .replace("{gameUrl}", gameUrl)

  if (navigator.share) {
    try {
      await navigator.share({
        title: uiContent.app.name,
        text,
        url: gameUrl,
      })
      return
    } catch {
      // fall through to clipboard / alert
    }
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(copiedMessage)
      return
    } catch {
      // fall through
    }
  }

  toast.info(fallbackPrefix + text)
}
