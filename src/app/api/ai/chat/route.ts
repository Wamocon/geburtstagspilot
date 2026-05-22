import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { aiStream, isAIAvailable } from "@/lib/ai/provider";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import type { AIMessage } from "@/lib/ai/provider";
import type { WizardData, Theme, Game, ScheduleItem } from "@/types";

interface ChatRequestBody {
  message: string;
  locale: "de" | "en";
  planContext: {
    wizard: WizardData;
    theme: Theme | null;
    schedule: ScheduleItem[];
    games: Game[];
  };
  history: { role: "user" | "assistant"; content: string }[];
}

export async function POST(request: Request) {
  // Check AI availability
  if (!isAIAvailable()) {
    return NextResponse.json(
      { error: "AI_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  // Auth check - Pro tier required
  let user;
  try {
    const supabase = await createSupabaseServer();
    if (!supabase) {
      return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
    }
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .single();

    if (profile?.tier !== "pro") {
      return NextResponse.json({ error: "PRO_REQUIRED" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  // Parse body
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { message, locale, planContext, history } = body;

  if (!message || typeof message !== "string" || message.length > 2000) {
    return NextResponse.json({ error: "INVALID_MESSAGE" }, { status: 400 });
  }

  // Build messages
  const systemPrompt = buildChatSystemPrompt(
    locale,
    planContext.wizard,
    planContext.theme,
    planContext.schedule,
    planContext.games
  );

  const messages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  // Stream response
  const stream = aiStream(messages);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
