"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, scenarios, choices, NewGame } from "@/lib/db/schema";
import { requireAuth, verifyGameOwnership } from "./utils";

export type SaveGameData = {
  title: string;
  description: string;
  slug: string;
  icon: string;
  status: "draft" | "published" | "archived";
  organizationId: string;
  language?: string;
};

export type SaveScenarioData = {
  id?: string;
  title: string;
  description: string;
  icon: string;
  choices: SaveChoiceData[];
};

export type SaveChoiceData = {
  text: string;
  icon: string;
  isCorrect: boolean;
  feedback: {
    title: string;
    message: string;
    tip: string;
  };
};

/**
 * Saves a complete game with all its scenarios and choices inside a transaction.
 * Handles both Creation and Updating (Replacing scenarios/choices).
 */
export async function saveFullGameAction(
  gameData: SaveGameData,
  scenariosData: SaveScenarioData[],
  gameId?: string
) {
  const user = await requireAuth();

  // If editing an existing game, verify ownership
  if (gameId) {
    await verifyGameOwnership(gameId, user.id);
  }

  // Execute in a transaction to guarantee data integrity
  const finalGameId = await db.transaction(async (tx) => {
    let targetGameId = gameId;

    // 1. Upsert Game
    if (targetGameId) {
      // Update
      await tx
        .update(games)
        .set({
          ...gameData,
          organizationId: gameData.organizationId,
          updatedAt: new Date(),
        })
        .where(eq(games.id, targetGameId));
    } else {
      // Insert
      const [newGame] = await tx
        .insert(games)
        .values({
          ...gameData,
          ownerId: user.id,
          organizationId: gameData.organizationId,
        })
        .returning({ id: games.id });
      targetGameId = newGame.id;
    }

    // 2. If it's an update, we delete old scenarios (Cascade will handle choices)
    if (gameId) {
      await tx.delete(scenarios).where(eq(scenarios.gameId, targetGameId));
    }

    // 3. Insert Scenarios and Choices
    for (let i = 0; i < scenariosData.length; i++) {
      const scenarioInput = scenariosData[i];

      // Insert Scenario
      const [newScenario] = await tx
        .insert(scenarios)
        .values({
          gameId: targetGameId!,
          orderIndex: i,
          title: scenarioInput.title,
          description: scenarioInput.description,
          icon: scenarioInput.icon,
        })
        .returning({ id: scenarios.id });

      // Insert Choices for this Scenario
      const choicesToInsert = scenarioInput.choices.map((choiceInput, j) => ({
        scenarioId: newScenario.id,
        orderIndex: j,
        text: choiceInput.text,
        icon: choiceInput.icon,
        isCorrect: choiceInput.isCorrect,
        feedbackTitle: choiceInput.feedback.title,
        feedbackMessage: choiceInput.feedback.message,
        feedbackTip: choiceInput.feedback.tip,
        points: choiceInput.isCorrect ? 100 : 0, // Default 100 points for correct
      }));

      if (choicesToInsert.length > 0) {
        await tx.insert(choices).values(choicesToInsert);
      }
    }

    return targetGameId;
  });

  revalidatePath("/dashboard/games");
  if (gameId) {
    revalidatePath(`/dashboard/games/${gameId}`);
    revalidateTag(`game-${gameId}`);
    revalidateTag(`game-full-${gameId}`);
  }
  revalidateTag(`games-${user.id}`);
  revalidateTag(`dashboard-${user.id}`);

  return { success: true, gameId: finalGameId };
}

/**
 * Fetches a complete game with all its scenarios and choices.
 * Used to populate the Game Wizard for editing.
 */
export async function getFullGameDataAction(gameId: string) {
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  const getCachedFullGame = unstable_cache(
    async () => {
      const gameResult = await db.select().from(games).where(eq(games.id, gameId)).limit(1);
      const game = gameResult[0];
      if (!game) return null;

      const scenariosResult = await db
        .select()
        .from(scenarios)
        .where(eq(scenarios.gameId, gameId))
        .orderBy(scenarios.orderIndex);

      const fullScenarios = await Promise.all(
        scenariosResult.map(async (scenario) => {
          const choicesResult = await db
            .select()
            .from(choices)
            .where(eq(choices.scenarioId, scenario.id))
            .orderBy(choices.orderIndex);

          return {
            ...scenario,
            choices: choicesResult,
          };
        })
      );

      return {
        game,
        scenarios: fullScenarios,
      };
    },
    [`game-full-${gameId}`],
    { tags: [`game-full-${gameId}`] }
  );

  return getCachedFullGame();
}
