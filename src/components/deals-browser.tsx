"use client";

import { useEffect, useMemo, useState } from "react";
import { trips, type Trip } from "@/lib/data";
import DealCard, { getUpcomingDepartures } from "@/components/deal-card";
import PillButton from "@/components/pill-button";

const PAGE_SIZE = 6;

const REGIONS = ["Asia", "South Asia", "Central America", "Europe", "Africa", "Oceania"] as const;

const DURATIONS = [
  { id: "any", label: "Any length" },
  { id: "short", label: "Under 1 week" },
  { id: "medium", label: "1–2 weeks" },
  { id: "long", label: "2–4 weeks" },
  { id: "longest", label: "4 weeks+" },
] as const;

const DEAL_SORT = [
  { id: "earliest", label: "Earliest Departure" },
  { id: "latest", label: "Latest Departure" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "highest-rated", label: "Highest Rated" },
  { id: "highest-discount", label: "Saving Amount: High to Low" },
];

const PRICE_MIN = 0;
const PRICE_MAX = 2500;

function durationMatches(durationStr: string, bucket: string) {
  const d = parseInt(durationStr, 10) || 0;
  if (bucket === "short") return d < 7;
  if (bucket === "medium") return d >= 7 && d <= 14;
  if (bucket === "long") return d > 14 && d <= 28;
  if (bucket === "longest") return d > 28;
  return true;
}

function discountPct(trip: Trip) {
  if (!trip.originalPrice) return 0;
  return Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100);
}

function getDealDepartures(trip: Trip) {
  return getUpcomingDepartures(trip, true);
}

function getNextDeparture(trip: Trip) {
  return getDealDepartures(trip)[0] ?? null;
}

const SECTION_PILLS = [{ id: "deals", label: "Deals" }];

