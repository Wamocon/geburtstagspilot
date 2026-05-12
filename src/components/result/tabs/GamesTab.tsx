"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Game } from "@/types";

interface GamesTabProps {
  games: Game[];
  reserveGames: Game[];
  onSwapGame: (gameIndex: number) => void;
  editMode: boolean;
  locale: "de" | "en";
}

export function GamesTab({ games, reserveGames, onSwapGame, editMode, locale }: GamesTabProps) {
  const t = useTranslations("result");
  const [expandedGame, setExpandedGame] = useState<string | null>(null);

  function renderGame(game: Game, index: number, isReserve: boolean) {
    const isExpanded = expandedGame === game.id;
    const name = locale === "de" ? game.name_de : game.name_en;
    const desc = locale === "de" ? game.description_de : game.description_en;
    const instructions = locale === "de" ? game.instructions_de : game.instructions_en;
    const materials = locale === "de" ? game.materials_de : game.materials_en;

    const activityIcon = game.activity === "calm" ? "😌" : game.activity === "active" ? "🏃" : "🤸";

    return (
      <div
        key={game.id}
        className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden"
      >
        <button
          onClick={() => setExpandedGame(isExpanded ? null : game.id)}
          className="w-full p-4 flex items-start gap-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
        >
          <span className="text-2xl">{activityIcon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-white">{name}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                {game.duration_minutes} {t("minutes")}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {game.min_players}+ {t("players")}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                {game.min_age}-{game.max_age} {t("age")}
              </span>
            </div>
          </div>
          {!isReserve && editMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwapGame(index);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-party-purple/10 text-party-purple hover:bg-party-purple/20 transition-colors font-medium shrink-0"
            >
              🔄 {t("swapGame")}
            </button>
          )}
          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-700">
            {/* Instructions */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
                📋 {t("instructions")}
              </h4>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                {instructions}
              </div>
            </div>

            {/* Materials */}
            {materials.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
                  🧰 {t("materials")}
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                  {materials.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-8">
        {games.map((game, i) => renderGame(game, i, false))}
      </div>

      {reserveGames.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-3">
            📦 {t("reserveGames")}
          </h3>
          <div className="space-y-3 opacity-75">
            {reserveGames.map((game, i) => renderGame(game, i, true))}
          </div>
        </>
      )}
    </div>
  );
}
