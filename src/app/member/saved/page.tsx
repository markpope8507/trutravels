"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { trips, Trip } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import MemberGate from "@/components/member-gate";
import TravelStyleBadge from "@/components/travel-style-badge";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

function TripCard({ trip, onRemove }: { trip: Trip; onRemove?: (id: string) => void }) {
  return (
    <div className="relative">
      {onRemove && (
        <button
          onClick={(e) => { e.preventDefault(); onRemove(trip.id); }}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <Link href={tripUrl(trip)} className="group block">
        <div className="rounded-[10px] bg-white/5 border border-white/5 hover:border-tru-pink/20 transition-all duration-300 overflow-hidden" style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}>
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
            <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{trip.tagline}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              {trip.originalPrice && <span className="text-gray-500 text-base line-through">&pound;{trip.originalPrice}</span>}
              <span className="text-white font-bold text-2xl font-heading">&pound;{trip.price}</span>
              {trip.originalPrice && (
                <>
                  <span className="text-red-500 text-sm font-bold">-{Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)}%</span>
                  <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ml-auto">Save &pound;{trip.originalPrice - trip.price}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function SavedContent() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem("trutravels-favourites") || "[]");
    setSavedIds(favs);
  }, []);

  const savedTrips = savedIds.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as Trip[];

  const handleRemove = (id: string) => {
    const updated = savedIds.filter((sid) => sid !== id);
    setSavedIds(updated);
    localStorage.setItem("trutravels-favourites", JSON.stringify(updated));
  };

  // Generate recommendations based on saved trips
  const savedRegions = [...new Set(savedTrips.map((t) => t.region))];
  const savedStyles = [...new Set(savedTrips.map((t) => t.travelStyle))];
  const recommendations = trips
    .filter((t) => !savedIds.includes(t.id))
    .filter((t) => savedRegions.includes(t.region) || savedStyles.includes(t.travelStyle))
    .slice(0, 8);

  // Fallback recommendations if no saved trips
  const fallbackRecs = trips.filter((t) => !savedIds.includes(t.id)).slice(0, 6);
  const recsToShow = recommendations.length > 0 ? recommendations : fallbackRecs;

  return (
    <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/member/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-6">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </Link>
      {/* Header */}
      <div className="mb-10">
        <p className="text-tru-pink text-sm font-semibold uppercase tracking-wider mb-1">Your Collection</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight mb-2">Saved Trips</h1>
        <p className="text-gray-400 text-sm">
          {savedTrips.length > 0
            ? `You have ${savedTrips.length} trip${savedTrips.length !== 1 ? "s" : ""} saved. Tap the heart on any trip to add or remove.`
            : "You haven't saved any trips yet. Browse and tap the heart to save trips you love."
          }
        </p>
      </div>

      {/* Saved trips grid */}
      {savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {savedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 mb-16 rounded-[10px] border border-white/10 bg-white/5">
          <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-white font-bold text-lg font-heading uppercase mb-2">No saved trips yet</p>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Browse our trips and tap the heart icon to save the ones that catch your eye.</p>
          <Link href="/explore" className="inline-block rounded-[10px] bg-tru-pink px-8 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider font-heading">
            Explore Trips
          </Link>
        </div>
      )}

      {/* Recommendations */}
      <section>
        <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">
          {savedTrips.length > 0 ? "Based on Your Saves" : "Popular Right Now"}
        </p>
        <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-2">
          {savedTrips.length > 0 ? "You Might Also Like" : "Recommended For You"}
        </h2>
        {savedTrips.length > 0 && savedRegions.length > 0 && (
          <p className="text-gray-400 text-sm mb-6">
            Because you saved trips in {savedRegions.join(" and ")}, we think you&apos;ll love these too.
          </p>
        )}
        <div className="recs-carousel relative mt-6">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={true}
            freeMode={false}
            navigation={{ nextEl: ".recs-next", prevEl: ".recs-prev" }}
            breakpoints={{
              480: { slidesPerView: 1.4, centeredSlides: true },
              640: { slidesPerView: 2.2, centeredSlides: false },
              1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
            }}
            speed={600}
          >
            {recsToShow.map((trip) => (
              <SwiperSlide key={trip.id}>
                <TripCard trip={trip} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="recs-prev absolute top-[calc(50%-40px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="recs-next absolute top-[calc(50%-40px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>
    </div>
  );
}

export default function SavedPage() {
  return (
    <MemberGate>
      <SavedContent />
    </MemberGate>
  );
}
