"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { createSupabaseBrowser, isSupabaseReady } from "@/lib/supabase-browser";

export function LoginForm({ redirect }: { redirect?: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isSupabaseReady()) {
      setError("Service is temporarily unavailable. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(t("loginError"));
        setLoading(false);
        return;
      }

      router.push(redirect || "/dashboard");
      router.refresh();
    } catch {
      setError(t("loginError"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent transition-all"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent transition-all"
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-party-purple hover:bg-party-purple-dark text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-party-purple/25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("loggingIn") : t("login")}
      </button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("noAccount")}{" "}
        <Link href="/auth/register" className="text-party-purple hover:underline font-medium">
          {t("registerNow")}
        </Link>
      </p>
    </form>
  );
}
