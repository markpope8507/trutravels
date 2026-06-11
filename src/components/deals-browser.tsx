"use client";

import { useState } from "react";
import Link from "next/link";
import { trips } from "@/lib/data";
import { tripUrl } from "@/lib/utils";

const dealsSortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "highest-discount", label: "Highest Discount" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "duration-short", label: "Duration: Shortest First" },
];

const statusDot: Record<string, string> = {
  available: "bg-tru-green",
  "almost-full": "bg-amber-500",
  discount: "bg-tru-pink",
};

export default function DealsBrowser() {
  const [dealsSortOpen, setDealsSortOpen] = useState(false);
  const [dealsSort, setDealsSort] = useState("recommended");

  const dealsTrips = trips.filter((t) => t.originalPrice);

  return (
    <>
      {/* Deals snippets */}
      <section id="deals" className="relative mb-16 scroll-mt-20 overflow-hidden">
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-6 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -bottom-10 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExploreSectionHeader
            eyebrow="Deals · Limited Time"
            title="Best Prices On The Road"
            titleAccent="Road"
            description="Sale departures, last-minute discounts, and trips with the biggest savings on right now. Gone when they're gone."
            accent="tru-pink"
            icon={<TagIcon />}
            action={
              <button
                onClick={() => setDealsSortOpen(true)}
                className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-white/40 hover:text-white transition"
                aria-label="Sort deals"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            }
          />
          {dealsTrips.length > 0 ? (
            <div className="space-y-3">
              {[...dealsTrips].sort((a, b) => {
                if (dealsSort === "highest-discount") return ((b.originalPrice || 0) - b.price) - ((a.originalPrice || 0) - a.price);
                if (dealsSort === "price-low") return a.price - b.price;
                if (dealsSort === "price-high") return b.price - a.price;
                if (dealsSort === "duration-short") return parseInt(a.duration) - parseInt(b.duration);
                return 0;
              }).map((trip) => {
                const savings = trip.originalPrice ? trip.originalPrice - trip.price : 0;
                const discountPct = trip.originalPrice
                  ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
                  : 0;
                const days = parseInt(trip.duration, 10) || 1;
                const perDay = Math.round(trip.price / days);
                return (
                  <Link
                    key={trip.id}
                    href={tripUrl(trip)}
                    className="group relative block rounded-[12px] border border-white/10 bg-tru-navy hover:border-white/20 hover:bg-[#0d2a4e] transition-all duration-200 overflow-hidden"
                  >
                    {discountPct > 0 && (
                      <div
                        className="absolute top-2 right-2 z-10 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-heading shadow-lg ring-2 ring-red-500/40"
                        style={{ transform: "rotate(-10deg)" }}
                      >
                        <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.15em] leading-none opacity-90">Save</span>
                        <span className="text-sm sm:text-base font-black leading-none">{discountPct}%</span>
                        <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.18em] leading-none">Off</span>
                      </div>
                    )}
                    <div className="flex gap-3 p-3">
                      <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[8px] overflow-hidden flex-shrink-0">
                        <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                      </div>
                      <div className={`min-w-0 flex-1 ${discountPct > 0 ? "pr-14 sm:pr-16" : ""}`}>
                        <p className="text-white text-sm sm:text-base font-black uppercase font-heading leading-snug line-clamp-2 group-hover:text-tru-pink transition-colors">
                          {trip.title}
                        </p>
                        {trip.startLocation && trip.endLocation && (
                          <p className="text-gray-300 text-[11px] mt-1 flex items-center gap-1.5 truncate">
                            <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {trip.startLocation} &mdash; {trip.endLocation}
                          </p>
                        )}
                        <p className="text-gray-300 text-[11px] mt-0.5 flex items-center gap-1.5">
                          <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                          </svg>
                          {trip.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-1 border-t border-white/5">
                      <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider font-heading mb-1">
                        Just <span className="text-white">&pound;{perDay}</span> per day
                      </p>
                      <div className="flex items-end gap-3">
                        {trip.originalPrice && (
                          <span className="text-gray-500 text-[11px] line-through mb-1">&pound;{trip.originalPrice}</span>
                        )}
                        <span className="text-white text-base font-black font-heading">&pound;{trip.price}</span>
                        {savings > 0 && (
                          <span className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider font-heading mb-1 ml-1">
                            Save &pound;{savings}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No deals available right now. Check back soon!</p>
          )}
        </div>
      </section>

      {/* By Date departures */}
      <section id="departures" className="relative mb-16 scroll-mt-20 overflow-hidden">
        <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[280px] sm:w-[440px] lg:w-[640px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 -bottom-8 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExploreSectionHeader
            eyebrow="Departures · Next Available"
            title="Bags Packed, Ready To Go"
            titleAccent="Go"
            description="Sorted by the next trips leaving. Whatever's free in your calendar, there's probably one that fits."
            accent="tru-blue"
            icon={<CalendarIcon />}
          />
          {(() => {
            const allDepartures = trips
              .filter((t) => t.departures && t.departures.length > 0)
              .flatMap((t) =>
                (t.departures || [])
                  .filter((d) => d.status !== "full")
                  .map((d) => ({ ...d, trip: t }))
              )
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            return allDepartures.length > 0 ? (
              <div className="space-y-3">
                {allDepartures.map((dep) => {
                  const savings = dep.originalPrice && dep.originalPrice !== dep.price ? dep.originalPrice - dep.price : 0;
                  const statusLabel = dep.status === "almost-full" ? "Almost Full" : dep.status === "discount" ? "On Sale" : "Available";
                  const days = parseInt(dep.trip.duration, 10) || 1;
                  const perDay = Math.round(dep.price / days);
                  return (
                    <Link
                      key={`${dep.trip.id}-${dep.date}`}
                      href={tripUrl(dep.trip)}
                      className="group block rounded-[12px] border border-white/10 bg-tru-navy hover:border-white/20 hover:bg-[#0d2a4e] transition-all duration-200 overflow-hidden"
                    >
                      <div className="flex items-center gap-4 p-3">
                        <div className="flex-shrink-0 w-14 text-center">
                          <p className="text-white text-2xl font-black font-heading leading-none">
                            {new Date(dep.date).getDate()}
                          </p>
                          <p className="text-gray-400 text-[10px] uppercase font-heading tracking-wider mt-1">
                            {new Date(dep.date).toLocaleDateString("en-GB", { month: "short" })}
                          </p>
                          <p className="text-gray-500 text-[10px]">{new Date(dep.date).getFullYear()}</p>
                        </div>
                        <div className="w-px h-14 bg-white/10 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm sm:text-base font-black uppercase font-heading leading-snug line-clamp-2 group-hover:text-tru-pink transition-colors">
                            {dep.trip.title}
                          </p>
                          {dep.trip.startLocation && dep.trip.endLocation && (
                            <p className="text-gray-300 text-[11px] mt-1 flex items-center gap-1.5 truncate">
                              <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {dep.trip.startLocation} &mdash; {dep.trip.endLocation}
                            </p>
                          )}
                          <p className="text-gray-300 text-[11px] mt-0.5 flex items-center gap-1.5">
                            <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <circle cx="12" cy="12" r="9" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                            </svg>
                            {dep.trip.duration}
                          </p>
                          <p className="text-gray-300 text-[11px] mt-0.5 flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${statusDot[dep.status] || "bg-tru-green"}`} />
                            {statusLabel}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-1 border-t border-white/5">
                        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider font-heading mb-1">
                          Just <span className="text-white">&pound;{perDay}</span> per day
                        </p>
                        <div className="flex items-end gap-3">
                          {dep.originalPrice && dep.originalPrice !== dep.price && (
                            <span className="text-gray-500 text-[11px] line-through mb-1">&pound;{dep.originalPrice}</span>
                          )}
                          <span className="text-white text-base font-black font-heading">&pound;{dep.price}</span>
                          {savings > 0 && (
                            <span className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider font-heading mb-1 ml-1">
                              Save &pound;{savings}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No upcoming departures. Check back soon!</p>
            );
          })()}
        </div>
      </section>

      {/* Deals sort modal */}
      {dealsSortOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDealsSortOpen(false)} />
          <div className="relative w-72 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in">
            <button onClick={() => setDealsSortOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-white text-base font-semibold mb-4">Sort By</p>
            <div className="space-y-1">
              {dealsSortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setDealsSort(opt.id);
                    setDealsSortOpen(false);
                  }}
                  className={`block w-full text-left rounded-md px-3 py-2 text-sm transition ${
                    dealsSort === opt.id ? "bg-tru-pink/15 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   ExploreSectionHeader — shared by the deals + departures sections
   ============================================================ */
function ExploreSectionHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  accent,
  icon,
  action,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  accent: "tru-pink" | "tru-green" | "tru-blue";
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  const accentText: Record<typeof accent, string> = {
    "tru-pink": "text-tru-pink",
    "tru-green": "text-tru-green",
    "tru-blue": "text-tru-blue",
  };
  const accentBorder: Record<typeof accent, string> = {
    "tru-pink": "border-tru-pink/40",
    "tru-green": "border-tru-green/40",
    "tru-blue": "border-tru-blue/40",
  };
  const lead = title.endsWith(titleAccent)
    ? title.slice(0, title.length - titleAccent.length).trimEnd()
    : title;
  return (
    <div className="mb-10 flex items-center justify-between gap-8 flex-wrap">
      <div className="flex-1 min-w-0 max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className={`h-px w-10 ${accentBorder[accent]} border-t-2`} />
          <p className={`${accentText[accent]} text-[11px] font-bold uppercase tracking-[0.3em] font-heading`}>
            {eyebrow}
          </p>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
          {lead}{lead && <> </>}
          <span className={accentText[accent]}>{titleAccent}</span>
        </h2>
        <p className="text-gray-400 mt-4 text-sm sm:text-base max-w-xl">{description}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {action}
        <div className={`${accentText[accent]} hidden md:block`}>{icon}</div>
      </div>
    </div>
  );
}

function TagIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14 L52 14 L86 48 L52 82 L14 44 Z" />
      <circle cx="28" cy="28" r="6" />
      <circle cx="42" cy="42" r="5" />
      <circle cx="62" cy="62" r="5" />
      <line x1="38" y1="66" x2="66" y2="38" />
      <path d="M28 28 L8 8" opacity="0.6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="20" width="76" height="68" rx="6" />
      <line x1="12" y1="38" x2="88" y2="38" />
      <line x1="30" y1="10" x2="30" y2="26" />
      <line x1="70" y1="10" x2="70" y2="26" />
      <circle cx="30" cy="54" r="2.5" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="50" cy="54" r="2.5" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="70" cy="54" r="2.5" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="30" cy="70" r="2.5" fill="currentColor" stroke="none" opacity="0.45" />
      <rect x="58" y="62" width="16" height="16" rx="3" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}
