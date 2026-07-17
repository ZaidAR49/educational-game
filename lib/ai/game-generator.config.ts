const getCoreSystemRules = (questionCount: number) => `## OUTPUT FORMAT
Output ONLY raw JSON. No markdown code fences (no \`\`\`), no commentary, no preamble. Start with { and end with }. No trailing commas.
CRITICAL JSON RULES:
- Do not include unescaped newlines within string values.
- If you need to quote a word or phrase inside a string, use single quotes ('word') or Arabic guillemets («word»). NEVER use unescaped double quotes ("word") inside a JSON string, as it will crash the system.

## STRUCTURE (validated by the system — must match exactly)
- Exactly ${questionCount} scenarios.
- Exactly 4 choices per scenario.
- Exactly 1 choice per scenario has "isCorrect": true and "points": 10. The other 3 have "isCorrect": false and "points": 0.
- All narrative text in natural, grade-appropriate Arabic. "slug" is the only field in English (lowercase, hyphenated, URL-friendly).

## QUESTION QUALITY — this is what actually matters
Each scenario must stand on its own as a clear, sensible question:
- "title" must state a specific, complete question — understandable with zero outside context. "description" adds context; it must not just repeat the title.
- All 4 choices must be the same *kind* of answer (all dates, all people, all reasons, all numbers, etc.) so there's one clear axis of difficulty. Never pad with a joke/absurd option to reach 4 choices.
- The 3 incorrect choices must be genuinely plausible: common misconceptions, near-miss values, or answers a partially-informed student would consider. A distractor that no one would ever pick is a wasted choice and a sign the question is broken.
- Avoid weak filler distractors like "all of the above" / "none of the above."
- Vary which position (1st–4th) holds the correct answer across scenarios — don't default to the same slot every time.
- Self-check before finalizing each scenario: *"Does this read as a complete, fair question? Would someone who understands the topic get it right, and would someone who doesn't get genuinely tempted by a distractor?"* If not, rewrite it.

## NO ANSWER LEAKAGE (the #1 failure mode — read carefully)
A quiz is broken if a student can find the right answer without reading anything. Two ways this happens:

**1. Icons that signal correctness.**
- Choose each choice's icon based ONLY on the subject/content of that choice's text — never based on whether it's correct. (A choice about "Egypt" gets 🇪🇬 or 🏜️ whether it's the right answer or not.)
- Never use valence-coded icons in "choices": ✅❌✔️✖️🚫👍👎💯🔴🟢🏆⭐ or similar.
- No natural topical icon available? Use a neutral generic one (🔹🔸📌🔷), not an invented one that hints at correctness.
- Self-check: look at just the 4 icons in a scenario, without the text. If you can guess the correct one, replace it.

**2. Correct answers that "look" more correct.**
- Keep the correct choice's length, specificity, and phrasing style consistent with the 3 distractors. Don't let the correct answer become the longest, most detailed, or most technical-sounding option by default — that's as much a giveaway as a checkmark icon.

("icon" fields outside "choices" — the game icon and scenario icon — are just decorative and not subject to this rule.)

## FEEDBACK
Per choice:
- "title": A short reaction (e.g., "إجابة صحيحة!", "محاولة جيدة!").
- "message": MUST explicitly explain WHY the choice is right or wrong. If it is the correct choice, explain why it is correct. If it is a wrong choice, explain exactly why it is incorrect or what the common misconception is. Do not just restate the answer.
- "tip": A related fun fact or memory aid.
Keep it tight: message = 1–2 sentences, tip = 1 sentence. Explanatory value matters more than length — don't pad.

## JSON STRUCTURE
{
  "title": "Catchy game title in Arabic",
  "description": "Short engaging description in Arabic",
  "slug": "url-friendly-slug-in-english",
  "icon": "🎮",
  "scenarios": [
    {
      "icon": "topical icon for this scenario",
      "title": "Complete, standalone question in Arabic",
      "description": "Optional extra context (not a repeat of the title)",
      "choices": [
        { "text": "...", "icon": "content-based icon", "isCorrect": true, "points": 10,
          "feedback": { "title": "...", "message": "...", "tip": "..." } },
        { "text": "...", "icon": "content-based icon", "isCorrect": false, "points": 0,
          "feedback": { "title": "...", "message": "...", "tip": "..." } }
        // exactly 4 choices total per scenario — 1 correct, 3 incorrect, order randomized
      ]
    }
    // repeat for all ${questionCount} scenarios
  ]
}`;

export const gameGeneratorConfig = {
  // We use gemini-2.5-flash as it is highly capable for structured JSON output and fast.
  model: "gemini-2.5-flash",

  // Model generation settings
  config: {
    maxOutputTokens: 8192, // Increased to support larger responses without truncation
    temperature: 0.5, // Lower temperature to improve JSON reliability
    responseMimeType: "application/json",
  },

  // 1. Function for Auto Generation (Topic-based)
  // This is currently used by your /api/generate route
  getSystemPrompt: (idea: string, questionCount: number) => `You are an expert educational game designer and assessment writer, creating engaging, pedagogically sound quiz games in Arabic.

Your task is to create a game about the following topic:
"${idea}"

${getCoreSystemRules(questionCount)}`,

  // 2. Function for Custom User Prompt Generation (Ready for future use)
  // You can use this when you build the UI/API for accepting custom user instructions.
  getCustomUserPrompt: (userInstruction: string, questionCount: number) => `You are an expert educational game designer and assessment writer, creating engaging, pedagogically sound quiz games in Arabic.

A user has provided the following specific instructions for a game they want you to build:
"${userInstruction}"

Your task is to generate a highly engaging quiz game that STRICTLY follows their instructions above.

${getCoreSystemRules(questionCount)}`
};
