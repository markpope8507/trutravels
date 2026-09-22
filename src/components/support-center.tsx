"use client";

import { useMemo, useState } from "react";
import { FAQ_GROUPS, type Faq } from "@/lib/faqs";
import FaqAccordion from "@/components/faq-accordion";
import TrudChat from "@/components/trud-chat";

type FlatFaq = Faq & { category: string; color: string };

const ALL_FAQS: FlatFaq[] = FAQ_GROUPS.flatMap((g) =>
  g.faqs.map((f) => ({ ...f, category: g.category, color: g.color })),
);

export default function SupportCenter() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);

  const results = useMemo(() => {
    if (!q) return [];
    return ALL_FAQS.map((f) => {
      const text = `${f.q} ${f.a} ${f.category}`.toLowerCase();
      const score = words.reduce((s, w) => s + (text.includes(w) ? 1 : 0), 0);
      return { f, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.f);
  }, [q, words]);

  const browseFaqs = topic ? FAQ_GROUPS.find((g) => g.category === topic)?.faqs ?? [] : [];
  const showTopics = !q && !topic;

  const reset = () => {
    setQuery("");
    setTopic(null);
  };

  return (
    <div>
      {/* Tru.D — AI assistant (streams from /api/trud; falls back to keyword search when not configured) */}
      <TrudChat variant="inline" />

      {/* Keyword search over the topic FAQs */}
      <div className="max-w-2xl mx-auto mt-6 relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setTopic(null);
          }}
          placeholder="Or search the FAQs"
          className="w-full bg-white/5 border border-white/10 rounded-[10px] pl-11 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
        />
        {query && (
          <button
            type="button"
            onClick={reset}
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {q && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="text-gray-400 text-sm">
              {results.length > 0 ? (
                <>Here&apos;s what I found for <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span> — {results.length} answer{results.length === 1 ? "" : "s"}.</>
              ) : (
                <>Hmm, I couldn&apos;t find an answer for <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>.</>
              )}
            </p>
            <button
              onClick={reset}
              className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/15 hover:border-tru-pink/50 text-gray-300 hover:text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider font-heading transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
          {results.length > 0 ? (
            <FaqAccordion faqs={results} />
          ) : (
            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-gray-300 text-sm mb-4">No worries — a real human can help. Jump on live chat or drop us a message.</p>
              <a href="/contact-us" className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition">
                Talk To Us
              </a>
            </div>
          )}
        </div>
      )}

      {/* Browse a topic */}
      {topic && !q && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight">{topic}</h3>
            <button onClick={reset} className="flex-shrink-0 text-tru-pink hover:text-tru-pink-light text-xs font-bold uppercase tracking-wider font-heading transition">
              &larr; All topics
            </button>
          </div>
          <FaqAccordion faqs={browseFaqs} />
        </div>
      )}

      {/* Topic cards */}
      {showTopics && (
        <div className="mt-10">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-4 font-heading">Or Browse By Topic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAQ_GROUPS.map((g) => (
              <button
                key={g.category}
                onClick={() => setTopic(g.category)}
                className="text-left rounded-[12px] border border-white/10 bg-white/[0.03] p-5 hover:border-tru-pink/30 hover:bg-white/[0.05] transition-all duration-200 group"
              >
                <div className="h-11 w-11 rounded-full flex items-center justify-center mb-4" style={{ background: `${g.color}22`, border: `1px solid ${g.color}66` }}>
                  <svg className="h-5 w-5" style={{ color: g.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                  </svg>
                </div>
                <p className="text-white font-black uppercase font-heading text-base tracking-wide mb-1 group-hover:text-tru-pink transition-colors">{g.category}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{g.description}</p>
                <span className="inline-flex items-center gap-1 text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading mt-3">
                  {g.faqs.length} answers &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
