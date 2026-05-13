"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { hasFeatureAccess } from "@/lib/feature-gates";
import type { ProFeature } from "@/lib/feature-gates";
import type { UserTier } from "@/types";

interface FeatureGateResult {
  hasAccess: boolean;
  tier: UserTier;
  isLoggedIn: boolean;
}

export function useFeatureGate(feature: ProFeature): FeatureGateResult {
  const { profile, user } = useAuth();
  const tier: UserTier = profile?.tier ?? "free";
  const isLoggedIn = !!user;
  const access = hasFeatureAccess(tier, feature);

  return { hasAccess: access, tier, isLoggedIn };
}
