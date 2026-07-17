import { getGenAIClient } from "@/lib/ai/genai-client";
import { gameGeneratorConfig } from "@/lib/ai/game-generator.config";
import { auth } from "@/auth";
import { getAiUsageAndLimit, recordAiUsage, checkAndResetAiUsage } from "@/lib/services/usage.service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { idea, questionCount } = await req.json();

    // SECURITY: Prevent Denial of Wallet / AI Abuse
    const maxQuestions = 20;
    const maxIdeaLength = 1000;
    
    if (typeof questionCount !== 'number' || questionCount < 1 || questionCount > maxQuestions) {
      return new Response(`Error: questionCount must be between 1 and ${maxQuestions}`, { status: 400 });
    }
    
    if (typeof idea !== 'string' || idea.trim().length === 0 || idea.length > maxIdeaLength) {
      return new Response(`Error: idea must be between 1 and ${maxIdeaLength} characters`, { status: 400 });
    }

    // Bug #3 Fix: Enforce AI token limit BEFORE calling the AI
    await checkAndResetAiUsage(session.user.id);
    const aiUsage = await getAiUsageAndLimit(session.user.id);
    if (aiUsage.isOverLimit) {
      return new Response(
        JSON.stringify({ error: "AI usage limit reached for this period.", used: aiUsage.used, limit: aiUsage.limit }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = getGenAIClient();
    const responseStream = await ai.models.generateContentStream({
      model: gameGeneratorConfig.model,
      contents: "Please generate the quiz game now according to the system instructions.",
      config: {
        ...gameGeneratorConfig.config,
        systemInstruction: gameGeneratorConfig.getSystemPrompt(idea, questionCount),
      },
    });

    let totalChars = 0;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              totalChars += chunk.text.length;
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();

          // Record approximate token usage after stream ends (1 token ≈ 4 chars)
          const estimatedTokens = Math.ceil(totalChars / 4);
          await recordAiUsage(session.user.id, estimatedTokens, {
            questionCount,
            ideaLength: idea.length,
          }).catch((err) => console.error("Failed to record AI usage:", err));
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("AI Streaming Error:", error);
    return new Response(error.message || "Failed to generate game", { status: 500 });
  }
}
