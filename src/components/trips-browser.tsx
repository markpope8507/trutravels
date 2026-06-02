"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Trip, TravelStyle, travelStyleConfig } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const lifeMoments = [
  { id: "solo", label: "Solo Adventure", emoji: "🎒" },
  { id: "mates", label: "With Mates", emoji: "👯" },
  { id: "birthday", label: "Birthday Trip", emoji: "🎂" },
  { id: "gap-year", label: "Gap Year", emoji: "🌏" },
  { id: "career-break", label: "Career Break", emoji: "💼" },
  { id: "fresh-start", label: "Fresh Start", emoji: "🌅" },
];

const durationOptions = [
  { id: "any", label: "Any" },
  { id: "short", label: "Under 10 days" },
  { id: "medium", label: "10–14 days" },
  { id: "long", label: "15+ days" },
];

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "duration-short", label: "Duration: Shortest" },
  { id: "duration-long", label: "Duration: Longest" },
];

/* ============================================================
   TRIP CAROUSEL SECTION
   ============================================================ */
function TripCarouselSection({ label, title, labelColor, trips: sectionTrips, id }: { label: string; title: string; labelColor: string; trips: Trip[]; id: string }) {
  if (sectionTrips.length === 0) return null;
  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1`} style={{ color: labelColor }}>{label}</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">{title}</h2>
        </div>
      </div>
      <div className={`${id}-carousel relative`}>
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.15}
          freeMode={{ enabled: true, sticky: false }}
          navigation={{ nextEl: `.${id}-next`, prevEl: `.${id}-prev` }}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 3.2, spaceBetween: 20 },
          }}
          speed={600}
        >
          {sectionTrips.map((trip) => (
            <SwiperSlide key={trip.id}>
              <TripCard trip={trip} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button className={`${id}-prev absolute top-[calc(50%-40px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default`}>
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className={`${id}-next absolute top-[calc(50%-40px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default`}>
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   FULL-SCREEN FILTER OVERLAY
   ============================================================ */
function FilterOverlay({
  isOpen,
  onClose,
  regions,
  trips,
  activeRegion,
  setActiveRegion,
  activeStyle,
  setActiveStyle,
  activeMoment,
  setActiveMoment,
  activeDuration,
  setActiveDuration,
  priceRange,
  setPriceRange,
  sort,
  setSort,
  filteredCount,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  regions: { name: string; count: number }[];
  trips: Trip[];
  activeRegion: string | null;
  setActiveRegion: (v: string | null) => void;
  activeStyle: TravelStyle | null;
  setActiveStyle: (v: TravelStyle | null) => void;
  activeMoment: string | null;
  setActiveMoment: (v: string | null) => void;
  activeDuration: string;
  setActiveDuration: (v: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  sort: string;
  setSort: (v: string) => void;
  filteredCount: number;
  onClear: () => void;
}) {
  const travelStyles = Object.entries(travelStyleConfig) as [TravelStyle, typeof travelStyleConfig[TravelStyle]][];
  const [closing, setClosing] = useState(false);

  const minPrice = Math.min(...trips.map((t) => t.price));
  const maxPrice = Math.max(...trips.map((t) => t.price));

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-start">
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm sm:block hidden transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"}`} onClick={handleClose} />
      <div className={`relative w-full sm:w-[420px] lg:w-[480px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${closing ? "-translate-x-full" : "animate-slide-in-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">Filters</h2>
        <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Destination */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Destination</p>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r.name}
                onClick={() => setActiveRegion(activeRegion === r.name ? null : r.name)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  activeRegion === r.name
                    ? "bg-tru-pink text-white"
                    : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"
                }`}
              >
                {r.name} <span className="text-gray-500 ml-1">({r.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Travel Style</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {travelStyles.map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveStyle(activeStyle === key ? null : key)}
                className={`rounded-[10px] p-4 transition-all duration-200 flex items-center justify-center ${
                  activeStyle === key
                    ? "border-2 bg-white/10"
                    : "border border-white/10 bg-white/5 hover:border-white/20"
                }`}
                style={activeStyle === key ? { borderColor: config.color, background: `${config.color}15` } : undefined}
              >
                <img
                  src={config.logo}
                  alt={config.label}
                  className="h-16 w-auto max-w-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Life Moment */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Life Moment</p>
          <div className="flex flex-wrap gap-2">
            {lifeMoments.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMoment(activeMoment === m.id ? null : m.id)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeMoment === m.id
                    ? "bg-tru-pink text-white"
                    : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{m.emoji}</span>
                <span className="font-heading text-[11px] font-semibold uppercase tracking-wider">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Duration</p>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDuration(d.id)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  activeDuration === d.id
                    ? "bg-tru-pink text-white"
                    : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">
            Price Range <span className="text-gray-400 ml-2">&pound;{priceRange[0]} – &pound;{priceRange[1]}</span>
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs w-12">Min</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                className="flex-1 accent-tru-pink"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs w-12">Max</span>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                className="flex-1 accent-tru-pink"
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Sort By</p>
          <div className="space-y-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSort(opt.id)}
                className={`w-full text-left rounded-[10px] px-4 py-3 text-sm transition-all duration-200 ${
                  sort === opt.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {opt.label}
                {sort === opt.id && (
                  <svg className="inline h-4 w-4 ml-2 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
        <button
          onClick={onClear}
          className="flex-1 rounded-[10px] border border-white/20 py-3 text-sm text-white hover:border-white/40 transition text-center font-heading uppercase tracking-wider"
        >
          Clear All
        </button>
        <button
          onClick={handleClose}
          className="flex-1 rounded-[10px] bg-tru-pink py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 text-center font-heading uppercase tracking-wider"
        >
          Show {filteredCount} Trip{filteredCount !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
    </div>
  );
}

/* ============================================================
   MAIN BROWSER
   ============================================================ */
export default function TripsBrowser({ trips, regions }: { trips: Trip[]; regions: { name: string; count: number }[] }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const recent: string[] = JSON.parse(localStorage.getItem("trutravels-recent") || "[]");
    setRecentIds(recent);
  }, []);

  const recentTrips = recentIds.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as Trip[];

  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<TravelStyle | null>(null);
  const [activeMoment, setActiveMoment] = useState<string | null>(null);
  const [activeDuration, setActiveDuration] = useState("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sort, setSort] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParam = searchParams.get("view") as "discover" | "deals" | "departures" | null;
  const view = viewParam === "deals" || viewParam === "departures" ? viewParam : "discover";

  const setView = (v: "discover" | "deals" | "departures") => {
    const params = new URLSearchParams(searchParams.toString());
    if (v === "discover") {
      params.delete("view");
    } else {
      params.set("view", v);
    }
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };
  const [dealsSort, setDealsSort] = useState("recommended");
  const [dealsSortOpen, setDealsSortOpen] = useState(false);
  const [navSticky, setNavSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById("explore-bar");
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      setNavSticky(rect.bottom < 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dealsSortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "highest-discount", label: "Highest Discount" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "duration-short", label: "Duration: Shortest" },
  ];

  useEffect(() => {
    const min = Math.min(...trips.map((t) => t.price));
    const max = Math.max(...trips.map((t) => t.price));
    setPriceRange([min, max]);
  }, [trips]);

  const filtered = useMemo(() => {
    let result = [...trips];
    if (activeRegion) result = result.filter((t) => t.region === activeRegion);
    if (activeStyle) result = result.filter((t) => t.travelStyle === activeStyle);
    if (activeDuration === "short") result = result.filter((t) => parseInt(t.duration) < 10);
    if (activeDuration === "medium") result = result.filter((t) => { const d = parseInt(t.duration); return d >= 10 && d <= 14; });
    if (activeDuration === "long") result = result.filter((t) => parseInt(t.duration) >= 15);
    result = result.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "duration-short") result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    if (sort === "duration-long") result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    return result;
  }, [trips, activeRegion, activeStyle, activeDuration, priceRange, sort]);

  const activeFilterCount = [activeRegion, activeStyle, activeMoment, activeDuration !== "any" ? activeDuration : null].filter(Boolean).length;

  const clearFilters = () => {
    setActiveRegion(null);
    setActiveStyle(null);
    setActiveMoment(null);
    setActiveDuration("any");
    setPriceRange([Math.min(...trips.map((t) => t.price)), Math.max(...trips.map((t) => t.price))]);
    setSort("recommended");
  };

  // Curated sections
  const trendingTrips = trips.filter((t) => t.originalPrice); // on sale = trending
  const budgetTrips = [...trips].sort((a, b) => a.price - b.price).slice(0, 3);
  const firstTimerTrips = trips.filter((t) => t.travelStyle === "classic" || t.travelStyle === "backpacker");
  const dealsTrips = trips.filter((t) => t.originalPrice);
  const departureTrips = [...trips].sort(() => Math.random() - 0.5); // mock closest departures

  const viewButtons = [
    { id: "discover" as const, label: "Explore", icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "deals" as const, label: "Deals", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "departures" as const, label: "By Date", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  return (
    <div>
      <FilterOverlay
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        regions={regions}
        trips={trips}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
        activeMoment={activeMoment}
        setActiveMoment={setActiveMoment}
        activeDuration={activeDuration}
        setActiveDuration={setActiveDuration}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sort={sort}
        setSort={setSort}
        filteredCount={filtered.length}
        onClear={clearFilters}
      />

      {/* Hero */}
      <section id="explore-hero" className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tru-pink/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Explore</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase font-heading tracking-tight mb-4">
              Find Your <span className="text-gradient">Trip</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Handcrafted group adventures for 18&ndash;35s. Filter by destination, travel style, or the moment in life that brought you here.
            </p>
            <button
              onClick={() => setShowFilters(true)}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider font-heading transition-all duration-200 border ${
                activeFilterCount > 0
                  ? "border-tru-pink bg-tru-pink/10 text-tru-pink"
                  : "border-white/30 text-white hover:border-white/50 hover:bg-white/5"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-tru-pink text-white text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      {recentTrips.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-4">Recently Viewed</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentTrips.map((trip) => (
              <Link
                key={trip.id}
                href={tripUrl(trip)}
                className="flex-shrink-0 w-72 flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-3 hover:border-white/20 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-bold font-heading truncate group-hover:text-tru-pink transition-colors">{trip.title}</p>
                  <p className="text-gray-400 text-xs mb-1.5">{trip.region} &middot; {trip.duration}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {trip.originalPrice && (
                      <span className="text-gray-500 text-xs line-through">&pound;{trip.originalPrice}</span>
                    )}
                    <span className="text-white font-bold text-sm">&pound;{trip.price}</span>
                    {trip.originalPrice && (
                      <>
                        <span className="text-red-500 text-[9px] font-bold">
                          -{Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)}%
                        </span>
                        <span className="bg-red-500 text-white text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                          Save &pound;{trip.originalPrice - trip.price}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action bar - normal flow, duplicated as fixed when scrolled */}
      <div id="explore-bar" className="bg-tru-navy/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14 gap-2 overflow-x-auto scrollbar-hide">
            {viewButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 ${
                  view === btn.id
                    ? "bg-white/15 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                </svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed duplicate when scrolled past */}
      <div className={`fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14 gap-2 overflow-x-auto scrollbar-hide">
            {viewButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 ${
                  view === btn.id
                    ? "bg-white/15 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={btn.icon} />
                </svg>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {activeRegion && (
              <button onClick={() => setActiveRegion(null)} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 transition">
                {activeRegion}
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {activeStyle && (
              <button onClick={() => setActiveStyle(null)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white hover:opacity-80 transition" style={{ background: travelStyleConfig[activeStyle].color }}>
                {travelStyleConfig[activeStyle].label}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {activeMoment && (
              <button onClick={() => setActiveMoment(null)} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 transition">
                {lifeMoments.find((m) => m.id === activeMoment)?.label}
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {activeDuration !== "any" && (
              <button onClick={() => setActiveDuration("any")} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 transition">
                {durationOptions.find((d) => d.id === activeDuration)?.label}
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-white transition ml-1">Clear all</button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Discover */}
        {view === "discover" && activeFilterCount === 0 && (
          <div>
            <TripCarouselSection id="trending" label="Trending Now" title="Most Popular Trips" labelColor="#FF3F99" trips={trendingTrips} />
            <TripCarouselSection id="first-timer" label="New to Tru?" title="Perfect First Trips" labelColor="#6BD495" trips={firstTimerTrips} />
            <TripCarouselSection id="budget" label="Ballin' on a Budget" title="Best Value Trips" labelColor="#FCA501" trips={budgetTrips} />
          </div>
        )}

        {/* Discover with filters active */}
        {view === "discover" && activeFilterCount > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">
                Filtered Trips
                <span className="text-gray-500 text-sm font-normal ml-3">{filtered.length} trips</span>
              </h2>
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filtered.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-black text-white uppercase font-heading mb-3">No trips found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Deals */}
        {view === "deals" && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Limited Time</p>
                <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">Deals &amp; Discounts</h2>
              </div>
              <button
                onClick={() => setDealsSortOpen(true)}
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-white/40 hover:text-white transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
            {dealsTrips.length > 0 ? (
              <div className="space-y-3">
                {[...dealsTrips].sort((a, b) => {
                  if (dealsSort === "highest-discount") return ((b.originalPrice || 0) - b.price) - ((a.originalPrice || 0) - a.price);
                  if (dealsSort === "price-low") return a.price - b.price;
                  if (dealsSort === "price-high") return b.price - a.price;
                  if (dealsSort === "duration-short") return parseInt(a.duration) - parseInt(b.duration);
                  return 0;
                }).map((trip) => (
                  <Link key={trip.id} href={tripUrl(trip)} className="group flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 hover:border-tru-pink/20 hover:bg-white/10 transition-all duration-200">
                    <img src={trip.image} alt={trip.title} className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-1"><span className="hidden sm:inline">{trip.region} &middot; </span>{trip.duration}</p>
                      <p className="text-white text-sm sm:text-base font-bold font-heading group-hover:text-tru-pink transition-colors line-clamp-2">{trip.title}</p>
                      <p className="text-gray-400 text-xs mt-1 hidden sm:block">{trip.tagline}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {trip.originalPrice && (
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5">
                          Save &pound;{trip.originalPrice - trip.price}
                        </span>
                      )}
                      <div className="flex items-baseline gap-2 justify-end">
                        {trip.originalPrice && (
                          <span className="text-gray-500 text-sm line-through">&pound;{trip.originalPrice}</span>
                        )}
                        <span className="text-white font-bold text-lg">&pound;{trip.price}</span>
                      </div>
                      <p className="text-gray-500 text-[10px]">per person</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No deals available right now. Check back soon!</p>
            )}
          </div>
        )}

        {/* By Date */}
        {view === "departures" && (
          <div>
            <div className="mb-8">
              <p className="text-tru-blue text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Next Available</p>
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">Closest Departures</h2>
            </div>
            {(() => {
              const allDepartures = trips
                .filter((t) => t.departures && t.departures.length > 0)
                .flatMap((t) =>
                  (t.departures || [])
                    .filter((d) => d.status !== "full")
                    .map((d) => ({ ...d, trip: t }))
                )
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              const statusDot: Record<string, string> = {
                available: "bg-tru-green",
                "almost-full": "bg-amber-500",
                discount: "bg-tru-pink",
              };

              return allDepartures.length > 0 ? (
                <div className="space-y-3">
                  {allDepartures.map((dep) => (
                    <Link
                      key={`${dep.trip.id}-${dep.date}`}
                      href={tripUrl(dep.trip)}
                      className="group flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 hover:border-tru-pink/20 hover:bg-white/10 transition-all duration-200"
                    >
                      {/* Date */}
                      <div className="flex-shrink-0 w-16 sm:w-20 text-center">
                        <p className="text-white text-lg sm:text-xl font-black font-heading leading-none">
                          {new Date(dep.date).getDate()}
                        </p>
                        <p className="text-gray-400 text-[10px] uppercase font-heading tracking-wider">
                          {new Date(dep.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </p>
                      </div>

                      <div className="w-px h-12 bg-white/10 flex-shrink-0" />

                      {/* Trip info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-1">
                          {dep.trip.duration}
                        </p>
                        <p className="text-white text-sm font-bold font-heading group-hover:text-tru-pink transition-colors truncate">
                          {dep.trip.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`h-2 w-2 rounded-full ${statusDot[dep.status] || "bg-tru-green"}`} />
                          <span className="text-gray-400 text-[10px] uppercase tracking-wider">
                            {dep.status === "almost-full" ? "Almost Full" : dep.status === "discount" ? "On Sale" : "Available"}
                          </span>
                          {dep.discount && <span className="text-red-500 text-[10px] font-bold">{dep.discount}</span>}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        {dep.originalPrice && dep.originalPrice !== dep.price && (
                          <span className="bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1">
                            Save &pound;{dep.originalPrice - dep.price}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2 justify-end">
                          {dep.originalPrice && dep.originalPrice !== dep.price && (
                            <span className="text-gray-500 text-sm line-through">&pound;{dep.originalPrice}</span>
                          )}
                          <span className="font-bold text-lg text-white">&pound;{dep.price}</span>
                        </div>
                        <p className="text-gray-500 text-[10px]">per person</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No upcoming departures. Check back soon!</p>
              );
            })()}
          </div>
        )}

      </div>

      {/* Deals sort modal */}
      {dealsSortOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDealsSortOpen(false)} />
          <div className="relative w-72 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in">
            <button
              onClick={() => setDealsSortOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-white text-base font-semibold mb-4">Sort By</p>
            <div className="space-y-1">
              {dealsSortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setDealsSort(opt.id); setDealsSortOpen(false); }}
                  className={`w-full text-left rounded-[10px] px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between ${
                    dealsSort === opt.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                  {dealsSort === opt.id && (
                    <svg className="h-4 w-4 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inspire Me CTA */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-[10px] border border-white/10 bg-white/5 p-8 sm:p-12 text-center">
          <p className="text-3xl sm:text-4xl font-handwriting text-tru-pink mb-3">
            Not sure where to start?
          </p>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Answer a few quick questions and we&apos;ll match you with your perfect trip.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink px-8 py-3.5 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Inspire Me
          </Link>
        </div>
      </div>
    </div>
  );
}
