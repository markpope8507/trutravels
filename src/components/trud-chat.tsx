"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { keywordSearch, type TrudFaq } from "@/lib/trud/knowledge";

// Ask Tru.D — the chat panel. Talks to /api/trud (NDJSON stream). Used inline
// on /support and inside the floating launcher on every other page.

type UiEvent =
  | { t: "handoff"; reason: string; summary: string }
  | { t: "waitlist"; trip: string; date: string; email: string }
  | { t: "departures"; trip: string; url: string };

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  events?: UiEvent[];
  fallback?: TrudFaq[];
  error?: string;
};

const SUGGESTIONS = [
  "Is everything included?",
  "Do I need travel insurance?",
  "Do many people travel solo?",
  "Can I pay a deposit?",
  "When does Thailand Island Hopper next depart?",
];

const WELCOME =
  "Hey, I'm Tru.D. Ask me anything about our trips: what's included, visas, money, who you'll travel with, dates. If it's about an existing booking I'll get a human on it.";

let nextId = 1;

export default function TrudChat({
  variant = "inline",
  onClose,
}: {
  variant?: "inline" | "panel";
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: nextId++, role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [toolNote, setToolNote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, toolNote]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const hasConversation = messages.length > 1;

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");

    const userMsg: ChatMessage = { id: nextId++, role: "user", content: question };
    const assistantId = nextId++;
    const history = [...messages.filter((m) => m.role === "user" || (m.role === "assistant" && !m.error)), userMsg]
      .slice(1) // drop the canned welcome
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((ms) => [...ms, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setBusy(true);

    const patch = (fn: (m: ChatMessage) => ChatMessage) =>
      setMessages((ms) => ms.map((m) => (m.id === assistantId ? fn(m) : m)));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/trud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, page: pathname }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        const fallback = keywordSearch(question);
        patch((m) => ({
          ...m,
          error: data.error ?? "error",
          content:
            data.error === "not_configured"
              ? fallback.length
                ? "I'm not switched on for this preview yet, but here's what I found in our FAQs:"
                : "I'm not switched on for this preview yet. A real human can help below."
              : data.message ?? "Something went wrong. Try again in a moment.",
          fallback,
        }));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const raw = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!raw) continue;
          let ev: { t: string; [k: string]: unknown };
          try {
            ev = JSON.parse(raw);
          } catch {
            continue;
          }
          switch (ev.t) {
            case "text":
              patch((m) => ({ ...m, content: m.content + (ev.v as string) }));
              break;
            case "tool":
              setToolNote(
                ev.status === "start"
                  ? ev.name === "get_departures"
                    ? "Checking live dates…"
                    : ev.name === "join_waitlist"
                      ? "Adding you to the waitlist…"
                      : "Looping in the team…"
                  : null,
              );
              break;
            case "handoff":
            case "waitlist":
            case "departures":
              patch((m) => ({ ...m, events: [...(m.events ?? []), ev as unknown as UiEvent] }));
              break;
            case "error":
              patch((m) => ({ ...m, error: ev.code as string, content: m.content || (ev.message as string) }));
              break;
            case "done":
              break;
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        patch((m) => ({ ...m, error: "network", content: m.content || "Lost the connection there. Try again?" }));
      }
    } finally {
      setToolNote(null);
      setBusy(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  const isPanel = variant === "panel";

  return (
    <div
      className={
        isPanel
          ? "flex flex-col h-full min-h-0"
          : "max-w-2xl mx-auto rounded-[16px] border border-tru-pink/25 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.06] p-5 sm:p-7"
      }
    >
      {/* Header */}
      {isPanel ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-tru-pink/10 to-tru-blue/10">
          <div className="flex items-center gap-2">
            <SparkAvatar className="h-8 w-8 text-base" />
            <div>
              <p className="text-white text-sm font-bold">Tru.D</p>
              <p className="text-tru-green text-[9px] font-semibold">Online &middot; AI Assistant</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} aria-label="Close chat" className="text-gray-400 hover:text-white transition">
              <CloseIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-3 mb-4">
          <SparkAvatar className="h-12 w-12 text-2xl" />
          <div>
            <p className="text-white font-black uppercase font-heading text-lg tracking-wide">Ask Tru.D</p>
            <p className="text-gray-400 text-xs sm:text-sm">Your travel assistant. Ask me a question and I&apos;ll find the answer.</p>
          </div>
        </div>
      )}

      {/* Transcript */}
      <div
        ref={scrollRef}
        className={`${isPanel ? "flex-1 px-4 py-3" : "max-h-[420px] rounded-[12px] border border-white/10 bg-white/[0.03] p-4"} overflow-y-auto space-y-3`}
        aria-live="polite"
      >
        {messages.map((m) => (
          <Bubble key={m.id} message={m} streaming={busy && m.id === messages[messages.length - 1].id && m.role === "assistant"} />
        ))}
        {toolNote && <p className="text-tru-pink text-xs italic pl-1">{toolNote}</p>}
      </div>

      {/* Suggestions */}
      {!hasConversation && (
        <div className={`flex flex-wrap gap-2 ${isPanel ? "px-4 pb-2" : "mt-4"}`}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs text-gray-300 border border-white/10 hover:border-tru-pink/40 hover:text-white rounded-full px-3 py-1 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className={`flex gap-2 ${isPanel ? "border-t border-white/10 px-3 py-2" : "mt-4"}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={busy ? "Tru.D is typing…" : isPanel ? "Ask Tru.D anything..." : "e.g. Do I need a visa? · What's included? · Can I pay in instalments?"}
          disabled={busy}
          maxLength={2000}
          className={`flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-tru-pink/50 transition disabled:opacity-60 ${isPanel ? "rounded-full px-4 py-2 text-xs" : "rounded-[10px] px-4 py-3.5 text-sm"}`}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className={`flex-shrink-0 rounded-full bg-tru-pink hover:bg-tru-pink-light disabled:opacity-40 disabled:hover:bg-tru-pink text-white font-semibold uppercase tracking-wider font-heading transition ${isPanel ? "px-4 py-2 text-[10px]" : "px-5 py-3 text-xs"}`}
        >
          Send
        </button>
      </form>
      <p className={`text-gray-500 text-[11px] ${isPanel ? "px-4 pb-2" : "mt-2 text-center"}`}>
        Tru.D checks dates and prices live but can still make mistakes. Anything about an existing booking goes to a human.
      </p>
    </div>
  );
}

function Bubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <SparkAvatar className="h-7 w-7 text-sm mt-0.5" />}
      <div
        className={`max-w-[85%] rounded-[10px] px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-tru-green/10 border border-tru-green/20 text-gray-200"
            : "bg-gradient-to-br from-tru-pink/10 to-tru-blue/10 border border-tru-pink/20 text-gray-200"
        }`}
      >
        {message.content ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : streaming ? (
          <span className="inline-flex gap-1 py-1" aria-label="Tru.D is thinking">
            <Dot delay="0s" />
            <Dot delay="0.15s" />
            <Dot delay="0.3s" />
          </span>
        ) : null}

        {message.fallback && message.fallback.length > 0 && (
          <ul className="mt-3 space-y-2">
            {message.fallback.map((f) => (
              <li key={f.id} className="rounded-[10px] border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-white font-semibold text-sm">{f.q}</p>
                <p className="text-gray-300 text-xs mt-1 leading-relaxed">{f.a}</p>
              </li>
            ))}
          </ul>
        )}

        {message.events?.map((ev, i) => (
          <EventCard key={i} ev={ev} />
        ))}

        {message.error && message.error !== "not_configured" && (
          <p className="mt-2 text-xs text-gray-400">
            Still stuck?{" "}
            <Link href="/contact-us" className="text-tru-pink hover:text-tru-pink-light underline underline-offset-2">
              Talk to a human
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function EventCard({ ev }: { ev: UiEvent }) {
  if (ev.t === "departures") {
    return (
      <div className="mt-3 flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-tru-navy/60 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-heading">Trip</p>
          <p className="text-white text-xs font-semibold truncate">{ev.trip}</p>
        </div>
        <Link
          href={ev.url}
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-tru-pink hover:bg-tru-pink-light text-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider font-heading transition"
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          Check dates
        </Link>
      </div>
    );
  }
  if (ev.t === "waitlist") {
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-[10px] border border-tru-green/30 bg-tru-green/10 px-3 py-2.5">
        <span className="mt-0.5 h-5 w-5 rounded-full bg-tru-green flex items-center justify-center flex-shrink-0">
          <TickIcon className="h-3 w-3 text-tru-navy" />
        </span>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold">You&apos;re on the waitlist</p>
          <p className="text-gray-300 text-[11px] leading-snug">{ev.trip} &middot; {ev.date}. We&apos;ll email {ev.email} the moment a spot opens.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-[10px] border border-white/10 bg-tru-navy/60 px-3 py-2.5">
      <p className="text-white text-xs font-semibold mb-0.5">Talk to a human</p>
      <p className="text-gray-400 text-[11px] mb-2.5">Live chat 9:30am–5pm GMT, Mon–Sat. The team can see this conversation.</p>
      <div className="flex flex-wrap gap-1.5">
        <a
          href="/support#talk-to-a-human"
          className="inline-flex items-center gap-1.5 rounded-full bg-tru-pink hover:bg-tru-pink-light text-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider font-heading transition"
        >
          <ChatIcon className="h-3.5 w-3.5" />
          Live chat
        </a>
        <Link
          href="/contact-us"
          className="inline-flex items-center rounded-full border border-white/20 hover:border-tru-pink/60 hover:text-white text-gray-200 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider font-heading transition"
        >
          Email
        </Link>
        <a
          href="tel:+442035422463"
          className="inline-flex items-center rounded-full border border-white/20 hover:border-tru-pink/60 hover:text-white text-gray-200 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider font-heading transition"
        >
          Call
        </a>
      </div>
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" />
    </svg>
  );
}

function TickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z" />
    </svg>
  );
}

function Dot({ delay }: { delay: string }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-tru-pink animate-bounce" style={{ animationDelay: delay }} />;
}

export function SparkAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center flex-shrink-0 ${className ?? ""}`}
    >
      ✨
    </span>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
