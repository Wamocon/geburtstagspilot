"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface ProRequest {
  id: string;
  email: string;
  message: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

function AdminDashboardContent() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState({ users: 0, plans: 0, proUsers: 0, pendingRequests: 0 });
  const [recentRequests, setRecentRequests] = useState<ProRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createSupabaseBrowser();

      const [usersRes, plansRes, proRes, pendingRes, requestsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("saved_plans").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("tier", "pro"),
        supabase.from("pro_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("pro_requests").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        users: usersRes.count || 0,
        plans: plansRes.count || 0,
        proUsers: proRes.count || 0,
        pendingRequests: pendingRes.count || 0,
      });
      setRecentRequests((requestsRes.data as ProRequest[]) || []);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              ⚙️ {t("title")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {t("subtitle")}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("totalUsers")}</p>
              <p className="text-3xl font-bold text-party-purple mt-1">
                {loading ? "..." : stats.users}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("totalPlans")}</p>
              <p className="text-3xl font-bold text-party-purple mt-1">
                {loading ? "..." : stats.plans}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("proUsers")}</p>
              <p className="text-3xl font-bold text-party-yellow mt-1">
                {loading ? "..." : stats.proUsers}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 relative">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{t("pendingRequests")}</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">
                {loading ? "..." : stats.pendingRequests}
              </p>
              {stats.pendingRequests > 0 && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              {t("quickActions")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 hover:border-party-purple/30 transition-all group"
              >
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-party-purple transition-colors text-sm">
                  {t("manageUsers")}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t("manageUsersDesc")}
                </p>
              </Link>
              <Link
                href="/admin/plans"
                className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 hover:border-party-purple/30 transition-all group"
              >
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-party-purple transition-colors text-sm">
                  {t("viewPlans")}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t("viewPlansDesc")}
                </p>
              </Link>
              <Link
                href="/admin/requests"
                className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border border-zinc-100 dark:border-zinc-700 hover:border-orange-300/30 transition-all group relative"
              >
                <div className="text-2xl mb-2">📨</div>
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors text-sm">
                  {t("proRequests")}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t("proRequestsDesc")}
                </p>
                {stats.pendingRequests > 0 && (
                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {stats.pendingRequests}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Recent Pro Requests */}
          {recentRequests.length > 0 && (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-zinc-100 dark:border-zinc-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                <h2 className="font-bold text-zinc-900 dark:text-white text-sm">
                  {t("recentActivity")}
                </h2>
                <Link href="/admin/requests" className="text-xs text-party-purple hover:underline">
                  {t("proRequests")} →
                </Link>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {recentRequests.map((req) => (
                  <div key={req.id} className="px-5 py-3 flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      req.status === "pending" ? "bg-orange-500" :
                      req.status === "approved" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900 dark:text-white truncate">
                        {req.email}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      req.status === "pending"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        : req.status === "approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}>
                      {req.status === "pending" ? t("statusPending") : req.status === "approved" ? t("statusApproved") : t("statusRejected")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AdminPage() {
  return <AdminDashboardContent />;
}
