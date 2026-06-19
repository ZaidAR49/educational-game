import { config } from "@/lib/config"
import uiContent from "@/data/ui-content-general.json"

export type ConfettiPiece = {
  id: number
  left: string
  color: string
  delay: string
  duration: string
}

export function createConfettiPieces(): ConfettiPiece[] {
  const { confettiPieceCount, confettiColors } = config.game
  return Array.from({ length: confettiPieceCount }, (_, i) => ({
    id: i,
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
      alert(copiedMessage)
      return
    } catch {
      // fall through
    }
  }

  alert(fallbackPrefix + text)
}
