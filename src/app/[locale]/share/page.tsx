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
import { getThemeEmoji, getThemeName } from "@/lib/theme-config";
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

export default function SharePage() {
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

  useEffect(() => {
    const stored = sessionStorage.getItem("wizardData");
    if (!stored) {
      setLoading(false);
      return;
    }
    const data: WizardData = JSON.parse(stored);
    setWizard(data);
    loadPlanData(data);
  }, []);

  async function loadPlanData(data: WizardData) {
    try {
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
      // silent fail
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

  if (!wizard || !theme) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t("noData")}</p>
            <button
              onClick={() => router.push("/wizard")}
              className="px-6 py-3 bg-party-purple text-white rounded-full font-medium hover:bg-party-purple-dark transition-colors"
            >
              {locale === "de" ? "Plan erstellen" : "Create Plan"}
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
            <div className="text-5xl mb-3">{getThemeEmoji(theme.slug, theme.emoji)}</div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              {wizard.birthdayChildName
                ? `${wizard.birthdayChildName}${locale === "de" ? "s Party" : "'s Party"}`
                : t("shareTitle")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              {getThemeName(theme.slug, locale as "de" | "en", theme.name_de, theme.name_en)} - {wizard.guestCount} {locale === "de" ? "Gäste" : "Guests"} - {budgetLabel}
            </p>
            <p className="text-xs text-zinc-400 mt-3">{t("shareSubtitle")}</p>
          </div>

          {/* Schedule Section */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              📅 {t("sectionSchedule")}
            </h2>
            <div className="space-y-2">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl"
                >
                  <span className="text-sm font-mono text-party-purple dark:text-party-yellow font-medium w-14 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                    {locale === "de" ? item.title_de : item.title_en}
                  </span>
                  <span className="text-xs text-zinc-400 shrink-0">{item.duration} min</span>
                </div>
              ))}
            </div>
          </section>

          {/* Games Section */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              🎮 {t("sectionGames")}
            </h2>
            <div className="grid gap-3">
              {games.map((game) => {
                const name = locale === "de" ? game.name_de : game.name_en;
                const desc = locale === "de" ? game.description_de : game.description_en;
                return (
                  <div
                    key={game.id}
                    className="p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">
                        {game.activity === "calm" ? "😌" : game.activity === "active" ? "🏃" : "🤸"}
                      </span>
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">{name}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {game.duration_minutes} min
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            {game.min_age}-{game.max_age} {locale === "de" ? "Jahre" : "years"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Food Section */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
              🍰 {t("sectionFood")}
            </h2>
            {recipe && (
              <div className="mb-4 p-4 bg-party-yellow/10 dark:bg-party-yellow/5 rounded-xl border border-party-yellow/20">
                <h3 className="font-bold text-zinc-900 dark:text-white">
                  🧁 {locale === "de" ? recipe.name_de : recipe.name_en}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {locale === "de" ? recipe.description_de : recipe.description_en}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {foodItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg text-sm"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {locale === "de" ? item.name_de : item.name_en}
                  </span>
                  <span className="font-medium text-party-purple dark:text-party-yellow">
                    {item.totalQuantity} {locale === "de" ? item.unit_de : item.unit_en}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Goodie Bags */}
          {filteredGoodies.length > 0 && (
            <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                🎁 {t("sectionGoodies")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {filteredGoodies.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg text-sm"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {locale === "de" ? item.name_de : item.name_en}
                    </span>
                    <span className="font-medium text-party-purple dark:text-party-yellow">
                      {item.quantity_per_child * wizard.guestCount}x
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Allergen Notes */}
          {(wizard.allergens.glutenFree || wizard.allergens.lactoseFree || wizard.allergens.nutFree || wizard.allergens.vegan || wizard.allergens.vegetarian || wizard.allergens.customNotes) && (
            <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-900 dark:text-white">
                ⚠️ {t("sectionNotes")}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {wizard.allergens.glutenFree && (
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
                    {locale === "de" ? "Glutenfrei" : "Gluten-free"}
                  </span>
                )}
                {wizard.allergens.lactoseFree && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">
                    {locale === "de" ? "Laktosefrei" : "Lactose-free"}
                  </span>
                )}
                {wizard.allergens.nutFree && (
                  <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium">
                    {locale === "de" ? "Nussfrei" : "Nut-free"}
                  </span>
                )}
                {wizard.allergens.vegan && (
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium">
                    {locale === "de" ? "Vegan" : "Vegan"}
                  </span>
                )}
                {wizard.allergens.vegetarian && (
                  <span className="px-3 py-1 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-300 text-xs font-medium">
                    {locale === "de" ? "Vegetarisch" : "Vegetarian"}
                  </span>
                )}
              </div>
              {wizard.allergens.customNotes && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg">
                  {wizard.allergens.customNotes}
                </p>
              )}
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center no-print">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-party-purple text-white rounded-full font-medium hover:bg-party-purple-dark transition-colors"
            >
              🔗 {t("copyLink")}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-party-mint text-zinc-900 rounded-full font-medium hover:bg-party-mint/80 transition-colors shadow-md"
            >
              🖨️ {t("printPlan")}
            </button>
            <button
              onClick={() => router.push("/result")}
              className="flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-full font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              ✏️ {t("backToEdit")}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
