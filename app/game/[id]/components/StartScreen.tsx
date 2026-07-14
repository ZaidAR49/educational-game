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
  const intro = game.organization?.introduction;
  
  const title = intro?.title || game.title;
  const subtitle = intro?.subtitle || game.description || "لعبة تفاعلية تعليمية للجميع";
  const welcomeText = intro?.welcome_box?.description || gameStart.ctaText || "مرحباً بك! 👋\n\nستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة.\n\nاختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!\n\nهل أنت مستعد لاختبار معلوماتك؟";
  const buttonLabel = intro?.button_text || gameStart.startButtonLabel || "ابدأ الاختبار 🚀";
  const emojis = intro?.decorative_emojis || ["⭐", "🌟", "✨"];
  const icon = emojis[0] || "👋";

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in fade-in duration-500">
      {game.organization?.logoPath && (
        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
           <img src={game.organization.logoPath} alt="Logo" className="w-full h-full object-contain" />
        </div>
      )}
      <h1 className="text-3xl font-black text-emerald-600 mb-2">
        {title}
      </h1>
      <p className="text-gray-500 mb-2 font-bold">{subtitle}</p>
      <p className="text-emerald-600 mb-6 font-bold text-sm">مرحباً {playerName}! 👋</p>

      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6 text-right">
        <div className="mb-4 text-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-line text-center text-sm">
          {welcomeText}
        </p>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse"
      >
        {buttonLabel}
      </button>

      <div className="flex justify-center gap-4 mt-6">
        <span className="text-2xl animate-pulse">{emojis[1] || "⭐"}</span>
        <span className="text-2xl animate-pulse" style={{ animationDelay: "0.3s" }}>{emojis[2] || "☀️"}</span>
        <span className="text-2xl animate-pulse" style={{ animationDelay: "0.6s" }}>{emojis[0] || "✨"}</span>
      </div>
    </div>
  );
}
