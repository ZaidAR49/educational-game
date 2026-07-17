"use server";

import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import * as organizationsService from "@/lib/services/organizations.service";
import { NewOrganization } from "@/lib/db/schema";
import { requireAuth, verifyOrganizationOwnership } from "./utils";
import { deleteLogoFromS3 } from "./upload.actions";

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
 * Fetches all organizations for the logged-in user with pagination and filters.
 */
export async function getMyOrganizationsAction(page: number = 1, search?: string) {
  const user = await requireAuth();
  
  return organizationsService.getOrganizationsByOwnerId(user.id, page, 3, search);
}

/**
 * Fetches the absolute total count of organizations for the logged-in user.
 */
export async function getTotalOrganizationsCountAction() {
  const user = await requireAuth();
  return organizationsService.getTotalOrganizationsCount(user.id);
}

/**
 * Updates an organization, ensuring the user owns it.
 */
export async function updateOrganizationAction(orgId: string, orgData: Partial<NewOrganization>) {
  const user = await requireAuth();
  await verifyOrganizationOwnership(orgId, user.id);

  if (orgData.logoPath !== undefined) {
    const oldOrg = await organizationsService.getOrganizationById(orgId);
    if (oldOrg && oldOrg.logoPath && oldOrg.logoPath !== orgData.logoPath) {
      await deleteLogoFromS3(oldOrg.logoPath);
    }
  }

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

  const org = await organizationsService.getOrganizationById(orgId);
  if (org && org.logoPath) {
    await deleteLogoFromS3(org.logoPath);
  }

  await organizationsService.deleteOrganization(orgId);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/organizations");
  updateTag(`organizations-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}
