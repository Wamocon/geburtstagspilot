import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function TermsPage() {
  const t = useTranslations("legal");

  const sections = [
    { id: "scope", title: `§ 1 ${t("terms.section1Title")}` },
    { id: "service", title: `§ 2 ${t("terms.section2Title")}` },
    { id: "usage", title: `§ 3 ${t("terms.section3Title")}` },
    { id: "rights", title: `§ 4 ${t("terms.section4Title")}` },
    { id: "obligations", title: `§ 5 ${t("terms.section5Title")}` },
    { id: "disclaimer", title: `§ 6 ${t("terms.section6Title")}` },
    { id: "data", title: `§ 7 ${t("terms.section7Title")}` },
    { id: "termination", title: `§ 8 ${t("terms.section8Title")}` },
    { id: "law", title: `§ 9 ${t("terms.section9Title")}` },
  ];

  const sectionKeys = [
    { id: "scope", num: 1, key: "section1" },
    { id: "service", num: 2, key: "section2" },
    { id: "usage", num: 3, key: "section3" },
    { id: "rights", num: 4, key: "section4" },
    { id: "obligations", num: 5, key: "section5" },
    { id: "disclaimer", num: 6, key: "section6" },
    { id: "data", num: 7, key: "section7" },
    { id: "termination", num: 8, key: "section8" },
    { id: "law", num: 9, key: "section9" },
  ] as const;

  return (
    <>
      <Header />
      <main className="flex-1">
        <LegalPageLayout
          icon="📜"
          title={t("terms.title")}
          subtitle={t("terms.subtitle")}
          lastUpdated={t("lastUpdated")}
          sections={sections}
        >
          <div className="space-y-8">
            {sectionKeys.map(({ id, num, key }, idx) => (
              <div key={id}>
                {idx > 0 && <hr className="border-zinc-200 dark:border-zinc-700 mb-8" />}
                <section id={id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-sm font-bold text-party-purple dark:text-party-yellow">
                      §{num}
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {t(`terms.${key}Title`)}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(`terms.${key}Text`)}
                  </p>
                </section>
              </div>
            ))}
          </div>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
