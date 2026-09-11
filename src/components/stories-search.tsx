"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchDropdownCard, type SearchAnchor } from "@/components/search-overlay";
import { storyLifeMomentEmojis, type Story } from "@/lib/data";

/* Stories search — same flow as the homepage bar (type and a dropdown drops
   flush beneath it), but scoped to this page. Suggestions are of two kinds:
   a story, which navigates straight to it, and a facet — topic, destination or
   life moment — which ticks the matching filter instead. The grid underneath
   still filters live on the raw text, so the dropdown only ever adds shortcuts. */

const STOP_WORDS = new Set(["the", "a", "an", "in", "on", "to", "of", "for", "and", "is", "it", "my", "i"]);

export function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function hits(haystack: string, tokens: string[]) {
  const h = haystack.toLowerCase();
  return tokens.every((t) => h.includes(t));
}

type Facet = { kind: "topic" | "country" | "moment"; value: string; label: string };

/* The fields typed text is matched against, in one place, so the dropdown and the
   grid behind it can never disagree about what counts as a hit. */
export function storyHaystack(s: Story) {
  return [s.title, s.excerpt, s.category, ...s.topics, ...s.destinations, ...s.lifeMoments].join(" ");
}

export function storyMatchesQuery(s: Story, query: string) {
  const tokens = tokenize(query);
  return !tokens.length || hits(storyHaystack(s), tokens);
}

export default function StoriesSearch({
  query,
  onQueryChange,
  stories,
  topics,
  countries,
  moments,
  onApplyFacet,
  variant = "desktop",
  placeholder,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  stories: Story[];
  topics: { id: string; label: string }[];
  countries: string[];
  moments: readonly string[];
  onApplyFacet: (facet: Facet) => void;
  variant?: "desktop" | "mobile";
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<SearchAnchor | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Pin the dropdown to the bar's box so it drops flush — same trick as SearchPrompt.
  const openDropdown = () => {
    const el = barRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.top, left: r.left, width: r.width, bottom: r.bottom });
    }
    setOpen(true);
  };

  const tokens = useMemo(() => tokenize(query), [query]);

  const suggestions = useMemo(() => {
    if (!tokens.length) {
      // Nothing typed yet — recommend the newest stories so the panel is never empty.
      return {
        stories: [...stories]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4),
        facets: [] as Facet[],
        empty: true,
      };
    }
    const matchedStories = stories
      .filter((s) => hits(storyHaystack(s), tokens))
      .slice(0, 5);

    const facets: Facet[] = [
      ...topics.filter((t) => hits(t.label, tokens)).map((t) => ({ kind: "topic" as const, value: t.id, label: t.label })),
      ...countries.filter((c) => hits(c, tokens)).map((c) => ({ kind: "country" as const, value: c, label: c })),
      ...moments.filter((m) => hits(m, tokens)).map((m) => ({ kind: "moment" as const, value: m, label: m })),
    ].slice(0, 5);

    return { stories: matchedStories, facets, empty: false };
  }, [tokens, stories, topics, countries, moments]);

  const nothing = !suggestions.stories.length && !suggestions.facets.length;

  const barClass =
    variant === "mobile"
      ? `flex items-center gap-3 w-full bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white transition focus-within:border-tru-pink/50 ${open ? "rounded-t-[18px] rounded-b-none" : "rounded-full"}`
      : `flex items-center gap-3 w-full bg-white/5 border border-white/10 px-4 py-3 text-white transition focus-within:border-tru-pink/50 ${open ? "rounded-t-[10px] rounded-b-none" : "rounded-[10px]"}`;

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={barRef} className={barClass}>
        <svg
          className={`${variant === "mobile" ? "h-4 w-4" : "h-5 w-5"} shrink-0 text-gray-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            if (!open) openDropdown();
          }}
          onFocus={openDropdown}
          placeholder={placeholder ?? "Search stories, guides, destinations…"}
          aria-label="Search stories"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="shrink-0 text-gray-500 hover:text-white transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <SearchDropdownCard
        isOpen={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        keepOpenRef={wrapperRef}
        attached
      >
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {nothing ? (
            <p className="px-5 py-6 text-sm text-gray-400">
              No stories match <span className="text-white font-semibold">“{query}”</span>. Try a destination, a
              topic, or a life moment.
            </p>
          ) : (
            <>
              {suggestions.facets.length > 0 && (
                <section className="mb-1">
                  <p className="px-5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink font-heading">
                    Filter by
                  </p>
                  {suggestions.facets.map((f) => (
                    <button
                      key={`${f.kind}-${f.value}`}
                      type="button"
                      onClick={() => {
                        onApplyFacet(f);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-left transition hover:bg-white/5"
                    >
                      <span className="text-base leading-none">
                        {f.kind === "moment" ? storyLifeMomentEmojis[f.value] ?? "✨" : f.kind === "country" ? "📍" : "🏷️"}
                      </span>
                      <span className="text-sm text-white">{f.label}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500 font-heading">
                        {f.kind === "country" ? "Destination" : f.kind === "moment" ? "Life moment" : "Topic"}
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {suggestions.stories.length > 0 && (
                <section>
                  <p className="px-5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink font-heading">
                    {suggestions.empty ? "Latest stories" : "Stories"}
                  </p>
                  {suggestions.stories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/stories/${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 transition hover:bg-white/5"
                    >
                      <img
                        src={s.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-[6px] object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-white">{s.title}</span>
                        <span className="block text-[11px] text-gray-500">
                          {s.category} · {s.readTime} min read
                        </span>
                      </span>
                    </Link>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </SearchDropdownCard>
    </div>
  );
}
