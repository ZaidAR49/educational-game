import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Retrieves the freshest user record from the database.
 * Useful for checking real-time status like isLocked or role changes.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) return null;

  try {
    let dbUser = null;
    if (session.user.id) {
      // Validate UUID format before querying users.id to prevent Postgres syntax error
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id);
      if (isUuid) {
        dbUser = await db.query.users.findFirst({
          where: eq(users.id, session.user.id)
        });
      }
    }
    if (!dbUser && session.user.email) {
      dbUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email)
      });
    }

    if (!dbUser) {
      // If DB record not found, fallback to session identity
      return {
        id: session.user.id || "",
        name: session.user.name || "Admin",
        email: session.user.email || "",
        role: (session.user as any).role || "admin",
        isLocked: (session.user as any).isLocked || false,
        image: session.user.image ?? null,
      } as typeof users.$inferSelect;
    }

    // Always use image taken from the session after user login, never from the database
    return {
      ...dbUser,
      image: session.user.image ?? null,
    };
  } catch (error) {
    console.error("[getCurrentUser] DB lookup failed, falling back to session:", error);
    return {
      id: session.user.id || "",
      name: session.user.name || "Admin",
      email: session.user.email || "",
      role: (session.user as any).role || "admin",
      isLocked: (session.user as any).isLocked || false,
      image: session.user.image ?? null,
    } as typeof users.$inferSelect;
  }
});

/**
 * Ensures the user has at least viewer access to the dashboard.
 * Allowed roles: super_admin, admin, viewer.
 */
export async function requireDashboardAccess() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/signin"); // Or redirect("/login") depending on your NextAuth setup
  if (user.isLocked) redirect("/blocked");
  if (!["admin", "super_admin", "viewer"].includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Ensures the user has at least admin access (can manage users, but not admins).
 * Allowed roles: super_admin, admin.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/signin");
  if (user.isLocked) redirect("/blocked");
  if (!["admin", "super_admin"].includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

/**
 * Ensures the user has super admin access (can manage everything, including admins).
 * Allowed roles: super_admin.
 */
export async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/signin");
  if (user.isLocked) redirect("/blocked");
  if (user.role !== "super_admin") {
    redirect("/unauthorized");
  }
  return user;
}
