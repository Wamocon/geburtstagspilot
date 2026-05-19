import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "@/app/globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Geburtstagspilot - Kindergeburtstag planen in 5 Minuten",
    template: "%s | Geburtstagspilot",
  },
  description:
    "Plane den perfekten Kindergeburtstag in 5 Minuten. Zeitablauf, Spiele, Rezepte, Einkaufsliste und Einladung - alles aus einem Wizard. Kostenlos starten!",
  keywords: [
    "Kindergeburtstag planen",
    "Kindergeburtstag Spiele",
    "Kindergeburtstag Ideen",
    "Kindergeburtstag Essen",
    "Kindergeburtstag Einladung",
    "Partyplanung Kinder",
    "Geburtstagspilot",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Geburtstagspilot - Kindergeburtstag planen in 5 Minuten",
    description: "Alter, Gaestezahl, Motto waehlen - fertig! Kompletter Partyplan mit Zeitablauf, Spielen, Rezepten und Einkaufsliste.",
    type: "website",
    locale: "de_DE",
    siteName: "Geburtstagspilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geburtstagspilot - Kindergeburtstag planen in 5 Minuten",
    description: "Kompletter Partyplan in 5 Minuten. Kostenlos starten!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#FFFDF7] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-[family-name:var(--font-nunito)]">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
        }} />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <UpgradeModal />
            {children}
            <ScrollToTop />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
