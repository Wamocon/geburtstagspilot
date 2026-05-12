"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type {
  WizardData,
  Theme,
  Game,
  Recipe,
  FoodItemWithQuantity,
  ShoppingCategory,
  InvitationTemplate,
  GoodieBagItem,
  ScheduleItem,
  GuestEntry,
  AllergenPreferences,
} from "@/types";
import {
  fetchThemes,
  fetchGames,
  fetchRecipe,
  fetchFoodItems,
  fetchGoodieBagItems,
  fetchInvitationTemplate,
} from "@/lib/data";
import {
  generateSchedule,
  calculateFoodQuantities,
  generateShoppingList,
} from "@/lib/plan-generator";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { GamesTab } from "./tabs/GamesTab";
import { FoodTab } from "./tabs/FoodTab";
import { ShoppingTab } from "./tabs/ShoppingTab";
import { InvitationTab } from "./tabs/InvitationTab";
import { GoodiesTab } from "./tabs/GoodiesTab";
import { GuestListTab } from "./tabs/GuestListTab";

const TABS = [
  { key: "schedule", icon: "🗓️" },
  { key: "games", icon: "🎮" },
  { key: "food", icon: "🍰" },
  { key: "shopping", icon: "🛒" },
  { key: "invitation", icon: "💌" },
  { key: "goodies", icon: "🎁" },
  { key: "guests", icon: "👥" },
] as const;

const DEFAULT_ALLERGENS: AllergenPreferences = {
  glutenFree: false,
  lactoseFree: false,
  nutFree: false,
  vegan: false,
  vegetarian: false,
  customNotes: "",
};

