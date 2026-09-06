import { getLiveGameForStudentAction, getGameForPreviewAction } from "@/lib/actions/plays.actions";
import GameClient from "@/components/game/GameClient";
import { DEMO_GAME, DEMO_PLAY, DEMO_SCENARIOS } from "@/data/demo-game";

import { GameErrorScreen } from "@/components/game/GameErrorScreen";

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
    return <GameErrorScreen error={data?.error} />;
  }

  return <GameClient game={data.game} play={data.play} scenarios={data.scenarios} />;
}
