// Feature gate configuration - neutral file (no "use client"/"use server")
// Defines which features are gated behind the Pro tier.

import type { UserTier } from "@/types";

export const PRO_FEATURES = [
  "collaboration",
  "rsvp_tracking",
  "ai_personalization",
  "ai_chat",
  "ai_game_generation",
  "ai_invitation_text",
  "task_manager",
  "child_profiles",
  "budget_tracker",
  "premium_themes",
  "unlimited_plans",
  "persistent_share_links",
] as const;

export type ProFeature = (typeof PRO_FEATURES)[number];

export const FEATURE_INFO: Record<
  ProFeature,
  { icon: string; labelKey: string; descKey: string }
> = {
  collaboration: {
    icon: "👨‍👩‍👧",
    labelKey: "upgrade.features.collaboration",
    descKey: "upgrade.features.collaborationDesc",
  },
  rsvp_tracking: {
    icon: "📬",
    labelKey: "upgrade.features.rsvpTracking",
    descKey: "upgrade.features.rsvpTrackingDesc",
  },
  ai_personalization: {
    icon: "🧠",
    labelKey: "upgrade.features.aiPersonalization",
    descKey: "upgrade.features.aiPersonalizationDesc",
  },
  ai_chat: {
    icon: "💬",
    labelKey: "upgrade.features.aiChat",
    descKey: "upgrade.features.aiChatDesc",
  },
  ai_game_generation: {
    icon: "🎲",
    labelKey: "upgrade.features.aiGameGeneration",
    descKey: "upgrade.features.aiGameGenerationDesc",
  },
  ai_invitation_text: {
    icon: "✉️",
    labelKey: "upgrade.features.aiInvitationText",
    descKey: "upgrade.features.aiInvitationTextDesc",
  },
  task_manager: {
    icon: "✅",
    labelKey: "upgrade.features.taskManager",
    descKey: "upgrade.features.taskManagerDesc",
  },
  child_profiles: {
    icon: "👶",
    labelKey: "upgrade.features.childProfiles",
    descKey: "upgrade.features.childProfilesDesc",
  },
  budget_tracker: {
    icon: "💰",
    labelKey: "upgrade.features.budgetTracker",
    descKey: "upgrade.features.budgetTrackerDesc",
  },
  premium_themes: {
    icon: "🌟",
    labelKey: "upgrade.features.premiumThemes",
    descKey: "upgrade.features.premiumThemesDesc",
  },
  unlimited_plans: {
    icon: "📋",
    labelKey: "upgrade.features.unlimitedPlans",
    descKey: "upgrade.features.unlimitedPlansDesc",
  },
  persistent_share_links: {
    icon: "🔗",
    labelKey: "upgrade.features.persistentShareLinks",
    descKey: "upgrade.features.persistentShareLinksDesc",
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasFeatureAccess(tier: UserTier, _feature: ProFeature): boolean {
  return tier === "pro";
}
