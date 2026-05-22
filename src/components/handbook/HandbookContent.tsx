"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const WIZARD_STEPS = ["step1", "step2", "step3", "step4", "step5", "step6", "step7"] as const;
const PLAN_FEATURES = ["schedule", "games", "food", "shopping", "invitation", "goodies"] as const;
const PLAN_ICONS = { schedule: "🗓️", games: "🎮", food: "🍰", shopping: "🛒", invitation: "💌", goodies: "🎁" } as const;
const DASHBOARD_FEATURES = ["feature1", "feature2", "feature3", "feature4"] as const;
const SHARING_STEPS = ["step1", "step2", "step3"] as const;
const PRO_FEATURES = ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6", "feature7", "feature8", "feature9", "feature10"] as const;
const FAQ_ITEMS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

const TOC_SECTIONS = [
  { id: "intro", icon: "👋" },
  { id: "getting-started", icon: "🚀" },
  { id: "wizard", icon: "🧙" },
  { id: "plan", icon: "📋" },
  { id: "dashboard", icon: "📊" },
  { id: "sharing", icon: "🔗" },
  { id: "pro", icon: "👑" },
  { id: "themes", icon: "🎨" },
  { id: "faq", icon: "❓" },
  { id: "support", icon: "💬" },
] as const;

export function HandbookContent() {
  const t = useTranslations("handbook");

  const tocTitles: Record<string, string> = {
    intro: t("intro.title"),
    "getting-started": t("gettingStarted.title"),
    wizard: t("wizard.title"),
    plan: t("plan.title"),
    dashboard: t("dashboard.title"),
    sharing: t("sharing.title"),
    pro: t("pro.title"),
    themes: t("themes.title"),
    faq: t("faq.title"),
    support: t("support.title"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-party-purple/5 via-party-cream to-party-yellow/10 dark:from-party-purple/20 dark:via-zinc-950 dark:to-party-yellow/5 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-party-purple/10 dark:bg-party-yellow/10 text-3xl mb-5">
            📖
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-24">
              <nav className="space-y-1">
                {TOC_SECTIONS.map(({ id, icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow py-2 px-3 rounded-lg hover:bg-party-purple/5 dark:hover:bg-party-yellow/5 transition-colors leading-snug"
                  >
                    <span className="text-base">{icon}</span>
                    {tocTitles[id]}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <a
                  href="/handbook-de.pdf"
                  download
                  className="flex items-center gap-2 text-sm font-semibold text-party-purple dark:text-party-yellow hover:underline px-3 py-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("downloadPdf")}
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Welcome */}
            <section id="intro" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-xl">👋</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("intro.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("intro.text")}</p>
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-xl">🚀</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("gettingStarted.title")}</h2>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-party-purple to-party-purple-dark text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-party-purple/20">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                        {t(`gettingStarted.step${step}Title` as Parameters<typeof t>[0])}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(`gettingStarted.step${step}Text` as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Wizard */}
            <section id="wizard" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center text-xl">🧙</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("wizard.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("wizard.text")}</p>
              <ol className="space-y-2">
                {WIZARD_STEPS.map((step, idx) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/30 rounded-lg px-4 py-2.5 border border-zinc-100 dark:border-zinc-700/50">
                    <span className="w-6 h-6 rounded-full bg-party-purple/10 dark:bg-party-yellow/10 text-party-purple dark:text-party-yellow flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    {t(`wizard.${step}`)}
                  </li>
                ))}
              </ol>
            </section>

            {/* Party Plan */}
            <section id="plan" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-xl">📋</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("plan.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("plan.text")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLAN_FEATURES.map((feat) => (
                  <div key={feat} className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50">
                    <span className="text-xl shrink-0">{PLAN_ICONS[feat]}</span>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{t(`plan.${feat}`)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dashboard */}
            <section id="dashboard" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-xl">📊</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("dashboard.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("dashboard.text")}</p>
              <ul className="space-y-2">
                {DASHBOARD_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-party-mint/20 text-party-mint flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    {t(`dashboard.${feat}`)}
                  </li>
                ))}
              </ul>
            </section>

            {/* Sharing */}
            <section id="sharing" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 flex items-center justify-center text-xl">🔗</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("sharing.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("sharing.text")}</p>
              <ol className="space-y-3">
                {SHARING_STEPS.map((step, idx) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="w-7 h-7 rounded-lg bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    {t(`sharing.${step}`)}
                  </li>
                ))}
              </ol>
            </section>

            {/* Pro Features */}
            <section id="pro" className="bg-gradient-to-br from-party-purple/5 to-party-yellow/5 dark:from-party-purple/20 dark:to-party-yellow/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-party-purple/20 dark:border-party-purple/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-xl">👑</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("pro.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("pro.text")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRO_FEATURES.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 bg-white/60 dark:bg-zinc-800/40 rounded-lg px-3 py-2.5 border border-party-purple/10 dark:border-party-yellow/10">
                    <span className="w-5 h-5 rounded-full bg-party-purple/20 dark:bg-party-yellow/20 text-party-purple dark:text-party-yellow flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    {t(`pro.${feat}`)}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href="/upgrade"
                  className="inline-flex items-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-party-purple/25 transition-all hover:scale-105 active:scale-[0.98]"
                >
                  👑 Pro freischalten
                </Link>
              </div>
            </section>

            {/* Themes */}
            <section id="themes" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-400/10 flex items-center justify-center text-xl">🎨</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("themes.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("themes.text")}</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700/50 leading-relaxed">
                {t("themes.list")}
              </p>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-400/10 flex items-center justify-center text-xl">❓</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("faq.title")}</h2>
              </div>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <details key={item} className="group bg-zinc-50 dark:bg-zinc-700/30 rounded-xl border border-zinc-100 dark:border-zinc-700/50 overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors list-none">
                      {t(`faq.${item}`)}
                      <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t(`faq.${item.replace("q", "a")}` as Parameters<typeof t>[0])}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Support */}
            <section id="support" className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-party-coral/10 dark:bg-party-coral/10 flex items-center justify-center text-xl">💬</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("support.title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{t("support.text")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">E-Mail</p>
                  <a href="mailto:info@wamocon.com" className="text-sm font-semibold text-party-purple dark:text-party-yellow hover:underline">
                    info@wamocon.com
                  </a>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Telefon</p>
                  <a href="tel:+496196 5838311" className="text-sm font-semibold text-party-purple dark:text-party-yellow hover:underline">
                    +49 6196 5838311
                  </a>
                </div>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
