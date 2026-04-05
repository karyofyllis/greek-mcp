import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4o";

export class OpenAIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
  ) {}

  async generate(prompt: string): Promise<string> {
    const client = new OpenAI({ apiKey: this.apiKey });
    const res = await client.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });
    return res.choices[0]?.message.content ?? "";
  }
}
