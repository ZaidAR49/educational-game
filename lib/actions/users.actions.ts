"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAuth } from "./utils";
import { update } from "@/auth";

export async function updateUserAction(data: { name: string }) {
  const sessionUser = await requireAuth();

  // Update in database
  await db
    .update(users)
    .set({ name: data.name, updatedAt: new Date() })
    .where(eq(users.id, sessionUser.id!));

  // Update JWT session
  // Note: This requires auth callback configuration to handle session updates if NextAuth v5.
  // We'll call update() to attempt session refresh.
  try {
    await update({ user: { name: data.name } });
  } catch (error) {
    console.error("Session update error:", error);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  
  return { success: true };
}
