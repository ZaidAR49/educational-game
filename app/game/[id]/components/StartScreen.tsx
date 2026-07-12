type StartScreenProps = {
  game: any;
  playerName: string;
  gameStart: any;
  onStartGame: () => void;
};

export function StartScreen({
  game,
  playerName,
  gameStart,
  onStartGame
}: StartScreenProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
      {game.organization?.logoPath && (
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
           <img src={game.organization.logoPath} alt="Logo" className="w-full h-full object-contain" />
        </div>
      )}
      <h1 className="text-3xl font-black text-emerald-600 mb-2">
        {game.title}
      </h1>
      <p className="text-gray-500 mb-6 font-bold">مرحباً {playerName}! 👋</p>

      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6 text-right">
        {game.description && (
          <p className="text-gray-700 mb-4 leading-relaxed font-medium">
            {game.description}
          </p>
        )}
        <p className="text-emerald-700 font-bold">{gameStart.ctaText}</p>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
      >
        {gameStart.startButtonLabel}
      </button>

      <div className="flex justify-center gap-4 mt-6">
        <span className="text-2xl animate-pulse">⭐</span>
        <span className="text-2xl animate-pulse" style={{ animationDelay: "0.3s" }}>🌟</span>
        <span className="text-2xl animate-pulse" style={{ animationDelay: "0.6s" }}>✨</span>
      </div>
    </div>
  );
}
