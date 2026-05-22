"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { PlanCard } from "@/components/dashboard/PlanCard";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { SavedPlan } from "@/types";
import { TIER_LIMITS } from "@/types";

function DashboardContent() {
  const t = useTranslations("dashboard");
  const ta = useTranslations("auth");
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }

    async function loadPlans() {
      try {
        const supabase = createSupabaseBrowser();
        const { data } = await supabase
          .from("saved_plans")
          .select("*")
          .order("updated_at", { ascending: false });
        setPlans((data as SavedPlan[]) || []);
      } catch {
        // Supabase unreachable - show empty plans
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, [authLoading, user]);

  async function handleDelete(id: string) {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    await refreshProfile();
  }

  const limits = TIER_LIMITS[profile?.tier || "free"];
  const planCount = profile?.plan_count || 0;

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
          <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-party-purple/30 border-t-party-purple rounded-full animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
          <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-100 dark:border-zinc-700 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {ta("loginRequiredTitle")}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                {ta("loginRequired")}
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-party-purple text-white hover:bg-party-purple-dark shadow-md shadow-party-purple/20 transition-all"
              >
                {ta("loginNow")}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>📋</span> {t("title")}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {t("subtitle", { count: planCount, max: limits.maxPlans === Infinity ? "\u221E" : limits.maxPlans })}
              </p>
            </div>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-party-purple/25 transition-all active:scale-95"
            >
              🎊 {t("newPlan")}
            </Link>
          </div>

          {/* Tier Info */}
          {profile?.tier === "free" && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center text-lg shrink-0">🎁</div>
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    {t("freeTierInfo")}
                  </p>
                  <div className="mt-1.5 w-32 h-1.5 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (planCount / (limits.maxPlans === Infinity ? 50 : limits.maxPlans)) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    {t("plansUsed", { count: planCount, max: limits.maxPlans })}
                  </p>
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-bold uppercase shrink-0">
                Free
              </span>
            </div>
          )}

          {profile?.tier === "pro" && (
            <div className="mb-6 bg-party-purple/5 dark:bg-party-purple/10 border border-party-purple/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-lg shrink-0">⭐</div>
                <p className="text-sm font-semibold text-party-purple dark:text-party-yellow">
                  {t("proTierInfo")}
                </p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-party-purple text-white font-bold uppercase shrink-0">
                Pro
              </span>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 animate-pulse h-48" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
              <div className="text-5xl mb-4 animate-float">🎊</div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {t("noPlans")}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto">
                {t("noPlansDesc")}
              </p>
              <Link
                href="/wizard"
                className="inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-party-purple/25 transition-all active:scale-95"
              >
                🎊 {t("createFirst")}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
                ))}
              </div>

              {/* Pro Upsell for free users */}
              {profile?.tier === "free" && (
                <div className="mt-8 bg-gradient-to-br from-party-purple/5 via-party-yellow/5 to-party-mint/5 dark:from-party-purple/10 dark:via-party-yellow/10 dark:to-party-mint/10 rounded-2xl p-6 border border-party-purple/20">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        ⭐ {t("upgradeTitle")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {t("upgradeDesc")}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="text-party-purple dark:text-party-yellow">✓</span>
                            {t(`proFeature${i}` as Parameters<typeof t>[0])}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href="/auth/register"
                      className="shrink-0 inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-party-purple/25 transition-all"
                    >
                      ⭐ {t("upgradeCta")}
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
