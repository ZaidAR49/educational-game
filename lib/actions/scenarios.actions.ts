"use server";

import { revalidatePath } from "next/cache";
import * as scenariosService from "@/lib/services/scenarios.service";
import { NewScenario } from "@/lib/db/schema";
import { requireAuth, verifyGameOwnership, verifyScenarioOwnership } from "./utils";

/**
 * Creates a new scenario for a game.
 * Verifies that the logged-in user owns the game first.
 */
export async function createScenarioAction(scenarioData: NewScenario) {
  const user = await requireAuth();
  await verifyGameOwnership(scenarioData.gameId, user.id);

  const newScenario = await scenariosService.createScenario(scenarioData);
  revalidatePath(`/dashboard/games/${scenarioData.gameId}`);
  return newScenario;
}

/**
 * Fetches all scenarios for a given game.
 */
export async function getScenariosByGameAction(gameId: string) {
  // It might be public or private, but usually if we're in the dashboard, we want to see it.
  // We can add auth check if needed, but fetching scenarios is generally safe 
  // or we can strictly enforce game ownership to view in dashboard.
  const user = await requireAuth();
  await verifyGameOwnership(gameId, user.id);

  return scenariosService.getScenariosByGameId(gameId);
}

/**
 * Updates an existing scenario.
 * Verifies that the logged-in user owns the game this scenario belongs to.
 */
export async function updateScenarioAction(scenarioId: string, scenarioData: Partial<NewScenario>) {
  const user = await requireAuth();
  const scenario = await verifyScenarioOwnership(scenarioId, user.id);

  const updatedScenario = await scenariosService.updateScenario(scenarioId, scenarioData);
  revalidatePath(`/dashboard/games/${scenario.gameId}`);
  return updatedScenario;
}

/**
 * Deletes a scenario.
 * Verifies that the logged-in user owns the game this scenario belongs to.
 */
export async function deleteScenarioAction(scenarioId: string) {
  const user = await requireAuth();
  const scenario = await verifyScenarioOwnership(scenarioId, user.id);

  await scenariosService.deleteScenario(scenarioId);
  revalidatePath(`/dashboard/games/${scenario.gameId}`);
}
