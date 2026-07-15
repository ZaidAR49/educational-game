import { getLiveGameForStudentAction, getGameForPreviewAction } from "@/lib/actions/plays.actions";
import GameClient from "@/components/game/GameClient";
import { DEMO_GAME, DEMO_PLAY, DEMO_SCENARIOS } from "@/data/demo-game";

export default async function GamePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ preview?: string }>
}) {
  const { id } = await params;
  const { preview } = await searchParams;
  
  if (id === 'demo') {
    return <GameClient game={DEMO_GAME} play={DEMO_PLAY} scenarios={DEMO_SCENARIOS} />;
  }
  
  const data = preview === 'true' 
    ? await getGameForPreviewAction(id)
    : await getLiveGameForStudentAction(id);

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
