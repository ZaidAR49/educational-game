import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { choices, Choice, NewChoice } from "@/lib/db/schema";

/**
 * Fetch all choices (answers) for a specific scenario, ordered by orderIndex.
 */
export async function getChoicesByScenarioId(scenarioId: string): Promise<Choice[]> {
  return db
    .select()
    .from(choices)
    .where(eq(choices.scenarioId, scenarioId))
    .orderBy(asc(choices.orderIndex));
}

/**
 * Fetch a single choice by ID.
 */
export async function getChoiceById(id: string): Promise<Choice | undefined> {
  const result = await db.select().from(choices).where(eq(choices.id, id)).limit(1);
  return result[0];
}

/**
 * Create a new choice.
 */
export async function createChoice(choiceData: NewChoice): Promise<Choice> {
  const [newChoice] = await db.insert(choices).values(choiceData).returning();
  return newChoice;
}

/**
 * Update an existing choice.
 */
export async function updateChoice(id: string, choiceData: Partial<NewChoice>): Promise<Choice> {
  const [updatedChoice] = await db
    .update(choices)
    .set(choiceData) // no updatedAt on choices table in schema.sql
    .where(eq(choices.id, id))
    .returning();

  if (!updatedChoice) throw new Error(`Failed to update choice with ID ${id}`);
  return updatedChoice;
}

/**
 * Delete a choice.
 */
export async function deleteChoice(id: string): Promise<void> {
  await db.delete(choices).where(eq(choices.id, id));
}
