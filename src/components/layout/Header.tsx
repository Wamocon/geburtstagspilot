"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useState, useEffect, useCallback } from "react";

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
            className="relative z-50 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/* Menu Panel */}
          <nav className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden bg-white dark:bg-zinc-900 overflow-y-auto animate-slide-down">
            <div className="px-5 py-6 space-y-2">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                    isActive(href)
                      ? "text-party-purple dark:text-party-yellow bg-party-purple/10 dark:bg-party-yellow/10"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 dark:active:bg-zinc-700"
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  {label}
                </Link>
              ))}

              <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-4" />

              {/* CTA in mobile menu */}
              <Link
                href="/wizard"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-base font-bold bg-party-purple text-white shadow-lg shadow-party-purple/25 active:scale-[0.98] transition-all"
              >
                🎈 {t("common.startPlanning")}
              </Link>

              <div className="h-px bg-zinc-200 dark:bg-zinc-700 my-4" />

              <div className="flex items-center justify-between px-2 py-2">
                <UserMenu />
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
