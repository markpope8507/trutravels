"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type Trip, getTripExperienceCounts, type TripExperienceCount } from "@/lib/data";
import { useExpDisclosure, toggleExpDisclosure } from "@/lib/use-exp-disclosure";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";
import FavouriteButton from "@/components/favourite-button";

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(d: string) {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTH_ABBR[date.getMonth()]} ${date.getFullYear()}`;
}

function addDays(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export type DepartureWithReturn = {
  date: string;
  returnDate: string;
  price: number;
  originalPrice?: number;
  status: "available" | "almost-full" | "full" | "discount";
  discount?: string;
};

export function getUpcomingDepartures(trip: Trip, dealsOnly: boolean): DepartureWithReturn[] {
  if (!trip.departures) return [];
  const days = parseInt(trip.duration, 10) || 7;
  const now = new Date();
  return trip.departures
    .filter((d) => d.status !== "full" && new Date(d.date) >= now)
    .filter((d) => (dealsOnly ? d.status === "discount" || (d.originalPrice && d.originalPrice > d.price) : true))
    .map((d) => ({ ...d, returnDate: addDays(d.date, days - 1) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default function DealCard({
  trip,
  mode = "deals",
}: {
  trip: Trip;
  mode?: "deals" | "all";
}) {
  const [expanded, setExpanded] = useState(false);
  const dealsOnly = mode === "deals";
  const allDepartures = useMemo(() => getUpcomingDepartures(trip, dealsOnly), [trip, dealsOnly]);
  const next = allDepartures[0];
  const moreDates = allDepartures.slice(1);
  if (!next) return null;

  const expData = getTripExperienceCounts(trip);
  const placesCount = trip.highlights?.length ?? 0;
  const activitiesCount = expData.total;
  const days = parseInt(trip.duration, 10) || 1;

  const bestDeal = allDepartures.reduce((best, d) => {
    const pct = d.originalPrice ? (d.originalPrice - d.price) / d.originalPrice : 0;
    const bestPct = best.originalPrice ? (best.originalPrice - best.price) / best.originalPrice : 0;
    return pct > bestPct ? d : best;
  }, allDepartures[0]);
  const maxDiscount = bestDeal.originalPrice
    ? Math.round(((bestDeal.originalPrice - bestDeal.price) / bestDeal.originalPrice) * 100)
    : 0;
  const perDay = Math.round(bestDeal.price / days);
  const discount = next.originalPrice ? Math.round(((next.originalPrice - next.price) / next.originalPrice) * 100) : 0;

  const headerTitle = dealsOnly ? "On Sale" : "Upcoming";
  const moreDatesNote = dealsOnly ? "on sale" : "upcoming";

  return (
    <article
      className="overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy hover:border-tru-pink/30 transition-all duration-300"
      style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-[260px] lg:w-[320px] flex-shrink-0">
        <Link href={tripUrl(trip)} className="relative block h-full group">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full min-h-[220px] overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/40" />
            <div className="absolute top-3 left-3">
              <TravelStyleBadge style={trip.travelStyle} />
            </div>
            {maxDiscount > 0 && (
              <div
                className="absolute top-3 right-3 h-20 w-20 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-heading shadow-xl ring-2 ring-red-500/40"
                style={{ transform: "rotate(-10deg)" }}
              >
                <span className="text-[8px] font-black uppercase tracking-[0.18em] leading-none mb-0.5 opacity-90">Up to</span>
                <span className="text-2xl font-black leading-none">{maxDiscount}%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">Off</span>
              </div>
            )}
          </div>
        </Link>
        {/* Save heart — outside the image Link so it can't trigger navigation. */}
        <div className="absolute bottom-3 right-3 z-20">
          <FavouriteButton tripId={trip.id} tripTitle={trip.title} variant="overlay" />
        </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="p-5 flex flex-col flex-1">
            {/* Title + Price */}
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <Link href={tripUrl(trip)} className="group/title min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-white uppercase font-heading leading-tight group-hover/title:text-tru-pink transition-colors">
                  {trip.title}
                </h3>
              </Link>
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-baseline gap-1.5">
                  {bestDeal.originalPrice && bestDeal.originalPrice !== bestDeal.price && (
                    <span className="text-gray-500 text-xs line-through">
                      &pound;{bestDeal.originalPrice}
                    </span>
                  )}
                  <span className="text-white font-bold text-xl font-heading">
                    &pound;{bestDeal.price}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] font-medium mt-0.5">
                  <span className="text-white">&pound;{perDay}</span> per day
                </p>
              </div>
            </div>

            {trip.startLocation && trip.endLocation && (
              <p className="text-gray-400 text-xs mb-3 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {trip.startLocation} &mdash; {trip.endLocation}
              </p>
            )}

            {trip.rating && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-xs font-bold ml-0.5">{trip.rating}</span>
                <span className="text-gray-500 text-xs">({trip.reviewCount} Reviews)</span>
              </div>
            )}

            <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
              {trip.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-300 text-xs mb-3">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {trip.duration}
              </span>
              {placesCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {placesCount} {placesCount === 1 ? "Place" : "Places"}
                </span>
              )}
              {activitiesCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  {activitiesCount} {activitiesCount === 1 ? "Activity" : "Activities"}
                </span>
              )}
            </div>

            {expData.byType.length > 0 && (
              <ExperienceTypesDisclosure expCounts={expData.byType} totalActivities={activitiesCount} />
            )}
          </div>
        </div>
      </div>

      {/* Departures header + next row — full width */}
      <div className="bg-white/[0.02] px-5 sm:px-6 py-4 sm:py-5">
        <div className="mb-3">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-1">
            Departures
          </p>
          <p className="text-lg sm:text-xl font-black text-white uppercase font-heading leading-tight">
            {headerTitle}
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex gap-4 sm:gap-10 min-w-0">
            <div className="w-[88px] sm:w-[110px]">
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">Start</p>
              <p className="text-white text-sm font-bold whitespace-nowrap leading-none">{formatDate(next.date)}</p>
            </div>
            <div className="w-[88px] sm:w-[110px]">
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">End</p>
              <p className="text-white text-sm font-bold whitespace-nowrap leading-none">{formatDate(next.returnDate)}</p>
            </div>
            <div className="w-[44px] sm:w-[60px]">
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.15em] font-heading mb-1.5">Save</p>
              <p className="text-tru-pink text-sm font-bold leading-none whitespace-nowrap">{discount > 0 ? `${discount}%` : <>&nbsp;</>}</p>
            </div>
            <div className="w-[60px] sm:w-[80px]">
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">Price</p>
              <p className="text-white text-sm font-bold whitespace-nowrap leading-none">&pound;{next.price}</p>
            </div>
          </div>
          <Link
            href={tripUrl(trip)}
            className="rounded-[10px] px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200 border whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
          >
            Go &rarr;
          </Link>
        </div>
      </div>

      {/* More dates — full width with animated expansion */}
      {moreDates.length > 0 && (
        <div className="border-t border-white/10">
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-wider font-heading text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              <span>
                More Dates
                <span className="text-gray-500 font-semibold normal-case tracking-normal">
                  {" "}&middot; {moreDates.length} {moreDatesNote}
                </span>
              </span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          <div
            className={`grid transition-all duration-500 ease-out ${
              expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="divide-y divide-white/5">
                {moreDates.map((dep) => {
                  const depDiscount = dep.originalPrice
                    ? Math.round(((dep.originalPrice - dep.price) / dep.originalPrice) * 100)
                    : 0;
                  return (
                    <div
                      key={dep.date}
                      className="flex items-end justify-between gap-3 px-5 sm:px-6 py-3 sm:py-4 hover:bg-white/5 transition"
                    >
                      <div className="flex gap-4 sm:gap-10 min-w-0">
                        <div className="w-[88px] sm:w-[110px]">
                          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">Start</p>
                          <p className="text-white text-sm font-bold leading-none whitespace-nowrap">{formatDate(dep.date)}</p>
                        </div>
                        <div className="w-[88px] sm:w-[110px]">
                          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">End</p>
                          <p className="text-white text-sm font-bold leading-none whitespace-nowrap">{formatDate(dep.returnDate)}</p>
                        </div>
                        <div className="w-[44px] sm:w-[60px]">
                          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.15em] font-heading mb-1.5">Save</p>
                          <p className="text-tru-pink text-sm font-bold leading-none whitespace-nowrap">{depDiscount > 0 ? `${depDiscount}%` : <>&nbsp;</>}</p>
                        </div>
                        <div className="w-[60px] sm:w-[80px]">
                          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-heading font-bold mb-1.5">Price</p>
                          <p className="text-white text-sm font-bold leading-none whitespace-nowrap">
                            &pound;{dep.price}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={tripUrl(trip)}
                        className="rounded-[10px] px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200 border whitespace-nowrap flex-shrink-0"
                        style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
                      >
                        Go &rarr;
                      </Link>
                    </div>
                  );
                })}
                <button
                  onClick={() => setExpanded(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-wider font-heading text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  <span>Hide Dates</span>
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function ExperienceTypesDisclosure({
  expCounts,
  totalActivities,
}: {
  expCounts: TripExperienceCount[];
  totalActivities: number;
}) {
  const open = useExpDisclosure();
  return (
    <div className="mt-auto pt-3 border-t border-white/10">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleExpDisclosure();
        }}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left text-[11px] font-bold uppercase tracking-wider font-heading text-gray-300 hover:text-white transition-colors"
      >
        <span>
          TRU Experience Types &middot;{" "}
          <span className="text-gray-500 font-semibold normal-case tracking-normal">
            {totalActivities} activities
          </span>
        </span>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-1.5">
            {expCounts.map((e) => (
              <span
                key={e.id}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-heading"
                style={{ background: `${e.color}25`, border: `1px solid ${e.color}50` }}
              >
                <span style={{ color: e.color }}>{e.count}</span>
                <span className="text-gray-200">{e.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
