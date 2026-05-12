"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";

export function Header() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" aria-hidden="true">🎈</span>
          <span className="text-lg font-bold text-party-purple dark:text-party-yellow group-hover:opacity-80 transition-opacity">
            {t("common.appName")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/wizard"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-party-purple dark:hover:text-party-yellow transition-colors"
          >
            {t("nav.wizard")}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-party-purple/10"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4">
          <Link
            href="/wizard"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-party-purple"
          >
            {t("nav.wizard")}
          </Link>
          <LanguageSwitcher />
        </nav>
      )}
    </header>
  );
}
