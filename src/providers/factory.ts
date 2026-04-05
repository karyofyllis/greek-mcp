import { OpenAIProvider } from "./openai.js";
import { ClaudeProvider } from "./claude.js";

export type ProviderInstance = OpenAIProvider | ClaudeProvider;

function resolveKey(type: "openai" | "claude", apiKey?: string): string {
  const trimmed = apiKey?.trim();
  if (trimmed) return trimmed;
  const fromEnv =
    type === "openai" ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;
  const key = fromEnv?.trim();
  if (!key) {
    throw new Error(
      type === "openai"
        ? "Missing OpenAI API key: set OPENAI_API_KEY or pass provider.apiKey"
        : "Missing Anthropic API key: set ANTHROPIC_API_KEY or pass provider.apiKey",
    );
  }
  return key;
}

export function createProvider(
  type: "openai" | "claude",
  apiKey?: string,
): ProviderInstance {
  if (type === "openai") {
    return new OpenAIProvider(resolveKey("openai", apiKey));
  }
  if (type === "claude") {
    return new ClaudeProvider(resolveKey("claude", apiKey));
  }
  throw new Error(`Unsupported provider: ${type}`);
}
