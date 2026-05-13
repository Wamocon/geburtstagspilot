import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FEATURES = [
  { key: "Schedule", icon: "🗓️", gradient: "from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20" },
  { key: "Games", icon: "🎮", gradient: "from-blue-500/10 to-sky-500/10 dark:from-blue-500/20 dark:to-sky-500/20" },
  { key: "Food", icon: "🍰", gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20" },
  { key: "Shopping", icon: "🛒", gradient: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20" },
  { key: "Invitation", icon: "💌", gradient: "from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20" },
  { key: "Goodie", icon: "🎁", gradient: "from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20" },
] as const;

const TESTIMONIALS = [
  { key: "testimonial1", emoji: "👩" },
  { key: "testimonial2", emoji: "👨" },
  { key: "testimonial3", emoji: "👩‍🦰" },
] as const;

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-party-purple/5 via-party-cream to-party-yellow/10 dark:from-party-purple/20 dark:via-zinc-950 dark:to-party-yellow/5">
          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-20 left-[10%] text-4xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>🎈</div>
            <div className="absolute top-40 right-[15%] text-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🎂</div>
            <div className="absolute bottom-20 left-[20%] text-3xl opacity-15 animate-float" style={{ animationDelay: "2s" }}>🎁</div>
            <div className="absolute bottom-32 right-[10%] text-4xl opacity-15 animate-float" style={{ animationDelay: "0.5s" }}>🎉</div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 md:py-32 text-center relative">
            <div className="inline-flex items-center gap-2 bg-party-purple/10 dark:bg-party-yellow/10 text-party-purple dark:text-party-yellow text-sm font-bold px-4 py-2 rounded-full mb-6 animate-fade-in-up">
              <span>★</span>
              {t("home.trustedBy")}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              {t("home.heroTitle")}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              {t("home.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center gap-2 bg-party-purple hover:bg-party-purple-dark text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-party-purple/25 hover:shadow-xl hover:shadow-party-purple/30 transition-all hover:scale-105 active:scale-[0.98]"
              >
                🎈 {t("common.startPlanning")}
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-full text-lg font-bold hover:border-party-purple dark:hover:border-party-yellow hover:text-party-purple dark:hover:text-party-yellow transition-all"
              >
                {t("common.learnMore")} ↓
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-party-purple dark:text-party-yellow">5</div>
                <div className="text-xs sm:text-sm text-zinc-500">{t("home.statMinutes")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-party-purple dark:text-party-yellow">13+</div>
                <div className="text-xs sm:text-sm text-zinc-500">{t("home.statThemes")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-party-purple dark:text-party-yellow">7</div>
                <div className="text-xs sm:text-sm text-zinc-500">{t("home.statCategories")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-white dark:bg-zinc-900 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-sm font-bold text-party-purple dark:text-party-yellow uppercase tracking-wider">{t("home.featuresLabel")}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-900 dark:text-white">
                {t("home.features")}
              </h2>
              <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                {t("home.featuresSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 stagger-children">
              {FEATURES.map(({ key, icon, gradient }) => (
                <div
                  key={key}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-zinc-100 dark:border-zinc-700/50 hover:border-party-purple/30 dark:hover:border-party-yellow/30 transition-all card-hover group animate-fade-in-up`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
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
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-sm font-bold text-party-purple dark:text-party-yellow uppercase tracking-wider">{t("home.easyLabel")}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-900 dark:text-white">
                {t("home.howItWorks")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-party-purple/30 via-party-yellow/30 to-party-mint/30" aria-hidden="true" />

              {[1, 2, 3].map((step) => (
                <div key={step} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-party-purple to-party-purple-dark text-white flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg shadow-party-purple/25 relative z-10">
                    {step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">
                    {t(`home.step${step}`)}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(`home.step${step}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-24 bg-white dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-sm font-bold text-party-purple dark:text-party-yellow uppercase tracking-wider">{t("home.testimonialsLabel")}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-900 dark:text-white">
                {t("home.testimonialsTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ key, emoji }) => (
                <div
                  key={key}
                  className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-700 card-hover"
                >
                  <div className="flex gap-1 mb-3 text-party-yellow text-sm">
                    ★★★★★
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 italic">
                    &ldquo;{t(`home.${key}Text`)}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-lg">
                      {emoji}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{t(`home.${key}Name`)}</p>
                      <p className="text-xs text-zinc-500">{t(`home.${key}Role`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-party-purple via-party-purple-dark to-party-purple dark:from-party-purple-dark dark:to-party-purple text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
            <div className="absolute top-10 left-[5%] text-6xl">🎈</div>
            <div className="absolute bottom-10 right-[5%] text-6xl">🎉</div>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              {t("home.ctaTitle")}
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              {t("home.ctaSubtitle")}
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 bg-party-yellow text-zinc-900 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-[0.98]"
            >
              🚀 {t("common.startPlanning")}
            </Link>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-party-purple dark:text-party-yellow uppercase tracking-wider">{t("home.pricingLabel")}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-zinc-900 dark:text-white">
                {t("pricing.title")}
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="relative bg-white dark:bg-zinc-800 rounded-3xl p-7 sm:p-8 border-2 border-zinc-200 dark:border-zinc-700 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-xl">🎉</div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {t("pricing.freePlanTitle")}
                  </h3>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-6">
                  {t("pricing.freePrice")}
                </p>
                <ul className="space-y-3 mb-8">
                  {["plans3", "basicThemes", "guestList", "shoppingList"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-party-mint/20 text-party-mint flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                      {t(`pricing.features.${feat}` as Parameters<typeof t>[0])}
                    </li>
                  ))}
                  {["customRecipes", "invitationStyles", "exportPdf", "share"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-zinc-400 line-through">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-xs shrink-0">✕</span>
                      {t(`pricing.features.${feat}` as Parameters<typeof t>[0])}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className="block text-center w-full py-3.5 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-bold text-sm hover:border-party-purple hover:text-party-purple dark:hover:border-party-yellow dark:hover:text-party-yellow transition-all"
                >
                  {t("pricing.getStarted")}
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative bg-gradient-to-br from-party-purple/5 to-party-yellow/5 dark:from-party-purple/20 dark:to-party-yellow/10 rounded-3xl p-7 sm:p-8 border-2 border-party-purple shadow-xl shadow-party-purple/10 card-hover">
                <span className="absolute -top-3.5 right-6 bg-party-yellow text-zinc-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  ⭐ {t("pricing.popular")}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-xl">👑</div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {t("pricing.proPlanTitle")}
                  </h3>
                </div>
                <p className="text-3xl font-extrabold text-party-purple dark:text-party-yellow mb-6">
                  {t("pricing.proPrice")}
                </p>
                <ul className="space-y-3 mb-8">
                  {["plans50", "allThemes", "guestList", "shoppingList", "customRecipes", "invitationStyles", "exportPdf", "share", "support"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="w-5 h-5 rounded-full bg-party-purple/20 dark:bg-party-yellow/20 text-party-purple dark:text-party-yellow flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                      {t(`pricing.features.${feat}` as Parameters<typeof t>[0])}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className="block text-center w-full py-3.5 rounded-xl bg-party-purple hover:bg-party-purple-dark text-white font-bold text-sm shadow-lg shadow-party-purple/25 transition-all active:scale-[0.98]"
                >
                  {t("pricing.goPro")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
