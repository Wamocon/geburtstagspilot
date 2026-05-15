import { supabase } from "@/lib/supabase";
import type {
  Theme,
  Game,
  Recipe,
  FoodItem,
  GoodieBagItem,
  InvitationTemplate,
  LocationType,
} from "@/types";

export async function fetchThemes(): Promise<Theme[]> {
  try {
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .order("name_de");

    if (error) {
      console.error("[data] fetchThemes error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[data] fetchThemes connection error:", err);
    return [];
  }
}

export async function fetchGames(
  age: number,
  location: LocationType,
  themeSlug: string
): Promise<Game[]> {
  try {
    let query = supabase
      .from("games")
      .select("*")
      .lte("min_age", age)
      .gte("max_age", age);

    if (location !== "both") {
      query = query.or(`location.eq.${location},location.eq.both`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[data] fetchGames error:", error.message);
      return [];
    }

    const games = data ?? [];

    // Sort: theme-matching games first, then general games
    return games.sort((a, b) => {
      const aMatch = a.theme_slugs.includes(themeSlug) ? 0 : 1;
      const bMatch = b.theme_slugs.includes(themeSlug) ? 0 : 1;
      return aMatch - bMatch;
    });
  } catch (err) {
    console.error("[data] fetchGames connection error:", err);
    return [];
  }
}

export async function fetchRecipe(themeSlug: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("theme_slug", themeSlug)
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchFoodItems(): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .order("category");

    if (error) {
      console.error("[data] fetchFoodItems error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[data] fetchFoodItems connection error:", err);
    return [];
  }
}

export async function fetchGoodieBagItems(
  themeSlug: string
): Promise<GoodieBagItem[]> {
  try {
    // Fetch all budget tiers so users can switch between them in the UI
    const { data, error } = await supabase
      .from("goodie_bag_items")
      .select("*")
      .or(`theme_slug.eq.${themeSlug},theme_slug.is.null`)
      .order("price_estimate");

    if (error) {
      console.error("[data] fetchGoodieBagItems error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[data] fetchGoodieBagItems connection error:", err);
    return [];
  }
}

export async function fetchInvitationTemplate(
  themeSlug: string
): Promise<InvitationTemplate | null> {
  try {
    const { data, error } = await supabase
      .from("invitation_templates")
      .select("*")
      .eq("theme_slug", themeSlug)
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}
