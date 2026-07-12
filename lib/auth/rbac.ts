import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Retrieves the freshest user record from the database.
 * Useful for checking real-time status like isLocked or role changes.
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id)
  });

  return dbUser || null;
}

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
