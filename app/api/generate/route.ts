import { getGenAIClient } from "@/lib/actions/ai.actions";
import { gameGeneratorConfig } from "@/lib/ai/game-generator.config";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
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

    const ai = getGenAIClient();
    const responseStream = await ai.models.generateContentStream({
      model: gameGeneratorConfig.model,
      contents: `Game Topic / Idea: "${idea}"`,
      config: {
        ...gameGeneratorConfig.config,
        systemInstruction: gameGeneratorConfig.getSystemPrompt(questionCount),
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
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
