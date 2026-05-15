import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { aiComplete, isAIAvailable } from "@/lib/ai/provider";
import { buildInvitationPrompt } from "@/lib/ai/prompts";
import type { AIMessage } from "@/lib/ai/provider";

interface GenerateInvitationRequestBody {
  locale: "de" | "en";
  childName: string;
  age: number;
  themeName: string;
  style: "funny" | "classic" | "creative";
}

export async function POST(request: Request) {
  if (!isAIAvailable()) {
    return NextResponse.json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
  }

  let user;
  try {
    const supabase = await createSupabaseServer();
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

  let body: GenerateInvitationRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { locale, childName, age, themeName, style } = body;

  if (!["funny", "classic", "creative"].includes(style)) {
    return NextResponse.json({ error: "INVALID_STYLE" }, { status: 400 });
  }

  const prompt = buildInvitationPrompt(locale, childName, age, themeName, style);
  const messages: AIMessage[] = [{ role: "user", content: prompt }];

  try {
    const text = await aiComplete(messages);
    return NextResponse.json({ text });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
