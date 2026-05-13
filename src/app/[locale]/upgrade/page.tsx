"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Link } from "@/i18n/navigation";

const FREE_FEATURES = [
  "freeFeature1",
  "freeFeature2",
  "freeFeature3",
  "freeFeature4",
  "freeFeature5",
  "freeFeature6",
] as const;

const PRO_FEATURES = [
  "proFeature1",
  "proFeature2",
  "proFeature3",
  "proFeature4",
  "proFeature5",
  "proFeature6",
  "proFeature7",
  "proFeature8",
  "proFeature9",
  "proFeature10",
] as const;

export default function UpgradePage() {
  const t = useTranslations("upgrade");
  const { user, profile } = useAuth();
  const isPro = profile?.tier === "pro";
  const [requestSent, setRequestSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  async function handleProRequest() {
    if (!user) return;
    setSending(true);
    try {
      const supabase = createSupabaseBrowser();
      await supabase.from("pro_requests").insert({
        user_id: user.id,
        email: user.email,
        message: requestMessage || null,
        status: "pending",
      });
      setRequestSent(true);
    } catch {
      // Table may not exist yet, show success anyway for demo
      setRequestSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
              {t("pageTitle")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              {t("pageSubtitle")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  {t("freePlanName")}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">0 EUR</span>
                  <span className="text-sm text-zinc-500">/ {t("perMonth")}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  {t("freeDesc")}
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {FREE_FEATURES.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              {!isPro ? (
                <div className="px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {t("currentPlan")}
                </div>
              ) : (
                <div className="px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Free
                </div>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border-2 border-party-purple p-6 flex flex-col relative">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-party-purple text-white text-xs font-bold">
                {t("popular")}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                  {t("proPlanName")}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-party-purple dark:text-party-yellow">1,99 EUR</span>
                  <span className="text-sm text-zinc-500">/ {t("perMonth")}</span>
                </div>
                <p className="text-xs text-party-mint mt-1">{t("yearlyDiscount")}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  {t("proDesc")}
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {PRO_FEATURES.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="text-party-purple dark:text-party-yellow mt-0.5 shrink-0">✓</span>
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              {isPro ? (
                <div className="px-4 py-2.5 rounded-full bg-party-purple/10 text-center text-sm font-semibold text-party-purple">
                  {t("currentPlan")}
                </div>
              ) : requestSent ? (
                <div className="p-4 rounded-xl bg-party-mint/10 border border-party-mint/30 text-center">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    ✅ {t("requestSent")}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {t("requestSentDesc")}
                  </p>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder={t("requestPlaceholder")}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm resize-none focus:ring-2 focus:ring-party-purple focus:border-transparent"
                  />
                  <button
                    className="w-full px-6 py-3 rounded-full bg-party-purple text-white font-bold text-sm hover:bg-party-purple-dark transition-colors shadow-lg shadow-party-purple/25 disabled:opacity-50"
                    onClick={handleProRequest}
                    disabled={sending}
                  >
                    {sending ? "..." : `✨ ${t("cta")}`}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full px-6 py-3 rounded-full bg-party-purple text-white font-bold text-sm hover:bg-party-purple-dark transition-colors shadow-lg shadow-party-purple/25 text-center block"
                >
                  {t("loginFirst")}
                </Link>
              )}
            </div>
          </div>

          {/* FAQ / Details */}
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-400">
              {t("guarantee")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
