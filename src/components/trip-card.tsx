"use client";

import Link from "next/link";
import { Trip, getTripExperienceCounts, MEMBER_CONTENT_ENABLED } from "@/lib/data";
import ExperienceTypesDisclosure from "@/components/experience-types-disclosure";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";
import FavouriteButton from "@/components/favourite-button";

export default function TripCard({
  trip,
  onRemove,
  nextDeparture,
  href,
  showFavourite = true,
}: {
  trip: Trip;
  onRemove?: (id: string) => void;
  nextDeparture?: string;
  href?: string;
  showFavourite?: boolean;
}) {
  const expData = getTripExperienceCounts(trip);
  const placesCount = trip.highlights?.length ?? 0;
  const activitiesCount = expData.total;
  const discountPct = trip.originalPrice
    ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)
    : 0;
  const days = parseInt(trip.duration, 10) || 1;
  const perDay = Math.round(trip.price / days);
  /* A trip with a future on-sale date is announced, not sold: it gets a
     Coming Soon badge instead of a discount sticker, and the price reads as
     indicative rather than as something you can pay today. */
  const comingSoon = Boolean(trip.launch) && new Date(trip.launch!.onSale).getTime() > Date.now();

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

      {/* Save heart — a sibling of the Link (not nested inside the anchor), sat in the
          bottom corner of the image since the top corners hold the style and discount badges.
          Redundant on the saved page, where onRemove already provides a remove control. */}
      {showFavourite && !onRemove && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 aspect-[4/3]">
          <div className="pointer-events-auto absolute bottom-3 right-3">
            <FavouriteButton tripId={trip.id} tripTitle={trip.title} variant="overlay" />
          </div>
        </div>
      )}

      <Link href={href ?? tripUrl(trip)} className="group block h-full">
        <div
          className="relative overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-pink/30 transition-all duration-300 h-full flex flex-col"
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

            {/* Coming Soon — same corner as the discount sticker, and it wins:
                a trip you can't book yet has nothing to discount. */}
            {comingSoon && !onRemove && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-tru-pink px-3 py-1.5 font-heading text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                Coming Soon
              </div>
            )}

            {/* Discount sticker — top right (skip when onRemove is showing) */}
            {discountPct > 0 && !comingSoon && !onRemove && (
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
            {MEMBER_CONTENT_ENABLED && trip.memberOnly && !discountPct && !onRemove && (
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
            {nextDeparture && (
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.18em] font-heading flex items-center gap-1.5 mb-2">
                <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Next departs {nextDeparture}
              </p>
            )}
            {/* Title + Price */}
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <h3 className="text-base font-black text-white uppercase font-heading leading-tight group-hover:text-tru-pink transition-colors">
                {trip.title}
              </h3>
              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-baseline gap-1.5">
                  {trip.originalPrice && !comingSoon && (
                    <span className="text-gray-500 text-xs line-through">
                      &pound;{trip.originalPrice}
                    </span>
                  )}
                  <span className="text-white font-bold text-lg font-heading">
                    &pound;{trip.price}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] font-medium mt-0.5">
                  {comingSoon ? "indicative" : <><span className="text-white">&pound;{perDay}</span> per day</>}
                </p>
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
