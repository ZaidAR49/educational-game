import { db } from "@/lib/db";
import { users, usageEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { config } from "@/lib/config";

function isResetNeeded(startedAt: Date | null) {
  if (!startedAt) return true;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays > 30;
}

export async function checkAndResetAiUsage(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { usagePeriodStartedAt: true }
  });

  if (!user) return;

  if (isResetNeeded(user.usagePeriodStartedAt)) {
    await db.update(users)
      .set({
        aiTokensUsedCurrentPeriod: 0,
        aiRequestsCurrentPeriod: 0,
        gamePlaysCurrentPeriod: 0,
        usagePeriodStartedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}

export async function getAiUsageAndLimit(userId: string) {
  await checkAndResetAiUsage(userId);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { 
      aiTokensUsedCurrentPeriod: true, 
      aiRequestsCurrentPeriod: true,
      isSubscribed: true,
    }
  });

  if (!user) throw new Error("User not found");

  const limit = user.isSubscribed ? config.ai.limits.subscribed : config.ai.limits.free;
  const used = user.aiTokensUsedCurrentPeriod || 0;
  
  return {
    used,
    limit,
    requests: user.aiRequestsCurrentPeriod || 0,
    isOverLimit: used >= limit
  };
}

export async function recordAiUsage(userId: string, tokensUsed: number, metadata: Record<string, any>) {
  await db.insert(usageEvents).values({
    userId,
    activity: "ai_generation",
    tokensUsed,
    metadata
  });
}
