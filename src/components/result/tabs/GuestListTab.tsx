"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { GuestEntry, RsvpStatus, ParentRole } from "@/types";

interface GuestListTabProps {
  guests: GuestEntry[];
  onUpdateGuests: (guests: GuestEntry[]) => void;
  locale: "de" | "en";
}

const RSVP_CONFIG: Record<RsvpStatus, { icon: string; colorClass: string }> = {
  accepted: { icon: "✅", colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  declined: { icon: "❌", colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  pending: { icon: "⏳", colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
};

const ROLE_CONFIG: Record<ParentRole, { icon: string }> = {
  host: { icon: "👑" },
  cohost: { icon: "🤝" },
  guest: { icon: "🎈" },
};

export function GuestListTab({ guests, onUpdateGuests, locale }: GuestListTabProps) {
  const t = useTranslations("result");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newGuest, setNewGuest] = useState<Omit<GuestEntry, "id">>({
    childName: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    rsvpStatus: "pending",
    allergens: "",
    role: "guest",
    notes: "",
  });

  const addGuest = useCallback(() => {
    if (!newGuest.childName.trim()) return;
    const entry: GuestEntry = {
      ...newGuest,
      id: crypto.randomUUID(),
    };
    onUpdateGuests([...guests, entry]);
    setNewGuest({
      childName: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      rsvpStatus: "pending",
      allergens: "",
      role: "guest",
      notes: "",
    });
    setShowAddForm(false);
  }, [newGuest, guests, onUpdateGuests]);

  const updateGuest = useCallback((id: string, updates: Partial<GuestEntry>) => {
    onUpdateGuests(guests.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, [guests, onUpdateGuests]);

  const removeGuest = useCallback((id: string) => {
    onUpdateGuests(guests.filter((g) => g.id !== id));
  }, [guests, onUpdateGuests]);

  const cycleRsvp = useCallback((id: string, current: RsvpStatus) => {
    const order: RsvpStatus[] = ["pending", "accepted", "declined"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateGuest(id, { rsvpStatus: next });
  }, [updateGuest]);

  const accepted = guests.filter((g) => g.rsvpStatus === "accepted").length;
  const declined = guests.filter((g) => g.rsvpStatus === "declined").length;
  const pending = guests.filter((g) => g.rsvpStatus === "pending").length;

  return (
    <div>
      {/* Summary Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {locale === "de" ? "Gesamt" : "Total"}: {guests.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
          ✅ {accepted} {t("rsvpAccepted")}
        </div>
        <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          ❌ {declined} {t("rsvpDeclined")}
        </div>
        <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
          ⏳ {pending} {t("rsvpPending")}
        </div>
      </div>

      {/* Guest List */}
      <div className="space-y-3">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3">
              {/* RSVP Status Toggle */}
              <button
                onClick={() => cycleRsvp(guest.id, guest.rsvpStatus)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${RSVP_CONFIG[guest.rsvpStatus].colorClass}`}
                title={t(`rsvp${guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}` as Parameters<typeof t>[0])}
              >
                {RSVP_CONFIG[guest.rsvpStatus].icon}
              </button>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {guest.childName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
                    {ROLE_CONFIG[guest.role].icon} {t(`role${guest.role.charAt(0).toUpperCase() + guest.role.slice(1)}` as Parameters<typeof t>[0])}
                  </span>
                </div>
                {guest.parentName && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {guest.parentName}
                    {guest.parentPhone ? ` - ${guest.parentPhone}` : ""}
                  </p>
                )}
                {guest.allergens && (
                  <p className="text-xs text-party-coral mt-0.5">
                    ⚠️ {guest.allergens}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingId(editingId === guest.id ? null : guest.id)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-party-purple"
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeGuest(guest.id)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-party-coral"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Expanded Edit Form */}
            {editingId === guest.id && (
              <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-700 space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("guestName")}</label>
                    <input
                      type="text"
                      value={guest.childName}
                      onChange={(e) => updateGuest(guest.id, { childName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("parentName")}</label>
                    <input
                      type="text"
                      value={guest.parentName}
                      onChange={(e) => updateGuest(guest.id, { parentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("parentEmail")}</label>
                    <input
                      type="email"
                      value={guest.parentEmail}
                      onChange={(e) => updateGuest(guest.id, { parentEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("parentPhone")}</label>
                    <input
                      type="tel"
                      value={guest.parentPhone}
                      onChange={(e) => updateGuest(guest.id, { parentPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("allergens")}</label>
                    <input
                      type="text"
                      value={guest.allergens}
                      onChange={(e) => updateGuest(guest.id, { allergens: e.target.value })}
                      placeholder={locale === "de" ? "z.B. Nussallergie, Laktose" : "e.g. nut allergy, lactose"}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">{t("role")}</label>
                    <select
                      value={guest.role}
                      onChange={(e) => updateGuest(guest.id, { role: e.target.value as ParentRole })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
                    >
                      <option value="guest">{t("roleGuest")}</option>
                      <option value="cohost">{t("roleCoHost")}</option>
                      <option value="host">{t("roleHost")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    {locale === "de" ? "Notizen" : "Notes"}
                  </label>
                  <textarea
                    value={guest.notes}
                    onChange={(e) => updateGuest(guest.id, { notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Guest Form */}
      {showAddForm ? (
        <div className="mt-4 p-4 border-2 border-dashed border-party-purple/30 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {locale === "de" ? "Neuen Gast hinzufügen" : "Add new guest"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newGuest.childName}
              onChange={(e) => setNewGuest((p) => ({ ...p, childName: e.target.value }))}
              placeholder={t("guestName")}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
            />
            <input
              type="text"
              value={newGuest.parentName}
              onChange={(e) => setNewGuest((p) => ({ ...p, parentName: e.target.value }))}
              placeholder={t("parentName")}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
            />
            <input
              type="email"
              value={newGuest.parentEmail}
              onChange={(e) => setNewGuest((p) => ({ ...p, parentEmail: e.target.value }))}
              placeholder={t("parentEmail")}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
            />
            <input
              type="tel"
              value={newGuest.parentPhone}
              onChange={(e) => setNewGuest((p) => ({ ...p, parentPhone: e.target.value }))}
              placeholder={t("parentPhone")}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
            />
          </div>
          <input
            type="text"
            value={newGuest.allergens}
            onChange={(e) => setNewGuest((p) => ({ ...p, allergens: e.target.value }))}
            placeholder={locale === "de" ? "Allergien (optional)" : "Allergies (optional)"}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={addGuest}
              className="px-4 py-2 bg-party-purple text-white rounded-lg text-sm font-medium hover:bg-party-purple-dark transition-colors"
            >
              ✓ {locale === "de" ? "Hinzufügen" : "Add"}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors"
            >
              {locale === "de" ? "Abbrechen" : "Cancel"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl text-sm text-zinc-500 hover:border-party-purple hover:text-party-purple transition-colors"
        >
          + {locale === "de" ? "Gast hinzufügen" : "Add guest"}
        </button>
      )}
    </div>
  );
}
