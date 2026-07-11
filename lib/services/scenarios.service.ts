import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { scenarios, Scenario, NewScenario } from "@/lib/db/schema";

/**
 * Fetch all scenarios (questions) for a given game, ordered by their orderIndex.
 */
export async function getScenariosByGameId(gameId: string): Promise<Scenario[]> {
  return db
    .select()
    .from(scenarios)
    .where(eq(scenarios.gameId, gameId))
    .orderBy(asc(scenarios.orderIndex));
}

/**
 * Fetch a single scenario by ID.
 */
export async function getScenarioById(id: string): Promise<Scenario | undefined> {
  const result = await db.select().from(scenarios).where(eq(scenarios.id, id)).limit(1);
  return result[0];
}

/**
 * Create a new scenario.
 */
export async function createScenario(scenarioData: NewScenario): Promise<Scenario> {
  const [newScenario] = await db.insert(scenarios).values(scenarioData).returning();
  return newScenario;
}

/**
 * Update an existing scenario.
 */
export async function updateScenario(id: string, scenarioData: Partial<NewScenario>): Promise<Scenario> {
  const [updatedScenario] = await db
    .update(scenarios)
    .set({ ...scenarioData, updatedAt: new Date() })
    .where(eq(scenarios.id, id))
    .returning();
    
  if (!updatedScenario) throw new Error(`Failed to update scenario with ID ${id}`);
  return updatedScenario;
}

/**
 * Delete a scenario.
 */
export async function deleteScenario(id: string): Promise<void> {
  await db.delete(scenarios).where(eq(scenarios.id, id));
}
