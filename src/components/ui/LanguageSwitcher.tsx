"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(locale: "de" | "en") {
    router.replace(pathname, { locale });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("de")}
        className="px-2 py-1 rounded hover:bg-party-purple/10 transition-colors"
        aria-label={t("german")}
      >
        DE
      </button>
      <span className="text-zinc-400">|</span>
      <button
        onClick={() => switchLocale("en")}
        className="px-2 py-1 rounded hover:bg-party-purple/10 transition-colors"
        aria-label={t("english")}
      >
        EN
      </button>
    </div>
  );
}
