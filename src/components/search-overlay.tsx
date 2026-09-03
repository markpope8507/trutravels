"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";
import Link from "next/link";
import { trips, stories, countries, regionPages, travelStyleConfig } from "@/lib/data";
import { tripUrl, countryUrl } from "@/lib/utils";

type SearchCategory = "Destination" | "Trip" | "Blog" | "Travel Style" | "Deal" | "Page" | "Life Moment";

type SearchItem = {
  title: string;
  href: string;
  category: SearchCategory;
  subtitle?: string;
  keywords?: string;
};

const TRAVEL_STYLE_SLUGS: Record<string, string> = {
  classic: "classic",
  backpacker: "backpacker",
  flashpacker: "flashpacker",
  multi_country: "multi-country",
  limited_edition: "limited-edition",
};

const searchIndex: SearchItem[] = [
  { title: "Home", href: "/", category: "Page" },
  { title: "All Trips", href: "/explore", category: "Page" },
  { title: "About Us", href: "/about", category: "Page" },
  { title: "Stories & Blog", href: "/stories", category: "Page" },
  { title: "Log In", href: "/login", category: "Page" },
  { title: "Sign Up", href: "/signup", category: "Page" },
  { title: "Member Dashboard", href: "/member/dashboard", category: "Page" },

  ...trips.map((t) => ({
    title: t.title,
    href: tripUrl(t),
    category: "Trip" as const,
    subtitle: `${t.destination} · ${t.duration} · From £${t.price}`,
    keywords: t.destination,
  })),

  ...regionPages.map((r) => ({
    title: r.name,
    href: `/destinations/${r.slug}`,
    category: "Destination" as const,
    subtitle: r.tagline,
  })),

  ...countries.map((c) => ({
    title: c.name,
    href: countryUrl(c),
    category: "Destination" as const,
    subtitle: c.tagline,
  })),

  ...(Object.keys(travelStyleConfig) as Array<keyof typeof travelStyleConfig>).map((key) => ({
    title: `${travelStyleConfig[key].label} Trips`,
    href: `/travel-styles/${TRAVEL_STYLE_SLUGS[key]}`,
    category: "Travel Style" as const,
  })),

  ...stories.map((s) => ({
    title: s.title,
    href: `/stories/${s.id}`,
    category: "Blog" as const,
    subtitle: `By ${s.author} · ${s.category}`,
    keywords: s.destinations.join(" "),
  })),

  {
    title: "Solo Soul Searcher",
    href: "/life-moments/solo-soul-searcher",
    category: "Life Moment",
    subtitle: "Coming alone? You won't leave that way.",
    keywords: "tours for solo travellers solo travel",
  },
  {
    title: "Just Left Uni",
    href: "/life-moments/just-left-uni",
    category: "Life Moment",
    subtitle: "Three years done. Hat off. Tickets booked.",
    keywords: "post uni graduate",
  },
  {
    title: "Gap Year",
    href: "/life-moments/gap-year",
    category: "Life Moment",
    subtitle: "A whole year on the road.",
    keywords: "gap year",
  },

  { title: "Flash Sale", href: "/deals", category: "Deal", subtitle: "Save up to 30% on 2026 departures" },
  { title: "Last-Minute Deals", href: "/deals", category: "Deal", subtitle: "Trips leaving within 30 days" },
];

const SEARCH_EXAMPLES = [
  "Thailand",
  "Bali Experience",
  "Tours for solo travellers",
  "Best Places to Travel in August",
] as const;

type GroupConfig = {
  category: SearchCategory;
  heading: string;
  cap: number;
  viewAllLabel: (count: number) => string;
  viewAllHref: (query: string, items: SearchItem[]) => string | null;
};

const GROUP_ORDER: GroupConfig[] = [
  {
    category: "Destination",
    heading: "Destination",
    cap: 4,
    viewAllLabel: (n) => `View all ${n} destinations`,
    viewAllHref: () => "/explore",
  },
  {
    category: "Trip",
    heading: "Tours",
    cap: 4,
    viewAllLabel: (n) => `View all ${n} tours`,
    viewAllHref: (query, items) => {
      const match = countries.find((c) => {
        const name = c.name.toLowerCase();
        const q = query.toLowerCase();
        return name === q || name.includes(q) || q.includes(name);
      });
      if (match && items.some((item) => item.subtitle?.toLowerCase().includes(match.name.toLowerCase()))) {
        return `/explore/all-trips?country=${encodeURIComponent(match.name)}`;
      }
      return "/explore";
    },
  },
  {
    category: "Blog",
    heading: "Stories",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} stories`,
    viewAllHref: () => "/stories",
  },
  {
    category: "Life Moment",
    heading: "Life Moments",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} life moments`,
    viewAllHref: () => null,
  },
  {
    category: "Travel Style",
    heading: "Travel Style",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} styles`,
    viewAllHref: () => "/travel-styles",
  },
  {
    category: "Deal",
    heading: "Deals",
    cap: 2,
    viewAllLabel: () => "View all deals",
    viewAllHref: () => "/deals",
  },
  {
    category: "Page",
    heading: "Pages",
    cap: 3,
    viewAllLabel: (n) => `View all ${n} pages`,
    viewAllHref: () => null,
  },
];

function matchesQuery(item: SearchItem, q: string) {
  return (
    item.title.toLowerCase().includes(q) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
    (item.keywords && item.keywords.toLowerCase().includes(q))
  );
}

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setQuery("");
  }

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useScrollLock(isOpen);

  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  const groups = useMemo(() => {
    if (!q) return [];
    const hits = searchIndex.filter((item) => matchesQuery(item, q));
    return GROUP_ORDER.flatMap((config) => {
      const items = hits.filter((item) => item.category === config.category);
      if (items.length === 0) return [];
      return [{
        ...config,
        items: items.slice(0, config.cap),
        total: items.length,
        moreHref: items.length > config.cap ? config.viewAllHref(trimmed, items) : null,
      }];
    });
  }, [q, trimmed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl mx-4 z-10 animate-fade-in">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, destinations, blog..."
            className="w-full bg-tru-navy border border-white/20 rounded-[10px] pl-12 pr-12 py-4 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {trimmed.length > 0 && (
          <div className="mt-2 bg-tru-navy border border-white/10 rounded-[10px] overflow-hidden max-h-[min(60vh,28rem)] overflow-y-auto">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.category} className="border-t border-white/10 first:border-t-0">
                  <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink font-heading">
                    {group.heading}
                  </p>
                  <div>
                    {group.items.map((item, i) => (
                      <Link
                        key={`${item.href}-${i}`}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-gray-500 text-xs truncate">{item.subtitle}</p>
                          )}
                        </div>
                        <svg className="h-4 w-4 text-gray-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                    {group.moreHref && (
                      <Link
                        href={group.moreHref}
                        onClick={onClose}
                        className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span>{group.viewAllLabel(group.total)}</span>
                        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-gray-500 text-sm">No results for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {trimmed.length === 0 && (
          <div className="mt-2 bg-tru-navy/80 border border-white/10 rounded-[10px] px-4 py-4">
            <p className="text-gray-500 text-xs mb-3">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuery(example);
                    inputRef.current?.focus();
                  }}
                  className="max-w-full text-left text-xs leading-snug text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:text-white hover:border-white/20 transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
