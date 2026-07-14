import { eq, desc, count, ilike, and } from "drizzle-orm";
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
 * Fetch the absolute total count of organizations belonging to a specific user (ignores filters).
 */
export async function getTotalOrganizationsCount(ownerId: string): Promise<number> {
  const [totalCount] = await db
    .select({ count: count() })
    .from(organizations)
    .where(eq(organizations.ownerId, ownerId));
  return totalCount.count;
}

/**
 * Fetch all organizations owned by a specific user with pagination and filters.
 */
export async function getOrganizationsByOwnerId(ownerId: string, page: number = 1, limit: number = 3, search?: string) {
  const offset = (page - 1) * limit;

  const conditions = [eq(organizations.ownerId, ownerId)];
  
  if (search) {
    conditions.push(ilike(organizations.name, `%${search}%`));
  }

  const whereClause = and(...conditions);

  const [totalCount] = await db
    .select({ count: count() })
    .from(organizations)
    .where(whereClause);

  const data = await db
    .select()
    .from(organizations)
    .where(whereClause)
    .orderBy(desc(organizations.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    data,
    total: totalCount.count
  };
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
