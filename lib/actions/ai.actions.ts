"use server"

import { GoogleGenAI } from "@google/genai"
import { gameGeneratorConfig } from "../ai/game-generator.config"

// Helper function to initialize the client safely
function getGenAIClient() {
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
  try {
    const ai = getGenAIClient();
    
    // Construct the full prompt
    const systemPrompt = gameGeneratorConfig.getSystemPrompt(questionCount);
    const finalPrompt = `${systemPrompt}\n\nGame Topic / Idea: "${idea}"`;

    // Call the model
    const response = await ai.models.generateContent({
      model: gameGeneratorConfig.model,
      contents: finalPrompt,
      config: gameGeneratorConfig.config,
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
    const parsed = JSON.parse(cleanJson.trim());
    
    if (!parsed.title || !parsed.scenarios || !Array.isArray(parsed.scenarios)) {
      throw new Error("المخرجات لا تحتوي على الحقول الأساسية المطلوبة.");
    }

    return {
      success: true,
      data: parsed,
    };
    
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      error: error.message || "حدث خطأ غير متوقع أثناء التوليد."
    };
  }
}
