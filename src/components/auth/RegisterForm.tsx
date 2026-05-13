"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    if (signUpError) {
      setError(t("registerError"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {t("displayName")}
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent transition-all"
          placeholder={t("displayNamePlaceholder")}
        />
      </div>

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
          autoComplete="new-password"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent transition-all"
          placeholder={t("passwordPlaceholder")}
        />
        <p className="mt-1 text-xs text-zinc-400">{t("passwordHint")}</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-party-purple hover:bg-party-purple-dark text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-party-purple/25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("registering") : t("register")}
      </button>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("hasAccount")}{" "}
        <Link href="/auth/login" className="text-party-purple hover:underline font-medium">
          {t("loginNow")}
        </Link>
      </p>
    </form>
  );
}
