"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FEATURE_INFO } from "@/lib/feature-gates";
import type { ProFeature } from "@/lib/feature-gates";

interface UpgradeBannerProps {
  feature: ProFeature;
  compact?: boolean;
}

export function UpgradeBanner({ feature, compact = false }: UpgradeBannerProps) {
  const t = useTranslations();
  const info = FEATURE_INFO[feature];

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-party-purple/5 dark:bg-party-purple/10 border border-party-purple/20 text-sm">
        <span className="text-base">{info.icon}</span>
        <span className="text-zinc-600 dark:text-zinc-400">
          {t(info.labelKey)}
        </span>
        <Link
          href="/upgrade"
          className="ml-auto text-party-purple dark:text-party-yellow font-semibold hover:underline text-xs"
        >
          Pro →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-party-purple/20 bg-gradient-to-br from-party-purple/5 via-party-yellow/5 to-party-mint/5 dark:from-party-purple/10 dark:via-party-yellow/10 dark:to-party-mint/10 p-5 text-center">
      <div className="text-3xl mb-2">{info.icon}</div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
        {t(info.labelKey)}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm mx-auto">
        {t(info.descKey)}
      </p>
      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-party-purple text-white font-semibold text-sm hover:bg-party-purple-dark transition-colors shadow-lg shadow-party-purple/25"
      >
        ✨ {t("upgrade.cta")}
      </Link>
    </div>
  );
}
