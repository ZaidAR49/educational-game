"use server";

import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import * as organizationsService from "@/lib/services/organizations.service";
import { NewOrganization } from "@/lib/db/schema";
import { requireAuth, verifyOrganizationOwnership } from "./utils";

/**
 * Creates a new organization for the logged-in user.
 */
export async function createOrganizationAction(orgData: Omit<NewOrganization, "ownerId">) {
  const user = await requireAuth();

  const newOrg = await organizationsService.createOrganization({
    ...orgData,
    ownerId: user.id,
  });

  revalidatePath("/dashboard/settings");
  updateTag(`organizations-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  return newOrg;
}

/**
 * Fetches a single organization by ID, ensuring the user owns it.
 */
export async function getOrganizationAction(orgId: string) {
  const user = await requireAuth();
  return verifyOrganizationOwnership(orgId, user.id);
}

/**
 * Fetches all organizations for the logged-in user.
 */
export async function getMyOrganizationsAction() {
  const user = await requireAuth();
  
  const getCachedOrgs = unstable_cache(
    async () => organizationsService.getOrganizationsByOwnerId(user.id),
    [`organizations-${user.id}`],
    { tags: [`organizations-${user.id}`] }
  );

  return getCachedOrgs();
}

/**
 * Updates an organization, ensuring the user owns it.
 */
export async function updateOrganizationAction(orgId: string, orgData: Partial<NewOrganization>) {
  const user = await requireAuth();
  await verifyOrganizationOwnership(orgId, user.id);

  const updatedOrg = await organizationsService.updateOrganization(orgId, orgData);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/organizations");
  updateTag(`organizations-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  return updatedOrg;
}

/**
 * Deletes an organization, ensuring the user owns it.
 */
export async function deleteOrganizationAction(orgId: string) {
  const user = await requireAuth();
  await verifyOrganizationOwnership(orgId, user.id);

  await organizationsService.deleteOrganization(orgId);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/organizations");
  updateTag(`organizations-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}
