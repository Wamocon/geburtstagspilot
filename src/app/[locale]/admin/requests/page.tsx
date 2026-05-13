"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface ProRequest {
  id: string;
  user_id: string;
  email: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface UserInfo {
  id: string;
  email: string;
  display_name: string;
  tier: string;
  created_at: string;
}

function AdminRequestsContent() {
  const t = useTranslations("admin");
  const [requests, setRequests] = useState<ProRequest[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const supabase = createSupabaseBrowser();
      const [reqRes, usersRes] = await Promise.all([
        supabase.from("pro_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, email, display_name, tier, created_at"),
      ]);
      setRequests((reqRes.data as ProRequest[]) || []);
      setUsers((usersRes.data as UserInfo[]) || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredRequests = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const getUserInfo = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  async function handleApprove(requestId: string, userId: string) {
    if (!confirm(t("confirmApprove"))) return;
    setProcessing(requestId);
    const supabase = createSupabaseBrowser();

    // Update request status
    await supabase
      .from("pro_requests")
      .update({
        status: "approved",
        admin_notes: notes[requestId] || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    // Upgrade user to pro
    await supabase
      .from("profiles")
      .update({ tier: "pro", updated_at: new Date().toISOString() })
      .eq("id", userId);

    // Update local state
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "approved", admin_notes: notes[requestId] || null } : r)
    );
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, tier: "pro" } : u)
    );
    setProcessing(null);
  }

  async function handleReject(requestId: string) {
    if (!confirm(t("confirmReject"))) return;
    setProcessing(requestId);
    const supabase = createSupabaseBrowser();

    await supabase
      .from("pro_requests")
      .update({
        status: "rejected",
        admin_notes: notes[requestId] || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "rejected", admin_notes: notes[requestId] || null } : r)
    );
    setProcessing(null);
  }

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
            📨 {t("proRequests")}
          </h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === status
                    ? "bg-party-purple text-white"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                }`}
              >
                {status === "all" ? "Alle" : t(`status${status.charAt(0).toUpperCase() + status.slice(1)}` as Parameters<typeof t>[0])}
                {" "}({status === "all" ? requests.length : requests.filter((r) => r.status === status).length})
              </button>
            ))}
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-zinc-500 dark:text-zinc-400">{t("noRequests")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const userInfo = getUserInfo(req.user_id);
                return (
                  <div
                    key={req.id}
                    className={`bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-md border transition-all ${
                      req.status === "pending"
                        ? "border-orange-200 dark:border-orange-800"
                        : "border-zinc-100 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            req.status === "pending" ? "bg-orange-500" :
                            req.status === "approved" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">
                            {userInfo?.display_name || req.email}
                          </p>
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
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {req.email} | {t("userSince")}: {userInfo ? new Date(userInfo.created_at).toLocaleDateString() : "-"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {t("requestDate")}: {new Date(req.created_at).toLocaleString()}
                        </p>
                        {req.message && (
                          <div className="mt-2 p-2 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">{t("requestMessage")}:</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{req.message}</p>
                          </div>
                        )}
                        {/* Current tier info */}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            userInfo?.tier === "pro"
                              ? "bg-party-yellow/20 text-party-yellow-dark"
                              : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                          }`}>
                            {userInfo?.tier === "pro" ? "PRO" : "FREE"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {req.status === "pending" && (
                        <div className="flex flex-col gap-2 sm:w-48 shrink-0">
                          <textarea
                            placeholder={t("adminNotesPlaceholder")}
                            value={notes[req.id] || ""}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 resize-none"
                            rows={2}
                          />
                          <button
                            onClick={() => handleApprove(req.id, req.user_id)}
                            disabled={processing === req.id}
                            className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                          >
                            ✓ {t("approve")}
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            disabled={processing === req.id}
                            className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                          >
                            ✕ {t("reject")}
                          </button>
                        </div>
                      )}

                      {/* Admin notes for already processed */}
                      {req.status !== "pending" && req.admin_notes && (
                        <div className="sm:w-48 shrink-0">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">{t("adminNotes")}:</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-2">
                            {req.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AdminRequestsPage() {
  return <AdminRequestsContent />;
}
