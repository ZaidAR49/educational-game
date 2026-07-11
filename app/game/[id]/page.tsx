import { getLiveGameForStudentAction } from "@/lib/actions/plays.actions";
import GameClient from "./GameClient";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLiveGameForStudentAction(id);

  if (!data || data.error || !data.game || !data.play) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" dir="rtl">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md w-full">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً، لا يمكن الانضمام</h1>
          <p className="text-gray-500 leading-relaxed">
            {data?.error || "لم يتم العثور على الجلسة المباشرة لهذه اللعبة. يرجى التأكد من أن المعلم قد بدأ اللعبة."}
          </p>
        </div>
      </div>
    );
  }

  return <GameClient game={data.game} play={data.play} scenarios={data.scenarios} />;
}
