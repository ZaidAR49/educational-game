type GameplayScreenProps = {
  playerName: string;
  score: number;
  currentScenarioIndex: number;
  totalScenarios: number;
  currentScenario: any;
  gamePlay: any;
  hasAnswered: boolean;
  selectedChoiceIndex: number | null;
  showFeedback: boolean;
  isSkipped: boolean;
  activeFeedback: any;
  feedbackIsCorrect: boolean;
  onSelectChoice: (index: number) => void;
  onSkipQuestion: () => void;
  onNextScenario: () => void;
};

export function GameplayScreen({
  playerName,
  score,
  currentScenarioIndex,
  totalScenarios,
  currentScenario,
  gamePlay,
  hasAnswered,
  selectedChoiceIndex,
  showFeedback,
  isSkipped,
  activeFeedback,
  feedbackIsCorrect,
  onSelectChoice,
  onSkipQuestion,
  onNextScenario
}: GameplayScreenProps) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl relative animate-in fade-in duration-500">
      {/* Player Name Badge */}
      <div className="flex justify-start mb-3">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-800 px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm max-w-[90%]">
          <span className="text-sm flex-shrink-0">👤</span>
          <span className="truncate leading-none py-1">{playerName}</span>
        </div>
      </div>

      {/* Header row: score | skip | question counter */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
          <span className="block text-xs text-gray-500 font-bold">{gamePlay.scoreLabel}</span>
          <span className="text-2xl font-black text-emerald-600">{score}</span>
        </div>

        {/* Skip button — centre */}
        <button
          type="button"
          onClick={onSkipQuestion}
          disabled={hasAnswered}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all duration-200
            ${hasAnswered
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-amber-400 text-amber-600 hover:bg-amber-50 hover:scale-105 active:scale-95"
            }`}
        >
          {gamePlay.skipButtonLabel}
        </button>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-2 rounded-xl text-center min-w-[80px]">
          <span className="block text-xs text-gray-500 font-bold">{gamePlay.questionLabel}</span>
          <span className="text-xl font-black text-blue-600">
            {currentScenarioIndex + 1} / {totalScenarios}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${(currentScenarioIndex / totalScenarios) * 100}%` }}
        />
      </div>

      {/* Scenario card */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5 text-center mb-5 animate-in slide-in-from-right duration-500">
        <div className="text-5xl mb-3">{currentScenario.icon || "❓"}</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">
          {currentScenario.title}
        </h2>
        <p className="text-gray-600 font-medium leading-relaxed">
          {currentScenario.description}
        </p>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {currentScenario.choices.map((choice: any, index: number) => (
          <button
            key={choice.id || index}
            type="button"
            onClick={() => onSelectChoice(index)}
            disabled={hasAnswered}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 text-right font-bold focus:outline-none focus:ring-4 focus:ring-indigo-300
              ${!hasAnswered ? "border-gray-200 hover:border-blue-400 hover:bg-gray-50 hover:-translate-x-1" : ""}
              ${hasAnswered && selectedChoiceIndex === index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
              ${hasAnswered && selectedChoiceIndex === index && !choice.isCorrect ? "border-amber-500 bg-amber-50 animate-shake" : ""}
              ${hasAnswered && selectedChoiceIndex !== index && choice.isCorrect ? "border-emerald-500 bg-emerald-50" : ""}
              ${hasAnswered ? "pointer-events-none" : "cursor-pointer"}
            `}
          >
            {choice.icon && <span className="text-2xl flex-shrink-0">{choice.icon}</span>}
            <span className="text-gray-700">{choice.text}</span>
          </button>
        ))}
      </div>

      {/* Feedback overlay */}
      {showFeedback && activeFeedback && (
        <div className="absolute inset-0 bg-white/98 rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-300 z-10">
          <div className="text-center w-full">
            <div className="text-6xl mb-4 animate-in zoom-in duration-500">
              {isSkipped ? "⏭️" : feedbackIsCorrect ? gamePlay.feedbackCorrectIcon : gamePlay.feedbackWrongIcon}
            </div>
            <h3
              className={`text-2xl font-black mb-3 ${
                isSkipped
                  ? "text-amber-500"
                  : feedbackIsCorrect
                    ? "text-emerald-600"
                    : "text-amber-600"
              }`}
            >
              {activeFeedback.title}
            </h3>
            {activeFeedback.message && (
              <p className="text-gray-600 font-medium mb-4 leading-relaxed">
                {activeFeedback.message}
              </p>
            )}

            {activeFeedback.tip && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 mb-5 flex items-start gap-3 text-right">
                <span className="text-2xl flex-shrink-0">{gamePlay.feedbackTipIcon}</span>
                <span className="text-gray-700 font-medium text-sm">
                  {activeFeedback.tip}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={onNextScenario}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full"
            >
              {currentScenarioIndex >= totalScenarios - 1
                ? gamePlay.showResultsLabel
                : gamePlay.nextButtonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
