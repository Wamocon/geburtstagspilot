/**
 * Client-side fallback emoji and name map for themes.
 * Prevents broken display when the database returns garbled
 * emoji/unicode characters (e.g. "????" instead of actual emojis).
 */

export const THEME_EMOJI: Record<string, string> = {
  "pirates": "\u{1F3F4}\u200D\u2620\uFE0F",
  "princess": "\uD83D\uDC51",
  "dinosaurs": "\uD83E\uDD95",
  "space": "\uD83D\uDE80",
  "soccer": "\u26BD",
  "detective": "\uD83D\uDD0D",
  "unicorn": "\uD83E\uDD84",
  "animals": "\uD83D\uDC3E",
  "superhero": "\uD83E\uDDB8",
  "circus": "\uD83C\uDFAA",
  "knight": "\u2694\uFE0F",
  "mermaid": "\uD83E\uDDDC\u200D\u2640\uFE0F",
  "jungle": "\uD83C\uDF34",
  "no-theme": "\uD83C\uDF88",
};

export const THEME_NAME_DE: Record<string, string> = {
  "pirates": "Piraten",
  "princess": "Prinzessin",
  "dinosaurs": "Dinosaurier",
  "space": "Weltraum",
  "soccer": "Fu\u00DFball",
  "detective": "Detektiv",
  "unicorn": "Einhorn",
  "animals": "Tiere",
  "superhero": "Superhelden",
  "circus": "Zirkus",
  "knight": "Ritter",
  "mermaid": "Meerjungfrau",
  "jungle": "Dschungel",
  "no-theme": "Ohne Motto",
};

export const THEME_NAME_EN: Record<string, string> = {
  "pirates": "Pirates",
  "princess": "Princess",
  "dinosaurs": "Dinosaurs",
  "space": "Space",
  "soccer": "Soccer",
  "detective": "Detective",
  "unicorn": "Unicorn",
  "animals": "Animals",
  "superhero": "Superheroes",
  "circus": "Circus",
  "knight": "Knights",
  "mermaid": "Mermaid",
  "jungle": "Jungle",
  "no-theme": "No Theme",
};

/** Returns the emoji for a theme slug, using db value as fallback. */
export function getThemeEmoji(slug: string, dbEmoji?: string): string {
  return THEME_EMOJI[slug] ?? dbEmoji ?? "";
}

/** Returns the localized theme name, using db value as fallback. */
export function getThemeName(slug: string, locale: "de" | "en", dbNameDe?: string, dbNameEn?: string): string {
  if (locale === "de") {
    return THEME_NAME_DE[slug] ?? dbNameDe ?? slug;
  }
  return THEME_NAME_EN[slug] ?? dbNameEn ?? slug;
}
