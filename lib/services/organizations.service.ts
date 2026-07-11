import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizations, Organization, NewOrganization } from "@/lib/db/schema";

/**
 * Fetch an organization by ID.
 */
export async function getOrganizationById(id: string): Promise<Organization | undefined> {
  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result[0];
}

/**
 * Fetch all organizations owned by a specific user.
 */
export async function getOrganizationsByOwnerId(ownerId: string): Promise<Organization[]> {
  return db
    .select()
    .from(organizations)
    .where(eq(organizations.ownerId, ownerId))
    .orderBy(desc(organizations.createdAt));
}

/**
 * Create a new organization.
 */
export async function createOrganization(orgData: NewOrganization): Promise<Organization> {
  const [newOrg] = await db.insert(organizations).values(orgData).returning();
  return newOrg;
}

/**
 * Update an existing organization.
 */
export async function updateOrganization(id: string, orgData: Partial<NewOrganization>): Promise<Organization> {
  const [updatedOrg] = await db
    .update(organizations)
    .set({ ...orgData, updatedAt: new Date() })
    .where(eq(organizations.id, id))
    .returning();
    
  if (!updatedOrg) throw new Error(`Failed to update organization with ID ${id}`);
  return updatedOrg;
}

/**
 * Delete an organization.
 */
export async function deleteOrganization(id: string): Promise<void> {
  await db.delete(organizations).where(eq(organizations.id, id));
}
