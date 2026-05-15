"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Profile } from "@/types";

interface PlanRow {
  id: string;
  title: string;
  wizard_data: { themeSlug?: string; age?: number; guestCount?: number };
  is_shared: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

function AdminPlansContent() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createSupabaseBrowser();
        const { data: usersData } = await supabase
          .from("profiles")
          .select("*")
          .order("email", { ascending: true });
        setUsers((usersData as Profile[]) || []);

        const { data: plansData } = await supabase
          .from("saved_plans")
          .select("id, title, wizard_data, is_shared, created_at, updated_at, user_id")
          .order("created_at", { ascending: false });
        setPlans((plansData as PlanRow[]) || []);
      } catch {
        // Supabase unreachable
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPlans = selectedUser === "all"
    ? plans
    : plans.filter((p) => p.user_id === selectedUser);

  const getUserEmail = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || user?.display_name || userId.slice(0, 8);
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin"
              className="text-sm text-zinc-500 hover:text-party-purple transition-colors"
            >
              ← {t("backToAdmin")}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            📋 {t("viewPlans")}
          </h1>

          {/* Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mr-3">
              {t("filterByUser")}:
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm text-zinc-900 dark:text-white"
            >
              <option value="all">{t("allUsers")} ({plans.length})</option>
              {users.map((u) => {
                const count = plans.filter((p) => p.user_id === u.id).length;
                if (count === 0) return null;
                return (
                  <option key={u.id} value={u.id}>
                    {u.display_name || u.email} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Plans Table */}
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">{t("noPlans")}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-700/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("planTitle")}
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("userEmail")}
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("planShared")}
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">
                        {t("planCreated")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {plan.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {plan.wizard_data?.themeSlug || "-"} | {plan.wizard_data?.age || "?"} J. | {plan.wizard_data?.guestCount || "?"} Gäste
                          </p>
                        </td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {getUserEmail(plan.user_id)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {plan.is_shared ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-zinc-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-500 text-xs">
                          {new Date(plan.created_at).toLocaleDateString()}
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

export default function AdminPlansPage() {
  return <AdminPlansContent />;
}
