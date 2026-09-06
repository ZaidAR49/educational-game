"use server";

import { getGenAIClient } from "@/lib/ai/genai-client";
import { auth } from "@/auth";
import { getAiUsageAndLimit, recordAiUsage, checkAndResetAiUsage } from "@/lib/services/usage.service";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const AI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-2.0-flash-lite";

export async function improveTextAction(text: string, context: string): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await checkAndResetAiUsage(session.user.id);
  const aiUsage = await getAiUsageAndLimit(session.user.id);
  if (aiUsage.isOverLimit) {
    throw new Error("AI usage limit reached for this period.");
  }

  const ai = getGenAIClient();
  const prompt = `You are an expert copywriter and educator for educational applications.
Your task is to enhance and polish the provided text for: "${context}".

Current text:
"${text}"

CRITICAL RULES:
1. PRESERVE THE INPUT LANGUAGE: Do NOT enforce or translate into any specific language. You MUST improve and return the text in the EXACT SAME language that the user entered (whether it is Arabic, English, French, Chinese, Spanish, or any other language). Never translate the text into a different language.
2. ENHANCE QUALITY: Make it professional, engaging, clear, and inspiring for students and educators while maintaining the original meaning and tone.
3. OUTPUT FORMAT: Output ONLY the improved text. Do NOT include explanations, preambles, notes, or surrounding quotes.`;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: AI_TEXT_MODEL,
        contents: prompt,
      });

      if (response.text) {
        const estimatedTokens = response.usageMetadata?.totalTokenCount || Math.ceil((prompt.length + response.text.length) / 4);
        await recordAiUsage(session.user.id, estimatedTokens, { action: "improveTextAction", context }).catch(console.error);

        try {
          const { getPostHogClient } = await import("@/lib/posthog-server");
          const posthog = getPostHogClient();
          posthog.capture({
            distinctId: session.user.id,
            event: "ai_organization_improved",
            properties: {
              tokensUsed: estimatedTokens,
              context: context
            },
          });
          await posthog.shutdown();
        } catch (err) {
          console.error("Failed to track PostHog event:", err);
        }
      }

      return response.text || text;
    } catch (error) {
      lastError = error;
      console.warn(`[improveTextAction] محاولة ${attempt} فشلت:`, (error as Error).message);
      
      if (attempt < MAX_RETRIES) {
        // تأخير متزايد مع عشوائية بسيطة لتجنب الضغط المتزامن
        const delay = attempt * 1500 + Math.random() * 500;
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export async function improveOrganizationFormAction(formData: Record<string, string>): Promise<Record<string, string>> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await checkAndResetAiUsage(session.user.id);
  const aiUsage = await getAiUsageAndLimit(session.user.id);
  if (aiUsage.isOverLimit) {
    throw new Error("AI usage limit reached for this period.");
  }

  const ai = getGenAIClient();
  const prompt = `You are an expert copywriter and educator for educational applications.
Your task is to enhance all text fields in the following organization settings form.

Current form data:
${JSON.stringify(formData, null, 2)}

CRITICAL RULES:
1. PRESERVE THE INPUT LANGUAGE: Do NOT enforce or translate into any specific language. For each text field, you MUST improve and return the text in the EXACT SAME language that was provided (whether Arabic, English, French, Chinese, Spanish, or any other language). Never translate values to a different language.
2. PRESERVE STRUCTURE: Keep the exact same JSON keys and structure. Do not rename, add, or remove keys.
3. ENHANCE QUALITY: Make all texts professional, cohesive, engaging, and suitable for students and educators.
4. OUTPUT FORMAT: Output ONLY valid raw JSON matching the original keys. No markdown code fences (no \`\`\`), no preamble, no commentary.`;

  const MAX_RETRIES = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: AI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("لم يتم إرجاع أي نص من الذكاء الاصطناعي");
      }

      const estimatedTokens = response.usageMetadata?.totalTokenCount || Math.ceil((prompt.length + response.text.length) / 4);
      await recordAiUsage(session.user.id, estimatedTokens, { action: "improveOrganizationFormAction" }).catch(console.error);

      try {
        const { getPostHogClient } = await import("@/lib/posthog-server");
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: session.user.id,
          event: "ai_organization_improved",
          properties: {
            tokensUsed: estimatedTokens,
          },
        });
        await posthog.shutdown();
      } catch (err) {
        console.error("Failed to track PostHog event:", err);
      }

      let cleanJson = response.text.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '');
      if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '');
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/```/g, '');
      
      return JSON.parse(cleanJson.trim());
    } catch (error) {
      lastError = error;
      console.warn(`[improveOrganizationFormAction] محاولة ${attempt} فشلت:`, (error as Error).message);
      
      if (attempt < MAX_RETRIES) {
        const delay = attempt * 2000 + Math.random() * 1000;
        await sleep(delay);
      }
    }
  }

  throw lastError;
}
