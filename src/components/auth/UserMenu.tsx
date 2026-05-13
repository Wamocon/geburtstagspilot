"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export function UserMenu() {
  const t = useTranslations("auth");
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-party-purple dark:hover:text-party-yellow transition-colors"
      >
        {t("login")}
      </Link>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-party-purple/10 hover:bg-party-purple/20 transition-colors"
        aria-label={t("userMenu")}
      >
        <div className="w-7 h-7 rounded-full bg-party-purple text-white flex items-center justify-center text-xs font-bold">
          {initial}
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block max-w-[100px] truncate">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-party-purple/10 text-party-purple font-medium uppercase">
              {profile?.tier || "free"}
            </span>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <span>📋</span> {t("myPlans")}
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
            >
              <span>⚙️</span> {t("adminDashboard")}
            </Link>
          )}

          <div className="border-t border-zinc-100 dark:border-zinc-700 mt-1 pt-1">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span>🚪</span> {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
