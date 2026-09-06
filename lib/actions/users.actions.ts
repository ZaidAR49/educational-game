"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, usageEvents, accounts, sessions, organizations, games, classroomPlays } from "@/lib/db/schema";
import { requireAuth } from "./utils";
import { update } from "@/auth";

export async function updateUserAction(data: { name?: string; locale?: string }) {
  const sessionUser = await requireAuth();

  const updateData: Record<string, any> = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.locale !== undefined && ["ar", "en"].includes(data.locale)) {
    updateData.locale = data.locale;
  }

  // Update in database
  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, sessionUser.id!));

  // Update JWT session
  try {
    const sessionUpdatePayload: Record<string, any> = {};
    if (data.name !== undefined) sessionUpdatePayload.name = data.name;
    if (data.locale !== undefined) sessionUpdatePayload.locale = data.locale;
    await update({ user: sessionUpdatePayload });
  } catch (error) {
    console.error("Session update error:", error);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  
  return { success: true };
}

export async function deleteUserAccountAction() {
  try {
    const sessionUser = await requireAuth();

    // If user is super_admin, verify they are not the only one
    if (sessionUser.role === "super_admin") {
      const superAdmins = await db.query.users.findMany({
        where: eq(users.role, "super_admin"),
        columns: { id: true },
      });

      if (superAdmins.length <= 1) {
        return { success: false, error: "لا يمكنك حذف حسابك لأنك المشرف العام الوحيد. الرجاء تعيين مشرف عام آخر أولاً." };
      }
    }

    // Delete the user's related records explicitly to avoid DB constraint issues
    // (In case the DB schema doesn't have ON DELETE CASCADE set up properly for some tables)
    await db.delete(usageEvents).where(eq(usageEvents.userId, sessionUser.id!));
    await db.delete(classroomPlays).where(eq(classroomPlays.teacherId, sessionUser.id!));
    await db.delete(games).where(eq(games.ownerId, sessionUser.id!));
    await db.delete(organizations).where(eq(organizations.ownerId, sessionUser.id!));
    await db.delete(sessions).where(eq(sessions.userId, sessionUser.id!));
    await db.delete(accounts).where(eq(accounts.userId, sessionUser.id!));

    // Delete the user
    await db.delete(users).where(eq(users.id, sessionUser.id!));

    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء محاولة حذف الحساب. الرجاء المحاولة لاحقاً." };
  }
}
