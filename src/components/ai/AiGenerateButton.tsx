"use client";

import { useTranslations } from "next-intl";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import type { ProFeature } from "@/lib/feature-gates";

interface AiGenerateButtonProps {
  feature: ProFeature;
  onClick: () => void;
  loading?: boolean;
  label: string;
  icon?: string;
}

export function AiGenerateButton({
  feature,
  onClick,
  loading = false,
  label,
  icon = "✨",
}: AiGenerateButtonProps) {
  const t = useTranslations("upgrade");
  const { hasAccess } = useFeatureGate(feature);

  if (!hasAccess) {
    return (
      <button
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("show-upgrade-modal", { detail: { feature } })
          );
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-party-purple/5 dark:bg-party-purple/10 border border-party-purple/20 text-sm text-party-purple dark:text-party-yellow font-medium hover:bg-party-purple/10 dark:hover:bg-party-purple/20 transition-colors"
      >
        <span className="text-base">🔒</span>
        <span>{label}</span>
        <span className="text-[10px] uppercase font-bold bg-party-purple/10 px-1.5 py-0.5 rounded">Pro</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-party-purple/10 to-party-yellow/10 border border-party-purple/20 text-sm font-medium text-party-purple dark:text-party-yellow hover:from-party-purple/20 hover:to-party-yellow/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-base">{loading ? "⏳" : icon}</span>
      <span>{loading ? t("generating") : label}</span>
    </button>
  );
}
