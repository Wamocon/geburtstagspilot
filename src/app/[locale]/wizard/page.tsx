import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PartyWizard } from "@/components/wizard/PartyWizard";

export default function WizardPage() {
  const t = useTranslations("wizard");

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
          <PartyWizard />
        </div>
      </main>
      <Footer />
    </>
  );
}
