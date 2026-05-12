"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 no-print">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎈</span>
              <span className="font-bold text-party-purple dark:text-party-yellow">
                {t("common.appName")}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("common.tagline")}
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-zinc-700 dark:text-zinc-300">
              {locale === "de" ? "Rechtliches" : "Legal"}
            </h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="font-semibold text-sm mb-3 text-zinc-700 dark:text-zinc-300">
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

        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
          &copy; {year} WAMOCON GmbH. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
