"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type {
  WizardData,
  Theme,
  Game,
  Recipe,
  ScheduleItem,
  FoodItemWithQuantity,
  GoodieBagItem,
  BudgetTier,
} from "@/types";
import {
  fetchThemes,
  fetchGames,
  fetchRecipe,
  fetchFoodItems,
  fetchGoodieBagItems,
} from "@/lib/data";
import {
  generateSchedule,
  calculateFoodQuantities,
} from "@/lib/plan-generator";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface ShareViewPageProps {
  token: string;
}

export function ShareViewPage({ token }: ShareViewPageProps) {
  const t = useTranslations("result");
  const locale = useLocale() as "de" | "en";
  const router = useRouter();

  const [wizard, setWizard] = useState<WizardData | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItemWithQuantity[]>([]);
  const [goodieItems, setGoodieItems] = useState<GoodieBagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [planTitle, setPlanTitle] = useState("");

  useEffect(() => {
    loadSharedPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadSharedPlan() {
    try {
      const supabase = createSupabaseBrowser();
      const { data: plan, error } = await supabase
        .from("saved_plans")
        .select("*")
        .eq("share_token", token)
        .eq("is_shared", true)
        .single();

      if (error || !plan) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const data: WizardData = plan.wizard_data;
      setWizard(data);
      setPlanTitle(plan.title);

      const [themes, allGames, recipeData, rawFoodItems, goodies] =
        await Promise.all([
          fetchThemes(),
          fetchGames(data.age, data.location, data.themeSlug),
          fetchRecipe(data.themeSlug),
          fetchFoodItems(),
          fetchGoodieBagItems(data.themeSlug),
        ]);

      const selectedTheme = themes.find((th) => th.slug === data.themeSlug) ?? themes[0];
      setTheme(selectedTheme);

      const mainGames = allGames.slice(0, 5);
      setGames(mainGames);
      setRecipe(recipeData);
      setFoodItems(calculateFoodQuantities(rawFoodItems, data.guestCount));
      setGoodieItems(goodies);

      const sched = generateSchedule(data, mainGames);
      setSchedule(sched);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-bounce">🎈</div>
            <p className="text-zinc-500">{locale === "de" ? "Laden..." : "Loading..."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !wizard || !theme) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              {locale === "de" ? "Plan nicht gefunden" : "Plan not found"}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {locale === "de"
                ? "Dieser geteilte Plan existiert nicht oder wurde entfernt."
                : "This shared plan does not exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-party-purple text-white rounded-full font-medium hover:bg-party-purple-dark transition-colors"
            >
              {locale === "de" ? "Zur Startseite" : "Go to Homepage"}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const budgetLabel =
    wizard.budget === "low"
      ? locale === "de" ? "Sparfuchs" : "Budget"
      : wizard.budget === "high"
        ? "Deluxe"
        : locale === "de" ? "Goldene Mitte" : "Standard";

  const filteredGoodies = goodieItems.filter(
    (item) => item.budget === (wizard.budget as BudgetTier)
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4 print:py-2 print:px-0">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="text-center py-8 bg-gradient-to-br from-party-purple/10 via-party-yellow/10 to-party-mint/10 dark:from-party-purple/20 dark:via-party-yellow/20 dark:to-party-mint/20 rounded-3xl border border-zinc-200 dark:border-zinc-700">
            <div className="text-5xl mb-3">{theme.emoji}</div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {planTitle || (wizard.birthdayChildName
                ? `${wizard.birthdayChildName}${locale === "de" ? "s Party" : "'s Party"}`
                : t("shareTitle"))}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              {locale === "de" ? theme.name_de : theme.name_en} - {wizard.guestCount} {locale === "de" ? "Gäste" : "Guests"} - {budgetLabel}
            </p>
            <p className="text-xs text-zinc-400 mt-3">{t("shareSubtitle")}</p>
          </div>

          {/* Schedule */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              📅 {t("sectionSchedule")}
            </h2>
            <div className="space-y-2">
              {schedule.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <span className="text-sm font-mono text-party-purple dark:text-party-yellow font-medium w-14 shrink-0">{item.time}</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">{locale === "de" ? item.title_de : item.title_en}</span>
                  <span className="text-xs text-zinc-400 shrink-0">{item.duration} min</span>
                </div>
              ))}
            </div>
          </section>

          {/* Games */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              🎮 {t("sectionGames")}
            </h2>
            <div className="grid gap-3">
              {games.map((game) => (
                <div key={game.id} className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{game.activity === "calm" ? "😌" : game.activity === "active" ? "🏃" : "🤸"}</span>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{locale === "de" ? game.name_de : game.name_en}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{locale === "de" ? game.description_de : game.description_en}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Food */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              🍰 {t("sectionFood")}
            </h2>
            {recipe && (
              <div className="mb-4 p-4 bg-party-yellow/10 dark:bg-party-yellow/5 rounded-xl border border-party-yellow/20">
                <h3 className="font-bold text-zinc-900 dark:text-white">
                  🧁 {locale === "de" ? recipe.name_de : recipe.name_en}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{locale === "de" ? recipe.description_de : recipe.description_en}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {foodItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300">{locale === "de" ? item.name_de : item.name_en}</span>
                  <span className="font-medium text-party-purple dark:text-party-yellow">{item.totalQuantity} {locale === "de" ? item.unit_de : item.unit_en}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Goodies */}
          {filteredGoodies.length > 0 && (
            <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                🎁 {t("sectionGoodies")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {filteredGoodies.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">{locale === "de" ? item.name_de : item.name_en}</span>
                    <span className="font-medium text-party-purple dark:text-party-yellow">{item.quantity_per_child * wizard.guestCount}x</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer branding */}
          <div className="text-center py-4">
            <p className="text-xs text-zinc-400">
              {locale === "de" ? "Erstellt mit" : "Created with"}{" "}
              <span className="font-bold text-party-purple dark:text-party-yellow">KinderPartyPlaner</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
