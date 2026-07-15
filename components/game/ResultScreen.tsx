import Link from "next/link";
import type { ConfettiPiece } from "@/lib/game";

type ResultScreenProps = {
  playerName: string;
  score: number;
  maxScore: number;
  game: any;
  results: any;
  resultData: any;
  confetti: ConfettiPiece[];
  onShare: () => void;
  onRetry: () => void;
};

export function ResultScreen({
  playerName,
  score,
  maxScore,
  game,
  results,
  resultData,
  confetti,
  onShare,
  onRetry
}: ResultScreenProps) {
  const isPass = maxScore > 0 && (score / maxScore) >= 0.5;
  const orgResultScreen = game.organization?.resultScreen;
  
  let title = resultData.title;
  let subtitle = resultData.subtitle;
  let message = resultData.message;
  let badge = resultData.badge;

  if (orgResultScreen) {
    if (isPass) {
      title = orgResultScreen.pass?.title || orgResultScreen.title || title;
      subtitle = orgResultScreen.pass?.small_description || orgResultScreen.small_description || subtitle;
      message = orgResultScreen.pass?.message || orgResultScreen.message || message;
      badge = "🏆";
    } else {
      title = orgResultScreen.fail?.title || orgResultScreen.title || title;
      subtitle = orgResultScreen.fail?.small_description || orgResultScreen.small_description || subtitle;
      message = orgResultScreen.fail?.message || orgResultScreen.message || message;
      badge = "🌱";
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden animate-in fade-in duration-500">
      {/* Player Name Badge */}
      <div className="flex justify-start mb-4 relative z-20">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm max-w-[90%]">
          <span className="text-sm flex-shrink-0">👤</span>
          <span className="truncate leading-none py-1">{playerName}</span>
        </div>
      </div>

      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}

      <div className="relative z-10">
        <div className="text-7xl mb-4 animate-in zoom-in duration-700 flex justify-center">
          {game.organization?.logoPath ? (
            <img src={game.organization.logoPath} alt="Logo" className="w-24 h-24 object-contain" />
          ) : (
            badge
          )}
        </div>
        <h1 className={`text-3xl font-black mb-2 ${isPass ? 'text-emerald-600' : 'text-amber-600'}`}>
          {title}
        </h1>
        <p className="text-gray-500 font-medium mb-6">{subtitle}</p>

        <div className={`text-white rounded-2xl p-5 mb-5 shadow-inner ${isPass ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-amber-600'}`}>
          <span className="block text-sm opacity-90 font-bold mb-1">
            {results.finalScoreLabel}
          </span>
          <span className="text-5xl font-black">{score}</span>
          <span className="text-lg opacity-90 font-bold"> / {maxScore} {results.pointsSuffix}</span>
        </div>

        <div className={`rounded-xl p-4 mb-5 font-bold ${isPass ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
          {message}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onShare}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {results.shareLabel}
          </button>
          
          {game.isDemo && (
            <>
              <button
                type="button"
                onClick={onRetry}
                className="bg-white border-2 border-emerald-500 text-emerald-600 text-lg font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                إعادة المحاولة 🔄
              </button>
              <Link
                href={game.id === 'demo' ? '/' : '/dashboard/games'}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl text-lg font-bold transition-colors"
              >
                {game.id === 'demo' ? 'العودة للرئيسية 🏠' : 'العودة للوحة التحكم 🔙'}
              </Link>
            </>
          )}

          {!game.isDemo && (
            <div className="text-gray-400 font-medium text-sm mt-4">
              تم تسجيل النتيجة وحفظها بنجاح 🎯
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
