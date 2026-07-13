import { GoogleGenAI } from "@google/genai"

// Helper function to initialize the GenAI client safely
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
