"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import Breadcrumbs from "@/components/breadcrumbs";
import { sectionCrumbs, TRAVEL_STYLES } from "@/lib/breadcrumbs";
import { Trip, TravelStyle, travelStyleConfig } from "@/lib/data";
import TripCard from "@/components/trip-card";
import PillButton from "@/components/pill-button";
import FaqAccordion from "@/components/faq-accordion";
import AccommodationShowcase, { type StayItem } from "@/components/accommodation-showcase";
import { HubCard, HubGrid } from "@/components/section-hub";
import { UpcomingDepartures } from "@/components/country-page";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

/**
 * A travel style page — /travel-styles/classic and friends.
 *
 * BUILT TO THE COUNTRY PAGE'S SHAPE. It's the same kind of page: a hero, a
 * breadcrumb, a carousel of trips, where you'll stay, upcoming departures,
 * FAQs. It used to have its own hero layout, its own accommodation viewer and
 * its own FAQ accordion — three answers to questions the country pages had
 * already answered. Those blocks are now shared components, so a change to a
 * stay card or an FAQ lands on both.
 *
 * NO PER-STYLE COLOURS. Every heading, eyebrow and accent here was drawn in
 * the style's own hue — Classic blue, Backpacker green, Multi Country amber —
 * which made five differently-coloured versions of one page and matched
 * nothing else on the site. Pink is the accent, as everywhere else.
 * `travelStyleConfig` no longer carries a `color` at all, so this can't drift
 * back.
 *
 * WHAT ISN'T HERE. No podcasts and no watch series — they aren't phase 1.
 * No reviews block either: the country pages' is hardcoded sample copy, and
 * copying invented reviews onto five more pages is not an improvement.
 */

const heroImages: Record<TravelStyle, string> = {
  classic: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
  backpacker: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80",
  flashpacker: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
  multi_country: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80",
  limited_edition: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
};

type StyleContent = {
  tagline: string;
  intro: string[];
  /**
   * Same shape as a country's `accommodation`, so both use one component.
   * NO `travelStyle` on these: the logo mark tells you which style a stay
   * belongs to, which is worth knowing on a country page where they vary —
   * on this page every card would say CLASSIC under a hero that already does.
   */
  accommodation?: StayItem[];
  faqs?: { question: string; answer: string }[];
};

const styleContent: Record<TravelStyle, StyleContent> = {
  classic: {
    tagline: "The perfect balance of everything",
    intro: [
      "Our Classic trips are the TruTravels signature — the perfect balance of culture, adventure, beaches and parties, all rolled into one seamless adventure. They're built for 18–39s who want the big highlights and the hidden gems without the stress of planning a thing.",
      "Every itinerary is packed with a high level of inclusions at a low cost: accommodation, in-country transport, a tonne of activities, some meals, and our own TruExclusives you won't find anywhere else. You just show up — your TRU Leader handles the rest.",
      "Expect a real mix of places to stay, from hotels and hostels to homestays, beach huts and even boats. It's the original way to do Tru, and still the favourite.",
    ],
    accommodation: [
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/28156618/12312367_1080_1920_50fps.mp4",
        poster: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=80",
        title: "Beachfront Resorts",
        caption: "On the island legs you'll wake up right by the water — palm trees, pools and sea views.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
        title: "Boutique Hotels",
        caption: "Central, comfortable hotels with private twin-share rooms in the cities and bigger towns.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
        title: "Beach Bungalows",
        caption: "Simple, characterful huts and bungalows just a few steps from the sand.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
        title: "Local Homestays",
        caption: "Stay with local families on select stops for a real taste of everyday life.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
        title: "Social Hostels",
        caption: "Hand-picked, sociable hostels where the whole crew can hang out and meet other travellers.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80",
        title: "Overnight Boats",
        caption: "On some routes you'll even sleep on the water — overnight boats and island-hopping cruises.",
      },
    ],
    faqs: [
      {
        question: "Who are Classic trips for?",
        answer:
          "Anyone aged 18–39 who wants the full mix — culture, adventure, beaches and nightlife — without planning it themselves. Around 65% of our travellers come solo.",
      },
      {
        question: "What's included?",
        answer:
          "Accommodation, all in-country transport, a packed activity schedule, some meals, an expert TRU Leader throughout, plus our exclusive TruExclusive experiences.",
      },
      {
        question: "What kind of accommodation will I stay in?",
        answer:
          "A real mix — hotels, hostels, homestays, beach huts and occasionally boats — almost always in private twin-share rooms.",
      },
      {
        question: "How big are the groups?",
        answer:
          "Classic groups are intentionally small, usually 10–20 travellers, so it always feels personal.",
      },
      {
        question: "Do I need any travel experience?",
        answer:
          "Not at all. Classic trips are perfect for first-timers — everything's organised and your leader is with you the whole way.",
      },
      {
        question: "Is my money protected?",
        answer:
          "Yes. TruTravels is both ABTA and ATOL registered, so your booking is fully financially protected.",
      },
    ],
  },
  backpacker: {
    tagline: "Maximum adventure, minimum spend",
    intro: [travelStyleConfig.backpacker.description],
  },
  flashpacker: {
    tagline: "Adventure with an upgrade",
    intro: [travelStyleConfig.flashpacker.description],
  },
  multi_country: {
    tagline: "Why pick one when you can have it all",
    intro: [travelStyleConfig.multi_country.description],
  },
  limited_edition: {
    tagline: "Once it's gone, it's gone",
    intro: [travelStyleConfig.limited_edition.description],
  },
};

