"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { trips, stories } from "@/lib/data";
import { tripUrl } from "@/lib/utils";

type SearchItem = {
  title: string;
  href: string;
  category: string;
  subtitle?: string;
};

// Build a static search index from all available data
const searchIndex: SearchItem[] = [
  // Pages
  { title: "Home", href: "/", category: "Page" },
  { title: "All Trips", href: "/explore", category: "Page" },
  { title: "About Us", href: "/about", category: "Page" },
  { title: "Stories & Blog", href: "/stories", category: "Page" },
  { title: "Log In", href: "/login", category: "Page" },
  { title: "Sign Up", href: "/signup", category: "Page" },
  { title: "Member Dashboard", href: "/member/dashboard", category: "Page" },

  // Trips
  ...trips.map((t) => ({
    title: t.title,
    href: tripUrl(t),
    category: "Trip",
    subtitle: `${t.destination} · ${t.duration} · From £${t.price}`,
  })),

  // Destinations (countries)
  ...["Thailand", "Indonesia", "Philippines", "Vietnam", "Cambodia", "Sri Lanka", "India", "Japan", "China",
    "Mexico", "Costa Rica", "Colombia", "Peru", "Brazil", "Belize", "Guatemala",
    "Greece", "Italy", "Albania", "Morocco", "Jordan", "New Zealand"].map((c) => ({
    title: c,
    href: "/explore",
    category: "Destination",
  })),

  // Travel Styles
  ...["Backpacker", "Classic", "Flashpacker", "Multi Country", "Limited Edition"].map((s) => ({
    title: `${s} Trips`,
    href: "/explore",
    category: "Travel Style",
  })),

  // Stories
  ...stories.map((s) => ({
    title: s.title,
    href: `/stories/${s.id}`,
    category: "Blog",
    subtitle: `By ${s.author} · ${s.category}`,
  })),

  // Deals
  { title: "Flash Sale", href: "/explore", category: "Deal", subtitle: "Save up to 30% on 2026 departures" },
  { title: "Last-Minute Deals", href: "/explore", category: "Deal", subtitle: "Trips leaving within 30 days" },
];

const categoryColors: Record<string, string> = {
  Trip: "bg-tru-pink",
  Destination: "bg-tru-blue",
  "Travel Style": "bg-tru-green text-tru-navy",
  Blog: "bg-amber-500",
  Page: "bg-white/20",
  Deal: "bg-red-500",
};

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.length > 0
    ? searchIndex.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl mx-4 z-10 animate-fade-in">
        {/* Search input */}
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

        {/* Results */}
        {query.length > 0 && (
          <div className="mt-2 bg-tru-navy border border-white/10 rounded-[10px] overflow-hidden">
            {filtered.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filtered.map((item, i) => (
                  <Link
                    key={`${item.href}-${i}`}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <span className={`text-[8px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[item.category] || "bg-white/20"}`}>
                      {item.category}
                    </span>
                    <div className="min-w-0">
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
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-gray-500 text-sm">No results for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* Hint when empty */}
        {query.length === 0 && (
          <div className="mt-2 bg-tru-navy/80 border border-white/10 rounded-[10px] px-4 py-4">
            <p className="text-gray-500 text-xs mb-3">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {["Thailand", "Bali", "Backpacker", "Full Moon Party", "Flash Sale"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:text-white hover:border-white/20 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
