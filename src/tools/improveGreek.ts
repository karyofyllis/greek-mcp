import * as z from "zod";
import { buildPrompt } from "../services/greekPrompt.js";
import { createProvider } from "../providers/factory.js";

export const MAX_TEXT_LENGTH = 12_000;

export const improveGreekInputSchema = z.object({
  text: z.string().max(MAX_TEXT_LENGTH),
  tone: z.enum(["formal", "casual", "marketing"]).default("marketing"),
  provider: z.object({
    type: z.enum(["openai", "claude"]),
    apiKey: z.string().optional(),
  }),
});

export type ImproveGreekInput = z.infer<typeof improveGreekInputSchema>;

export type ImproveGreekResult = {
  corrected: string;
  improvements: string[];
  confidence: number;
};

function normalizeResult(raw: string, fallbackRaw: string): ImproveGreekResult {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "corrected" in parsed &&
      "improvements" in parsed &&
      "confidence" in parsed &&
      typeof (parsed as { corrected: unknown }).corrected === "string" &&
      Array.isArray((parsed as { improvements: unknown }).improvements) &&
      typeof (parsed as { confidence: unknown }).confidence === "number"
    ) {
      const p = parsed as ImproveGreekResult;
      return {
        corrected: p.corrected,
        improvements: p.improvements.filter(
          (x): x is string => typeof x === "string",
        ),
        confidence: p.confidence,
      };
    }
  } catch {
    /* fallback below */
  }
  return {
    corrected: fallbackRaw,
    improvements: ["Fallback parsing"],
    confidence: 0.5,
  };
}

export async function improveGreek(input: ImproveGreekInput): Promise<ImproveGreekResult> {
  const provider = createProvider(input.provider.type, input.provider.apiKey);
  const prompt = buildPrompt(input.text, input.tone);
  const raw = await provider.generate(prompt);
  return normalizeResult(raw.trim(), raw);
}
