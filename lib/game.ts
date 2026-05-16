import { config } from "@/lib/config"

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

  if (percentage >= excellent) {
    return {
      badge: "🏆",
      title: "مبروك يا بطل!",
      subtitle: "أنت بطل القرارات الصحيحة!",
      message:
        "🌟 أداء رائع! أنت تعرف كيف تحمي نفسك وتتخذ القرارات الصحيحة!",
    }
  }

  if (percentage >= good) {
    return {
      badge: "⭐",
      title: "أحسنت!",
      subtitle: "أداء جيد جداً!",
      message: "💪 أنت في الطريق الصحيح! استمر في التعلم واتخاذ القرارات الحكيمة!",
    }
  }

  return {
    badge: "🌱",
    title: "لا بأس!",
    subtitle: "كل تجربة فرصة للتعلم!",
    message: "📚 تعلمت أشياء مهمة! جرب مرة أخرى لتحسين نتيجتك!",
  }
}

export async function shareGameResult(score: number, gameUrl: string) {
  const text = `🛡️ لعبت لعبة "${config.appName}" من جمعية حماية الأسرة وحصلت على ${score} نقطة! 🌟\n\n🎮 جرب الآن:\n${gameUrl}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: config.game.shareTitle,
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
      alert("✅ تم نسخ النتيجة! يمكنك لصقها ومشاركتها مع أصدقائك.")
      return
    } catch {
      // fall through
    }
  }

  alert("📋 شارك نتيجتك:\n\n" + text)
}
