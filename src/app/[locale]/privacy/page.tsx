import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function PrivacyPage() {
  const t = useTranslations("legal");

  const sections = [
    { id: "controller", title: t("privacy.section1Title") },
    { id: "overview", title: t("privacy.section2Title") },
    { id: "legal-basis", title: t("privacy.section3Title") },
    { id: "hosting", title: t("privacy.section4Title") },
    { id: "personal-data", title: t("privacy.section5Title") },
    { id: "cookies", title: t("privacy.section6Title") },
    { id: "rights", title: t("privacy.section7Title") },
    { id: "security", title: t("privacy.section8Title") },
    { id: "changes", title: t("privacy.section9Title") },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <LegalPageLayout
          icon="🔒"
          title={t("privacy.title")}
          subtitle={t("privacy.subtitle")}
          lastUpdated={t("lastUpdated")}
          sections={sections}
        >
          <div className="space-y-8">
            {/* 1. Data Controller */}
            <section id="controller">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">1</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section1Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{t("privacy.section1Text")}</p>
              <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <p className="font-bold">WAMOCON GmbH</p>
                <p>Mergenthalerallee 79 - 81<br />65760 Eschborn</p>
                <p className="mt-2">
                  <a href="mailto:info@wamocon.com" className="text-party-purple dark:text-party-yellow hover:underline">info@wamocon.com</a>
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 2. Overview */}
            <section id="overview">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">2</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section2Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section2Text")}</p>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 3. Legal Basis */}
            <section id="legal-basis">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">3</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section3Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{t("privacy.section3Text")}</p>
              <ul className="space-y-2">
                {(["legal1", "legal2", "legal3", "legal4"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-party-purple/10 dark:bg-party-yellow/10 text-party-purple dark:text-party-yellow flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    {t(`privacy.${key}`)}
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 4. Hosting */}
            <section id="hosting">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">4</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section4Title")}</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Vercel Inc.</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section4Vercel")}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Supabase Inc.</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section4Supabase")}</p>
                </div>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 5. Personal Data */}
            <section id="personal-data">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">5</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section5Title")}</h2>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section5Registration")}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section5Logs")}</p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 6. Cookies */}
            <section id="cookies">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">6</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section6Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section6Text")}</p>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 7. Rights */}
            <section id="rights">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">7</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section7Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{t("privacy.section7Text")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(["right1", "right2", "right3", "right4", "right5", "right6", "right7", "right8"] as const).map((key) => (
                  <div key={key} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/30 rounded-lg px-3 py-2.5 border border-zinc-100 dark:border-zinc-700/50">
                    <span className="text-party-purple dark:text-party-yellow text-xs">●</span>
                    {t(`privacy.${key}`)}
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 8. Security */}
            <section id="security">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">8</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section8Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section8Text")}</p>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* 9. Changes */}
            <section id="changes">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">9</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("privacy.section9Title")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{t("privacy.section9Text")}</p>
            </section>
          </div>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
