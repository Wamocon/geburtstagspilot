"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 no-print">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">🎈</span>
              <span className="font-extrabold bg-gradient-to-r from-party-purple to-party-pink bg-clip-text text-transparent dark:from-party-yellow dark:to-party-coral">
                {t("common.appName")}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t("common.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-zinc-800 dark:text-zinc-200">
              {locale === "de" ? "Schnellzugriff" : "Quick Links"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/wizard" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  🎈 {t("nav.wizard")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  📋 {t("auth.myPlans")}
                </Link>
              </li>
              <li>
                <Link href="/handbook" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  📖 {t("nav.handbook")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-zinc-800 dark:text-zinc-200">
              {locale === "de" ? "Rechtliches" : "Legal"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/imprint" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  {t("nav.imprint")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  {t("nav.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                  {t("nav.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Stamp */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-zinc-800 dark:text-zinc-200">
              {t("footer.company")}
            </h3>
            <address className="text-sm text-zinc-500 dark:text-zinc-400 not-italic leading-relaxed">
              WAMOCON GmbH<br />
              Mergenthalerallee 79 - 81<br />
              65760 Eschborn<br />
              Deutschland<br />
              <a href="mailto:info@wamocon.com" className="hover:text-party-purple dark:hover:text-party-yellow transition-colors">
                info@wamocon.com
              </a>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p>&copy; {year} WAMOCON GmbH. {t("footer.copyright")}</p>
          <p className="flex items-center gap-1.5">
            {t("footer.madeWith")} <span className="text-party-coral">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
