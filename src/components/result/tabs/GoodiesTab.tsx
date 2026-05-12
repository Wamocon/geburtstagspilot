"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GoodieBagItem, BudgetTier } from "@/types";

interface GoodiesTabProps {
  goodieItems: GoodieBagItem[];
  guestCount: number;
  editMode: boolean;
  locale: "de" | "en";
}

export function GoodiesTab({ goodieItems, guestCount, editMode, locale }: GoodiesTabProps) {
  const t = useTranslations("result");
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>("medium");

  const budgets: BudgetTier[] = ["low", "medium", "high"];
  const filteredItems = goodieItems.filter((item) => item.budget === selectedBudget);

  const totalPerChild = filteredItems.reduce(
    (sum, item) => sum + item.price_estimate * item.quantity_per_child,
    0
  );

  return (
    <div>
      {/* Edit mode indicator */}
      {editMode && (
        <div className="mb-4 text-xs px-3 py-1.5 rounded-lg bg-party-yellow/10 text-party-yellow border border-party-yellow/20 inline-block">
          ✏️ {locale === "de" ? "Bearbeitungsmodus" : "Edit mode"}
        </div>
      )}

      {/* Budget Selector */}
      <div className="flex gap-2 mb-6">
        {budgets.map((budget) => (
          <button
            key={budget}
            onClick={() => setSelectedBudget(budget)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              selectedBudget === budget
                ? "bg-party-purple text-white shadow-lg"
                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-party-purple/10"
            }`}
          >
            {t(`goodieBudget.${budget}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-zinc-400 text-sm">
            {locale === "de"
              ? "Keine Mitgebsel in dieser Kategorie verfügbar"
              : "No goodie bag items available in this category"}
          </div>
        )}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl"
          >
            <div>
              <span className="text-sm font-medium">
                {locale === "de" ? item.name_de : item.name_en}
              </span>
              {item.theme_slug && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-party-purple/10 text-party-purple">
                  {item.theme_slug}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-party-purple dark:text-party-yellow">
                {item.quantity_per_child * guestCount}x
              </div>
              <div className="text-xs text-zinc-500">
                ~{(item.price_estimate * item.quantity_per_child).toFixed(2)} EUR/{locale === "de" ? "Kind" : "child"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 p-4 bg-party-purple/5 dark:bg-party-purple/10 rounded-xl border border-party-purple/20">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {locale === "de" ? "Gesamt pro Kind" : "Total per child"}
          </span>
          <span className="text-lg font-bold text-party-purple dark:text-party-yellow">
            ~{totalPerChild.toFixed(2)} EUR
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-zinc-500">
            {locale === "de" ? `Gesamt für ${guestCount} Gäste` : `Total for ${guestCount} guests`}
          </span>
          <span className="text-sm font-semibold text-party-purple dark:text-party-yellow">
            ~{(totalPerChild * guestCount).toFixed(2)} EUR
          </span>
        </div>
      </div>
    </div>
  );
}
