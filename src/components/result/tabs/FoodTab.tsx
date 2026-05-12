"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Recipe, FoodItemWithQuantity, RecipeIngredient, AllergenPreferences, CustomRecipe } from "@/types";

interface FoodTabProps {
  recipe: Recipe | null;
  foodItems: FoodItemWithQuantity[];
  guestCount: number;
  allergens: AllergenPreferences;
  editMode: boolean;
  locale: "de" | "en";
}

export function FoodTab({ recipe, foodItems, guestCount, allergens, editMode, locale }: FoodTabProps) {
  const t = useTranslations("result");
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Omit<CustomRecipe, "id">>({
    name: "",
    description: "",
    instructions: "",
    prepTimeMinutes: 30,
    servings: guestCount,
    ingredients: [{ item: "", amount: "" }],
    isGlutenFree: false,
    isLactoseFree: false,
    isNutFree: false,
  });

  const savory = foodItems.filter((i) => i.category === "savory");
  const snacks = foodItems.filter((i) => i.category === "snack");
  const drinks = foodItems.filter((i) => i.category === "drink");

  const hasAllergenConflict = recipe && (
    (allergens.glutenFree && !recipe.is_gluten_free) ||
    (allergens.lactoseFree && !recipe.is_lactose_free) ||
    (allergens.nutFree && !recipe.is_nut_free)
  );

  function addIngredient() {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: "", amount: "" }],
    }));
  }

  function updateIngredient(index: number, field: keyof RecipeIngredient, value: string) {
    setNewRecipe((prev) => {
      const ingredients = [...prev.ingredients];
      ingredients[index] = { ...ingredients[index], [field]: value };
      return { ...prev, ingredients };
    });
  }

  function removeIngredient(index: number) {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }

  function saveCustomRecipe() {
    if (!newRecipe.name.trim()) return;
    setCustomRecipes((prev) => [
      ...prev,
      { ...newRecipe, id: crypto.randomUUID() },
    ]);
    setNewRecipe({
      name: "",
      description: "",
      instructions: "",
      prepTimeMinutes: 30,
      servings: guestCount,
      ingredients: [{ item: "", amount: "" }],
      isGlutenFree: false,
      isLactoseFree: false,
      isNutFree: false,
    });
    setShowAddRecipe(false);
  }

  function removeCustomRecipe(id: string) {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Allergen Warning */}
      {hasAllergenConflict && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                {t("allergenInfo")}
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {locale === "de"
                  ? "Das vorgeschlagene Rezept passt nicht zu allen angegebenen Allergien. Bitte prüfe die Zutaten oder füge ein eigenes Rezept hinzu."
                  : "The suggested recipe may not match all specified allergies. Please check the ingredients or add a custom recipe."}
              </p>
              <div className="flex gap-2 mt-2">
                {allergens.glutenFree && !recipe?.is_gluten_free && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">🌾 {locale === "de" ? "Enthält Gluten" : "Contains gluten"}</span>
                )}
                {allergens.lactoseFree && !recipe?.is_lactose_free && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">🥛 {locale === "de" ? "Enthält Laktose" : "Contains lactose"}</span>
                )}
                {allergens.nutFree && !recipe?.is_nut_free && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">🥜 {locale === "de" ? "Enthält Nüsse" : "Contains nuts"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe */}
      {recipe && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            🎂 {t("recipe")}: {locale === "de" ? recipe.name_de : recipe.name_en}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {locale === "de" ? recipe.description_de : recipe.description_en}
          </p>
          <div className="flex gap-3 mb-4 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              ⏱️ {recipe.prep_time_minutes} min {t("prepTime")}
            </span>
            {recipe.is_gluten_free && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">🌾 {locale === "de" ? "Glutenfrei" : "Gluten-free"}</span>
            )}
            {recipe.is_lactose_free && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">🥛 {locale === "de" ? "Laktosefrei" : "Lactose-free"}</span>
            )}
            {recipe.is_nut_free && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">🥜 {locale === "de" ? "Nussfrei" : "Nut-free"}</span>
            )}
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">{t("ingredients")}</h4>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
              {(locale === "de" ? recipe.ingredients_de : recipe.ingredients_en).map(
                (ing: RecipeIngredient, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-party-purple shrink-0" />
                    <span>{ing.amount} {ing.item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-sm mb-2">📋 {t("instructions")}</h4>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
              {locale === "de" ? recipe.instructions_de : recipe.instructions_en}
            </div>
          </div>
        </div>
      )}

      {/* Custom Recipes */}
      {customRecipes.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            📝 {t("customRecipe")}
          </h3>
          {customRecipes.map((cr) => (
            <div key={cr.id} className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-zinc-900 dark:text-white">{cr.name}</h4>
                {editMode && (
                  <button
                    onClick={() => removeCustomRecipe(cr.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
              {cr.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{cr.description}</p>
              )}
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300">⏱️ {cr.prepTimeMinutes} min</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300">{cr.servings} {locale === "de" ? "Portionen" : "servings"}</span>
              </div>
              {cr.ingredients.filter((ing) => ing.item).length > 0 && (
                <div className="mb-2">
                  <h5 className="text-xs font-semibold mb-1">{t("ingredients")}</h5>
                  <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-0.5">
                    {cr.ingredients.filter((ing) => ing.item).map((ing, i) => (
                      <li key={i}>- {ing.amount} {ing.item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cr.instructions && (
                <div>
                  <h5 className="text-xs font-semibold mb-1">{t("instructions")}</h5>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{cr.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Recipe Form */}
      {editMode && (
        <>
          {showAddRecipe ? (
            <div className="p-4 border-2 border-dashed border-party-purple/30 rounded-xl space-y-3">
              <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("addRecipe")}</h4>
              <input
                type="text"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe((p) => ({ ...p, name: e.target.value }))}
                placeholder={locale === "de" ? "Rezeptname" : "Recipe name"}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
              />
              <textarea
                value={newRecipe.description}
                onChange={(e) => setNewRecipe((p) => ({ ...p, description: e.target.value }))}
                placeholder={locale === "de" ? "Kurzbeschreibung" : "Short description"}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm resize-none"
              />
              <div className="flex gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">{t("prepTime")}</label>
                  <input
                    type="number"
                    value={newRecipe.prepTimeMinutes}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, prepTimeMinutes: Number(e.target.value) }))}
                    min={5}
                    className="w-20 px-2 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">{locale === "de" ? "Portionen" : "Servings"}</label>
                  <input
                    type="number"
                    value={newRecipe.servings}
                    onChange={(e) => setNewRecipe((p) => ({ ...p, servings: Number(e.target.value) }))}
                    min={1}
                    className="w-20 px-2 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2">{t("ingredients")}</label>
                {newRecipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ing.amount}
                      onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                      placeholder={locale === "de" ? "Menge" : "Amount"}
                      className="w-24 px-2 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                    <input
                      type="text"
                      value={ing.item}
                      onChange={(e) => updateIngredient(i, "item", e.target.value)}
                      placeholder={locale === "de" ? "Zutat" : "Ingredient"}
                      className="flex-1 px-2 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                    {newRecipe.ingredients.length > 1 && (
                      <button
                        onClick={() => removeIngredient(i)}
                        className="text-zinc-400 hover:text-red-500 px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addIngredient}
                  className="text-xs text-party-purple hover:text-party-purple-dark transition-colors"
                >
                  + {locale === "de" ? "Zutat hinzufügen" : "Add ingredient"}
                </button>
              </div>

              <textarea
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe((p) => ({ ...p, instructions: e.target.value }))}
                placeholder={locale === "de" ? "Zubereitung (Schritt für Schritt)" : "Instructions (step by step)"}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={saveCustomRecipe}
                  className="px-4 py-2 bg-party-purple text-white rounded-lg text-sm font-medium hover:bg-party-purple-dark transition-colors"
                >
                  ✓ {locale === "de" ? "Rezept speichern" : "Save recipe"}
                </button>
                <button
                  onClick={() => setShowAddRecipe(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors"
                >
                  {locale === "de" ? "Abbrechen" : "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddRecipe(true)}
              className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl text-sm text-zinc-500 hover:border-party-purple hover:text-party-purple transition-colors"
            >
              + {t("addRecipe")}
            </button>
          )}
        </>
      )}

      {/* Food Suggestions */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
          🍕 {t("foodSuggestions")}
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          {t("totalForGuests", { count: guestCount })} (+10% {locale === "de" ? "Puffer" : "buffer"})
        </p>

        {[
          { items: savory, icon: "🍖", label: locale === "de" ? "Herzhaft" : "Savory" },
          { items: snacks, icon: "🍿", label: "Snacks" },
          { items: drinks, icon: "🥤", label: locale === "de" ? "Getränke" : "Drinks" },
        ].map(({ items, icon, label }) => (
          <div key={label} className="mb-4">
            <h4 className="font-semibold text-sm mb-2">
              {icon} {label}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg"
                >
                  <span className="text-sm">
                    {locale === "de" ? item.name_de : item.name_en}
                  </span>
                  <span className="text-sm font-semibold text-party-purple dark:text-party-yellow">
                    {item.totalQuantity} {locale === "de" ? item.unit_de : item.unit_en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
