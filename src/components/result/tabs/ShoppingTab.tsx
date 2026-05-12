"use client";

import { useState } from "react";
import type { ShoppingCategory } from "@/types";

interface ShoppingTabProps {
  shoppingList: ShoppingCategory[];
  onCheck: (catIdx: number, itemIdx: number) => void;
  editMode: boolean;
  locale: "de" | "en";
}

export function ShoppingTab({ shoppingList, onCheck, editMode, locale }: ShoppingTabProps) {
  const [showAddItem, setShowAddItem] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");

  const checkedCount = shoppingList.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.checked).length,
    0
  );
  const totalCount = shoppingList.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
          <div className="flex-1">
            <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
              <div
                className="bg-party-mint h-2 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 shrink-0">
            {checkedCount}/{totalCount}
          </span>
        </div>
      )}

      {shoppingList.map((cat, catIdx) => (
        <div key={catIdx}>
          <h3 className="text-lg font-bold mb-3 text-zinc-900 dark:text-white">
            {locale === "de" ? cat.category_de : cat.category_en}
          </h3>
          <div className="space-y-2">
            {cat.items.map((item, itemIdx) => (
              <label
                key={itemIdx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  item.checked
                    ? "bg-party-mint/10 line-through text-zinc-400"
                    : "bg-zinc-50 dark:bg-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onCheck(catIdx, itemIdx)}
                  className="w-5 h-5 rounded accent-party-purple shrink-0"
                />
                <span className="flex-1 text-sm">
                  {locale === "de" ? item.name_de : item.name_en}
                </span>
                <span className="text-sm font-medium text-party-purple dark:text-party-yellow shrink-0">
                  {item.quantity}
                </span>
              </label>
            ))}
          </div>

          {/* Add custom item in edit mode */}
          {editMode && (
            <>
              {showAddItem === catIdx ? (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={locale === "de" ? "Artikel" : "Item"}
                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                  />
                  <input
                    type="text"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    placeholder={locale === "de" ? "Menge" : "Qty"}
                    className="w-24 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                  />
                  <button
                    onClick={() => {
                      setShowAddItem(null);
                      setNewItemName("");
                      setNewItemQty("");
                    }}
                    className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddItem(catIdx)}
                  className="mt-2 w-full py-2 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-xs text-zinc-500 hover:border-party-purple hover:text-party-purple transition-colors"
                >
                  + {locale === "de" ? "Artikel hinzufügen" : "Add item"}
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
