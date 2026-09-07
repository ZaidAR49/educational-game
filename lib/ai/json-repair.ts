export function safeParseAiGameJson(streamedJson: string): any {
  // 1. First attempt: standard clean and parse
  const trimmed = streamedJson.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : trimmed;

  try {
    const parsed = JSON.parse(candidate);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // Continue to repair attempts below
  }

  // 2. Second attempt: repair truncated scenarios array
  // Find opening of scenarios: "scenarios"\s*:\s*\[
  const scenariosIdx = trimmed.indexOf('"scenarios"');
  if (scenariosIdx === -1) {
    throw new SyntaxError("No valid scenarios found in AI output");
  }

  // Walk backwards from the end looking for closing curly braces '}'
  let searchPos = trimmed.length;
  while (searchPos > scenariosIdx) {
    const lastBrace = trimmed.lastIndexOf('}', searchPos);
    if (lastBrace === -1 || lastBrace <= scenariosIdx) break;

    const sliceToBrace = trimmed.slice(0, lastBrace + 1);

    // Candidates to complete the JSON
    const attempts = [
      sliceToBrace + '\n  ]\n}',
      sliceToBrace + '\n}',
    ];

    for (const attempt of attempts) {
      try {
        const repairedMatch = attempt.match(/\{[\s\S]*\}/);
        const toParse = repairedMatch ? repairedMatch[0] : attempt;
        const parsed = JSON.parse(toParse);
        if (
          parsed &&
          Array.isArray(parsed.scenarios) &&
          parsed.scenarios.length > 0 &&
          parsed.scenarios[0].title
        ) {
          // Filter out any incomplete scenario items at the end that lack choices
          parsed.scenarios = parsed.scenarios.filter(
            (s: any) => s && s.title && Array.isArray(s.choices) && s.choices.length > 0
          );
          if (parsed.scenarios.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Try earlier brace
      }
    }

    searchPos = lastBrace - 1;
  }

  throw new SyntaxError("Failed to parse or salvage valid JSON from stream");
}
