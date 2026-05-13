"use client";

import { useState } from "react";
import type { WizardData, Game, ShoppingCategory } from "@/types";

interface TodoItem {
  id: string;
  text: string;
  category: "preparation" | "shopping" | "day-of" | "after";
  priority: "high" | "medium" | "low";
  done: boolean;
  daysBeforeParty?: number;
}

interface TodoTabProps {
  wizard: WizardData;
  games: Game[];
  shoppingList: ShoppingCategory[];
  locale: "de" | "en";
}

function generateTodos(wizard: WizardData, games: Game[], shoppingList: ShoppingCategory[], locale: "de" | "en"): TodoItem[] {
  const todos: TodoItem[] = [];
  const de = locale === "de";

  // Preparation - 2+ weeks before
  todos.push({
    id: "prep-1",
    text: de ? "Datum und Uhrzeit festlegen" : "Set date and time",
    category: "preparation",
    priority: "high",
    done: false,
    daysBeforeParty: 14,
  });
  todos.push({
    id: "prep-2",
    text: de ? `Einladungen verschicken (${wizard.guestCount} Gäste)` : `Send invitations (${wizard.guestCount} guests)`,
    category: "preparation",
    priority: "high",
    done: false,
    daysBeforeParty: 14,
  });
  todos.push({
    id: "prep-3",
    text: de ? "Rückmeldungen der Gäste sammeln" : "Collect guest RSVPs",
    category: "preparation",
    priority: "high",
    done: false,
    daysBeforeParty: 7,
  });
  todos.push({
    id: "prep-4",
    text: de ? "Kuchen / Torte planen und Zutaten besorgen" : "Plan cake and get ingredients",
    category: "preparation",
    priority: "high",
    done: false,
    daysBeforeParty: 3,
  });

  // Shopping items
  if (shoppingList.length > 0) {
    todos.push({
      id: "shop-1",
      text: de ? "Einkaufsliste durchgehen und einkaufen" : "Go through shopping list and buy items",
      category: "shopping",
      priority: "high",
      done: false,
      daysBeforeParty: 3,
    });
  }

  todos.push({
    id: "shop-2",
    text: de ? "Dekoration besorgen" : "Get decorations",
    category: "shopping",
    priority: "medium",
    done: false,
    daysBeforeParty: 3,
  });

  todos.push({
    id: "shop-3",
    text: de ? `Mitgebsel vorbereiten (${wizard.guestCount} Tüten)` : `Prepare goodie bags (${wizard.guestCount} bags)`,
    category: "shopping",
    priority: "medium",
    done: false,
    daysBeforeParty: 2,
  });

  // Game materials
  if (games.length > 0) {
    const materials = games.flatMap((g) => locale === "de" ? g.materials_de : g.materials_en);
    if (materials.length > 0) {
      todos.push({
        id: "shop-4",
        text: de ? "Spielmaterial vorbereiten" : "Prepare game materials",
        category: "shopping",
        priority: "medium",
        done: false,
        daysBeforeParty: 2,
      });
    }
  }

  // Day before
  todos.push({
    id: "prep-5",
    text: de ? "Kuchen backen" : "Bake cake",
    category: "preparation",
    priority: "high",
    done: false,
    daysBeforeParty: 1,
  });
  todos.push({
    id: "prep-6",
    text: de ? "Raum/Garten dekorieren" : "Decorate room/garden",
    category: "preparation",
    priority: "medium",
    done: false,
    daysBeforeParty: 1,
  });
  todos.push({
    id: "prep-7",
    text: de ? "Spiele aufbauen und testen" : "Set up and test games",
    category: "preparation",
    priority: "medium",
    done: false,
    daysBeforeParty: 1,
  });

  // Day of party
  todos.push({
    id: "day-1",
    text: de ? "Essen und Getränke vorbereiten" : "Prepare food and drinks",
    category: "day-of",
    priority: "high",
    done: false,
  });
  todos.push({
    id: "day-2",
    text: de ? "Musik-Playlist bereitstellen" : "Set up music playlist",
    category: "day-of",
    priority: "low",
    done: false,
  });
  todos.push({
    id: "day-3",
    text: de ? "Kamera / Handy laden für Fotos" : "Charge camera/phone for photos",
    category: "day-of",
    priority: "medium",
    done: false,
  });
  todos.push({
    id: "day-4",
    text: de ? "Erste-Hilfe-Set bereithalten" : "Have first-aid kit ready",
    category: "day-of",
    priority: "medium",
    done: false,
  });
  todos.push({
    id: "day-5",
    text: de ? "Geschenketisch vorbereiten" : "Prepare gift table",
    category: "day-of",
    priority: "low",
    done: false,
  });

  // After party
  todos.push({
    id: "after-1",
    text: de ? "Danke-Nachricht an Eltern senden" : "Send thank-you message to parents",
    category: "after",
    priority: "medium",
    done: false,
  });
  todos.push({
    id: "after-2",
    text: de ? "Fotos teilen" : "Share photos",
    category: "after",
    priority: "low",
    done: false,
  });

  return todos;
}

