"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ScheduleItem } from "@/types";

interface ScheduleTabProps {
  schedule: ScheduleItem[];
  startTime: string;
  onTimeChange: (time: string) => void;
  onUpdateSchedule: (schedule: ScheduleItem[]) => void;
  editMode: boolean;
  locale: "de" | "en";
}

const TYPE_COLORS: Record<ScheduleItem["type"], string> = {
  arrival: "bg-party-mint/20 border-party-mint text-emerald-800 dark:text-emerald-300",
  greeting: "bg-party-yellow/20 border-party-yellow text-amber-800 dark:text-amber-300",
  game: "bg-party-purple/10 border-party-purple text-purple-800 dark:text-purple-300",
  food: "bg-orange-100 border-orange-400 text-orange-800 dark:text-orange-300 dark:bg-orange-900/20",
  cake: "bg-pink-100 border-pink-400 text-pink-800 dark:text-pink-300 dark:bg-pink-900/20",
  gifts: "bg-party-coral/20 border-party-coral text-red-800 dark:text-red-300",
  free: "bg-blue-100 border-blue-400 text-blue-800 dark:text-blue-300 dark:bg-blue-900/20",
  goodbye: "bg-zinc-100 border-zinc-400 text-zinc-800 dark:text-zinc-300 dark:bg-zinc-700/50",
  custom: "bg-indigo-100 border-indigo-400 text-indigo-800 dark:text-indigo-300 dark:bg-indigo-900/20",
};

const TYPE_ICONS: Record<ScheduleItem["type"], string> = {
  arrival: "👋",
  greeting: "🎤",
  game: "🎮",
  food: "🍕",
  cake: "🎂",
  gifts: "🎁",
  free: "⚡",
  goodbye: "👋",
  custom: "📌",
};

export function ScheduleTab({ schedule, startTime, onTimeChange, onUpdateSchedule, editMode, locale }: ScheduleTabProps) {
  const t = useTranslations("result");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState(15);

  function moveItem(index: number, direction: "up" | "down") {
    const newSchedule = [...schedule];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSchedule.length) return;
    [newSchedule[index], newSchedule[targetIndex]] = [newSchedule[targetIndex], newSchedule[index]];
    onUpdateSchedule(recalculateTimes(newSchedule, startTime));
  }

  function removeItem(index: number) {
    const newSchedule = schedule.filter((_, i) => i !== index);
    onUpdateSchedule(recalculateTimes(newSchedule, startTime));
  }

  function updateItemDuration(index: number, duration: number) {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], duration };
    onUpdateSchedule(recalculateTimes(newSchedule, startTime));
  }

  function addCustomItem() {
    if (!newTitle.trim()) return;
    const item: ScheduleItem = {
      id: crypto.randomUUID(),
      time: "",
      title_de: newTitle,
      title_en: newTitle,
      duration: newDuration,
      type: "custom",
      isCustom: true,
    };
    const newSchedule = [...schedule, item];
    onUpdateSchedule(recalculateTimes(newSchedule, startTime));
    setNewTitle("");
    setNewDuration(15);
    setShowAddForm(false);
  }

  return (
    <div>
      {/* Time Adjuster */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("startTime")}:
        </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
        />
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${TYPE_COLORS[item.type]} transition-all`}
          >
            <div className="text-2xl">{TYPE_ICONS[item.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{item.time}</span>
                <span className="text-sm font-medium">
                  {locale === "de" ? item.title_de : item.title_en}
                </span>
              </div>
              {editMode ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateItemDuration(index, Math.max(5, Number(e.target.value)))}
                    min={5}
                    max={120}
                    className="w-16 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-xs"
                  />
                  <span className="text-xs opacity-70">{t("minutes")}</span>
                </div>
              ) : (
                <span className="text-xs opacity-70">
                  {item.duration} {t("minutes")}
                </span>
              )}
            </div>
            {editMode && (
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-30 transition-colors"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === schedule.length - 1}
                  className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 disabled:opacity-30 transition-colors"
                >
                  ▼
                </button>
                {item.isCustom && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Item */}
      {editMode && (
        <>
          {showAddForm ? (
            <div className="mt-4 p-4 border-2 border-dashed border-party-purple/30 rounded-xl space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={locale === "de" ? "Bezeichnung des Programmpunkts" : "Activity name"}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  min={5}
                  max={120}
                  className="w-20 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                />
                <span className="text-sm text-zinc-500">{t("minutes")}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addCustomItem}
                  className="px-4 py-2 bg-party-purple text-white rounded-lg text-sm font-medium hover:bg-party-purple-dark transition-colors"
                >
                  ✓ {locale === "de" ? "Hinzufügen" : "Add"}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors"
                >
                  {locale === "de" ? "Abbrechen" : "Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl text-sm text-zinc-500 hover:border-party-purple hover:text-party-purple transition-colors"
            >
              + {t("addCustomItem")}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function recalculateTimes(schedule: ScheduleItem[], startTime: string): ScheduleItem[] {
  const [startHour, startMin] = startTime.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMin;

  return schedule.map((item) => {
    const h = Math.floor(currentMinutes / 60) % 24;
    const m = currentMinutes % 60;
    const time = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    currentMinutes += item.duration;
    return { ...item, time };
  });
}
