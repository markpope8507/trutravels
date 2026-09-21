"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import { sectionCrumbs, TRAVEL_STYLES } from "@/lib/breadcrumbs";

import { useState } from "react";
import Link from "next/link";
import { Trip, TravelStyle, travelStyleConfig } from "@/lib/data";
import AllTripsBrowser from "@/components/all-trips-browser";
import AccommodationMediaCarousel, {
  type AccommodationMedia,
} from "@/components/accommodation-media-carousel";

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
  accommodation?: AccommodationMedia[];
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

export default function TravelStylePage({ style, trips }: { style: TravelStyle; trips: Trip[] }) {
  const config = travelStyleConfig[style];
  const content = styleContent[style];
  const styleTrips = trips.filter((t) => t.travelStyle === style);

  const styleRegions = [...new Set(styleTrips.map((t) => t.region))].map((name) => ({
    name,
    count: styleTrips.filter((t) => t.region === name).length,
  }));

  const otherStyles = (Object.keys(travelStyleConfig) as TravelStyle[]).filter((s) => s !== style);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <img src={heroImages[style]} alt={config.label} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/50 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <img src={config.logo} alt={config.label} className="h-44 sm:h-56 lg:h-64 -mb-2 animate-fade-up" />
          <h1 className="animate-fade-up delay-100 text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase font-heading tracking-wide mb-3">
            {content.tagline}
          </h1>
          <p className="animate-fade-up delay-200 text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed mb-4">
            {config.description}
          </p>
          <p className="animate-fade-up delay-300 text-sm font-semibold" style={{ color: config.color }}>
            {styleTrips.length} trip{styleTrips.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </section>
      <Breadcrumbs crumbs={sectionCrumbs(TRAVEL_STYLES, config.label)} />

      {/* ===================== INTRO ===================== */}
      <section className="relative pt-20 pb-12 overflow-clip">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 -top-6 w-[260px] sm:w-[380px] lg:w-[480px] opacity-[0.05] brightness-0 invert" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3" style={{ color: config.color }}>
            The Style
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-6">
            What Is <span style={{ color: config.color }}>{config.label}?</span>
          </h2>
          {content.intro.map((p, i) => (
            <p key={i} className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ===================== ACCOMMODATION ===================== */}
      {content.accommodation && content.accommodation.length > 0 && (
        <section className="relative pt-12 pb-16 overflow-clip border-t border-white/5">
          <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-10 w-[240px] sm:w-[360px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3" style={{ color: config.color }}>
                Where You&apos;ll Stay
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-4">
                Sleep Somewhere <span style={{ color: config.color }}>Different</span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                No two nights are the same. Here&apos;s the kind of stays you can expect on a {config.label} trip.
              </p>
            </div>
            <AccommodationMediaCarousel items={content.accommodation} />
          </div>
        </section>
      )}

      {/* ===================== TOURS ===================== */}
      <section className="relative pt-12 overflow-clip border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3" style={{ color: config.color }}>
              The Trips
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Every <span style={{ color: config.color }}>{config.label}</span> Tour
            </h2>
          </div>
        </div>
        <AllTripsBrowser
          trips={styleTrips}
          regions={styleRegions}
          pageSize={6}
          hideStyleFilter
          heading="Tours"
        />
      </section>

      {/* ===================== FAQS ===================== */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="relative pt-12 pb-20 border-t border-white/5">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3" style={{ color: config.color }}>
              Good To Know
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-8">
              {config.label} <span style={{ color: config.color }}>FAQs</span>
            </h2>
            <div className="space-y-2">
              {content.faqs.map((faq, i) => (
                <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-200"
                  >
                    <span className="text-white text-sm font-semibold pr-4">{faq.question}</span>
                    <svg
                      className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ease-out overflow-hidden ${openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 pb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== EXPLORE OTHER STYLES ===================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 border-t border-white/5 pt-12">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore More</p>
        <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-8">Other Travel Styles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherStyles.map((s) => {
            const c = travelStyleConfig[s];
            return (
              <Link
                key={s}
                href={`/travel-styles/${s.replace(/_/g, "-")}`}
                className="group rounded-[10px] border border-white/10 bg-white/5 p-6 text-center hover:border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                <img src={c.logo} alt={c.label} className="h-16 mx-auto mb-3" />
                <p className="text-gray-400 text-xs">{trips.filter((t) => t.travelStyle === s).length} trips</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
