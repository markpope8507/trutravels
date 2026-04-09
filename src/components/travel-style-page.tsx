"use client";

import { useState, useMemo, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Trip, TravelStyle, travelStyleConfig } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "duration-short", label: "Duration: Shortest" },
  { id: "duration-long", label: "Duration: Longest" },
];

const durationOptions = [
  { id: "any", label: "Any" },
  { id: "short", label: "Under 10 days" },
  { id: "medium", label: "10–14 days" },
  { id: "long", label: "15+ days" },
];

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={tripUrl(trip)} className="group block">
      <div
        className="relative overflow-hidden rounded-[10px] bg-white/5 border border-white/5 hover:border-tru-pink/20 transition-all duration-300"
        style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={trip.image} alt={trip.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-1 left-1"><TravelStyleBadge style={trip.travelStyle} /></div>
        </div>
        <div className="p-4">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-1">{trip.duration}</p>
          <h3 className="text-sm font-black text-white font-heading leading-tight group-hover:text-tru-pink transition-colors mb-2 uppercase">{trip.title}</h3>
          {trip.startLocation && trip.endLocation && (
            <p className="text-gray-400 text-[10px] mb-2 flex items-center gap-1.5">
              <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trip.startLocation} &rarr; {trip.endLocation}
            </p>
          )}
          <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">{trip.tagline}</p>
          {trip.rating && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<div key={i} className="h-4 w-4 bg-[#00B67A] flex items-center justify-center rounded-[2px]"><svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>))}</div>
              <span className="text-white text-[10px] font-bold">{trip.rating}</span>
              <span className="text-gray-500 text-[10px]">({trip.reviewCount})</span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <span className="text-gray-400 text-xs">From</span>
            {trip.originalPrice && <span className="text-gray-500 text-sm line-through">&pound;{trip.originalPrice}</span>}
            <span className="text-white font-bold text-lg">&pound;{trip.price}</span>
            {trip.originalPrice && (
              <>
                <span className="text-red-500 text-[10px] font-bold">-{Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)}%</span>
                <span className="bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-auto">Save &pound;{trip.originalPrice - trip.price}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TravelStylePage({ style, trips }: { style: TravelStyle; trips: Trip[] }) {
  const config = travelStyleConfig[style];
  const styleTrips = trips.filter((t) => t.travelStyle === style);

  const [sort, setSort] = useState("recommended");
  const [activeDuration, setActiveDuration] = useState("any");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterClosing, setFilterClosing] = useState(false);

  const regions = [...new Set(styleTrips.map((t) => t.region))];
  const minPrice = Math.min(...styleTrips.map((t) => t.price));
  const maxPrice = Math.max(...styleTrips.map((t) => t.price));

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleFilterClose = () => {
    setFilterClosing(true);
    setTimeout(() => { setFilterClosing(false); setShowFilter(false); }, 300);
  };

  const activeFilterCount = [activeRegion, activeDuration !== "any" ? activeDuration : null, (priceRange[0] > minPrice || priceRange[1] < maxPrice) ? "price" : null].filter(Boolean).length;

  const clearFilters = () => {
    setActiveRegion(null);
    setActiveDuration("any");
    setPriceRange([minPrice, maxPrice]);
    setSort("recommended");
  };

  const filtered = useMemo(() => {
    let result = [...styleTrips];
    if (activeRegion) result = result.filter((t) => t.region === activeRegion);
    if (activeDuration === "short") result = result.filter((t) => parseInt(t.duration) < 10);
    if (activeDuration === "medium") result = result.filter((t) => { const d = parseInt(t.duration); return d >= 10 && d <= 14; });
    if (activeDuration === "long") result = result.filter((t) => parseInt(t.duration) >= 15);
    result = result.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "duration-short") result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    if (sort === "duration-long") result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    return result;
  }, [styleTrips, sort, activeDuration, activeRegion, priceRange]);

  // Other styles for "explore more"
  const otherStyles = (Object.keys(travelStyleConfig) as TravelStyle[]).filter((s) => s !== style);

  const heroImages: Record<string, string> = {
    classic: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
    backpacker: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80",
    flashpacker: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    multi_country: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80",
    limited_edition: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <img src={heroImages[style]} alt={config.label} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 w-full">
          <img src={config.logo} alt={config.label} className="h-48 sm:h-60 lg:h-72 -mb-3 animate-fade-up" />
          <h2 className="animate-fade-up delay-100 text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase font-heading tracking-wide mb-3">
            {{
              classic: "The perfect balance of everything",
              backpacker: "Maximum adventure, minimum spend",
              flashpacker: "Adventure with an upgrade",
              multi_country: "Why pick one when you can have it all",
              limited_edition: "Once it's gone, it's gone",
            }[style]}
          </h2>
          <p className="animate-fade-up delay-200 text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed mb-4">
            {config.description}
          </p>
          <p className="animate-fade-up delay-300 text-sm" style={{ color: config.color }}>
            {filtered.length} trip{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-heading">Scroll</p>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilter(true)}
              className={`flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border ${
                activeFilterCount > 0
                  ? "border-tru-pink bg-tru-pink/10 text-tru-pink"
                  : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-tru-pink text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-gray-500 text-xs flex-1">{filtered.length} trip{filtered.length !== 1 ? "s" : ""}</span>
            <button
              onClick={() => setShowSort(true)}
              className="flex-shrink-0 h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-white/40 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filter overlay */}
      {showFilter && (
        <div className="fixed inset-0 z-[100] flex justify-start">
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm sm:block hidden transition-opacity duration-300 ${filterClosing ? "opacity-0" : "opacity-100"}`} onClick={handleFilterClose} />
          <div className={`relative w-full sm:w-[420px] lg:w-[480px] bg-tru-navy flex flex-col h-full shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${filterClosing ? "-translate-x-full" : "animate-slide-in-left"}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-white font-black text-lg uppercase font-heading tracking-wider">Filters</h2>
              <button onClick={handleFilterClose} className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {regions.length > 1 && (
                <div>
                  <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Destination</p>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((r) => (
                      <button key={r} onClick={() => setActiveRegion(activeRegion === r ? null : r)} className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${activeRegion === r ? "bg-tru-pink text-white" : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((d) => (
                    <button key={d.id} onClick={() => setActiveDuration(d.id)} className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${activeDuration === d.id ? "text-white" : "border border-white/15 text-gray-300 hover:border-white/30 hover:text-white"}`} style={activeDuration === d.id ? { background: config.color } : undefined}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Price Range <span className="text-gray-400 ml-2">&pound;{priceRange[0]} – &pound;{priceRange[1]}</span></p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs w-12">Min</span>
                    <input type="range" min={minPrice} max={maxPrice} value={priceRange[0]} onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])} className="flex-1 accent-tru-pink" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs w-12">Max</span>
                    <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])} className="flex-1 accent-tru-pink" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-3">Sort By</p>
                <div className="space-y-1">
                  {sortOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setSort(opt.id)} className={`w-full text-left rounded-[10px] px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between ${sort === opt.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                      {opt.label}
                      {sort === opt.id && <svg className="h-4 w-4" style={{ color: config.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
              <button onClick={clearFilters} className="flex-1 rounded-[10px] border border-white/20 py-3 text-sm text-white hover:border-white/40 transition text-center font-heading uppercase tracking-wider">Clear All</button>
              <button onClick={handleFilterClose} className="flex-1 rounded-[10px] py-3 text-sm font-semibold text-white transition-all duration-300 text-center font-heading uppercase tracking-wider" style={{ background: config.color }}>Show {filtered.length} Trip{filtered.length !== 1 ? "s" : ""}</button>
            </div>
          </div>
        </div>
      )}

      {/* Sort modal */}
      {showSort && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSort(false)} />
          <div className="relative w-72 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in">
            <button onClick={() => setShowSort(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-white text-base font-semibold mb-4">Sort By</p>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSort(opt.id); setShowSort(false); }}
                  className={`w-full text-left rounded-[10px] px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between ${sort === opt.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  {opt.label}
                  {sort === opt.id && (
                    <svg className="h-4 w-4" style={{ color: config.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trips grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-black text-white uppercase font-heading mb-3">No trips found</p>
            <p className="text-gray-400 text-sm mb-6">Try a different duration filter.</p>
            <button onClick={() => setActiveDuration("any")} className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider">
              Show All
            </button>
          </div>
        )}
      </div>

      {/* Explore other styles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore More</p>
        <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-8">Other Travel Styles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherStyles.map((s) => {
            const c = travelStyleConfig[s];
            return (
              <Link
                key={s}
                href={`/travel-styles/${s.replace(/_/g, "-")}`}
                className="group rounded-[10px] border border-white/10 bg-white/5 p-6 text-center hover:border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                <img src={c.logo} alt={c.label} className="h-16 mx-auto mb-3" />
                <p className="text-gray-400 text-xs">{trips.filter((t) => t.travelStyle === s).length} trips</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
