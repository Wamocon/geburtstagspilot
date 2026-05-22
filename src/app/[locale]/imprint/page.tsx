import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export default function ImprintPage() {
  const t = useTranslations("legal");

  const sections = [
    { id: "company", title: t("imprint.companyInfo") },
    { id: "contact", title: t("imprint.contact") },
    { id: "director", title: t("imprint.managingDirector") },
    { id: "registration", title: t("imprint.registration") },
    { id: "service", title: t("imprint.aboutService") },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <LegalPageLayout
          icon="📋"
          title={t("imprint.title")}
          subtitle={t("imprint.subtitle")}
          lastUpdated={t("lastUpdated")}
          sections={sections}
        >
          <div className="space-y-8">
            {/* Company Info */}
            <section id="company">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-lg">🏢</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("imprint.companyInfo")}</h2>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                <p className="font-bold text-zinc-900 dark:text-white text-base mb-1">{t("imprint.companyName")}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {t("imprint.address")}<br />
                  {t("imprint.zip")}<br />
                  {t("imprint.country")}
                </p>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* Contact */}
            <section id="contact">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-lg">📞</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("imprint.contact")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t("imprint.phone")}</p>
                  <a href="tel:+496196 5838311" className="text-sm font-semibold text-party-purple dark:text-party-yellow hover:underline">
                    {t("imprint.phoneNumber")}
                  </a>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-700/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-700/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t("imprint.emailLabel")}</p>
                  <a href="mailto:info@wamocon.com" className="text-sm font-semibold text-party-purple dark:text-party-yellow hover:underline">
                    {t("imprint.emailAddress")}
                  </a>
                </div>
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* Managing Director */}
            <section id="director">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-lg">👤</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("imprint.managingDirector")}</h2>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{t("imprint.directorName")}</p>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* Registration */}
            <section id="registration">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-lg">📑</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("imprint.registration")}</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: t("imprint.registeredOffice"), value: t("imprint.registeredOfficeValue") },
                  { label: t("imprint.commercialRegister"), value: t("imprint.commercialRegisterValue") },
                  { label: t("imprint.vatId"), value: t("imprint.vatIdValue") },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider sm:w-56 shrink-0">{label}</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-zinc-200 dark:border-zinc-700" />

            {/* About the Service */}
            <section id="service">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-party-pink/10 dark:bg-party-pink/10 flex items-center justify-center text-lg">🎈</div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("imprint.aboutService")}</h2>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t("imprint.aboutServiceText")}
              </p>
            </section>
          </div>
        </LegalPageLayout>
      </main>
      <Footer />
    </>
  );
}
