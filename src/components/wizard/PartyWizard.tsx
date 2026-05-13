"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Theme, WizardData, LocationType, AllergenPreferences } from "@/types";
import { fetchThemes } from "@/lib/data";

const AGES = Array.from({ length: 10 }, (_, i) => i + 3);
const DURATIONS = [1.5, 2, 2.5, 3, 3.5, 4, 5];
const BUDGETS = ["50", "100", "150", "200", "none"];
const TOTAL_STEPS = 7;
const STEP_ICONS = ["🎂", "👫", "📍", "🎨", "⏱️", "🥗", "💰"];

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
      {/* Step indicator with icons */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEP_ICONS.map((icon, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <button
                key={i}
                onClick={() => { if (isDone) setStep(stepNum); }}
                disabled={!isDone}
                className={`relative flex flex-col items-center gap-1 transition-all ${
                  isDone ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label={`${t("step")} ${stepNum}`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg transition-all ${
                    isActive
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-110"
                      : isDone
                        ? "bg-party-mint/20 text-party-mint"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {isDone ? <span className="text-sm font-bold">✓</span> : icon}
                </div>
                {/* Connector line */}
                {i < STEP_ICONS.length - 1 && (
                  <div
                    className={`absolute top-[18px] sm:top-[20px] left-[calc(50%+18px)] sm:left-[calc(50%+20px)] h-0.5 transition-colors ${
                      isDone ? "bg-party-mint/40" : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                    style={{ width: "calc(100% - 20px)" }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-party-purple dark:text-party-yellow">
            {t("step")} {step}/{TOTAL_STEPS}
          </span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 mt-1.5">
          <div
            className="bg-gradient-to-r from-party-purple to-party-pink h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-zinc-100 dark:border-zinc-700 min-h-[320px] flex flex-col">
        {/* Step 1: Age + Birthday Child Name */}
        {step === 1 && (
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step1Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step1Desc")}</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
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

            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
              {t("step1Title")}
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => updateWizard({ age })}
                  className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-95 ${
                    wizard.age === age
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
            <p className="text-center mt-3 text-sm text-zinc-500">{wizard.age} {t("years")}</p>
          </div>
        )}

        {/* Step 2: Guest Count */}
        {step === 2 && (
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step2Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step2Desc")}</p>
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
              <div className="space-y-2 pr-1">
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
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step3Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step3Desc")}</p>
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
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step4Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step4Desc")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
              {[...themes].sort((a, b) => {
                // "Ohne Motto" (no-theme) always first
                if (a.slug === "no-theme") return -1;
                if (b.slug === "no-theme") return 1;
                const nameA = locale === "de" ? a.name_de : a.name_en;
                const nameB = locale === "de" ? b.name_de : b.name_en;
                return nameA.localeCompare(nameB);
              }).map((theme) => (
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
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step5Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step5Desc")}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  onClick={() => updateWizard({ duration: dur })}
                  className={`py-4 rounded-xl text-center transition-all ${
                    wizard.duration === dur
                      ? "bg-party-purple text-white shadow-lg shadow-party-purple/25 scale-105"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
                  }`}
                >
                  <div className="text-lg font-bold">{dur}</div>
                  <div className="text-xs">{t("hours")}</div>
                </button>
              ))}
            </div>
            {/* Custom duration input */}
            <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {locale === "de" ? "Eigene Dauer (in Stunden)" : "Custom duration (in hours)"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={8}
                  step={0.5}
                  value={wizard.duration}
                  onChange={(e) => {
                    const val = Math.min(8, Math.max(1, Number(e.target.value)));
                    updateWizard({ duration: val });
                  }}
                  className="w-24 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm font-bold text-center focus:ring-2 focus:ring-party-purple focus:border-transparent"
                />
                <span className="text-sm text-zinc-500">{t("hours")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Allergies & Preferences */}
        {step === 6 && (
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step6Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step6Desc")}</p>

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
          <div className="flex-1 wizard-step-enter">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{t("step7Title")}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">{t("step7Desc")}</p>
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
        <div className="flex justify-between mt-6 sm:mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-700">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {tc("back")}
          </button>
          {step < TOTAL_STEPS ? (
            <button
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold bg-party-purple text-white hover:bg-party-purple-dark shadow-md shadow-party-purple/20 transition-all active:scale-95"
            >
              {tc("next")} →
            </button>
          ) : (
            <button
              onClick={generatePlan}
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-party-yellow to-amber-400 text-zinc-900 shadow-lg shadow-amber-300/30 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("generating") : <><span>🎉</span> {t("generatePlan")}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