/** The section eyebrow + heading pair the country pages use. */
function SectionHead({
  eyebrow,
  children,
  lead,
}: {
  eyebrow: string;
  children: React.ReactNode;
  lead?: string;
}) {
  return (
    <>
      <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.3em] text-tru-pink">{eyebrow}</p>
      <h2 className="mb-4 font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
        {children}
      </h2>
      {lead && <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">{lead}</p>}
    </>
  );
}

export default function TravelStylePage({ style, trips }: { style: TravelStyle; trips: Trip[] }) {
  const config = travelStyleConfig[style];
  const content = styleContent[style];
  const styleTrips = trips.filter((t) => t.travelStyle === style);
  const otherStyles = (Object.keys(travelStyleConfig) as TravelStyle[]).filter((s) => s !== style);
  const allTripsHref = `/explore/all-trips?style=${encodeURIComponent(style)}`;

  return (
    <div className="relative overflow-x-clip">
      {/* Decorative background watermarks, as on the country pages. */}
      <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[16%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-[32%] w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[54%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
      <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 top-[76%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />

      <div className="relative z-10">
        {/* ===================== HERO ===================== */}
        {/* The country page's hero, with the trip count where a country page
            puts its Trustpilot row. The style logo used to be the headline
            here at 44-64px tall; it's gone because the h1 already says
            CLASSIC and a logo of the same word underneath it is the same word
            twice. The logos still mark the trip cards and the Other Styles
            grid, which is where they do work. */}
        <section className="relative flex h-[70vh] items-end overflow-hidden sm:h-[80vh]">
          <img src={heroImages[style]} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <p className="animate-fade-up mb-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-tru-pink">
              Travel Style
            </p>
            <h1 className="animate-fade-up delay-100 mb-3 font-heading text-5xl font-black uppercase tracking-tight text-white sm:text-7xl lg:text-8xl">
              {config.label}
            </h1>
            <p className="animate-fade-up delay-150 mb-4 text-sm font-semibold text-white">
              {styleTrips.length} trip{styleTrips.length !== 1 ? "s" : ""} available
            </p>
            <p className="animate-fade-up delay-200 mb-4 font-handwriting text-2xl text-tru-pink sm:text-3xl">
              {content.tagline}
            </p>
            <p className="animate-fade-up delay-300 max-w-2xl text-sm text-gray-300 sm:text-base">
              {config.description}
            </p>
          </div>
        </section>
        <Breadcrumbs crumbs={sectionCrumbs(TRAVEL_STYLES, config.label)} />

        {/* ===================== WHAT IS X ===================== */}
        {/* The centred prose column the About and Essentials pages use for
            their opening block — max-w-3xl, centred, eyebrow over heading.
            The sections below are full-width because they hold carousels and
            rows; this one is reading, so it gets a reading measure. */}
        <section className="relative mx-auto mt-16 mb-20 max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-tru-pink">The Style</p>
          <h2 className="mb-6 font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl">
            What Is <span className="text-tru-pink">{config.label}?</span>
          </h2>
          <div className="space-y-5 text-base leading-relaxed text-gray-300 sm:text-lg">
            {content.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        {/* ===================== TRIPS ===================== */}
        {styleTrips.length > 0 && (
          <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
                  Explore
                </p>
                <h2 className="font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                  {config.label} Trips
                </h2>
              </div>
              <div className="hidden flex-shrink-0 sm:block">
                <PillButton href={allTripsHref} className="whitespace-nowrap">
                  See All Trips
                </PillButton>
              </div>
            </div>
            <div className="style-trips-carousel relative">
              <Swiper
                modules={[Navigation, FreeMode]}
                spaceBetween={16}
                slidesPerView={1.15}
                freeMode={{ enabled: true, sticky: false }}
                navigation={{ nextEl: ".style-trips-next", prevEl: ".style-trips-prev" }}
                breakpoints={{
                  480: { slidesPerView: 1.5 },
                  640: { slidesPerView: 2.2 },
                  1024: { slidesPerView: 3.2, spaceBetween: 20 },
                }}
                speed={600}
              >
                {styleTrips.map((trip) => (
                  <SwiperSlide key={trip.id}>
                    <TripCard trip={trip} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="style-trips-prev absolute top-[calc(50%-20px)] -left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-tru-navy/90 transition-colors hover:border-tru-pink/40 disabled:opacity-30 sm:-left-5">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="style-trips-next absolute top-[calc(50%-20px)] -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-tru-navy/90 transition-colors hover:border-tru-pink/40 disabled:opacity-30 sm:-right-5">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="mt-6 flex justify-center sm:hidden">
              <PillButton href={allTripsHref}>See All Trips</PillButton>
            </div>
          </section>
        )}

        {/* ===================== WHERE YOU'LL STAY ===================== */}
        {content.accommodation && content.accommodation.length > 0 && (
          <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHead
              eyebrow="Where You'll Stay"
              lead={`No two nights are the same. Here's the kind of stays a ${config.label} trip calls home.`}
            >
              Sleep Somewhere <span className="text-tru-pink">Special</span>
            </SectionHead>
            <AccommodationShowcase items={content.accommodation} />
          </section>
        )}

        {/* ===================== DEPARTURES ===================== */}
        {styleTrips.length > 0 && (
          <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-green">
              Book Now
            </p>
            <h2 className="mb-8 font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
              Upcoming Departures
            </h2>
            <UpcomingDepartures countryTrips={styleTrips} />
          </section>
        )}

        {/* ===================== FAQS ===================== */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink">
              Need to Know
            </p>
            <h2 className="mb-8 font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
              {config.label} FAQs
            </h2>
            <FaqAccordion faqs={content.faqs.map((f) => ({ q: f.question, a: f.answer }))} />
          </section>
        )}

        {/* ===================== OTHER STYLES ===================== */}
        {/* The photo card the rest of the site uses to link sideways — the
            About pages' cross-links, the section hubs, the destinations
            carousel. This was four logo tiles in a bordered box, the only
            thing of its kind on the site, and at that size the logos read as
            thumbnails rather than marks. Same HubCard as /partners. */}
        <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-tru-pink">
            Explore More
          </p>
          <h2 className="mb-8 font-heading text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
            Other Travel <span className="text-tru-pink">Styles</span>
          </h2>
          <HubGrid>
            {otherStyles.map((s) => {
              const n = trips.filter((t) => t.travelStyle === s).length;
              return (
                <HubCard
                  key={s}
                  href={`/travel-styles/${s.replace(/_/g, "-")}`}
                  image={heroImages[s]}
                  name={travelStyleConfig[s].label}
                  description={`${n} trip${n !== 1 ? "s" : ""} — ${styleContent[s].tagline.toLowerCase()}`}
                />
              );
            })}
          </HubGrid>
        </section>
      </div>
    </div>
  );
}
