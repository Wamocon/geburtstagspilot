"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { SavedPlan } from "@/types";

interface PlanCardProps {
  plan: SavedPlan;
  onDelete: (id: string) => void;
}

export function PlanCard({ plan, onDelete }: PlanCardProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale() as "de" | "en";
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const wizard = plan.wizard_data;
  const createdAt = new Date(plan.created_at).toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.from("saved_plans").delete().eq("id", plan.id);
      if (!error) {
        onDelete(plan.id);
      }
    } catch {
      // Supabase unreachable
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  function handleLoad() {
    sessionStorage.setItem("wizardData", JSON.stringify(plan.wizard_data));
    router.push("/result");
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 hover:border-party-purple/30 dark:hover:border-party-yellow/30 transition-all card-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 dark:text-white truncate text-base">
            {plan.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {createdAt}
          </p>
        </div>
        {plan.is_shared && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-party-mint/10 text-party-mint font-semibold">
            {t("shared")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-xl p-2.5">
          <p className="text-lg font-bold text-party-purple dark:text-party-yellow">{wizard.age}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("age")}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-xl p-2.5">
          <p className="text-lg font-bold text-party-purple dark:text-party-yellow">{wizard.guestCount}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("guests")}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-xl p-2.5">
          <p className="text-lg font-bold text-party-purple dark:text-party-yellow">{wizard.duration}h</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("duration")}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleLoad}
          className="flex-1 bg-party-purple hover:bg-party-purple-dark text-white py-2 rounded-xl text-sm font-bold transition-all"
        >
          📋 {t("loadPlan")}
        </button>
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {deleting ? "..." : "✓"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-xl text-sm font-bold transition-all"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-xl text-sm transition-all"
            title={t("deletePlan")}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
