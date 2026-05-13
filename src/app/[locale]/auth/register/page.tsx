import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return <RegisterPageContent />;
}

function RegisterPageContent() {
  const t = useTranslations("auth");

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 rounded-2xl bg-party-purple/10 dark:bg-party-yellow/10 flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {t("registerTitle")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {t("registerSubtitle")}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-zinc-100 dark:border-zinc-700">
            <RegisterForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
