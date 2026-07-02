"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import {
  RegionInfo,
  countries,
  trips as allTrips,
  stories as allStories,
} from "@/lib/data";
import { slugify } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import TripCard from "@/components/trip-card";
import StoryCard from "@/components/story-card";
import PillButton from "@/components/pill-button";
import DestinationsCarousel from "@/components/destinations-carousel";
import { ActivityShowcase, UpcomingDepartures } from "@/components/country-page";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const REVIEWS = [
  { name: "Sophie C.", text: "Did Thailand then hopped over to Cambodia — best few weeks of my life. Every detail sorted, incredible group, unreal Local Legends.", rating: 5 },
  { name: "Jake M.", text: "Asia was the perfect first trip. Never felt lost for a second and made friends I still travel with. Already booking my next one.", rating: 5 },
  { name: "Priya K.", text: "From Bali sunrises to Vietnamese street food — every day was something new. Couldn't recommend Tru enough.", rating: 5 },
  { name: "Marcus R.", text: "Island hopping, temples, night markets, the lot. Seamless from start to finish and worth every penny.", rating: 5 },
];

export default function RegionPage({ region }: { region: RegionInfo }) {
  const { isLoggedIn } = useAuth();

  const regionCountries = region.countryIds
    .map((id) => countries.find((c) => c.id === id))
    .filter(Boolean) as (typeof countries)[number][];
  const countryNames = new Set(regionCountries.map((c) => c.name));

  const regionTrips = allTrips.filter((t) => countryNames.has(t.destination));
  const regionStories = allStories.filter((s) =>
    s.destinations.some((d) => countryNames.has(d)),
  );
  const regionActivities = regionCountries
    .flatMap((c) => c.bucketList.slice(0, 3))
    .slice(0, 12);

  const countryCards = regionCountries.map((c) => ({
    name: c.name,
    slug: c.id,
    region: slugify(c.region),
    image: c.heroImage,
    tagline: c.tagline,
  }));

  return (
    <div className="relative overflow-x-clip">
      {/* Decorative background watermarks (behind content) */}
      <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[14%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-[32%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-32 top-[52%] w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 top-[72%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[88%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.05] brightness-0 invert" />

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative h-[70vh] sm:h-[80vh] flex items-end overflow-hidden">
          <img src={region.heroImage} alt={region.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-2 font-heading animate-fade-up">Destinations</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase font-heading tracking-tight mb-3 animate-fade-up delay-100">{region.name}</h1>
            <div className="flex items-center gap-3 mb-4 animate-fade-up delay-150">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 w-5 bg-[#00B67A] flex items-center justify-center rounded-[2px]">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                ))}
              </div>
              <span className="text-white text-sm font-bold">4.9</span>
              <span className="text-gray-300 text-sm">from 2,400+ reviews</span>
            </div>
            <p className="text-2xl sm:text-3xl font-handwriting text-tru-pink mb-4 animate-fade-up delay-200">{region.tagline}</p>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl animate-fade-up delay-300">{region.description}</p>
          </div>
        </section>

        {/* Trips */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 mb-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide">Explore {region.name} Trips</h2>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <PillButton href="/explore/all-trips" className="whitespace-nowrap">See All Trips</PillButton>
            </div>
          </div>
          <div className="region-trips-carousel relative">
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={16}
              slidesPerView={1.15}
              freeMode={{ enabled: true, sticky: false }}
              navigation={{ nextEl: ".region-trips-next", prevEl: ".region-trips-prev" }}
              breakpoints={{ 480: { slidesPerView: 1.5 }, 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2, spaceBetween: 20 } }}
              speed={600}
            >
              {regionTrips.map((trip) => (
                <SwiperSlide key={trip.id}><TripCard trip={trip} /></SwiperSlide>
              ))}
            </Swiper>
            <button className="region-trips-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="region-trips-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="sm:hidden mt-6 flex justify-center">
            <PillButton href="/explore/all-trips">See All Trips</PillButton>
          </div>
        </section>

        {/* Things To Do */}
        {regionActivities.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">The Experiences</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-4">
              Things To Do In <span className="text-tru-pink">{region.name}</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              A taste of what&apos;s waiting across {region.name} — each one tagged by type so you know what you&apos;re in for. Cook with locals on a <span className="text-white font-semibold">Local Lens</span> day, push your limits with a <span className="text-white font-semibold">Rise Up</span> challenge, and tick off the <span className="text-white font-semibold">Bucket List</span> moments you came for.
            </p>
            <ActivityShowcase items={regionActivities} />
          </section>
        )}

        {/* Stories */}
        {regionStories.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">From Our Community</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">
              {region.name} <span className="text-tru-pink">Stories</span>
            </h2>
            <div className="region-stories-carousel relative">
              <Swiper
                modules={[Navigation, FreeMode]}
                spaceBetween={16}
                slidesPerView={1.1}
                freeMode={{ enabled: true, sticky: false }}
                navigation={{ nextEl: ".region-stories-next", prevEl: ".region-stories-prev" }}
                breakpoints={{ 640: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3.2, spaceBetween: 24 } }}
                speed={600}
              >
                {regionStories.map((story) => (
                  <SwiperSlide key={story.id}><StoryCard story={story} isLoggedIn={isLoggedIn} /></SwiperSlide>
                ))}
              </Swiper>
              <button className="region-stories-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="region-stories-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </section>
        )}

        {/* Upcoming Departures */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Book Now</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">Upcoming Departures</h2>
          <UpcomingDepartures countryTrips={regionTrips} />
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Traveller Reviews</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-6">{region.name} Reviews</h2>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<div key={i} className="h-7 w-7 bg-[#00B67A] flex items-center justify-center"><svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>))}</div>
            <span className="text-white font-semibold text-sm">4.9</span>
            <span className="text-gray-400 text-sm">from 2,400+ reviews</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.map((review, i) => (
              <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 p-5">
                <div className="flex gap-0.5 mb-3">{[...Array(review.rating)].map((_, j) => (<div key={j} className="h-4 w-4 bg-[#00B67A] flex items-center justify-center rounded-[2px]"><svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>))}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
                <p className="text-white text-xs font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* All region destinations */}
        <DestinationsCarousel
          items={countryCards}
          limit={countryCards.length}
          eyebrow="Explore More"
          title={`All ${region.name} Destinations`}
        />
      </div>
    </div>
  );
}
