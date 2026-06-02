"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Country, Trip, Story, VideoDiary, trips as allTrips, stories as allStories, videoDiaries as allVideoDiaries } from "@/lib/data";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// ============================================================
// SUB-COMPONENTS
// ============================================================

function FunFacts({ facts }: { facts: Country["facts"] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {facts.map((fact) => (
        <div key={fact.label} className="rounded-[10px] border border-white/10 bg-white/5 p-4 text-center">
          <span className="text-2xl block mb-2">{fact.icon}</span>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-heading mb-1">{fact.label}</p>
          <p className="text-white text-sm font-semibold">{fact.value}</p>
        </div>
      ))}
    </div>
  );
}

function BucketListCarousel({ items }: { items: Country["bucketList"] }) {
  return (
    <div className="bucket-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.2}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".bucket-next", prevEl: ".bucket-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.8 },
          640: { slidesPerView: 2.5, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 20 },
        }}
        speed={600}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="group relative overflow-hidden rounded-[10px] h-full">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-black text-white uppercase font-heading mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="bucket-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="bucket-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function ContentSeriesSection({ series }: { series: Country["contentSeries"] }) {
  return (
    <div className="content-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.2}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".content-next", prevEl: ".content-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.8 },
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5, spaceBetween: 20 },
        }}
        speed={600}
      >
        {series.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="group rounded-[10px] border border-white/10 bg-white/5 overflow-hidden hover:border-tru-pink/20 transition-all duration-300 cursor-pointer">
              <div className="relative aspect-video overflow-hidden">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className="bg-tru-pink text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-heading">{s.tag}</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">{s.episodes} episodes</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white text-sm font-bold font-heading group-hover:text-tru-pink transition-colors mb-1">{s.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{s.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="content-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="content-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function PodcastSection({ episodes }: { episodes: Country["podcasts"] }) {
  return (
    <div className="space-y-3">
      {episodes.map((ep) => (
        <div key={ep.id} className="flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 hover:border-tru-pink/20 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
            <img src={ep.image} alt={ep.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold font-heading group-hover:text-tru-pink transition-colors truncate">{ep.title}</p>
            <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{ep.description}</p>
          </div>
          <span className="text-gray-500 text-xs flex-shrink-0">{ep.duration}</span>
        </div>
      ))}
    </div>
  );
}

function CountryFaqs({ faqs }: { faqs: Country["faqs"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-200"
          >
            <span className="text-white text-sm font-semibold pr-4">{faq.question}</span>
            <svg className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`transition-all duration-300 ease-out overflow-hidden ${openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-5 pb-4">
              <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommunityVideos({ videos }: { videos: VideoDiary[] }) {
  return (
    <div className="community-vid-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={12}
        slidesPerView={1.8}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".community-vid-next", prevEl: ".community-vid-prev" }}
        breakpoints={{
          480: { slidesPerView: 2.3 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4.5, spaceBetween: 16 },
        }}
        speed={600}
      >
        {videos.map((v) => (
          <SwiperSlide key={v.id}>
            <div className="group relative overflow-hidden rounded-[10px] cursor-pointer">
              <div className="relative aspect-[9/16] overflow-hidden bg-black">
                <video src={v.video} poster={v.poster} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full font-heading" style={{ background: v.tag === "Creator" ? "#FF3F99" : v.tag === "Influencer" ? "#2172D5" : "#6BD495" }}>{v.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                  <p className="text-white text-xs leading-relaxed mb-2">{v.caption}</p>
                  <p className="text-white/70 text-[10px] font-semibold">{v.author}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="community-vid-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="community-vid-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function UpcomingDepartures({ countryTrips }: { countryTrips: Trip[] }) {
  const departures = countryTrips
    .filter((t) => t.departures && t.departures.length > 0)
    .flatMap((t) => (t.departures || []).filter((d) => d.status !== "full").map((d) => ({ ...d, trip: t })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  if (departures.length === 0) return null;

  const statusDot: Record<string, string> = { available: "bg-tru-green", "almost-full": "bg-amber-500", discount: "bg-tru-pink" };

  return (
    <div className="space-y-3">
      {departures.map((dep) => (
        <Link key={`${dep.trip.id}-${dep.date}`} href={`/explore/${dep.trip.id}`} className="group flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/5 p-4 hover:border-tru-pink/20 hover:bg-white/10 transition-all duration-200">
          <div className="flex-shrink-0 w-14 text-center">
            <p className="text-white text-xl font-black font-heading leading-none">{new Date(dep.date).getDate()}</p>
            <p className="text-gray-400 text-[10px] uppercase font-heading tracking-wider">{new Date(dep.date).toLocaleDateString("en-GB", { month: "short" })}</p>
          </div>
          <div className="w-px h-10 bg-white/10 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-0.5">{dep.trip.duration}</p>
            <p className="text-white text-sm font-bold font-heading group-hover:text-tru-pink transition-colors truncate">{dep.trip.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`h-2 w-2 rounded-full ${statusDot[dep.status] || "bg-tru-green"}`} />
              <span className="text-gray-400 text-[10px]">{dep.status === "almost-full" ? "Almost Full" : dep.status === "discount" ? "On Sale" : "Available"}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {dep.originalPrice && dep.originalPrice !== dep.price && (
              <span className="bg-red-500 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1">Save &pound;{dep.originalPrice - dep.price}</span>
            )}
            <div className="flex items-baseline gap-2 justify-end">
              {dep.originalPrice && dep.originalPrice !== dep.price && <span className="text-gray-500 text-sm line-through">&pound;{dep.originalPrice}</span>}
              <span className="font-bold text-lg text-white">&pound;{dep.price}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ============================================================
// MAIN COUNTRY PAGE
// ============================================================

export default function CountryPage({ country }: { country: Country }) {
  const countryTrips = allTrips.filter((t) => t.destination === country.name);
  const countryStories = allStories.filter((s) => s.title.toLowerCase().includes(country.name.toLowerCase()) || s.excerpt.toLowerCase().includes(country.name.toLowerCase()));
  const countryVideos = allVideoDiaries.filter((v) => v.location.includes(country.name));

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[80vh] flex items-end overflow-hidden">
        <img src={country.heroImage} alt={country.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-2 font-heading animate-fade-up">{country.region}</p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase font-heading tracking-tight mb-3 animate-fade-up delay-100">{country.name}</h1>
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
            <span className="text-gray-300 text-sm">from 305 reviews</span>
          </div>
          <p className="text-2xl sm:text-3xl font-handwriting text-tru-pink mb-4 animate-fade-up delay-200">{country.tagline}</p>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl animate-fade-up delay-300">{country.description}</p>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
        <FunFacts facts={country.facts} />
      </section>

      {/* Trips */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} Trips</h2>
        <div className="country-trips-carousel relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.15}
            freeMode={{ enabled: true, sticky: false }}
            navigation={{ nextEl: ".country-trips-next", prevEl: ".country-trips-prev" }}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            speed={600}
          >
            {countryTrips.map((trip) => (
              <SwiperSlide key={trip.id}><TripCard trip={trip} /></SwiperSlide>
            ))}
          </Swiper>
          <button className="country-trips-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="country-trips-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      {/* Bucket List */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Don&apos;t Miss</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} Bucket List</h2>
        <BucketListCarousel items={country.bucketList} />
      </section>

      {/* Community Videos */}
      {countryVideos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">From Our Community</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} Stories</h2>
          <CommunityVideos videos={countryVideos} />
        </section>
      )}

      {/* Content Series */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Watch &amp; Learn</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">Content Series</h2>
        <ContentSeriesSection series={country.contentSeries} />
      </section>

      {/* Podcasts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-blue text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Listen</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} Podcast Episodes</h2>
        <PodcastSection episodes={country.podcasts} />
      </section>

      {/* Blog */}
      {countryStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Read</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryStories.map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`} className="group rounded-[10px] border border-white/10 bg-white/5 overflow-hidden hover:border-tru-pink/20 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img src={story.image} alt={story.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-tru-pink text-[9px] font-bold uppercase tracking-wider font-heading mb-1">{story.category}</p>
                  <h3 className="text-white text-sm font-bold font-heading group-hover:text-tru-pink transition-colors mb-1">{story.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{story.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Departures */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Book Now</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">Upcoming Departures</h2>
        <UpcomingDepartures countryTrips={countryTrips} />
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Traveller Reviews</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-6">{country.name} Reviews</h2>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<div key={i} className="h-7 w-7 bg-[#00B67A] flex items-center justify-center"><svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>))}</div>
          <span className="text-white font-semibold text-sm">4.9</span>
          <span className="text-gray-400 text-sm">from 305 reviews</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Sophie C.", text: "Thailand Island Hopper was the best 12 days of my life. The group, the islands, the Full Moon Party — absolutely unreal.", rating: 5 },
            { name: "Jake M.", text: "Our tour leader Tommy was incredible. Every detail sorted, local knowledge on point, and just a legend to be around.", rating: 5 },
            { name: "Priya K.", text: "The Bottle Beach experience was so special. Fire show, cocktails on the sand, surrounded by new mates. Pure magic.", rating: 5 },
            { name: "Marcus R.", text: "Koh Tao diving was a dream. Saw turtles on my first dive. Already planning my next Tru trip.", rating: 5 },
          ].map((review, i) => (
            <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 p-5">
              <div className="flex gap-0.5 mb-3">{[...Array(review.rating)].map((_, j) => (<div key={j} className="h-4 w-4 bg-[#00B67A] flex items-center justify-center rounded-[2px]"><svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>))}</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
              <p className="text-white text-xs font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Need to Know</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{country.name} FAQs</h2>
        <CountryFaqs faqs={country.faqs} />
      </section>

      {/* You Might Also Like */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore More</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">You Might Also Like</h2>
        <div className="also-like-carousel relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.3}
            freeMode={{ enabled: true, sticky: false }}
            navigation={{ nextEl: ".also-like-next", prevEl: ".also-like-prev" }}
            breakpoints={{
              480: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            speed={600}
          >
            {[
              { name: "Indonesia", slug: "indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Island of the Gods" },
              { name: "Vietnam", slug: "vietnam", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", tagline: "The Hidden Gem of Asia" },
              { name: "Sri Lanka", slug: "sri-lanka", image: "https://images.unsplash.com/photo-1546708770-599a0e47a9c7?w=800&q=80", tagline: "The Teardrop of India" },
              { name: "Philippines", slug: "philippines", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "7,000 Islands of Paradise" },
              { name: "Cambodia", slug: "cambodia", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", tagline: "Temples, History & Heart" },
              { name: "Mexico", slug: "mexico", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Colour, Culture & Chaos" },
            ].filter((c) => c.name !== country.name).map((c) => (
              <SwiperSlide key={c.slug}>
                <Link href={`/destinations/country/${c.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-[10px] aspect-[3/4]">
                    <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-black text-white uppercase font-heading mb-1">{c.name}</h3>
                      <p className="text-lg font-handwriting" style={{ color: "#FF3F99" }}>{c.tagline}</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="also-like-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="also-like-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>
    </div>
  );
}
