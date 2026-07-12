import { auth } from "@/auth";
import * as gamesService from "@/lib/services/games.service";
import * as scenariosService from "@/lib/services/scenarios.service";
import * as organizationsService from "@/lib/services/organizations.service";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Ensures the user is authenticated, redirecting to sign in if not.
 * Returns the authenticated user object.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  
  // Fetch fresh user from DB to check for real-time locks and subscription
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { isLocked: true, role: true, isSubscribed: true, subscriptionPlan: true }
  });

  if (dbUser?.isLocked) {
    redirect("/blocked");
  }

  const isAdmin = ["super_admin", "admin", "viewer"].includes(dbUser?.role ?? "")
  const isSubscribed = isAdmin || !!dbUser?.isSubscribed

  return {
    ...session.user,
    role: dbUser?.role || (session.user as any).role,
    isLocked: !!dbUser?.isLocked,
    isSubscribed,
    subscriptionPlan: isSubscribed ? (dbUser?.subscriptionPlan ?? "pro") : null,
  } as typeof session.user & { id: string, role: string, isLocked: boolean, isSubscribed: boolean, subscriptionPlan: string | null };
}

/**
 * Verifies if the user is the owner of the given game.
 * Throws an error if not authorized.
 */
export async function verifyGameOwnership(gameId: string, userId: string) {
  const game = await gamesService.getGameById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.ownerId !== userId) throw new Error("Unauthorized: You do not own this game.");
  return game;
}

/**
 * Verifies if the user is the owner of the organization.
 * Throws an error if not authorized.
 */
export async function verifyOrganizationOwnership(orgId: string, userId: string) {
  const org = await organizationsService.getOrganizationById(orgId);
  if (!org) throw new Error("Organization not found");
  if (org.ownerId !== userId) throw new Error("Unauthorized: You do not own this organization.");
  return org;
}

/**
 * Verifies if the user is the owner of the game the scenario belongs to.
 * Throws an error if not authorized.
 */
export async function verifyScenarioOwnership(scenarioId: string, userId: string) {
  const scenario = await scenariosService.getScenarioById(scenarioId);
  if (!scenario) throw new Error("Scenario not found");
  // We reuse game ownership verification
  await verifyGameOwnership(scenario.gameId, userId);
  return scenario;
}

/**
 * Verifies if the user is the owner of the game the choice belongs to (via scenario).
 * Throws an error if not authorized.
 */
export async function verifyChoiceOwnership(choiceId: string, userId: string) {
  const { getChoiceById } = await import("@/lib/services/choices.service");
  const choice = await getChoiceById(choiceId);
  if (!choice) throw new Error("Choice not found");
  await verifyScenarioOwnership(choice.scenarioId, userId);
  return choice;
}
