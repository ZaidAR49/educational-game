"use server";

import { revalidatePath } from "next/cache";
import { eq, desc, and, or, isNull, gt, lte, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { systemAnnouncements, userNotifications, users, systemAnnouncementReads } from "@/lib/db/schema";
import { requireAuth, requireAdmin } from "./utils";

export async function getSystemAnnouncementsAction() {
  await requireAdmin();
  const announcements = await db.select().from(systemAnnouncements).orderBy(desc(systemAnnouncements.createdAt));
  return announcements;
}

export async function createSystemAnnouncementAction(data: {
  title: string;
  body: string;
  type: string;
  severity: string;
  language?: string;
  endsAt: Date | null;
}) {
  const sessionUser = await requireAdmin();

  await db.insert(systemAnnouncements).values({
    title: data.title,
    body: data.body,
    type: data.type,
    severity: data.severity,
    language: (data.language && ["all", "ar", "en"].includes(data.language)) ? data.language : "all",
    endsAt: data.endsAt,
    createdBy: sessionUser.id,
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
}

export async function deleteSystemAnnouncementAction(id: string) {
  await requireAdmin();
  await db.delete(systemAnnouncements).where(eq(systemAnnouncements.id, id));
  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
}

export async function deleteAllSystemAnnouncementsAction() {
  await requireAdmin();
  await db.delete(systemAnnouncements);
  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
}

export async function getUserNotificationsAction() {
  await requireAdmin();
  
  // For the admin dashboard, we fetch all recent user notifications
  // joining with users to show who it was sent to, including their preferred language.
  const notifications = await db
    .select({
      notification: userNotifications,
      user: {
        name: users.name,
        email: users.email,
        locale: users.locale,
      }
    })
    .from(userNotifications)
    .leftJoin(users, eq(userNotifications.userId, users.id))
    .orderBy(desc(userNotifications.createdAt))
    .limit(50);
    
  return notifications;
}

export async function createUserNotificationAction(data: {
  userId: string;
  title: string;
  body: string;
  type: string;
}) {
  await requireAdmin();

  // Validate that the user exists first
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, data.userId),
  });

  if (!existingUser) {
    return { error: "المستخدم غير موجود. الرجاء التأكد من المعرف (User ID)." };
  }

  await db.insert(userNotifications).values({
    userId: data.userId,
    title: data.title,
    body: data.body,
    type: data.type,
  });

  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function deleteUserNotificationAction(id: string) {
  await requireAdmin();
  await db.delete(userNotifications).where(eq(userNotifications.id, id));
  revalidatePath("/admin/notifications");
}

export async function deleteAllUserNotificationsAction() {
  await requireAdmin();
  await db.delete(userNotifications);
  revalidatePath("/admin/notifications");
}

// ------------------------------------------------------------------
// USER-FACING ACTIONS
// ------------------------------------------------------------------

export async function getMyNotificationsAction() {
  const sessionUser = await requireAuth();
  
  const notifications = await db
    .select()
    .from(userNotifications)
    .where(eq(userNotifications.userId, sessionUser.id))
    .orderBy(desc(userNotifications.createdAt))
    .limit(50);
    
  return notifications;
}

export async function getMySystemAnnouncementsAction(overrideLocale?: string) {
  const sessionUser = await requireAuth();
  const userLocale = (overrideLocale && ["ar", "en"].includes(overrideLocale))
    ? overrideLocale
    : (sessionUser.locale || "ar");
  
  // Find IDs of announcements the user has already dismissed
  const dismissedReads = await db
    .select({ id: systemAnnouncementReads.announcementId })
    .from(systemAnnouncementReads)
    .where(eq(systemAnnouncementReads.userId, sessionUser.id));
    
  const dismissedIds = dismissedReads.map((r) => r.id);

  // Build the query for active announcements
  // is_active = true AND startsAt <= now AND (endsAt IS NULL OR endsAt > now)
  // AND (language = 'all' OR language = userLocale)
  const now = new Date();
  
  const conditions = [
    eq(systemAnnouncements.isActive, true),
    lte(systemAnnouncements.startsAt, now),
    or(isNull(systemAnnouncements.endsAt), gt(systemAnnouncements.endsAt, now)),
    or(
      eq(systemAnnouncements.language, "all"),
      eq(systemAnnouncements.language, userLocale)
    )
  ];
  
  if (dismissedIds.length > 0) {
    conditions.push(notInArray(systemAnnouncements.id, dismissedIds));
  }
  
  const announcements = await db
    .select()
    .from(systemAnnouncements)
    .where(and(...conditions))
    .orderBy(desc(systemAnnouncements.createdAt));
    
  return announcements;
}

export async function deleteMyNotificationAction(id: string) {
  const sessionUser = await requireAuth();
  
  await db
    .delete(userNotifications)
    .where(and(
      eq(userNotifications.id, id),
      eq(userNotifications.userId, sessionUser.id)
    ));
    
  revalidatePath("/dashboard");
}

export async function markUserNotificationReadAction(id: string) {
  const sessionUser = await requireAuth();
  
  await db
    .update(userNotifications)
    .set({ isRead: true })
    .where(and(
      eq(userNotifications.id, id),
      eq(userNotifications.userId, sessionUser.id)
    ));
    
  revalidatePath("/dashboard");
}

export async function dismissSystemAnnouncementAction(announcementId: string) {
  const sessionUser = await requireAuth();
  
  // Insert a record into systemAnnouncementReads so it won't show again
  try {
    await db.insert(systemAnnouncementReads).values({
      userId: sessionUser.id,
      announcementId: announcementId,
    });
  } catch (error: any) {
    // Ignore duplicate key errors if the user clicks twice quickly
    if (error.code !== "23505") {
      throw error;
    }
  }
  
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadAction() {
  const sessionUser = await requireAuth();
  
  // 1. Mark all direct user notifications as read
  await db
    .update(userNotifications)
    .set({ isRead: true })
    .where(
      and(
        eq(userNotifications.userId, sessionUser.id),
        eq(userNotifications.isRead, false)
      )
    );
    
  revalidatePath("/dashboard");
}
