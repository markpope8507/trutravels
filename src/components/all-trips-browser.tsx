"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Trip, TravelStyle, travelStyleConfig } from "@/lib/data";
import { LIFE_MOMENTS } from "@/lib/life-moments";
import TripCard from "@/components/trip-card";

const PAGE_SIZE = 9;

const DURATIONS = [
  { id: "any", label: "Any length" },
  { id: "short", label: "Under 10 days" },
  { id: "medium", label: "10–14 days" },
  { id: "long", label: "15+ days" },
] as const;

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "duration-short", label: "Duration: Shortest" },
  { id: "duration-long", label: "Duration: Longest" },
  { id: "highest-rated", label: "Highest Rated" },
];

function durationMatches(durationStr: string, bucket: string) {
  const d = parseInt(durationStr, 10) || 0;
  if (bucket === "short") return d < 10;
  if (bucket === "medium") return d >= 10 && d <= 14;
  if (bucket === "long") return d >= 15;
  return true;
}

/* Collapsible filter group: a header that toggles its body open/closed,
   with an optional count badge showing how many options are selected. */
function FilterSection({
  title,
  count = 0,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 group"
      >
        <span className="flex items-center gap-2 text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading">
          {title}
          {count > 0 && (
            <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center tracking-normal">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-white ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function AllTripsBrowser({
  trips,
  regions,
  pageSize = PAGE_SIZE,
  hideStyleFilter = false,
  heading = "All Trips",
  initialCountries = [],
}: {
  trips: Trip[];
  regions: { name: string; count: number }[];
  pageSize?: number;
  hideStyleFilter?: boolean;
  heading?: string;
  initialCountries?: string[];
}) {
  const minPrice = useMemo(() => Math.min(...trips.map((t) => t.price)), [trips]);
  const maxPrice = useMemo(() => Math.max(...trips.map((t) => t.price)), [trips]);

  // Region → countries taxonomy, derived from the trips (in the given region
  // order), each with a trip count. Only regions/countries with trips appear.
  const regionTree = useMemo(
    () =>
      regions
        .map((r) => {
          const counts = new Map<string, number>();
          for (const t of trips) {
            if (t.region === r.name) counts.set(t.destination, (counts.get(t.destination) ?? 0) + 1);
          }
          const countries = [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
          return { region: r.name, count: r.count, countries };
        })
        .filter((r) => r.countries.length > 0),
    [regions, trips],
  );

  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(() => new Set(initialCountries));
  const [selectedStyles, setSelectedStyles] = useState<Set<TravelStyle>>(new Set());
  const [duration, setDuration] = useState("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sort, setSort] = useState("recommended");
  const [selectedMoments, setSelectedMoments] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [limit, setLimit] = useState(pageSize);
  const [navSticky, setNavSticky] = useState(false);
  // Which collapsible groups are expanded — destination starts open when a
  // country was pre-selected (e.g. arriving from a country page), else closed.
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(initialCountries.length > 0 ? ["destination"] : []),
  );
  // Which region rows inside the Destination group are expanded — auto-expand
  // any region that contains a pre-selected country.
  const [openRegions, setOpenRegions] = useState<Set<string>>(() => {
    const open = new Set<string>();
    for (const t of trips) {
      if (initialCountries.includes(t.destination)) open.add(t.region);
    }
    return open;
  });

  // Show the fixed sort/filter bar once the original scrolls out of view (mobile).
  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById("all-trips-bar");
      if (!bar) return;
      setNavSticky(bar.getBoundingClientRect().bottom < 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFilterOpen]);

  const travelStyles = Object.entries(travelStyleConfig) as [
    TravelStyle,
    (typeof travelStyleConfig)[TravelStyle],
  ][];

  const priceTouched = priceRange[0] !== minPrice || priceRange[1] !== maxPrice;
  const activeFilterCount =
    selectedCountries.size +
    selectedStyles.size +
    selectedMoments.size +
    (duration !== "any" ? 1 : 0) +
    (priceTouched ? 1 : 0);

  const toggleCountry = (name: string) => {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleRegion = (name: string) => {
    setOpenRegions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleStyle = (key: TravelStyle) => {
    setSelectedStyles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleMoment = (id: string) => {
    setSelectedMoments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCountries(new Set());
    setSelectedStyles(new Set());
    setSelectedMoments(new Set());
    setDuration("any");
    setPriceRange([minPrice, maxPrice]);
  };

  const filtered = useMemo(() => {
    let result = [...trips];
    if (selectedCountries.size > 0) result = result.filter((t) => selectedCountries.has(t.destination));
    if (selectedStyles.size > 0) result = result.filter((t) => selectedStyles.has(t.travelStyle));
    if (duration !== "any") result = result.filter((t) => durationMatches(t.duration, duration));
    result = result.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sort === "duration-short") result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    else if (sort === "duration-long") result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    else if (sort === "highest-rated") result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return result;
  }, [trips, selectedCountries, selectedStyles, duration, priceRange, sort]);

  // Reset pagination to the first page whenever the active filters change.
  // Adjusting state during render is the supported alternative to a setState-in-effect.
  const filterKey = JSON.stringify([
    [...selectedCountries].sort(),
    [...selectedStyles].sort(),
    duration,
    priceRange,
    sort,
  ]);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setLimit(pageSize);
  }

  /* ---- Reusable controls -------------------------------------------- */

  const SortSelect = (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full appearance-none bg-tru-navy border border-white/15 rounded-[10px] px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-tru-pink/50 cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const FilterPanel = (
    <div className="space-y-4">
      {/* Sort By — always visible */}
      <div>
        <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2">Sort By</p>
        {SortSelect}
      </div>

      {/* Destination — region → countries (nested, collapsible) */}
      <FilterSection
        title="Destination"
        count={selectedCountries.size}
        open={openSections.has("destination")}
        onToggle={() => toggleSection("destination")}
      >
        <div className="space-y-1">
          {regionTree.map(({ region, countries }) => {
            const regionOpen = openRegions.has(region);
            const regionCount = countries.filter((c) => selectedCountries.has(c.name)).length;
            return (
              <div key={region}>
                <button
                  type="button"
                  onClick={() => toggleRegion(region)}
                  className="w-full flex items-center justify-between gap-2 rounded-[8px] px-3 py-2 text-gray-200 hover:bg-white/5 hover:text-white transition"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {region}
                    {regionCount > 0 && (
                      <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                        {regionCount}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform ${regionOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {regionOpen && (
                  <div className="mt-1 space-y-1.5 pl-2">
                    {countries.map((c) => {
                      const checked = selectedCountries.has(c.name);
                      return (
                        <label
                          key={c.name}
                          className={`flex items-center gap-3 cursor-pointer rounded-[8px] px-3 py-2 transition ${
                            checked ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCountry(c.name)}
                            className="h-4 w-4 accent-tru-pink rounded"
                          />
                          <span className="text-sm flex-1">{c.name}</span>
                          <span className="text-xs text-gray-500">{c.count}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FilterSection>

      {/* Travel Style — collapsible (hidden on travel-style pages) */}
      {!hideStyleFilter && (
        <FilterSection
          title="Travel Style"
          count={selectedStyles.size}
          open={openSections.has("style")}
          onToggle={() => toggleSection("style")}
        >
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5">
            {travelStyles.map(([key, config]) => {
              const checked = selectedStyles.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleStyle(key)}
                  aria-pressed={checked}
                  title={config.label}
                  className={`aspect-square rounded-[10px] p-2 flex items-center justify-center transition-all duration-200 ${
                    checked ? "border-2 border-tru-pink bg-tru-pink/15" : "border border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <img src={config.logo} alt={config.label} className="h-full w-auto max-w-full object-contain" />
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Life Moment — collapsible */}
      <FilterSection
        title="Life Moment"
        count={selectedMoments.size}
        open={openSections.has("moment")}
        onToggle={() => toggleSection("moment")}
      >
        <div className="space-y-1.5">
          {LIFE_MOMENTS.map((m) => {
            const checked = selectedMoments.has(m.slug);
            return (
              <label
                key={m.slug}
                className={`flex items-center gap-3 cursor-pointer rounded-[8px] px-3 py-2 transition ${
                  checked ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMoment(m.slug)}
                  className="h-4 w-4 accent-tru-pink rounded flex-shrink-0"
                />
                <span className="text-sm">{m.name}</span>
              </label>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-500 mt-3 leading-snug">
          Filtering by life moment is coming soon.
        </p>
      </FilterSection>

      {/* Duration — collapsible */}
      <FilterSection
        title="Duration"
        count={duration !== "any" ? 1 : 0}
        open={openSections.has("duration")}
        onToggle={() => toggleSection("duration")}
      >
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
                name="all-trips-duration"
                value={d.id}
                checked={duration === d.id}
                onChange={() => setDuration(d.id)}
                className="h-4 w-4 accent-tru-pink"
              />
              <span className="text-sm">{d.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range — always visible */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading">Price Range</p>
          <p className="text-white text-sm font-bold font-heading">&pound;{priceRange[0]} – &pound;{priceRange[1]}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-8">Min</span>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
              className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-tru-pink"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-8">Max</span>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
              className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-tru-pink"
            />
          </div>
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

  /* ---- Mobile sticky bar (Sort + Filter) ---------------------------- */

  const MobileBar = (
    <div className="lg:hidden mx-auto max-w-[1480px] px-4 sm:px-6 flex items-center gap-3 h-14">
      <div className="flex-1">{SortSelect}</div>
      <button
        onClick={() => setMobileFilterOpen(true)}
        className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border ${
          activeFilterCount > 0
            ? "border-tru-pink bg-tru-pink/15 text-white"
            : "border-white/20 text-gray-300"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-tru-pink text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile sort/filter bar */}
      <div id="all-trips-bar" className="lg:hidden bg-tru-navy/95 backdrop-blur-md border-y border-white/10">
        {MobileBar}
      </div>

      {/* Sticky duplicate once scrolled past — mobile/tablet only */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        {MobileBar}
      </div>

      {/* Sidebar + grid */}
      <section className="relative py-10 overflow-clip">
        <div className="relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-6 rounded-[12px] border border-white/10 bg-tru-navy/60 backdrop-blur-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white text-sm font-black uppercase font-heading tracking-wider">Filters</p>
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
                  <span className="text-white font-bold">{filtered.length}</span> trip{filtered.length === 1 ? "" : "s"} found
                </p>
                {FilterPanel}
              </div>
            </aside>

            {/* Cards column */}
            <div className="min-w-0">
              <div className="hidden lg:flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">
                  {heading}
                  <span className="text-gray-500 text-sm font-normal ml-3">{filtered.length} trips found</span>
                </h2>
              </div>

              {filtered.length > 0 ? (
                <>
                  {/* Cards hold a fixed size band (matching the carousel cards); the grid
                      drops from 3 → 2 → 1 columns as space shrinks rather than squashing them.
                      The min(100%, …) guard stops a single column overflowing on tiny screens. */}
                  <div
                    className="grid gap-x-6 gap-y-10 justify-center lg:justify-start"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 360px))" }}
                  >
                    {filtered.slice(0, limit).map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                  {limit < filtered.length && (
                    <div className="pt-10 text-center">
                      <button
                        onClick={() => setLimit((n) => n + pageSize)}
                        className="inline-flex items-center gap-2 rounded-full border border-tru-pink/40 bg-transparent px-6 py-2.5 text-xs font-bold text-tru-pink hover:bg-tru-pink hover:text-white hover:border-tru-pink transition-all duration-200 uppercase tracking-wider font-heading"
                      >
                        Show More Trips
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <p className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider font-heading">
                        Showing {Math.min(limit, filtered.length)} of {filtered.length}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-[10px] border border-dashed border-white/10 py-16 text-center">
                  <p className="text-2xl font-black text-white uppercase font-heading mb-3">No trips found</p>
                  <p className="text-gray-400 text-sm mb-6">Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider">
                    Clear Filters
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
              <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">Filter &amp; Sort</h2>
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
                Show {filtered.length} Trip{filtered.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
