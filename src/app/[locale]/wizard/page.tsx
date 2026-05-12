import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PartyWizard } from "@/components/wizard/PartyWizard";

export default function WizardPage() {
  const t = useTranslations("wizard");

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            🎈 {t("title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <PartyWizard />
      </main>
      <Footer />
    </>
  );
}
