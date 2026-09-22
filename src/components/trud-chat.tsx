"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
        body: JSON.stringify({ messages: history }),
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
          ? "flex flex-col h-full"
          : "max-w-2xl mx-auto rounded-[16px] border border-tru-pink/25 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.06] p-5 sm:p-7"
      }
    >
      {/* Header */}
      <div className={`flex items-center gap-3 ${isPanel ? "px-4 py-3 border-b border-white/10" : "justify-center text-center flex-col mb-4"}`}>
        <span className={`${isPanel ? "h-9 w-9" : "h-12 w-12"} rounded-full bg-tru-pink/15 border border-tru-pink/40 flex items-center justify-center flex-shrink-0`}>
          <SparkIcon className={isPanel ? "h-4 w-4 text-tru-pink" : "h-6 w-6 text-tru-pink"} />
        </span>
        <div className={isPanel ? "flex-1 min-w-0" : ""}>
          <p className={`text-white font-black uppercase font-heading tracking-wide ${isPanel ? "text-sm" : "text-lg"}`}>Ask Tru.D</p>
          <p className="text-gray-400 text-xs sm:text-sm">Your travel assistant. Ask me a question and I&apos;ll find the answer.</p>
        </div>
        {isPanel && onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className={`${isPanel ? "flex-1 px-4 py-4" : "max-h-[420px] rounded-[12px] border border-white/10 bg-white/[0.03] p-4"} overflow-y-auto space-y-3`}
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
        className={`relative ${isPanel ? "px-4 pb-4 pt-2" : "mt-4"}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={busy ? "Tru.D is typing…" : "e.g. Do I need a visa? · What's included? · Can I pay in instalments?"}
          disabled={busy}
          maxLength={2000}
          className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-4 pr-12 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className={`absolute ${isPanel ? "right-6 bottom-6" : "right-2 top-1/2 -translate-y-1/2"} h-9 w-9 rounded-full bg-tru-pink hover:bg-tru-pink-light disabled:opacity-40 disabled:hover:bg-tru-pink flex items-center justify-center text-white transition`}
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
      <p className={`text-gray-500 text-[11px] ${isPanel ? "px-4 pb-3" : "mt-2 text-center"}`}>
        Tru.D checks dates and prices live but can still make mistakes. Anything about an existing booking goes to a human.
      </p>
    </div>
  );
}

function Bubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] ${isUser ? "bg-tru-pink text-white rounded-[14px] rounded-br-sm" : "bg-white/[0.06] text-gray-200 rounded-[14px] rounded-bl-sm"} px-4 py-2.5 text-sm leading-relaxed`}>
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
      <Link
        href={ev.url}
        className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-tru-pink/40 hover:bg-tru-pink/10 text-tru-pink px-3 py-2 text-[11px] font-bold uppercase tracking-wider font-heading transition"
      >
        Check dates for {ev.trip} &rarr;
      </Link>
    );
  }
  if (ev.t === "waitlist") {
    return (
      <p className="mt-3 rounded-[10px] border border-tru-green/40 bg-tru-green/10 px-3 py-2 text-xs text-white">
        You&apos;re on the list for {ev.trip} ({ev.date}). We&apos;ll email {ev.email} the moment a spot opens.
      </p>
    );
  }
  return (
    <div className="mt-3 rounded-[10px] border border-tru-pink/30 bg-tru-pink/[0.08] p-3">
      <p className="text-white text-xs font-bold uppercase font-heading tracking-wide mb-2">Talk to a human</p>
      <div className="flex flex-wrap gap-2">
        <a
          href="/support#talk-to-a-human"
          className="rounded-[8px] bg-tru-pink hover:bg-tru-pink-light text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider font-heading transition"
        >
          Live chat
        </a>
        <Link
          href="/contact-us"
          className="rounded-[8px] border border-white/20 hover:border-tru-pink/50 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider font-heading transition"
        >
          Email us
        </Link>
        <a
          href="tel:+442035422463"
          className="rounded-[8px] border border-white/20 hover:border-tru-pink/50 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider font-heading transition"
        >
          +44 203 542 2463
        </a>
      </div>
      <p className="text-gray-400 text-[11px] mt-2">Live chat runs 9:30am–5pm GMT, Mon–Sat.</p>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-tru-pink animate-bounce" style={{ animationDelay: delay }} />;
}

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
