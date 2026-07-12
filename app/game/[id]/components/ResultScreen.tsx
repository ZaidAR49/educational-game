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
            resultData.badge
          )}
        </div>
        <h1 className="text-3xl font-black text-emerald-600 mb-2">
          {resultData.title}
        </h1>
        <p className="text-gray-500 font-medium mb-6">{resultData.subtitle}</p>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 mb-5 shadow-inner">
          <span className="block text-sm opacity-90 font-bold mb-1">
            {results.finalScoreLabel}
          </span>
          <span className="text-5xl font-black">{score}</span>
          <span className="text-lg opacity-90 font-bold"> / {maxScore} {results.pointsSuffix}</span>
        </div>

        <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 mb-5 font-bold">
          {resultData.message}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onShare}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {results.shareLabel}
          </button>
          
          {game.isDemo && (
            <>
              <button
                type="button"
                onClick={onRetry}
                className="bg-white border-2 border-emerald-500 text-emerald-600 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                إعادة المحاولة 🔄
              </button>
              <Link
                href={game.id === '00000000-0000-0000-0000-000000000003' ? '/' : '/dashboard/games'}
                className="bg-gray-100 text-gray-700 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                {game.id === '00000000-0000-0000-0000-000000000003' ? 'العودة للرئيسية 🏠' : 'العودة للوحة التحكم 🔙'}
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
