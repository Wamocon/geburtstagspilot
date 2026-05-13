"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useState, useEffect } from "react";

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/wizard" as const, label: t("nav.wizard"), icon: "🎈" },
    { href: "/dashboard" as const, label: t("auth.myPlans"), icon: "📋" },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header
      className={`sticky top-0 z-50 no-print transition-all duration-200 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-900/95 shadow-md shadow-black/5 dark:shadow-black/20"
          : "bg-white/80 dark:bg-zinc-900/80"
      } backdrop-blur-lg border-b border-zinc-200/80 dark:border-zinc-800/80`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="text-2xl group-hover:animate-bounce transition-transform" aria-hidden="true">🎈</span>
          <span className="text-lg font-extrabold bg-gradient-to-r from-party-purple to-party-pink bg-clip-text text-transparent dark:from-party-yellow dark:to-party-coral">
            {t("common.appName")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive(href)
                  ? "text-party-purple dark:text-party-yellow bg-party-purple/10 dark:bg-party-yellow/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-party-purple dark:hover:text-party-yellow hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="mr-1.5">{icon}</span>
              {label}
            </Link>
          ))}
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />
          <UserMenu />
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Menu"
            aria-expanded={menuOpen}
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
        <nav className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(href)
                    ? "text-party-purple dark:text-party-yellow bg-party-purple/10 dark:bg-party-yellow/10"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            ))}
            <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-2" />
            <div className="flex items-center justify-between px-4 py-2">
              <UserMenu />
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
