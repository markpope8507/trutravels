"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip, getTripExperienceCounts, type TripExperienceCount } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";

export default function TripCard({
  trip,
  onRemove,
}: {
  trip: Trip;
  onRemove?: (id: string) => void;
}) {
  const expData = getTripExperienceCounts(trip);
  const placesCount = trip.highlights?.length ?? 0;
  const activitiesCount = expData.total;
  const discountPct = trip.originalPrice
    ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
    : 0;

  return (
    <div className="relative h-full">
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(trip.id);
          }}
          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition"
          aria-label="Remove from saved"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <Link href={tripUrl(trip)} className="group block h-full">
        <div
          className="relative overflow-hidden rounded-[10px] bg-white/[0.08] border border-white/10 hover:border-tru-pink/30 transition-all duration-300 h-full flex flex-col"
          style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/40" />

            {/* Travel style badge */}
            <div className="absolute top-3 left-3">
              <TravelStyleBadge style={trip.travelStyle} />
            </div>

            {/* Discount sticker — top right (skip when onRemove is showing) */}
            {discountPct > 0 && !onRemove && (
              <div
                className="absolute top-3 right-3 h-20 w-20 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-heading shadow-xl ring-2 ring-red-500/40"
                style={{ transform: "rotate(-10deg)" }}
              >
                <span className="text-[9px] font-black uppercase tracking-[0.18em] leading-none mb-0.5 opacity-90">
                  Save
                </span>
                <span className="text-2xl font-black leading-none">
                  {discountPct}%
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">
                  Off
                </span>
              </div>
            )}

            {/* Member badge — bottom-left fallback when no discount */}
            {trip.memberOnly && !discountPct && !onRemove && (
              <div
                className="absolute top-3 right-3 bg-tru-pink text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading"
                style={{ filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.5))" }}
              >
                Members Only
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-5 flex flex-col flex-1">
            {/* Title + Price */}
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <h3 className="text-base font-bold text-white font-heading leading-tight group-hover:text-tru-pink transition-colors">
                {trip.title}
              </h3>
              <div className="flex items-baseline gap-1.5 flex-shrink-0">
                {trip.originalPrice && (
                  <span className="text-gray-500 text-xs line-through">
                    &pound;{trip.originalPrice}
                  </span>
                )}
                <span className="text-white font-bold text-lg font-heading">
                  &pound;{trip.price}
                </span>
              </div>
            </div>

            {/* Start → End */}
            {trip.startLocation && trip.endLocation && (
              <p className="text-gray-400 text-xs mb-3 flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-tru-pink flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {trip.startLocation} &mdash; {trip.endLocation}
              </p>
            )}

            {/* Rating */}
            {trip.rating && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5 text-amber-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-xs font-bold ml-0.5">
                  {trip.rating}
                </span>
                <span className="text-gray-500 text-xs">
                  ({trip.reviewCount} Reviews)
                </span>
              </div>
            )}

            {/* Tagline */}
            <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
              {trip.tagline}
            </p>

            {/* Quick facts row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-300 text-xs mb-3">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-tru-pink flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {trip.duration}
              </span>
              {placesCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-tru-pink flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {placesCount} {placesCount === 1 ? "Place" : "Places"}
                </span>
              )}
              {activitiesCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-3.5 w-3.5 text-tru-pink flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  {activitiesCount}{" "}
                  {activitiesCount === 1 ? "Activity" : "Activities"}
                </span>
              )}
            </div>

            {/* Experience type disclosure */}
            {expData.byType.length > 0 && (
              <ExperienceTypesDisclosure
                expCounts={expData.byType}
                totalActivities={activitiesCount}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function ExperienceTypesDisclosure({
  expCounts,
  totalActivities,
}: {
  expCounts: TripExperienceCount[];
  totalActivities: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-auto pt-3 border-t border-white/10">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
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
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-1.5">
            {expCounts.map((e) => (
              <span
                key={e.id}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-heading"
                style={{
                  background: `${e.color}25`,
                  border: `1px solid ${e.color}50`,
                }}
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
