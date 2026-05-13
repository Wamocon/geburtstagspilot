"use client";

import type { ReactNode } from "react";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { UpgradeBanner } from "@/components/upgrade/UpgradeBanner";
import type { ProFeature } from "@/lib/feature-gates";

interface FeatureGateProps {
  feature: ProFeature;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasAccess } = useFeatureGate(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback ?? <UpgradeBanner feature={feature} />;
}
