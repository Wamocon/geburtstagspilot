import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FEATURES = [
  { key: "Schedule", icon: "🗓️" },
  { key: "Games", icon: "🎮" },
  { key: "Food", icon: "🍰" },
  { key: "Shopping", icon: "🛒" },
  { key: "Invitation", icon: "💌" },
  { key: "Goodie", icon: "🎁" },
] as const;

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-party-purple/5 via-party-cream to-party-yellow/10 dark:from-party-purple/20 dark:via-zinc-950 dark:to-party-yellow/5">
          <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
            <div className="text-6xl mb-6 animate-bounce" aria-hidden="true">
              🎂
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
              {t("home.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("home.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-party-purple/25 hover:shadow-xl hover:shadow-party-purple/30 transition-all hover:scale-105"
              >
                🎈 {t("common.startPlanning")}
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              {t("home.trustedBy")}
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-900 dark:text-white">
              {t("home.features")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map(({ key, icon }) => (
                <div
                  key={key}
                  className="p-6 rounded-2xl bg-party-cream dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-party-purple/30 dark:hover:border-party-yellow/30 transition-all hover:shadow-lg group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">
                    {t(`home.feature${key}`)}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(`home.feature${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-white to-party-cream dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-900 dark:text-white">
              {t("home.howItWorks")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-party-purple text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-party-purple/25">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">
                    {t(`home.step${step}`)}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t(`home.step${step}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-party-purple dark:bg-party-purple-dark text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t("home.ctaSubtitle")}
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 bg-party-yellow text-zinc-900 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              🚀 {t("common.startPlanning")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
