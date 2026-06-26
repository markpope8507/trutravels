"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Trip } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import TripCarouselSection from "@/components/trip-carousel-section";
import { LIFE_MOMENTS } from "@/lib/life-moments";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// Re-read the recent list whenever another tab updates it.
function subscribeRecent(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/* ============================================================
   MAIN BROWSER
   ============================================================ */
export default function TripsBrowser({ trips }: { trips: Trip[] }) {
  // Read "recently viewed" from localStorage via useSyncExternalStore: hydration-safe
  // (the server snapshot is an empty list) and no setState-in-effect.
  const recentRaw = useSyncExternalStore(
    subscribeRecent,
    () => localStorage.getItem("trutravels-recent") ?? "[]",
    () => "[]",
  );
  const recentIds: string[] = JSON.parse(recentRaw);

  const recentTrips = recentIds.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as Trip[];

  const [navSticky, setNavSticky] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("explore");

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

  // Scroll-spy: highlight the active pill based on which section is in view
  useEffect(() => {
    const ids = ["trending", "first-timer", "budget", "life-moments"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Route any incoming URL hash (e.g. /explore#deals from the home-page modal)
  // through the same scroll logic the in-page pill bar uses, so the landing
  // position matches exactly.
  useEffect(() => {
    const goToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      // Wait a tick for the section to be in the DOM, then scroll.
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (!el) return;
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    };
    goToHash();
    window.addEventListener("hashchange", goToHash);
    return () => window.removeEventListener("hashchange", goToHash);
  }, []);



  // Curated sections
  const trendingTrips = trips.filter((t) => t.originalPrice); // on sale = trending
  const budgetTrips = [...trips].sort((a, b) => a.price - b.price).slice(0, 3);
  const firstTimerTrips = trips.filter((t) => t.travelStyle === "classic" || t.travelStyle === "backpacker");

  const sectionPills = [
    { id: "trending", label: "Most Popular" },
    { id: "first-timer", label: "First Trips" },
    { id: "budget", label: "Best Value" },
    { id: "life-moments", label: "Life Moments" },
  ];

  return (
    <div>

      {/* Hero — image with right-aligned overlay, same language as Stories page */}
      <section id="explore-hero" className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="/images/explore-hero.jpg"
          alt="TruTravels explore — find your trip"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Explore
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Find Your<br />
              <span className="text-tru-pink">Trip</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              Handcrafted group adventures for 18&ndash;35s. Filter by destination, travel style, or the moment in life that brought you here.
            </p>
          </div>
        </div>
      </section>

      {/* Recently viewed — overlaps the bottom of the hero on a dark backdrop */}
      {recentTrips.length > 0 && (
        <div className="relative -mt-24 z-10 bg-tru-navy/95 backdrop-blur-sm border-t border-white/10 pt-8 pb-6 mx-auto max-w-7xl rounded-t-[20px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.22em] font-heading mb-1">
              Pick Up Where You Left Off
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Recently <span className="text-tru-pink">Viewed</span>
            </h2>
          </div>
          <div className="recent-carousel relative">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={16}
            slidesPerView="auto"
            grabCursor
            freeMode={{ enabled: true, sticky: false }}
            navigation={{ nextEl: ".recent-next", prevEl: ".recent-prev" }}
            className="!pb-2"
          >
            {recentTrips.map((trip) => {
              const savings = trip.originalPrice ? trip.originalPrice - trip.price : 0;
              return (
                <SwiperSlide key={trip.id} className="!w-80">
                <Link
                  href={tripUrl(trip)}
                  className="block w-full rounded-[12px] border border-white/10 bg-tru-navy hover:border-white/20 hover:bg-[#0d2a4e] transition-all duration-200 group overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <div className="h-20 w-20 rounded-[8px] overflow-hidden flex-shrink-0">
                      <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-black uppercase font-heading leading-snug line-clamp-2 group-hover:text-tru-pink transition-colors">
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
                  <div className="flex items-center justify-end gap-2 px-3 pb-3 pt-1 border-t border-white/5">
                    {trip.originalPrice && (
                      <span className="text-gray-500 text-[11px] line-through">&pound;{trip.originalPrice}</span>
                    )}
                    <span className="text-white text-base font-black font-heading">&pound;{trip.price}</span>
                    {savings > 0 && (
                      <span className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider font-heading ml-1">
                        Save &pound;{savings}
                      </span>
                    )}
                  </div>
                </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            className="recent-prev absolute top-[calc(50%-12px)] -left-2 sm:-left-4 z-10 h-9 w-9 rounded-full bg-tru-navy border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-0 disabled:cursor-default"
            aria-label="Previous"
          >
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="recent-next absolute top-[calc(50%-12px)] -right-2 sm:-right-4 z-10 h-9 w-9 rounded-full bg-tru-navy border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-0 disabled:cursor-default"
            aria-label="Next"
          >
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          </div>
        </div>
      )}

      {/* Anchor pill bar — scrolls to each section */}
      <div id="explore-bar" className="bg-tru-navy/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* MOBILE: two-row stack — filter on top, section pills below */}
          <div className="sm:hidden">
            <div className="flex items-center justify-end h-11 border-b border-white/5">
              <Link
                href="/explore/all-trips"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border border-tru-pink bg-tru-pink/15 text-white hover:bg-tru-pink"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Browse All Trips
              </Link>
            </div>
            <div className="flex items-stretch h-10">
              {sectionPills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex-1 text-center py-2 text-[10px] font-semibold uppercase tracking-wider font-heading whitespace-nowrap transition-all duration-200 ${
                    activeSection === s.id
                      ? "text-tru-pink border-b-2 border-tru-pink"
                      : "text-gray-400 border-b-2 border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP: single-row underline tabs + filter on the right */}
          <div className="hidden sm:flex items-stretch h-14 gap-6">
            <div className="flex items-stretch gap-6 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              {sectionPills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex-shrink-0 whitespace-nowrap px-1 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border-b-2 ${
                    activeSection === s.id
                      ? "text-tru-pink border-tru-pink"
                      : "text-gray-400 hover:text-white border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Link
              href="/explore/all-trips"
              className="flex-shrink-0 self-center inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border border-tru-pink bg-tru-pink text-white hover:bg-tru-pink-light"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Browse All Trips
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky duplicate when scrolled past */}
      <div className={`fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* MOBILE: two-row stack */}
          <div className="sm:hidden">
            <div className="flex items-center justify-end h-11 border-b border-white/5">
              <Link
                href="/explore/all-trips"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border border-tru-pink bg-tru-pink/15 text-white hover:bg-tru-pink"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Browse All Trips
              </Link>
            </div>
            <div className="flex items-stretch h-10">
              {sectionPills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex-1 text-center py-2 text-[10px] font-semibold uppercase tracking-wider font-heading whitespace-nowrap transition-all duration-200 ${
                    activeSection === s.id
                      ? "text-tru-pink border-b-2 border-tru-pink"
                      : "text-gray-400 border-b-2 border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP: single-row underline tabs + filter on the right */}
          <div className="hidden sm:flex items-stretch h-14 gap-6">
            <div className="flex items-stretch gap-6 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              {sectionPills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex-shrink-0 whitespace-nowrap px-1 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border-b-2 ${
                    activeSection === s.id
                      ? "text-tru-pink border-tru-pink"
                      : "text-gray-400 hover:text-white border-transparent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Link
              href="/explore/all-trips"
              className="flex-shrink-0 self-center inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading transition-all duration-200 border border-tru-pink bg-tru-pink text-white hover:bg-tru-pink-light"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Browse All Trips
            </Link>
          </div>
        </div>
      </div>


      {/* Content */}
        <div className="py-12">
            <section id="explore" className="relative scroll-mt-20 overflow-hidden">
              <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[600px] opacity-[0.07] brightness-0 invert" />
              <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/3 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <TripCarouselSection id="trending" label="Trending Now" title="Most Popular Trips" labelColor="#FF3F99" trips={trendingTrips} />
                <TripCarouselSection id="first-timer" label="New to Tru?" title="Perfect First Trips" labelColor="#6BD495" trips={firstTimerTrips} />
                <TripCarouselSection id="budget" label="Ballin' on a Budget" title="Best Value Trips" labelColor="#FCA501" trips={budgetTrips} />
              </div>
            </section>

            {/* Life Moments */}
            <section id="life-moments" className="relative mb-16 scroll-mt-20 overflow-hidden">
              <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                  <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                    Life Moments &middot; Find Your Fit
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                    Travel Through Every <span className="text-tru-pink">Chapter</span>
                  </h2>
                  <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                    Different stage of life, different kind of trip. Just left uni and chasing your first taste of freedom? Burnt out and need a recharge? Turning thirty and after something more? Pick the moment you&apos;re in — we&apos;ll show you the routes built for it.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {LIFE_MOMENTS.map((moment) => (
                    <Link
                      key={moment.slug}
                      href={moment.href}
                      className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
                    >
                      <img
                        src={moment.image}
                        alt={moment.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-xl mb-2 block">{moment.emoji}</span>
                        <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                          {moment.name}
                        </h3>
                        <p className="text-[12px] text-gray-200 leading-snug">{moment.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
        </div>

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