export function ResultView() {
  const t = useTranslations("result");
  const locale = useLocale() as "de" | "en";
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [loading, setLoading] = useState(true);
  const [wizard, setWizard] = useState<WizardData | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [reserveGames, setReserveGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItemWithQuantity[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingCategory[]>([]);
  const [invitation, setInvitation] = useState<InvitationTemplate | null>(null);
  const [goodieItems, setGoodieItems] = useState<GoodieBagItem[]>([]);
  const [startTime, setStartTime] = useState("14:00");
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("wizardData");
    if (!stored) {
      router.push("/wizard");
      return;
    }

    const wizardData: WizardData = JSON.parse(stored);
    // Backward compatibility: ensure allergens and guestNames exist
    if (!wizardData.allergens) wizardData.allergens = { ...DEFAULT_ALLERGENS };
    if (!wizardData.guestNames) wizardData.guestNames = [];
    if (!wizardData.birthdayChildName) wizardData.birthdayChildName = "";

    setWizard(wizardData);

    // Initialize guest list from wizard guest names
    if (wizardData.guestNames.length > 0) {
      const initialGuests: GuestEntry[] = wizardData.guestNames
        .filter((n) => n.trim())
        .map((name) => ({
          id: crypto.randomUUID(),
          childName: name,
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          rsvpStatus: "pending" as const,
          allergens: "",
          role: "guest" as const,
          notes: "",
        }));
      setGuests(initialGuests);
    }

    async function loadPlan() {
      try {
        const [themes, gamesData, recipeData, foodData, goodiesData, invData] =
          await Promise.all([
            fetchThemes(),
            fetchGames(wizardData.age, wizardData.location, wizardData.themeSlug),
            fetchRecipe(wizardData.themeSlug),
            fetchFoodItems(),
            fetchGoodieBagItems(wizardData.themeSlug),
            fetchInvitationTemplate(wizardData.themeSlug),
          ]);

        const selectedTheme = themes.find(
          (th) => th.slug === wizardData.themeSlug
        );
        setTheme(selectedTheme ?? null);

        const selectedGames = gamesData.slice(0, 5);
        const mainGames = selectedGames.slice(0, 3);
        const reserve = selectedGames.slice(3, 5);
        setGames(mainGames);
        setReserveGames(reserve);
        setAllGames(gamesData);

        const sched = generateSchedule(wizardData, mainGames, "14:00");
        setSchedule(sched);

        setRecipe(recipeData);

        const foodWithQty = calculateFoodQuantities(
          foodData,
          wizardData.guestCount
        );
        setFoodItems(foodWithQty);

        const shopping = generateShoppingList(
          foodWithQty,
          selectedGames,
          goodiesData,
          wizardData.guestCount,
          locale
        );
        setShoppingList(shopping);

        setInvitation(invData);
        setGoodieItems(goodiesData);
      } catch (error) {
        console.error("Failed to load plan:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [router, locale]);

  const handleSwapGame = useCallback((gameIndex: number) => {
    const currentIds = new Set([...games, ...reserveGames].map((g) => g.id));
    const available = allGames.filter((g) => !currentIds.has(g.id));
    if (available.length === 0) return;

    const newGames = [...games];
    newGames[gameIndex] = available[0];
    setGames(newGames);
    if (wizard) setSchedule(generateSchedule(wizard, newGames, startTime));
  }, [games, reserveGames, allGames, wizard, startTime]);

  const handleTimeChange = useCallback((newTime: string) => {
    setStartTime(newTime);
    if (wizard) setSchedule(generateSchedule(wizard, games, newTime));
  }, [wizard, games]);

  const handleShoppingCheck = useCallback((catIdx: number, itemIdx: number) => {
    setShoppingList((prev) => {
      const next = [...prev];
      next[catIdx] = {
        ...next[catIdx],
        items: next[catIdx].items.map((item, i) =>
          i === itemIdx ? { ...item, checked: !item.checked } : item
        ),
      };
      return next;
    });
  }, []);

  const handleUpdateSchedule = useCallback((newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
  }, []);

  const handleUpdateGuests = useCallback((newGuests: GuestEntry[]) => {
    setGuests(newGuests);
  }, []);

  const handleUpdatePlan = useCallback(() => {
    if (!wizard) return;
    // Regenerate shopping list based on current data
    const shopping = generateShoppingList(
      foodItems,
      games,
      goodieItems,
      wizard.guestCount,
      locale
    );
    setShoppingList(shopping);
  }, [wizard, foodItems, games, goodieItems, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎉</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 animate-pulse">
            {locale === "de" ? "Plan wird erstellt..." : "Creating your plan..."}
          </p>
        </div>
      </div>
    );
  }

  if (!wizard || !theme) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{theme.emoji}</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
          {t("title")}
          {wizard.birthdayChildName && (
            <span className="text-party-purple dark:text-party-yellow">
              {" "}{locale === "de" ? "für" : "for"} {wizard.birthdayChildName}
            </span>
          )}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {locale === "de" ? theme.name_de : theme.name_en} -{" "}
          {t("subtitle", { childAge: wizard.age, guestCount: wizard.guestCount })}
        </p>

        {/* Allergen badges */}
        {wizard.allergens && (
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {wizard.allergens.glutenFree && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">🌾 {locale === "de" ? "Glutenfrei" : "Gluten-free"}</span>
            )}
            {wizard.allergens.lactoseFree && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">🥛 {locale === "de" ? "Laktosefrei" : "Lactose-free"}</span>
            )}
            {wizard.allergens.nutFree && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">🥜 {locale === "de" ? "Nussfrei" : "Nut-free"}</span>
            )}
            {wizard.allergens.vegan && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">🌱 Vegan</span>
            )}
            {wizard.allergens.vegetarian && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">🥬 {locale === "de" ? "Vegetarisch" : "Vegetarian"}</span>
            )}
          </div>
        )}
      </div>

      {/* Edit Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            editMode
              ? "bg-party-yellow text-zinc-900 shadow-md"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {editMode ? "✏️" : "👁️"} {editMode ? t("editMode") : t("viewMode")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-6 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl no-print">
        {TABS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === key
                ? "bg-white dark:bg-zinc-700 text-party-purple dark:text-party-yellow shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">
              {t(`tab${key.charAt(0).toUpperCase() + key.slice(1)}` as Parameters<typeof t>[0])}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-zinc-700">
        {activeTab === "schedule" && (
          <ScheduleTab
            schedule={schedule}
            startTime={startTime}
            onTimeChange={handleTimeChange}
            onUpdateSchedule={handleUpdateSchedule}
            editMode={editMode}
            locale={locale}
          />
        )}
        {activeTab === "games" && (
          <GamesTab
            games={games}
            reserveGames={reserveGames}
            onSwapGame={handleSwapGame}
            editMode={editMode}
            locale={locale}
          />
        )}
        {activeTab === "food" && (
          <FoodTab
            recipe={recipe}
            foodItems={foodItems}
            guestCount={wizard.guestCount}
            allergens={wizard.allergens}
            editMode={editMode}
            locale={locale}
          />
        )}
        {activeTab === "shopping" && (
          <ShoppingTab
            shoppingList={shoppingList}
            onCheck={handleShoppingCheck}
            editMode={editMode}
            locale={locale}
          />
        )}
        {activeTab === "invitation" && (
          <InvitationTab
            invitation={invitation}
            theme={theme}
            wizard={wizard}
            guests={guests}
            locale={locale}
          />
        )}
        {activeTab === "goodies" && (
          <GoodiesTab goodieItems={goodieItems} guestCount={wizard.guestCount} editMode={editMode} locale={locale} />
        )}
        {activeTab === "guests" && (
          <GuestListTab
            guests={guests}
            onUpdateGuests={handleUpdateGuests}
            locale={locale}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-6 no-print">
        <button
          onClick={handleUpdatePlan}
          className="flex items-center gap-2 px-6 py-3 bg-party-mint text-zinc-900 rounded-full font-medium hover:bg-party-mint/80 transition-colors shadow-md"
        >
          🔄 {t("updatePlan")}
        </button>
        <button
          onClick={() => router.push("/share")}
          className="flex items-center gap-2 px-6 py-3 bg-party-purple text-white rounded-full font-medium hover:bg-party-purple-dark transition-colors"
        >
          📤 {t("sharePlan")}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-party-purple text-white rounded-full font-medium hover:bg-party-purple-dark transition-colors"
        >
          🖨️ {t("exportPdf")}
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("wizardData");
            router.push("/wizard");
          }}
          className="flex items-center gap-2 px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-full font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          ✨ {t("newPlan")}
        </button>
      </div>
    </div>
  );
}
