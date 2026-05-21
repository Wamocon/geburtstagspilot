"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PartyWizard } from "@/components/wizard/PartyWizard";
import { useAuth } from "@/components/auth/AuthProvider";

export default function WizardPage() {
  const t = useTranslations("wizard");
  const ta = useTranslations("auth");
  const { user, loading } = useAuth();

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-2xl mx-auto px-4 pt-6 sm:pt-10 pb-8 sm:pb-12">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-party-purple/10 dark:bg-party-yellow/10 text-party-purple dark:text-party-yellow text-sm font-bold px-4 py-2 rounded-full mb-4">
              🎊 {t("subtitle")}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white">
              {t("title")}
            </h1>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-party-purple/30 border-t-party-purple rounded-full animate-spin" />
            </div>
          ) : user ? (
            <PartyWizard />
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
