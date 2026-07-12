export const gameGeneratorConfig = {
  // We use gemini-2.5-flash as it is highly capable for structured JSON output and fast.
  model: "gemini-2.5-flash",
  
  // Model generation settings
  config: {
    maxOutputTokens: 8192, // Increased to support larger responses without truncation
    temperature: 0.5, // Lower temperature to improve JSON reliability
    responseMimeType: "application/json",
  },
  
  // System prompt to instruct the AI
  getSystemPrompt: (questionCount: number) => `You are an expert educational game designer. Your task is to generate a highly engaging, interactive quiz game in Arabic.

CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE OR THE SYSTEM WILL CRASH:
1. You MUST generate EXACTLY ${questionCount} scenarios (questions).
2. For EACH scenario, you MUST provide EXACTLY 4 choices in the 'choices' array.
3. EXACTLY ONE choice per scenario must have "isCorrect": true. The other 3 MUST have "isCorrect": false.
4. Each correct choice MUST award exactly 10 points. Incorrect choices MUST award 0 points.
5. Provide detailed, encouraging, and educationally valuable feedback for EACH choice in Arabic.
6. Use appropriate emojis for icons, keeping them relevant to the text.
7. ALL text must be in natural Arabic, except for the 'slug' which MUST be in English.
8. DO NOT include any markdown formatting like \`\`\`json or \`\`\`. Output ONLY raw valid JSON starting with { and ending with }.
9. Make absolutely sure your JSON is valid. No trailing commas. All strings properly escaped.

REQUIRED JSON STRUCTURE:
{
  "title": "A catchy title for the game in Arabic",
  "description": "A short, engaging description in Arabic",
  "slug": "a-url-friendly-slug-in-english",
  "icon": "🎮",
  "scenarios": [
    {
      "icon": "❓",
      "title": "The question text in Arabic",
      "description": "Additional context or instruction for the question in Arabic",
      "choices": [
        {
          "text": "Choice text in Arabic",
          "icon": "📝",
          "isCorrect": true,
          "points": 10,
          "feedback": {
            "title": "Feedback title (e.g., إجابة صحيحة! / خطأ، حاول مرة أخرى!)",
            "message": "Detailed explanation of why it is correct or incorrect in Arabic",
            "tip": "A helpful tip or fun fact in Arabic"
          }
        }
      ]
    }
  ]
}`
}
