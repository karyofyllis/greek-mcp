export type Tone = "formal" | "casual" | "marketing";

export function buildPrompt(text: string, tone: Tone): string {
  return `You are an expert Greek SaaS copywriter.

RULES:
- Use natural modern Greek
- Avoid translation-like phrasing
- Fix grammar, syntax, tone
- Use correct accents (τόνοι)
- Keep sentences short and clear
- Reply with ONLY valid JSON (no markdown fences, no commentary)

TONE: ${tone}

Return JSON with this exact shape:
{
  "corrected": "<improved Greek text>",
  "improvements": ["<short bullet notes in Greek or English>"],
  "confidence": <number from 0 to 1>

TEXT:
${text}
`;
}