export default function DealsBrowser() {
  const [regions, setRegions] = useState<Set<string>>(new Set());
  const [duration, setDuration] = useState<string>("any");
  const [maxBudget, setMaxBudget] = useState<number>(PRICE_MAX);
  const [dealsSort, setDealsSort] = useState("earliest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [dealsLimit, setDealsLimit] = useState(PAGE_SIZE);

  const [navSticky, setNavSticky] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("deals");

  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById("deals-bar");
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      setNavSticky(rect.bottom < 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = SECTION_PILLS.map((p) => p.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const activeFilterCount =
    regions.size +
    (duration !== "any" ? 1 : 0) +
    (maxBudget !== PRICE_MAX ? 1 : 0);

  const toggleRegion = (r: string) => {
    setRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const clearFilters = () => {
    setRegions(new Set());
    setDuration("any");
    setMaxBudget(PRICE_MAX);
  };

  const sortedDeals = useMemo(() => {
    let list = trips.filter((t) => t.originalPrice && getDealDepartures(t).length > 0);

    if (regions.size > 0) list = list.filter((t) => regions.has(t.region));
    if (duration !== "any") list = list.filter((t) => durationMatches(t.duration, duration));
    if (maxBudget < PRICE_MAX) list = list.filter((t) => t.price <= maxBudget);

    return [...list].sort((a, b) => {
      if (dealsSort === "highest-discount") return discountPct(b) - discountPct(a);
      if (dealsSort === "price-low") return a.price - b.price;
      if (dealsSort === "price-high") return b.price - a.price;
      if (dealsSort === "highest-rated") return (b.rating ?? 0) - (a.rating ?? 0);
      const aNext = getNextDeparture(a)?.date ?? "9999";
      const bNext = getNextDeparture(b)?.date ?? "9999";
      if (dealsSort === "latest") return new Date(bNext).getTime() - new Date(aNext).getTime();
      return new Date(aNext).getTime() - new Date(bNext).getTime();
    });
  }, [regions, duration, maxBudget, dealsSort]);

  const FilterPanel = (
    <div className="space-y-4">
      {/* Sort By */}
      <div>
        <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Sort By
        </p>
        <div className="relative">
          <select
            value={dealsSort}
            onChange={(e) => setDealsSort(e.target.value)}
            className="w-full appearance-none bg-tru-navy border border-white/15 rounded-[10px] px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-tru-pink/50 cursor-pointer"
          >
            {DEAL_SORT.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Budget */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading">
            Your Budget
          </p>
          <p className="text-white text-sm font-bold font-heading">
            up to &pound;{maxBudget}{maxBudget === PRICE_MAX && "+"}
          </p>
        </div>
        <input
          type="range"
          min={300}
          max={PRICE_MAX}
          step={50}
          value={maxBudget}
          onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-tru-pink"
        />
        <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider font-heading mt-2">
          <span>&pound;300</span>
          <span>&pound;{PRICE_MAX}+</span>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Length */}
      <div>
        <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Length
        </p>
        <div className="space-y-1.5">
          {DURATIONS.map((d) => (
            <label
              key={d.id}
              className={`flex items-center gap-3 cursor-pointer rounded-[8px] px-3 py-2 transition ${
                duration === d.id ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="duration"
                value={d.id}
                checked={duration === d.id}
                onChange={() => setDuration(d.id)}
                className="h-4 w-4 accent-tru-pink"
              />
              <span className="text-sm">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Region */}
      <div>
        <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">
          Region
        </p>
        <div className="space-y-1.5">
          {REGIONS.map((r) => {
            const checked = regions.has(r);
            return (
              <label
                key={r}
                className={`flex items-center gap-3 cursor-pointer rounded-[8px] px-3 py-2 transition ${
                  checked ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRegion(r)}
                  className="h-4 w-4 accent-tru-pink rounded"
                />
                <span className="text-sm">{r}</span>
              </label>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <>
          <div className="h-px bg-white/10" />
          <button
            onClick={clearFilters}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/20 py-2.5 text-xs font-bold text-white hover:border-tru-pink hover:text-tru-pink transition uppercase tracking-wider font-heading"
          >
            Clear Filters ({activeFilterCount})
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Anchor pill bar — mobile only (desktop uses sticky sidebar) */}
      <div id="deals-bar" className="sm:hidden bg-tru-navy/95 backdrop-blur-md border-y border-white/10 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border ${
                activeFilterCount > 0
                  ? "border-tru-pink bg-tru-pink/15 text-white"
                  : "border-white/20 text-gray-300"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky duplicate when scrolled past — mobile only */}
      <div className={`sm:hidden fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border ${
                activeFilterCount > 0
                  ? "border-tru-pink bg-tru-pink/15 text-white"
                  : "border-white/20 text-gray-300"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Deals — sidebar + cards */}
      <section id="deals" className="relative mb-16 sm:pt-16 scroll-mt-20 overflow-clip">
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-6 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -bottom-10 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="rounded-[12px] border border-white/10 bg-tru-navy/60 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-white text-sm font-black uppercase font-heading tracking-wider">
                    Filter Results
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading hover:text-tru-pink-light transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-xs mb-5">
                  Found <span className="text-white font-bold">{sortedDeals.length}</span> result{sortedDeals.length === 1 ? "" : "s"}
                </p>
                {FilterPanel}
              </div>
            </aside>

            {/* Cards column */}
            <div className="min-w-0">
              {sortedDeals.length > 0 ? (
                <>
                  <div className="space-y-5">
                    {sortedDeals.slice(0, dealsLimit).map((trip) => (
                      <DealCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                  {dealsLimit < sortedDeals.length && (
                    <div className="pt-8 text-center">
                      <PillButton onClick={() => setDealsLimit((n) => n + PAGE_SIZE)} arrow="down">
                        Show More Deals
                      </PillButton>
                      <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider font-heading">
                        Showing {dealsLimit} of {sortedDeals.length}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-[10px] border border-dashed border-white/10 py-16 text-center">
                  <p className="text-gray-400 mb-4">No deals match those filters.</p>
                  <button onClick={clearFilters} className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition">
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-full sm:w-[420px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">
                Filter & Sort
              </h2>
              <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {FilterPanel}
            </div>
            <div className="px-6 py-4 border-t border-white/10">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full rounded-[10px] bg-tru-pink py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 text-center font-heading uppercase tracking-wider">
                Show {sortedDeals.length} Deal{sortedDeals.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

