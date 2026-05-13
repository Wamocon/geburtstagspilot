"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FEATURE_INFO } from "@/lib/feature-gates";
import type { ProFeature } from "@/lib/feature-gates";

export function UpgradeModal() {
  const t = useTranslations("upgrade");
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<ProFeature | null>(null);

  const handleEvent = useCallback((e: Event) => {
    const detail = (e as CustomEvent<{ feature: ProFeature }>).detail;
    setFeature(detail.feature);
    setOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("show-upgrade-modal", handleEvent);
    return () => window.removeEventListener("show-upgrade-modal", handleEvent);
  }, [handleEvent]);

  if (!open || !feature) return null;

  const info = FEATURE_INFO[feature];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-3">{info.icon}</div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            {t("modalTitle")}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            {t("modalDesc", { feature: t(`featureNames.${feature}`) })}
          </p>

          {/* Price highlight */}
          <div className="bg-party-purple/5 dark:bg-party-purple/10 rounded-xl p-4 mb-6 border border-party-purple/20">
            <p className="text-2xl font-bold text-party-purple dark:text-party-yellow">
              1,99 EUR
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("perMonth")}</p>
            <p className="text-xs text-party-mint mt-1">{t("yearlyDiscount")}</p>
          </div>

          {/* CTA */}
          <Link
            href="/upgrade"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-full bg-party-purple text-white font-bold text-sm hover:bg-party-purple-dark transition-colors shadow-lg shadow-party-purple/25"
          >
            ✨ {t("cta")}
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => setOpen(false)}
            className="mt-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {t("notNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
