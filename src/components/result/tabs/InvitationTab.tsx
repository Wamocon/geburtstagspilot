"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { InvitationTemplate, Theme, WizardData, GuestEntry, InvitationStyle } from "@/types";

interface InvitationTabProps {
  invitation: InvitationTemplate | null;
  theme: Theme;
  wizard: WizardData;
  guests: GuestEntry[];
  locale: "de" | "en";
}

const INVITATION_STYLES: { key: InvitationStyle; label_de: string; label_en: string; bgPattern: string }[] = [
  { key: "classic", label_de: "Klassisch", label_en: "Classic", bgPattern: "" },
  { key: "modern", label_de: "Modern", label_en: "Modern", bgPattern: "bg-gradient-to-br from-party-purple/10 to-party-yellow/10" },
  { key: "playful", label_de: "Verspielt", label_en: "Playful", bgPattern: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20" },
  { key: "elegant", label_de: "Elegant", label_en: "Elegant", bgPattern: "bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-zinc-900" },
];

const BG_IMAGES = [
  { key: "none", label: "🚫", url: "" },
  { key: "balloons", label: "🎈", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" },
  { key: "confetti", label: "🎊", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80" },
  { key: "cake", label: "🎂", url: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80" },
  { key: "stars", label: "⭐", url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80" },
];

export function InvitationTab({ invitation, theme, wizard, guests, locale }: InvitationTabProps) {
  const t = useTranslations("result");
  const invRef = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState({
    childName: "",
    birthdayChild: wizard.birthdayChildName || "",
    date: "",
    time: "14:00",
    address: "",
    rsvpDate: "",
    bringNote: "",
  });

  const [selectedStyle, setSelectedStyle] = useState<InvitationStyle>("classic");
  const [selectedBg, setSelectedBg] = useState("");
  const [customText, setCustomText] = useState("");
  const [editingText, setEditingText] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string>("");

  const updateField = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  // When a guest is selected from the list, populate the child name
  const handleGuestSelect = useCallback((guestId: string) => {
    setSelectedGuest(guestId);
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      setFields((prev) => ({ ...prev, childName: guest.childName }));
    }
  }, [guests]);

  if (!invitation) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
        {locale === "de" ? "Keine Einladungsvorlage verfügbar." : "No invitation template available."}
      </p>
    );
  }

  const template = customText || (locale === "de" ? invitation.template_text_de : invitation.template_text_en);
  // Replace escaped newlines from DB with actual newlines
  const normalizedTemplate = template.replace(/\\n/g, "\n");
  const rendered = normalizedTemplate
    .replace(/\{\{childName\}\}/g, fields.childName || "...")
    .replace(/\{\{birthdayChild\}\}/g, fields.birthdayChild || "...")
    .replace(/\{\{age\}\}/g, String(wizard.age))
    .replace(/\{\{date\}\}/g, fields.date || "...")
    .replace(/\{\{time\}\}/g, fields.time || "...")
    .replace(/\{\{address\}\}/g, fields.address || "...")
    .replace(/\{\{rsvpDate\}\}/g, fields.rsvpDate || "...")
    .replace(/\{\{bringNote\}\}/g, fields.bringNote ? `${locale === "de" ? "Bitte mitbringen" : "Please bring"}: ${fields.bringNote}` : "");

  const fieldEntries = [
    { key: "birthdayChild", type: "text" },
    { key: "childName", type: "text" },
    { key: "date", type: "date" },
    { key: "time", type: "time" },
    { key: "address", type: "text" },
    { key: "rsvpDate", type: "date" },
    { key: "bringNote", type: "text" },
  ] as const;

  const styleConfig = INVITATION_STYLES.find((s) => s.key === selectedStyle);

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          🎨 {t("invitationStyle")}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {INVITATION_STYLES.map((style) => (
            <button
              key={style.key}
              onClick={() => setSelectedStyle(style.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStyle === style.key
                  ? "bg-party-purple text-white shadow-md"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {locale === "de" ? style.label_de : style.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Background Image Selector */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          🖼️ {t("invitationBackground")}
        </h3>
        <div className="flex gap-2">
          {BG_IMAGES.map((bg) => (
            <button
              key={bg.key}
              onClick={() => setSelectedBg(bg.url)}
              className={`w-12 h-12 rounded-lg text-xl flex items-center justify-center transition-all ${
                selectedBg === bg.url
                  ? "ring-2 ring-party-purple scale-110"
                  : "bg-zinc-100 dark:bg-zinc-700 hover:scale-105"
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
            ✏️ {locale === "de" ? "Einladung ausfüllen" : "Fill in invitation"}
          </h3>

          {/* Guest selector from list */}
          {guests.length > 0 && (
            <div className="mb-4 p-3 bg-party-purple/5 dark:bg-party-purple/10 rounded-lg">
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                {locale === "de" ? "Gast aus Liste wählen" : "Select guest from list"}
              </label>
              <select
                value={selectedGuest}
                onChange={(e) => handleGuestSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm"
              >
                <option value="">{locale === "de" ? "Gast auswählen..." : "Select guest..."}</option>
                {guests.filter((g) => g.rsvpStatus !== "declined").map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.childName} {guest.rsvpStatus === "accepted" ? "✅" : "⏳"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-3">
            {fieldEntries.map(({ key, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t(`invitationFields.${key}` as Parameters<typeof t>[0])}
                </label>
                <input
                  type={type}
                  value={fields[key as keyof typeof fields]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple focus:border-transparent"
                  placeholder={t(`invitationFields.${key}` as Parameters<typeof t>[0])}
                />
              </div>
            ))}
          </div>

          {/* Custom Text Editor */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t("editInvitation")}
              </label>
              <button
                onClick={() => {
                  if (!editingText) {
                    setCustomText(locale === "de" ? invitation.template_text_de : invitation.template_text_en);
                  }
                  setEditingText(!editingText);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-party-purple/10 text-party-purple hover:bg-party-purple/20 transition-colors"
              >
                {editingText ? (locale === "de" ? "Fertig" : "Done") : "✏️"}
              </button>
            </div>
            {editingText && (
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm font-mono resize-none focus:ring-2 focus:ring-party-purple focus:border-transparent"
                placeholder={locale === "de" ? "Verwende {{childName}}, {{birthdayChild}}, {{age}}, {{date}}, {{time}}, {{address}}, {{rsvpDate}}, {{bringNote}} als Platzhalter" : "Use {{childName}}, {{birthdayChild}}, {{age}}, {{date}}, {{time}}, {{address}}, {{rsvpDate}}, {{bringNote}} as placeholders"}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
            👁️ {locale === "de" ? "Vorschau" : "Preview"}
          </h3>
          <div
            ref={invRef}
            className={`relative p-8 rounded-2xl border-4 border-dashed text-center overflow-hidden ${styleConfig?.bgPattern || ""}`}
            style={{
              backgroundColor: selectedBg ? "transparent" : invitation.bg_color,
              borderColor: invitation.accent_color,
              color: "#1a1a1a",
            }}
          >
            {/* Background Image */}
            {selectedBg && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${selectedBg})` }}
              />
            )}

            <div className="relative z-10">
              <div className="text-4xl mb-4">{invitation.emoji}</div>
              <div className="whitespace-pre-line text-sm leading-relaxed font-medium">
                {rendered}
              </div>
              <div className="mt-4 text-4xl">{theme.emoji}</div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={async () => {
                if (!invRef.current) return;
                try {
                  // Use canvas-based export for the invitation card
                  const el = invRef.current;
                  const canvas = document.createElement("canvas");
                  const scale = 2; // retina quality
                  canvas.width = el.offsetWidth * scale;
                  canvas.height = el.offsetHeight * scale;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;

                  // Draw background
                  ctx.scale(scale, scale);
                  ctx.fillStyle = invitation.bg_color;
                  ctx.fillRect(0, 0, el.offsetWidth, el.offsetHeight);

                  // Draw border
                  ctx.strokeStyle = invitation.accent_color;
                  ctx.lineWidth = 4;
                  ctx.setLineDash([12, 8]);
                  ctx.strokeRect(8, 8, el.offsetWidth - 16, el.offsetHeight - 16);

                  // Draw text content
                  ctx.setLineDash([]);
                  ctx.fillStyle = "#1a1a1a";
                  ctx.textAlign = "center";
                  const centerX = el.offsetWidth / 2;

                  // Emoji top
                  ctx.font = "32px serif";
                  ctx.fillText(invitation.emoji, centerX, 60);

                  // Invitation text
                  ctx.font = "14px sans-serif";
                  const lines = rendered.split("\n");
                  let y = 100;
                  for (const line of lines) {
                    ctx.fillText(line.trim(), centerX, y);
                    y += 22;
                  }

                  // Theme emoji
                  ctx.font = "32px serif";
                  ctx.fillText(theme.emoji, centerX, y + 20);

                  // Download
                  const link = document.createElement("a");
                  link.download = `einladung-${wizard.birthdayChildName || "party"}.png`;
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                } catch (err) {
                  console.error("Export failed:", err);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-party-purple text-white rounded-lg text-sm font-medium hover:bg-party-purple-dark transition-colors"
            >
              📷 PNG
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(rendered);
                window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </button>
          </div>

          {/* Bulk send info */}
          {guests.filter((g) => g.rsvpStatus !== "declined").length > 0 && (
            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                💡 {locale === "de"
                  ? `${guests.filter((g) => g.rsvpStatus !== "declined").length} Gäste warten auf eine Einladung. Wähle oben einen Gast aus, um die Einladung zu personalisieren.`
                  : `${guests.filter((g) => g.rsvpStatus !== "declined").length} guests are waiting for an invitation. Select a guest above to personalize the invitation.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
