import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022";

export class ClaudeProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
  ) {}

  async generate(prompt: string): Promise<string> {
    const client = new Anthropic({ apiKey: this.apiKey });
    const res = await client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    const parts = res.content.filter(
      (b): b is Anthropic.Messages.TextBlock => b.type === "text",
    );
    return parts.map((b) => b.text).join("");
  }
}
