"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import type { WizardData, Theme, Game, ScheduleItem } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiChatPanelProps {
  wizard: WizardData;
  theme: Theme | null;
  schedule: ScheduleItem[];
  games: Game[];
}

export function AiChatPanel({ wizard, theme, schedule, games }: AiChatPanelProps) {
  const t = useTranslations("ai");
  const locale = useLocale() as "de" | "en";
  const { hasAccess } = useFeatureGate("ai_chat");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          planContext: { wizard, theme, schedule, games },
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error === "PRO_REQUIRED"
          ? t("proRequired")
          : errorData.error === "AI_NOT_CONFIGURED"
            ? t("aiNotConfigured")
            : t("chatError");

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorMsg } : m
          )
        );
        setStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.error) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: parsed.error ?? "" } : m
                )
              );
            } else if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.text }
                    : m
                )
              );
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: t("chatError") } : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, locale, wizard, theme, schedule, games, messages, t]);

  // Floating button if not Pro
  if (!hasAccess) {
    return (
      <button
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("show-upgrade-modal", { detail: { feature: "ai_chat" } })
          );
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-party-purple text-white shadow-xl shadow-party-purple/25 hover:bg-party-purple-dark transition-all no-print"
        title={t("chatTitle")}
      >
        <span className="text-lg">💬</span>
        <span className="text-sm font-semibold hidden sm:inline">{t("chatTitle")}</span>
        <span className="text-[10px] uppercase font-bold bg-white/20 px-1.5 py-0.5 rounded">Pro</span>
      </button>
    );
  }

  // Floating button (Pro user)
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-party-purple text-white shadow-xl shadow-party-purple/25 hover:bg-party-purple-dark transition-all no-print"
        title={t("chatTitle")}
      >
        <span className="text-lg">💬</span>
        <span className="text-sm font-semibold hidden sm:inline">{t("chatTitle")}</span>
      </button>
    );
  }

  // Chat panel
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col overflow-hidden no-print" style={{ height: "500px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-party-purple text-white">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-bold text-sm">{t("chatTitle")}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/70 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("chatWelcome")}
            </p>
            <div className="mt-4 space-y-2">
              {[t("suggestion1"), t("suggestion2"), t("suggestion3")].map(
                (suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => sendMessage(), 0);
                    }}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:bg-party-purple/5 dark:hover:bg-party-purple/10 transition-colors"
                  >
                    &quot;{suggestion}&quot;
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-party-purple text-white rounded-br-md"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content || "..."}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={t("chatPlaceholder")}
            disabled={streaming}
            className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm focus:ring-2 focus:ring-party-purple/30 focus:border-party-purple transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="px-3 py-2 rounded-xl bg-party-purple text-white text-sm font-bold hover:bg-party-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {streaming ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}
