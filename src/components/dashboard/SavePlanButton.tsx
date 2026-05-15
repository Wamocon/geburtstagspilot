"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link, usePathname } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { WizardData, PartyPlan } from "@/types";
import { TIER_LIMITS } from "@/types";

interface SavePlanButtonProps {
  wizardData: WizardData;
  planData: PartyPlan;
  onSaved?: (planId: string) => void;
}

export function SavePlanButton({ wizardData, planData, onSaved }: SavePlanButtonProps) {
  const t = useTranslations("dashboard");
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [planName, setPlanName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const pathname = usePathname();

  if (!user) {
    return (
      <Link
        href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
        className="inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-party-purple/25 transition-all"
      >
        🔐 {t("loginToSave")}
      </Link>
    );
  }

  const limits = TIER_LIMITS[profile?.tier || "free"];
  const atLimit = (profile?.plan_count || 0) >= limits.maxPlans;

  if (atLimit && profile?.tier === "free") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-amber-600 dark:text-amber-400">
          ⚠️ {t("planLimitReached")}
        </p>
        <button
          disabled
          className="inline-flex items-center gap-2 bg-zinc-300 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
        >
          💾 {t("savePlan")}
        </button>
        <p className="text-xs text-zinc-500">
          {t("upgradeToPro")}
        </p>
      </div>
    );
  }

  async function handleSave() {
    if (!showNameInput) {
      const defaultName = wizardData.birthdayChildName
        ? `${wizardData.birthdayChildName} - ${wizardData.age} ${t("years")}`
        : `Party - ${wizardData.age} ${t("years")}`;
      setPlanName(defaultName);
      setShowNameInput(true);
      return;
    }

    if (!planName.trim()) {
      setError(t("nameRequired"));
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createSupabaseBrowser();
      const { data, error: saveError } = await supabase
        .from("saved_plans")
        .insert({
          user_id: user!.id,
          title: planName.trim(),
          wizard_data: wizardData,
          plan_data: planData,
        })
        .select("id")
        .single();

      if (saveError) {
        setError(t("saveError"));
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      setShowNameInput(false);
      await refreshProfile();

      if (data && onSaved) {
        onSaved(data.id);
      }
    } catch {
      setError(t("saveError"));
      setSaving(false);
    }

    setTimeout(() => setSuccess(false), 3000);
  }

  if (success) {
    return (
      <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
        ✅ {t("planSaved")}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {showNameInput && (
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder={t("planNamePlaceholder")}
          className="w-full max-w-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-party-purple/25 transition-all disabled:opacity-50"
      >
        {saving ? "..." : "💾"} {showNameInput ? t("confirmSave") : t("savePlan")}
      </button>
    </div>
  );
}