const CATEGORY_CONFIG = {
  preparation: { de: "Vorbereitung", en: "Preparation", icon: "📝", color: "purple" },
  shopping: { de: "Einkaufen", en: "Shopping", icon: "🛒", color: "blue" },
  "day-of": { de: "Am Partytag", en: "Day of Party", icon: "🎉", color: "green" },
  after: { de: "Nach der Party", en: "After Party", icon: "📸", color: "zinc" },
};

const PRIORITY_COLORS = {
  high: "text-red-500",
  medium: "text-orange-500",
  low: "text-zinc-400",
};

export function TodoTab({ wizard, games, shoppingList, locale }: TodoTabProps) {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("partyTodos");
    if (stored) return JSON.parse(stored);
    const generated = generateTodos(wizard, games, shoppingList, locale);
    sessionStorage.setItem("partyTodos", JSON.stringify(generated));
    return generated;
  });
  const [customText, setCustomText] = useState("");

  function toggleTodo(id: string) {
    setTodos((prev) => {
      const next = prev.map((t) => t.id === id ? { ...t, done: !t.done } : t);
      sessionStorage.setItem("partyTodos", JSON.stringify(next));
      return next;
    });
  }

  function addCustomTodo() {
    if (!customText.trim()) return;
    const newTodo: TodoItem = {
      id: `custom-${Date.now()}`,
      text: customText.trim(),
      category: "preparation",
      priority: "medium",
      done: false,
    };
    setTodos((prev) => {
      const next = [...prev, newTodo];
      sessionStorage.setItem("partyTodos", JSON.stringify(next));
      return next;
    });
    setCustomText("");
  }

  function removeTodo(id: string) {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      sessionStorage.setItem("partyTodos", JSON.stringify(next));
      return next;
    });
  }

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = ["preparation", "shopping", "day-of", "after"] as const;

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-zinc-900 dark:text-white">
            {locale === "de" ? "Fortschritt" : "Progress"}
          </h3>
          <span className="text-sm font-medium text-party-purple">
            {completedCount}/{totalCount} ({progress}%)
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-party-purple to-party-mint rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Todo Categories */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const catTodos = todos.filter((t) => t.category === cat);
          if (catTodos.length === 0) return null;

          const catDone = catTodos.filter((t) => t.done).length;

          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{config.icon}</span>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                  {locale === "de" ? config.de : config.en}
                </h4>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({catDone}/{catTodos.length})
                </span>
              </div>
              <div className="space-y-2">
                {catTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      todo.done
                        ? "bg-zinc-50 dark:bg-zinc-700/30 border-zinc-100 dark:border-zinc-700 opacity-60"
                        : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 hover:border-party-purple/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        todo.done
                          ? "bg-party-purple border-party-purple text-white"
                          : "border-zinc-300 dark:border-zinc-500 hover:border-party-purple"
                      }`}
                    >
                      {todo.done && <span className="text-xs">✓</span>}
                    </button>
                    <span className={`flex-1 text-sm ${
                      todo.done ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"
                    }`}>
                      {todo.text}
                    </span>
                    <span className={`text-xs ${PRIORITY_COLORS[todo.priority]}`}>
                      {todo.priority === "high" ? "!" : todo.priority === "medium" ? "-" : ""}
                    </span>
                    {todo.daysBeforeParty !== undefined && (
                      <span className="text-xs text-zinc-400 shrink-0">
                        {todo.daysBeforeParty === 1
                          ? (locale === "de" ? "1 Tag vorher" : "1 day before")
                          : (locale === "de" ? `${todo.daysBeforeParty} Tage vorher` : `${todo.daysBeforeParty} days before`)
                        }
                      </span>
                    )}
                    {todo.id.startsWith("custom-") && (
                      <button
                        onClick={() => removeTodo(todo.id)}
                        className="text-xs text-red-400 hover:text-red-600 shrink-0"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Todo */}
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomTodo()}
          placeholder={locale === "de" ? "Eigene Aufgabe hinzufügen..." : "Add custom task..."}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400"
        />
        <button
          onClick={addCustomTodo}
          disabled={!customText.trim()}
          className="px-4 py-2 bg-party-purple text-white text-sm font-bold rounded-lg hover:bg-party-purple-dark transition-colors disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
