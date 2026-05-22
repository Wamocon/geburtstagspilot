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
import { getThemeEmoji, getThemeName } from "@/lib/theme-config";
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
import { useAuth } from "@/components/auth/AuthProvider";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { SavePlanButton } from "@/components/dashboard/SavePlanButton";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { GamesTab } from "./tabs/GamesTab";
import { FoodTab } from "./tabs/FoodTab";
import { ShoppingTab } from "./tabs/ShoppingTab";
import { InvitationTab } from "./tabs/InvitationTab";
import { GoodiesTab } from "./tabs/GoodiesTab";
import { GuestListTab } from "./tabs/GuestListTab";
import { TodoTab } from "./tabs/TodoTab";
import { AiChatPanel } from "@/components/ai/AiChatPanel";

const TABS = [
  { key: "todo", icon: "✅" },
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

  const [activeTab, setActiveTab] = useState<string>("todo");
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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [disabledSections, setDisabledSections] = useState<Set<string>>(new Set());
  const { user, profile } = useAuth();

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

  async function handleSharePlan() {
    if (!wizard || !theme) return;

    // If not logged in, save to sessionStorage and navigate to share preview
    if (!user) {
      router.push("/share");
      return;
    }

    setSharing(true);
    try {
      const supabase = createSupabaseBrowser();
      const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const title = wizard.birthdayChildName
        ? `${wizard.birthdayChildName}${locale === "de" ? "s Party" : "'s Party"}`
        : locale === "de" ? "Partyplan" : "Party Plan";

      const { error } = await supabase.from("saved_plans").insert({
        user_id: user.id,
        title,
        wizard_data: wizard,
        plan_data: { wizard, theme, schedule, games, reserveGames: [], recipe, foodItems, shoppingList, invitation, goodieBagItems: goodieItems },
        is_shared: true,
        share_token: token,
      });

      if (error) {
        // If plan limit reached, show hint
        console.error("Share error:", error);
        router.push("/share");
        return;
      }

      const url = `${window.location.origin}/${locale}/share/${token}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      router.push("/share");
    } finally {
      setSharing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 animate-pulse-soft">
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
        <div className="w-16 h-16 rounded-2xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-3xl mx-auto mb-3">
          {getThemeEmoji(theme.slug, theme.emoji)}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-1">
          {t("title")}
          {wizard.birthdayChildName && (
            <span className="gradient-text">
              {" "}{locale === "de" ? "für" : "for"} {wizard.birthdayChildName}
            </span>
          )}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {getThemeName(theme.slug, locale as "de" | "en", theme.name_de, theme.name_en)} -{" "}
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

      {/* Edit Mode Toggle + Section Toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
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

        {editMode && (
          <div className="flex flex-wrap gap-2">
            {TABS.filter(({ key }) => key !== "schedule").map(({ key, icon }) => {
              const isDisabled = disabledSections.has(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    setDisabledSections((prev) => {
                      const next = new Set(prev);
                      if (next.has(key)) {
                        next.delete(key);
                      } else {
                        next.add(key);
                        if (activeTab === key) setActiveTab("schedule");
                      }
                      return next;
                    });
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all border ${
                    isDisabled
                      ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-500 line-through opacity-60"
                      : "border-party-mint/30 bg-party-mint/10 text-emerald-700 dark:text-emerald-300"
                  }`}
                  title={isDisabled
                    ? (locale === "de" ? "Klicken zum Aktivieren" : "Click to enable")
                    : (locale === "de" ? "Klicken zum Deaktivieren" : "Click to disable")}
                >
                  {icon} {isDisabled ? "✕" : "✓"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 no-print">
        <div className="relative">
          {/* Scroll fade hint right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-100 dark:from-zinc-800 to-transparent rounded-r-xl pointer-events-none z-10 sm:hidden" aria-hidden="true" />
          <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto scrollbar-hide">
            {TABS.filter(({ key }) => !disabledSections.has(key)).map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
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
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-zinc-100 dark:border-zinc-700 animate-fade-in">
        {activeTab === "todo" && (
          <TodoTab
            wizard={wizard}
            games={games}
            shoppingList={shoppingList}
            locale={locale}
          />
        )}
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
            age={wizard.age}
            location={wizard.location}
            themeName={theme ? (locale === "de" ? theme.name_de : theme.name_en) : undefined}
            guestCount={wizard.guestCount}
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

      {/* Desktop Actions */}
      <div className="hidden sm:flex flex-wrap gap-3 justify-center mt-6 no-print">
        <SavePlanButton
          wizardData={wizard}
          planData={{
            wizard,
            theme,
            schedule,
            games,
            reserveGames,
            recipe: recipe!,
            foodItems,
            shoppingList,
            invitation: invitation!,
            goodieBagItems: goodieItems,
          }}
        />
        <button
          onClick={handleUpdatePlan}
          className="flex items-center gap-2 px-6 py-3 bg-party-mint text-zinc-900 rounded-full text-sm font-bold hover:bg-party-mint/80 transition-all active:scale-95 shadow-md"
        >
          🔄 {t("updatePlan")}
        </button>
        <button
          onClick={handleSharePlan}
          disabled={sharing}
          className="flex items-center gap-2 px-6 py-3 bg-party-purple text-white rounded-full text-sm font-bold hover:bg-party-purple-dark transition-all active:scale-95 shadow-md shadow-party-purple/20 disabled:opacity-50"
        >
          {sharing ? "..." : linkCopied ? "✓" : "📤"} {linkCopied ? t("linkCopied") : t("sharePlan")}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all active:scale-95"
        >
          🖨 {t("exportPdf")}
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("wizardData");
            router.push("/wizard");
          }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-zinc-200 dark:border-zinc-600 rounded-full text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:border-party-purple dark:hover:border-party-yellow hover:text-party-purple dark:hover:text-party-yellow transition-all active:scale-95"
        >
          ✨ {t("newPlan")}
        </button>
      </div>

      {/* Mobile Save Plan */}
      <div className="sm:hidden flex justify-center mt-6 no-print">
        <SavePlanButton
          wizardData={wizard}
          planData={{
            wizard,
            theme,
            schedule,
            games,
            reserveGames,
            recipe: recipe!,
            foodItems,
            shoppingList,
            invitation: invitation!,
            goodieBagItems: goodieItems,
          }}
        />
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden no-print">
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-3 py-2.5 safe-area-bottom">
          <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
            <button
              onClick={handleUpdatePlan}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-party-mint active:bg-party-mint/10 transition-colors"
            >
              <span className="text-lg">🔄</span>
              <span className="text-[10px] font-semibold">{t("updatePlan")}</span>
            </button>
            <button
              onClick={handleSharePlan}
              disabled={sharing}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-party-purple dark:text-party-yellow active:bg-party-purple/10 transition-colors disabled:opacity-50"
            >
              <span className="text-lg">{linkCopied ? "✓" : "📤"}</span>
              <span className="text-[10px] font-semibold">{linkCopied ? t("linkCopied") : t("sharePlan")}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors"
            >
              <span className="text-lg">🖨</span>
              <span className="text-[10px] font-semibold">{t("exportPdf")}</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("wizardData");
                router.push("/wizard");
              }}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-zinc-600 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-zinc-800 transition-colors"
            >
              <span className="text-lg">✨</span>
              <span className="text-[10px] font-semibold">{t("newPlan")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share URL display */}
      {shareUrl && (
        <div className="mt-4 p-4 bg-party-mint/10 dark:bg-party-mint/5 border border-party-mint/30 rounded-xl text-center no-print">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            🔗 {locale === "de" ? "Dein Teilen-Link:" : "Your share link:"}
          </p>
          <div className="flex gap-2 items-center justify-center">
            <code className="text-xs bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 break-all max-w-md">
              {shareUrl}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
              }}
              className="px-3 py-2 bg-party-purple text-white rounded-lg text-xs font-medium hover:bg-party-purple-dark transition-colors shrink-0"
            >
              {linkCopied ? "✓" : "📋"}
            </button>
          </div>
        </div>
      )}

      {/* Pro gated features hint for free users */}
      {user && profile?.tier === "free" && (
        <div className="mt-6 bg-gradient-to-r from-party-purple/5 to-party-yellow/5 dark:from-party-purple/10 dark:to-party-yellow/10 rounded-2xl p-5 border border-party-purple/20 no-print">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            ⭐ {locale === "de" ? "Pro-Funktionen freischalten" : "Unlock Pro Features"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { icon: "💬", label: locale === "de" ? "KI-Party-Coach" : "AI Party Coach" },
              { icon: "🎲", label: locale === "de" ? "KI-Spiele generieren" : "AI Game Generation" },
              { icon: "✉️", label: locale === "de" ? "KI-Einladungstexte" : "AI Invitation Texts" },
              { icon: "👨‍👩‍👧", label: locale === "de" ? "Eltern-Kollaboration" : "Parent Collaboration" },
              { icon: "📬", label: locale === "de" ? "RSVP-Tracking" : "RSVP Tracking" },
              { icon: "📋", label: locale === "de" ? "Unbegrenzte Pläne" : "Unlimited Plans" },
            ].map((feat) => (
              <div
                key={feat.label}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-zinc-800/50 opacity-60"
              >
                <span className="text-lg grayscale">{feat.icon}</span>
                <span className="text-xs text-zinc-500 line-through">{feat.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/upgrade")}
            className="mt-3 text-xs font-bold text-party-purple hover:underline"
          >
            {locale === "de" ? "Jetzt auf Pro upgraden →" : "Upgrade to Pro now →"}
          </button>
        </div>
      )}

      {/* AI Chat Panel */}
      <AiChatPanel
        wizard={wizard}
        theme={theme}
        schedule={schedule}
        games={games}
      />
    </div>
  );
}
