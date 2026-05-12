"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Theme, WizardData, LocationType, AllergenPreferences } from "@/types";
import { fetchThemes } from "@/lib/data";

const AGES = Array.from({ length: 10 }, (_, i) => i + 3);
const DURATIONS = [2, 2.5, 3, 3.5];
const BUDGETS = ["50", "100", "150", "200", "none"];
const TOTAL_STEPS = 7;

const DEFAULT_ALLERGENS: AllergenPreferences = {
  glutenFree: false,
  lactoseFree: false,
  nutFree: false,
  vegan: false,
  vegetarian: false,
  customNotes: "",
};

export function PartyWizard() {
  const t = useTranslations("wizard");
  const tc = useTranslations("common");
  const locale = useLocale() as "de" | "en";
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  const [wizard, setWizard] = useState<WizardData>({
    age: 6,
    guestCount: 8,
    location: "both",
    themeSlug: "no-theme",
    duration: 3,
    budget: "none",
    birthdayChildName: "",
    allergens: { ...DEFAULT_ALLERGENS },
    guestNames: [],
  });

  useEffect(() => {
    fetchThemes().then(setThemes).catch(console.error);
  }, []);

  const updateWizard = useCallback(
    (updates: Partial<WizardData>) => {
      setWizard((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateAllergen = useCallback(
    (key: keyof AllergenPreferences, value: boolean | string) => {
      setWizard((prev) => ({
        ...prev,
        allergens: { ...prev.allergens, [key]: value },
      }));
    },
    []
  );

  function nextStep() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  function addGuestName() {
    setWizard((prev) => ({
      ...prev,
      guestNames: [...prev.guestNames, ""],
    }));
  }

  function updateGuestName(index: number, name: string) {
    setWizard((prev) => {
      const names = [...prev.guestNames];
      names[index] = name;
      return { ...prev, guestNames: names };
    });
  }

  function removeGuestName(index: number) {
    setWizard((prev) => ({
      ...prev,
      guestNames: prev.guestNames.filter((_, i) => i !== index),
    }));
  }

  async function generatePlan() {
    setLoading(true);
    sessionStorage.setItem("wizardData", JSON.stringify(wizard));
    router.push("/result");
  }

  const locations: { value: LocationType; label: string; icon: string }[] = [
    { value: "indoor", label: t("indoor"), icon: "🏠" },
    { value: "outdoor", label: t("outdoor"), icon: "🌳" },
    { value: "both", label: t("both"), icon: "🏠🌳" },
  ];

  const allergenOptions: { key: keyof Omit<AllergenPreferences, "customNotes">; icon: string }[] = [
    { key: "glutenFree", icon: "🌾" },
    { key: "lactoseFree", icon: "🥛" },
    { key: "nutFree", icon: "🥜" },
    { key: "vegetarian", icon: "🥬" },
    { key: "vegan", icon: "🌱" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          <span>
            {t("step")} {step} {t("of")} {TOTAL_STEPS}
          </span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className="bg-party-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 md:p-8 shadow-lg border border-zinc-100 dark:border-zinc-700 min-h-[320px] flex flex-col">
        {/* Step 1: Age + Birthday Child Name */}
        {step === 1 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step1Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">{t("step1Desc")}</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {t("birthdayChildName")}
              </label>
              <input
                type="text"
                value={wizard.birthdayChildName}
                onChange={(e) => updateWizard({ birthdayChildName: e.target.value })}
                placeholder={t("birthdayChildNamePlaceholder")}
                className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => updateWizard({ age })}
                  className={`py-3 rounded-xl text-lg font-bold transition-all ${
                    wizard.age === age
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
            <p className="text-center mt-4 text-sm text-zinc-500">{wizard.age} {t("years")}</p>
          </div>
        )}

        {/* Step 2: Guest Count */}
        {step === 2 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step2Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step2Desc")}</p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="range"
                min={3}
                max={20}
                value={wizard.guestCount}
                onChange={(e) => updateWizard({ guestCount: Number(e.target.value) })}
                className="w-full accent-party-purple"
              />
              <span className="text-4xl font-bold text-party-purple">
                {wizard.guestCount} <span className="text-lg text-zinc-500">{t("guests")}</span>
              </span>
            </div>

            {/* Guest Names (optional) */}
            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t("guestNames")}
                  {wizard.guestNames.filter((n) => n.trim()).length > 0 && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-party-purple/10 text-party-purple">
                      {wizard.guestNames.filter((n) => n.trim()).length}
                    </span>
                  )}
                </label>
                <button
                  onClick={addGuestName}
                  className="text-xs px-3 py-1.5 rounded-lg bg-party-purple/10 text-party-purple hover:bg-party-purple/20 transition-colors font-medium"
                >
                  + {t("addGuest")}
                </button>
              </div>
              <p className="text-xs text-zinc-400 mb-3">{t("guestNamesDesc")}</p>

              {/* Name chips for filled entries */}
              {wizard.guestNames.filter((n) => n.trim()).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {wizard.guestNames.map((name, i) =>
                    name.trim() ? (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-party-purple/10 text-party-purple text-xs font-medium"
                      >
                        {name}
                        <button
                          onClick={() => removeGuestName(i)}
                          className="ml-0.5 hover:text-party-coral transition-colors"
                        >
                          ✕
                        </button>
                      </span>
                    ) : null
                  )}
                </div>
              )}

              {/* Input fields */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {wizard.guestNames.map((name, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs text-zinc-400 w-5 text-right shrink-0">{i + 1}.</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateGuestName(i, e.target.value)}
                      placeholder={`${locale === "de" ? "Kind" : "Child"} ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple/30 focus:border-party-purple transition-all"
                    />
                    <button
                      onClick={() => removeGuestName(i)}
                      className="px-2 text-zinc-400 hover:text-party-coral transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step3Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step3Desc")}</p>
            <div className="grid grid-cols-3 gap-4">
              {locations.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => updateWizard({ location: value })}
                  className={`py-6 rounded-xl text-center transition-all ${
                    wizard.location === value
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-semibold">{label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Theme */}
        {step === 4 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step4Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step4Desc")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
              {themes.map((theme) => (
                <button
                  key={theme.slug}
                  onClick={() => updateWizard({ themeSlug: theme.slug })}
                  className={`p-4 rounded-xl text-center transition-all ${
                    wizard.themeSlug === theme.slug
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.emoji}</div>
                  <div className="text-sm font-semibold">
                    {locale === "de" ? theme.name_de : theme.name_en}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Duration */}
        {step === 5 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step5Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step5Desc")}</p>
            <div className="grid grid-cols-2 gap-4">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  onClick={() => updateWizard({ duration: dur })}
                  className={`py-6 rounded-xl text-center transition-all ${
                    wizard.duration === dur
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  <div className="text-2xl font-bold">{dur}</div>
                  <div className="text-sm">{t("hours")}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Allergies & Preferences */}
        {step === 6 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step6Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step6Desc")}</p>

            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              {t("allergens")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {allergenOptions.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => updateAllergen(key, !wizard.allergens[key])}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                    wizard.allergens[key]
                      ? "bg-party-mint/20 border-2 border-party-mint text-emerald-800 dark:text-emerald-300"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-2 border-transparent hover:bg-party-purple/10"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{t(key)}</span>
                  {wizard.allergens[key] && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              {t("preferences")}
            </h3>
            <textarea
              value={wizard.allergens.customNotes}
              onChange={(e) => updateAllergen("customNotes", e.target.value)}
              placeholder={t("preferencesPlaceholder")}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm resize-none focus:ring-2 focus:ring-party-purple focus:border-transparent"
            />
          </div>
        )}

        {/* Step 7: Budget */}
        {step === 7 && (
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{t("step7Title")}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">{t("step7Desc")}</p>
            <div className="grid grid-cols-1 gap-3">
              {BUDGETS.map((budget) => (
                <button
                  key={budget}
                  onClick={() => updateWizard({ budget })}
                  className={`py-4 px-6 rounded-xl text-left transition-all flex items-center gap-3 ${
                    wizard.budget === budget
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  <span className="text-xl">
                    {budget === "none" ? "🤷" : "💰"}
                  </span>
                  <span className="font-semibold">
                    {budget === "none" ? t("noBudget") : `${budget} EUR`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-700">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {tc("back")}
          </button>
          {step < TOTAL_STEPS ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-party-purple text-white hover:bg-party-purple-dark transition-colors"
            >
              {tc("next")} →
            </button>
          ) : (
            <button
              onClick={generatePlan}
              disabled={loading}
              className="px-8 py-3 rounded-full text-sm font-bold bg-party-yellow text-zinc-900 hover:bg-party-yellow/80 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? t("generating") : `🎉 ${t("generatePlan")}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
