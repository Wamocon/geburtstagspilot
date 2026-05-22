"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

interface LegalSection {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  icon: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: ReactNode;
}

export function LegalPageLayout({ icon, title, subtitle, lastUpdated, sections, children }: LegalPageLayoutProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-party-purple/5 via-party-cream to-party-yellow/10 dark:from-party-purple/20 dark:via-zinc-950 dark:to-party-yellow/5 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-party-purple/10 dark:bg-party-yellow/10 text-3xl mb-5">
            {icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            {subtitle}
          </p>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents Sidebar */}
          {sections.length > 0 && (
            <aside className="lg:w-56 shrink-0">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-xs font-bold text-party-purple dark:text-party-yellow uppercase tracking-wider mb-3">
                  {t("legal.tableOfContents")}
                </h2>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow py-1.5 px-3 rounded-lg hover:bg-party-purple/5 dark:hover:bg-party-yellow/5 transition-colors leading-snug"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-zinc-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-zinc-100 dark:border-zinc-700/50">
              {children}
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("legal.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
