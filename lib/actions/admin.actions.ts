"use server";

import { eq, inArray, sql, and, or, ilike, desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, organizations, games, players, classroomPlays } from "@/lib/db/schema";
import { requireSuperAdmin, requireDashboardAccess, requireAdmin } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function getAdminsAction() {
  // Bug #1 Fix: require at least dashboard/viewer access
  await requireDashboardAccess();

  // Per product requirement: return only id, name, email, and role for admin list
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
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
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

export async function getUsersListAction(page = 1, searchQuery = "", filterType = "all", sortType = "newest") {
  // Bug #2 Fix: only admin+ can list all platform users
  await requireAdmin();

  const limit = 10;
  const offset = (page - 1) * limit;

  const conditions = [eq(users.role, "user")];

  if (searchQuery) {
    conditions.push(or(
      ilike(users.name, `%${searchQuery}%`),
      ilike(users.email, `%${searchQuery}%`)
    ) as any);
  }

  if (filterType === "pro") {
    conditions.push(eq(users.subscriptionPlan, "pro"));
  } else if (filterType === "locked") {
    conditions.push(eq(users.isLocked, true));
  }

  const whereClause = and(...conditions);

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(whereClause);
  
  const totalCount = Number(totalCountResult[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  let orderByClause;
  if (sortType === "recent_login") {
    orderByClause = desc(users.lastLoginAt);
  } else if (sortType === "oldest") {
    orderByClause = asc(users.createdAt);
  } else {
    orderByClause = desc(users.createdAt);
  }

  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    isLocked: users.isLocked,
    isSubscribed: users.isSubscribed,
    plan: users.subscriptionPlan,
    createdAt: users.createdAt,
    lastLoginAt: users.lastLoginAt,
    aiRequestsCurrentPeriod: users.aiRequestsCurrentPeriod,
    subscriptionExpiresAt: users.subscriptionExpiresAt,
    aiTokensUsedCurrentPeriod: users.aiTokensUsedCurrentPeriod,
    organizations: sql<number>`(
      SELECT count(*)::int FROM "organizations" WHERE "owner_id" = "users"."id"
    )`,
    games: sql<number>`(
      SELECT count(*)::int FROM "games" WHERE "owner_id" = "users"."id"
    )`,
    totalPlayers: sql<number>`(
      SELECT count(*)::int
      FROM "players" p
      JOIN "classroom_plays" cp ON p.classroom_play_id = cp.id
      WHERE cp.teacher_id = "users"."id"
    )`,
  })
  .from(users)
  .where(whereClause)
  .limit(limit)
  .offset(offset)
  .orderBy(orderByClause);

  const mappedUsers = result.map(u => ({
    ...u,
    status: u.isLocked ? "locked" : "active",
    plan: u.plan || "free",
    createdAt: u.createdAt.toISOString().split('T')[0],
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString().split('T')[0] : null,
    subscriptionExpiresAt: u.subscriptionExpiresAt ? u.subscriptionExpiresAt.toISOString().split('T')[0] : null,
  }));

  return {
    users: mappedUsers,
    totalPages,
    currentPage: page
  };
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

  // Bug #10 Fix: wrap guard + update in a transaction to prevent TOCTOU race
  await db.transaction(async (tx) => {
    const target = await tx.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
    if (target[0]?.role === "super_admin") {
      const superAdmins = await tx.select({ id: users.id }).from(users).where(eq(users.role, "super_admin"));
      if (superAdmins.length <= 1) {
        throw new Error("لا يمكن حذف مدير النظام الوحيد. يجب أن يبقى على الأقل مدير نظام واحد.");
      }
    }
    await tx.update(users)
      .set({ role: "user" })
      .where(eq(users.id, userId));
  });

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

  // Bug #10 Fix: wrap guard + update in a transaction to prevent TOCTOU race
  await db.transaction(async (tx) => {
    if (role !== "super_admin") {
      const current = await tx.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
      if (current[0]?.role === "super_admin") {
        const superAdmins = await tx.select({ id: users.id }).from(users).where(eq(users.role, "super_admin"));
        if (superAdmins.length <= 1) {
          throw new Error("لا يمكن تخفيض صلاحية مدير النظام الوحيد.");
        }
      }
    }
    await tx.update(users)
      .set({ name, role })
      .where(eq(users.id, userId));
  });

  revalidatePath("/admin/settings");
}
