"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  function switchLocale(locale: "de" | "en") {
    router.replace(pathname, { locale });
  }

  return (
    <div className="flex items-center gap-0.5 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
      <button
        onClick={() => switchLocale("de")}
        className={`px-2.5 py-1.5 rounded-md font-semibold transition-all ${
          currentLocale === "de"
            ? "bg-white dark:bg-zinc-700 text-party-purple dark:text-party-yellow shadow-sm"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        }`}
        aria-label={t("german")}
      >
        DE
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2.5 py-1.5 rounded-md font-semibold transition-all ${
          currentLocale === "en"
            ? "bg-white dark:bg-zinc-700 text-party-purple dark:text-party-yellow shadow-sm"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        }`}
        aria-label={t("english")}
      >
        EN
      </button>
    </div>
  );
}
