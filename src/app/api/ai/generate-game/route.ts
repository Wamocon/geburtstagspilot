import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { aiCompleteJSON, isAIAvailable } from "@/lib/ai/provider";
import { buildGameGenerationPrompt } from "@/lib/ai/prompts";
import type { AIMessage } from "@/lib/ai/provider";

interface GenerateGameRequestBody {
  locale: "de" | "en";
  age: number;
  location: string;
  themeName: string;
  existingGames: string[];
  guestCount: number;
}

interface AIGameResult {
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  instructions_de: string;
  instructions_en: string;
  duration_minutes: number;
  min_players: number;
  activity: string;
  materials_de: string[];
  materials_en: string[];
}

export async function POST(request: Request) {
  if (!isAIAvailable()) {
    return NextResponse.json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
  }

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

  let body: GenerateGameRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const { locale, age, location, themeName, existingGames, guestCount } = body;

  const prompt = buildGameGenerationPrompt(
    locale,
    age,
    location,
    themeName,
    existingGames,
    guestCount
  );

  const messages: AIMessage[] = [
    { role: "user", content: prompt },
  ];

  try {
    const game = await aiCompleteJSON<AIGameResult>(messages, (raw: string) => {
      const parsed = JSON.parse(raw) as AIGameResult;
      // Basic validation
      if (!parsed.name_de || !parsed.name_en || !parsed.description_de) {
        throw new Error("Invalid game format");
      }
      return parsed;
    });

    return NextResponse.json({ game });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
