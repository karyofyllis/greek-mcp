import * as z from "zod";
import { McpServer, StdioServerTransport } from "@modelcontextprotocol/server";
import {
  improveGreek,
  improveGreekInputSchema,
  MAX_TEXT_LENGTH,
} from "./tools/improveGreek.js";

const outputSchema = z.object({
  corrected: z.string(),
  improvements: z.array(z.string()),
  confidence: z.number(),
});

const server = new McpServer(
  { name: "greek-mcp", version: "1.0.0" },
  {
    instructions:
      "Polish Greek product or marketing copy with improveGreekText. " +
      "API keys: set OPENAI_API_KEY / ANTHROPIC_API_KEY in the MCP process env, " +
      "or pass provider.apiKey per call (optional override). " +
      `Max input length ${MAX_TEXT_LENGTH} characters.`,
  },
);

server.registerTool(
  "improveGreekText",
  {
    title: "Improve Greek text",
    description:
      "Improve Greek AI-generated or translated text (grammar, tone, natural phrasing). " +
      "BYOK: use env keys or optional provider.apiKey.",
    inputSchema: improveGreekInputSchema,
    outputSchema,
  },
  async (input) => {
    const result = await improveGreek(input);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
