// AI Provider abstraction - server-only (no "use client"/"use server")
// Supports OpenAI GPT-4o with graceful fallback when no API key is configured.

import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export function isAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function aiComplete(messages: AIMessage[]): Promise<string> {
  const client = getOpenAI();
  if (!client) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const response = await client.chat.completions.create({
    model: AI_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function aiCompleteJSON<T>(
  messages: AIMessage[],
  parseResponse: (raw: string) => T
): Promise<T> {
  const client = getOpenAI();
  if (!client) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const response = await client.chat.completions.create({
    model: AI_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return parseResponse(content);
}

export function aiStream(messages: AIMessage[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const client = getOpenAI();
      if (!client) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: "AI is not configured. Please set OPENAI_API_KEY." })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
        return;
      }

      try {
        const stream = await client.chat.completions.create({
          model: AI_MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown AI error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });
}
