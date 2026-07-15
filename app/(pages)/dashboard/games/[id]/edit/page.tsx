import { notFound } from "next/navigation"
import { GameWizard } from "@/components/games/GameWizard"
import { getFullGameDataAction } from "@/lib/actions/game-wizard.actions"
import { getMyOrganizationsAction } from "@/lib/actions/organizations.actions"

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const data = await getFullGameDataAction(id);
    if (!data) return notFound();

    const { data: organizations } = await getMyOrganizationsAction();
    const orgOptions = organizations.map(org => ({
      id: org.id,
      name: org.name,
      logo: org.logoPath
    }));

    // Map DB structure to frontend Wizard state structure
    const initialGame = {
      title: data.game.title,
      description: data.game.description || "",
      slug: data.game.slug,
      icon: data.game.icon || "🎮",
      status: data.game.status,
      organizationId: data.game.organizationId || "",
    };

    const initialScenarios = data.scenarios.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon || "❓",
      choices: s.choices.map(c => ({
        text: c.text,
        icon: c.icon || "📝",
        isCorrect: c.isCorrect,
        feedback: {
          title: c.feedbackTitle || "",
          message: c.feedbackMessage || "",
          tip: c.feedbackTip || "",
        }
      }))
    }));

    return (
      <GameWizard 
        isEdit={true} 
        gameId={id}
        initialGame={initialGame}
        initialScenarios={initialScenarios}
        organizations={orgOptions} 
      />
    );
  } catch (error) {
    console.error("Failed to load game for editing:", error);
    return notFound();
  }
}
