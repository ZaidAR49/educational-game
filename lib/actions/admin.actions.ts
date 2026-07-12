"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, organizations, games, players, classroomPlays } from "@/lib/db/schema";
import { requireSuperAdmin } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getAdminsAction() {
  const allAdmins = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isLocked: users.isLocked,
      addedAt: users.createdAt,
    })
    .from(users)
    .where(inArray(users.role, ["super_admin", "admin", "viewer"]));

  return allAdmins.map(admin => ({
    ...admin,
    status: admin.isLocked ? "blocked" : "active",
    addedAt: admin.addedAt.toISOString().split('T')[0]
  }));
}

export async function addAdminAction(formData: FormData) {
  await requireSuperAdmin();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleInput = formData.get("role") as string;

  const validRoles = ["super_admin", "admin", "viewer"] as const;
  const role = validRoles.includes(roleInput as typeof validRoles[number]) ? roleInput as typeof validRoles[number] : "admin";

  if (!email || !name) throw new Error("Name and email are required");

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    // Upgrade existing user — also update name so it reflects what was entered
    await db.update(users)
      .set({ role, name })
      .where(eq(users.id, existingUser[0].id));
  } else {
    // Create new user stub
    await db.insert(users).values({
      name,
      email,
      role,
      isLocked: false,
    });
  }

  revalidatePath("/admin/settings");
}

export async function toggleAdminBlockAction(userId: string, isLocked: boolean) {
  await requireSuperAdmin();

  await db.update(users)
    .set({ isLocked })
    .where(eq(users.id, userId));
  revalidatePath("/admin/settings");
}

export async function getUsersListAction() {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    isLocked: users.isLocked,
    isSubscribed: users.isSubscribed,
    plan: users.subscriptionPlan,
    createdAt: users.createdAt,
    organizations: sql<number>`(SELECT count(*) FROM organizations WHERE owner_id = "users"."id")::int`,
    games: sql<number>`(SELECT count(*) FROM games WHERE owner_id = "users"."id")::int`,
    totalPlayers: sql<number>`(
      SELECT count(*) 
      FROM players p 
      JOIN classroom_plays cp ON p.classroom_play_id = cp.id 
      WHERE cp.teacher_id = "users"."id"
    )::int`,
  })
  .from(users)
  .where(eq(users.role, "user"));

  return result.map(u => ({
    ...u,
    status: u.isLocked ? "locked" : "active",
    plan: u.plan || "free",
    createdAt: u.createdAt.toISOString().split('T')[0]
  }));
}

export async function addNormalUserAction(formData: FormData) {
  await requireSuperAdmin();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const plan = formData.get("plan") as string;

  if (!email || !name) throw new Error("Name and email required");

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) throw new Error("User with this email already exists");

  await db.insert(users).values({
    name,
    email,
    role: "user",
    isLocked: false,
    isSubscribed: plan === "pro",
    subscriptionPlan: plan === "pro" ? "pro" : null,
  });

  revalidatePath("/admin/accounts");
}

export async function toggleUserBlockAction(userId: string, isLocked: boolean) {
  await requireSuperAdmin();
  await db.update(users).set({ isLocked }).where(eq(users.id, userId));
  revalidatePath("/admin/accounts");
}

export async function toggleUserSubscriptionAction(userId: string, isSubscribed: boolean) {
  await requireSuperAdmin();
  await db.update(users).set({ 
    isSubscribed, 
    subscriptionPlan: isSubscribed ? "pro" : null 
  }).where(eq(users.id, userId));
  revalidatePath("/admin/accounts");
}

export async function deleteUserAction(userId: string) {
  await requireSuperAdmin();
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/accounts");
}

export async function removeAdminAction(userId: string) {
  await requireSuperAdmin();

  // Guard: ensure at least one super_admin will remain after removal
  const target = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
  if (target[0]?.role === "super_admin") {
    const superAdmins = await db.select({ id: users.id }).from(users).where(eq(users.role, "super_admin"));
    if (superAdmins.length <= 1) {
      throw new Error("لا يمكن حذف مدير النظام الوحيد. يجب أن يبقى على الأقل مدير نظام واحد.");
    }
  }

  await db.update(users)
    .set({ role: "user" })
    .where(eq(users.id, userId));

  revalidatePath("/admin/settings");
}

export async function editAdminAction(formData: FormData) {
  await requireSuperAdmin();

  const userId = formData.get("userId") as string;
  const name   = formData.get("name")   as string;
  const roleInput = formData.get("role") as string;

  if (!userId || !name) throw new Error("User ID and name are required");

  const validRoles = ["super_admin", "admin", "viewer"] as const;
  const role = validRoles.includes(roleInput as typeof validRoles[number]) ? roleInput as typeof validRoles[number] : "admin";

  // If we are downgrading a super_admin, ensure at least one remains
  if (role !== "super_admin") {
    const current = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
    if (current[0]?.role === "super_admin") {
      const superAdmins = await db.select({ id: users.id }).from(users).where(eq(users.role, "super_admin"));
      if (superAdmins.length <= 1) {
        throw new Error("لا يمكن تخفيض صلاحية مدير النظام الوحيد.");
      }
    }
  }

  await db.update(users)
    .set({ name, role })
    .where(eq(users.id, userId));

  revalidatePath("/admin/settings");
}
