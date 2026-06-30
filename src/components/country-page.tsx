"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Country, Trip, BucketListItem, experienceTypes, trips as allTrips, stories as allStories, videoDiaries as allVideoDiaries } from "@/lib/data";
import TripCard from "@/components/trip-card";
import StoryCard from "@/components/story-card";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import { useAuth } from "@/lib/auth-context";
import { tripUrl } from "@/lib/utils";

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

function ExperienceTypePill({ id }: { id?: string }) {
  const exp = id ? experienceTypes.find((e) => e.id === id) : undefined;
  if (!exp) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-heading"
      style={{ background: `${exp.color}22`, border: `1px solid ${exp.color}80`, color: exp.color }}
    >
      <span className="text-sm leading-none">{exp.emoji}</span>
      {exp.name}
    </span>
  );
}

function ActivityShowcase({ items }: { items: BucketListItem[] }) {
  return (
    <div className="activities-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".activities-next", prevEl: ".activities-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.4 },
          640: { slidesPerView: 2.1, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
        }}
        speed={600}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto">
            <div className="group h-full flex flex-col overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-pink/30 transition-all duration-300" style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}>
              {/* Media */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {item.video ? (
                  <video
                    src={item.video}
                    poster={item.poster ?? item.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <ExperienceTypePill id={item.experienceType} />
                  {item.video && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-heading">
                      Video
                    </span>
                  )}
                </div>
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-black text-white uppercase font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                  <span className="mr-1.5">{item.emoji}</span>{item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="activities-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="activities-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function AccommodationShowcase({ items }: { items: NonNullable<Country["accommodation"]> }) {
  return (
    <div className="stays-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".stays-next", prevEl: ".stays-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.4 },
          640: { slidesPerView: 2.1, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
        }}
        speed={600}
      >
        {items.map((item) => (
          <SwiperSlide key={item.title} className="!h-auto">
            <div className="group h-full flex flex-col overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-green/30 transition-all duration-300" style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}>
              {/* Media */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img src={item.src} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-heading" style={{ background: "#6BD49522", border: "1px solid #6BD49580", color: "#6BD495" }}>
                    <span className="text-sm leading-none">🛏️</span>
                    Stay
                  </span>
                  {item.type === "video" && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-heading">
                      Video
                    </span>
                  )}
                </div>
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-black text-white uppercase font-heading leading-tight mb-2 group-hover:text-tru-green transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.caption}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="stays-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-green/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="stays-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-green/40 transition-colors disabled:opacity-30">
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

type DepartureEntry = {
  trip: Trip;
  dep: NonNullable<Trip["departures"]>[number];
};

const DEPARTURES_PAGE_SIZE = 6;

function DepartureRow({ trip, dep }: DepartureEntry) {
  const date = new Date(dep.date);
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const day = date.toLocaleDateString("en-GB", { day: "numeric" });
  const year = date.toLocaleDateString("en-GB", { year: "numeric" });
  const discount =
    dep.originalPrice && dep.originalPrice > dep.price
      ? Math.round(((dep.originalPrice - dep.price) / dep.originalPrice) * 100)
      : 0;
  const almostFull = dep.status === "almost-full";

  return (
    <div
      className="rounded-[10px] border border-white/10 bg-tru-navy hover:border-tru-pink/30 transition-colors duration-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
    >
      {/* Date */}
      <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0 sm:w-20 sm:flex-shrink-0 sm:text-center">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-wider font-heading order-1 sm:order-none">{month}</p>
        <p className="text-white text-2xl font-black font-heading leading-none">{day}</p>
        <p className="text-gray-400 text-xs order-2 sm:order-none">{year}</p>
      </div>

      <div className="hidden sm:block w-px self-stretch bg-white/10" />

      {/* Trip info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-black text-sm sm:text-base font-heading uppercase leading-snug">{trip.title}</h3>
        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {trip.duration}
          {trip.startLocation && trip.endLocation && (
            <> &middot; {trip.startLocation} &mdash; {trip.endLocation}</>
          )}
        </p>
        {almostFull && (
          <span className="inline-flex items-center gap-1.5 mt-2 text-amber-400 text-[10px] font-bold uppercase tracking-wider font-heading">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Almost Full
          </span>
        )}
      </div>

      {/* Save + Price + CTA */}
      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6 sm:flex-shrink-0 pt-3 border-t border-white/10 sm:pt-0 sm:border-0">
        <div className="flex items-center gap-5 sm:gap-6">
          {discount > 0 && (
            <div className="text-left sm:text-right">
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.15em] font-heading mb-0.5">Save</p>
              <p className="text-tru-pink text-sm font-bold leading-none">{discount}%</p>
            </div>
          )}
          <div className="text-left sm:text-right">
            {dep.originalPrice && dep.originalPrice > dep.price && (
              <span className="block text-gray-500 text-xs line-through leading-none mb-0.5">&pound;{dep.originalPrice}</span>
            )}
            <p className="text-white text-lg font-bold font-heading leading-none">&pound;{dep.price}</p>
          </div>
        </div>
        <Link
          href={tripUrl(trip)}
          className="rounded-[10px] px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-heading border whitespace-nowrap flex-shrink-0 transition-all duration-200"
          style={{ backgroundColor: "#FFD814", borderColor: "#FCD200", color: "#0F1111" }}
        >
          View Trip &rarr;
        </Link>
      </div>
    </div>
  );
}

function UpcomingDepartures({ countryTrips }: { countryTrips: Trip[] }) {
  const [visible, setVisible] = useState(DEPARTURES_PAGE_SIZE);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const departures: DepartureEntry[] = countryTrips
    .flatMap((trip) =>
      (trip.departures || [])
        .filter((d) => d.status !== "full" && new Date(d.date) >= today)
        .map((dep) => ({ trip, dep })),
    )
    .sort((a, b) => new Date(a.dep.date).getTime() - new Date(b.dep.date).getTime());

  if (departures.length === 0) return null;

  return (
    <div>
      <div className="space-y-3">
        {departures.slice(0, visible).map(({ trip, dep }) => (
          <DepartureRow key={`${trip.id}-${dep.date}`} trip={trip} dep={dep} />
        ))}
      </div>
      {visible < departures.length && (
        <div className="pt-8 text-center">
          <button
            onClick={() => setVisible((n) => n + DEPARTURES_PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-tru-pink/40 bg-transparent px-6 py-2.5 text-xs font-bold text-tru-pink hover:bg-tru-pink hover:text-white hover:border-tru-pink transition-all duration-200 uppercase tracking-wider font-heading"
          >
            Show More Departures
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COUNTRY PAGE
// ============================================================

export default function CountryPage({ country }: { country: Country }) {
  const { isLoggedIn } = useAuth();
  const countryTrips = allTrips.filter((t) => t.destination === country.name);
  const countryStories = allStories.filter(
    (s) =>
      s.destinations.includes(country.name) ||
      s.title.toLowerCase().includes(country.name.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(country.name.toLowerCase()),
  );
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
              1024: { slidesPerView: 3.2, spaceBetween: 20 },
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

      {/* Video Diaries */}
      {countryVideos.length > 0 && (
        <section className="mb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">Video Diaries</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-4">
              Moments In <span className="text-tru-pink">{country.name}</span>
              <br />
              From Our Community
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Travellers, guides, partners, and the Planeterra projects we support — in their own words.
            </p>
          </div>
          <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
            <VideoDiariesCarousel diaries={countryVideos} />
          </div>
        </section>
      )}

      {/* Experiences / Things To Do */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">The Experiences</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-4">
          Things To Do In <span className="text-tru-pink">{country.name}</span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
          A taste of the experiences waiting for you — each one tagged by type so you know exactly what you&apos;re in for. Cook with locals on a <span className="text-white font-semibold">Local Lens</span> day, push your limits with a <span className="text-white font-semibold">Rise Up</span> challenge, and tick off the <span className="text-white font-semibold">Bucket List</span> moments you came here for.
        </p>
        <ActivityShowcase items={country.bucketList} />
      </section>

      {/* Where You'll Stay */}
      {country.accommodation && country.accommodation.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-green text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">Where You&apos;ll Stay</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-4">
            Sleep Somewhere <span className="text-tru-green">Special</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            A few of the stays our {country.name} tours call home — from floating bungalows on a jungle lake to beach resorts steps from the sand.
          </p>
          <AccommodationShowcase items={country.accommodation} />
        </section>
      )}

      {/* Stories from our community */}
      {countryStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">From Our Community</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">
            {country.name} <span className="text-tru-pink">Stories</span>
          </h2>
          <div className="country-stories-carousel relative">
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={16}
              slidesPerView={1.1}
              freeMode={{ enabled: true, sticky: false }}
              navigation={{ nextEl: ".country-stories-next", prevEl: ".country-stories-prev" }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3.2, spaceBetween: 24 },
              }}
              speed={600}
            >
              {countryStories.map((story) => (
                <SwiperSlide key={story.id}>
                  <StoryCard story={story} isLoggedIn={isLoggedIn} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="country-stories-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="country-stories-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
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
              { name: "Indonesia", slug: "indonesia", region: "asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Island of the Gods" },
              { name: "Vietnam", slug: "vietnam", region: "asia", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", tagline: "The Hidden Gem of Asia" },
              { name: "Sri Lanka", slug: "sri-lanka", region: "asia", image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80", tagline: "The Teardrop of India" },
              { name: "Philippines", slug: "philippines", region: "asia", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "7,000 Islands of Paradise" },
              { name: "Cambodia", slug: "cambodia", region: "asia", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", tagline: "Temples, History & Heart" },
              { name: "Mexico", slug: "mexico", region: "latin-america", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Colour, Culture & Chaos" },
            ].filter((c) => c.name !== country.name).map((c) => (
              <SwiperSlide key={c.slug}>
                <Link href={`/destinations/${c.region}/${c.slug}`} className="group block">
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
