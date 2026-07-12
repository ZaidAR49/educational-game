"use server"

import { GoogleGenAI } from "@google/genai"
import { gameGeneratorConfig } from "../ai/game-generator.config"
import { getPostHogClient } from "@/lib/posthog-server"
import { auth } from "@/auth"

// Helper function to initialize the client safely
export function getGenAIClient() {
  const projectId = process.env.VERTEX_AI_PROJECT_ID;
  const location = process.env.VERTEX_AI_LOCATION || "us-central1";
  const clientEmail = process.env.VERTEX_AI_CLIENT_EMAIL;
  // Handle literal '\n' strings that might be passed from .env
  const privateKey = process.env.VERTEX_AI_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId) {
    console.warn("VERTEX_AI_PROJECT_ID is not set.");
  }

  // Initialize the Vertex AI client
  return new GoogleGenAI({
    vertexai: true,
    project: projectId as string,
    location: location,
    ...(clientEmail && privateKey ? {
      googleAuthOptions: {
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        }
      }
    } : {})
  });
}

export async function generateGameAction(idea: string, questionCount: number) {
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ai = getGenAIClient();
      
      // Call the model with separated user contents and native systemInstruction config for prompt caching
      const response = await ai.models.generateContent({
        model: gameGeneratorConfig.model,
        contents: `Game Topic / Idea: "${idea}"`,
        config: {
          ...gameGeneratorConfig.config,
          systemInstruction: gameGeneratorConfig.getSystemPrompt(questionCount),
        },
      });

      const responseText = response.text;
      
      if (!responseText) {
        throw new Error("لم يقم الذكاء الاصطناعي بتوليد أي محتوى.");
      }

      // Clean up potential markdown wrappers
      let cleanJson = responseText.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json/g, '');
      }
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```/g, '');
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.replace(/```/g, '');
      }

      // Parse and validate
      let parsed;
      try {
        parsed = JSON.parse(cleanJson.trim());
      } catch (parseError) {
        throw new Error("JSON_PARSE_ERROR");
      }
      
      if (!parsed.title || !parsed.scenarios || !Array.isArray(parsed.scenarios)) {
        throw new Error("MISSING_FIELDS_ERROR");
      }

      const session = await auth();
      if (session?.user?.id) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: session.user.id,
          event: "ai_game_generated",
          properties: {
            question_count: questionCount,
            scenario_count: parsed.scenarios?.length ?? 0,
          },
        });
        await posthog.shutdown();
      }

      return {
        success: true,
        data: parsed,
      };

    } catch (error: any) {
      console.error(`AI Generation Error (Attempt ${attempt}):`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, 1500 * attempt));
      }
    }
  }

  // If we reach here, all retries failed. We provide a clear Arabic reason.
  let arabicReason = "حدث خطأ غير متوقع أثناء التوليد. يرجى المحاولة مرة أخرى.";
  const errorMsg = lastError?.message || "";

  if (errorMsg === "JSON_PARSE_ERROR") {
    arabicReason = "فشل الذكاء الاصطناعي في صياغة اللعبة بالشكل الصحيح. قد تكون الفكرة معقدة جداً، جرب تبسيطها.";
  } else if (errorMsg === "MISSING_FIELDS_ERROR") {
    arabicReason = "لم يقم الذكاء الاصطناعي بتوليد جميع الحقول المطلوبة (مثل الأسئلة أو العنوان). يرجى توضيح الفكرة أكثر.";
  } else if (errorMsg.includes("quota") || errorMsg.includes("429")) {
    arabicReason = "تم تجاوز الحد المسموح للاستخدام في الذكاء الاصطناعي. يرجى المحاولة لاحقاً.";
  } else if (errorMsg.includes("timeout") || errorMsg.includes("fetch")) {
    arabicReason = "انتهى وقت الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.";
  } else if (errorMsg.includes("لم يقم الذكاء الاصطناعي")) {
    arabicReason = errorMsg;
  }

  return {
    success: false,
    error: arabicReason
  };
}
