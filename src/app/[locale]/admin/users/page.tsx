"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Profile, UserRole, UserTier } from "@/types";

function UserManagementContent() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers((data as Profile[]) || []);
      setLoading(false);
    }
    loadUsers();
  }, []);

  async function updateUser(userId: string, updates: { role?: UserRole; tier?: UserTier }) {
    setUpdating(userId);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
    }
    setUpdating(null);
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="text-sm text-zinc-500 hover:text-party-purple transition-colors"
            >
              ← {t("backToAdmin")}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            👥 {t("manageUsers")}
          </h1>

          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-zinc-500">{t("noUsers")}</p>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-700/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userName")}
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userEmail")}
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userRole")}
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userTier")}
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userPlans")}
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userActions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {user.display_name || "-"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={user.role}
                            onChange={(e) => updateUser(user.id, { role: e.target.value as UserRole })}
                            disabled={updating === user.id}
                            className="text-xs px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 disabled:opacity-50"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={user.tier}
                            onChange={(e) => updateUser(user.id, { tier: e.target.value as UserTier })}
                            disabled={updating === user.id}
                            className="text-xs px-2 py-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 disabled:opacity-50"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-400">
                          {user.plan_count}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs text-zinc-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function UsersPage() {
  return <UserManagementContent />;
}
