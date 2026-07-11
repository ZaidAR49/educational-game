"use server";

import { revalidatePath } from "next/cache";
import * as choicesService from "@/lib/services/choices.service";
import { NewChoice } from "@/lib/db/schema";
import { requireAuth, verifyScenarioOwnership, verifyChoiceOwnership } from "./utils";

/**
 * Creates a new choice for a scenario.
 */
export async function createChoiceAction(choiceData: NewChoice) {
  const user = await requireAuth();
  const scenario = await verifyScenarioOwnership(choiceData.scenarioId, user.id);

  const newChoice = await choicesService.createChoice(choiceData);
  revalidatePath(`/dashboard/games/${scenario.gameId}`);
  return newChoice;
}

/**
 * Updates an existing choice.
 */
export async function updateChoiceAction(choiceId: string, choiceData: Partial<NewChoice>) {
  const user = await requireAuth();
  const choice = await verifyChoiceOwnership(choiceId, user.id);

  const updatedChoice = await choicesService.updateChoice(choiceId, choiceData);
  
  // Revalidate the game page since scenario/choices are displayed there
  // verifyChoiceOwnership also fetches scenario, but since verifyChoiceOwnership doesn't return the scenario object directly,
  // we can re-fetch scenario or let verifyChoiceOwnership return it, or import scenariosService.
  // We'll import scenariosService directly here.
  const { getScenarioById } = await import("@/lib/services/scenarios.service");
  const scenario = await getScenarioById(choice.scenarioId);
  if (scenario) {
    revalidatePath(`/dashboard/games/${scenario.gameId}`);
  }
  
  return updatedChoice;
}

/**
 * Deletes a choice.
 */
export async function deleteChoiceAction(choiceId: string) {
  const user = await requireAuth();
  const choice = await verifyChoiceOwnership(choiceId, user.id);

  await choicesService.deleteChoice(choiceId);
  
  const { getScenarioById } = await import("@/lib/services/scenarios.service");
  const scenario = await getScenarioById(choice.scenarioId);
  if (scenario) {
    revalidatePath(`/dashboard/games/${scenario.gameId}`);
  }
}
