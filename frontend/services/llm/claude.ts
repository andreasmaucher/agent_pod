import { Anthropic } from "@anthropic-ai/sdk";
import type { Message, StructuredMessage } from "./types";

export interface SendMessageOptions {
  messages: Message[];
  maxTokens?: number;
}

export async function sendMessage({
  messages,
  maxTokens = 1000,
}: SendMessageOptions): Promise<StructuredMessage> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  let systemPrompt: string | undefined;
  let messagesToSend = messages;

  if (messages[0]?.role === "system") {
    systemPrompt = messages[0].content;
    messagesToSend = messages.slice(1);
  }

  const claudeMessages: Anthropic.MessageParam[] = messagesToSend.map(
    (msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    })
  );

  const tools: Anthropic.Tool[] = [
    {
      name: "approveTransfer",
      description: "Approve the money transfer request and provide explanation",
      input_schema: {
        type: "object" as const,
        properties: {
          explanation: {
            type: "string",
            description: "Explanation for why the money transfer is approved",
          },
        },
        required: ["explanation"],
      },
    },
    {
      name: "rejectTransfer",
      description: "Reject the money transfer request and provide explanation",
      input_schema: {
        type: "object" as const,
        properties: {
          explanation: {
            type: "string",
            description: "Explanation for why the money transfer is rejected",
          },
        },
        required: ["explanation"],
      },
    },
  ];

  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    messages: claudeMessages,
    system: systemPrompt,
    tools: tools,
    max_tokens: maxTokens,
  });

  console.log("completion");
  console.log(completion.content);

  for (const content of completion.content) {
    if (content.type === "tool_use") {
      type ToolInput = { explanation: string };
      if (content.name === "approveTransfer") {
        return {
          explanation: (content.input as ToolInput).explanation,
          decision: true,
        };
      }
      return {
        explanation: (content.input as ToolInput).explanation,
        decision: false,
      };
    }
  }

  try {
    const responseText =
      completion.content[0].type === "text" ? completion.content[0].text : "";

    const response = JSON.parse(responseText);
    return {
      explanation: response.explanation,
      decision: response.decision,
    };
  } catch (e) {
    // Fallback if response isn't valid JSON
    const fallbackText =
      completion.content[0].type === "text"
        ? completion.content[0].text
        : "Transfer rejected";

    return {
      explanation: fallbackText,
      decision: false,
    };
  }
}
