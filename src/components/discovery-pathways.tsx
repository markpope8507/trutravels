"use client";

import { useState } from "react";
import Link from "next/link";
import { InspireMeModal } from "@/components/inspire-me";

const lifeMoments = [
  { label: "Looking To Challenge Myself", emoji: "🏔️", href: "/life-moments/looking-to-challenge-myself" },
  { label: "Solo Soul Searcher", emoji: "🧭", href: "/life-moments/solo-soul-searcher" },
  { label: "Just Left Uni", emoji: "🎓", href: "/life-moments/just-left-uni" },
  { label: "Work Break Recharge", emoji: "🔋", href: "/life-moments/work-break-recharge" },
  { label: "Turning 30", emoji: "🎂", href: "/life-moments/turning-30" },
  { label: "Gap Year", emoji: "🌍", href: "/life-moments/gap-year" },
];

function LifeMomentsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-tru-blue text-[10px] font-bold uppercase tracking-[0.2em] font-heading">Your Chapter</p>
            <p className="text-white text-sm font-bold font-heading uppercase">Life Moments</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          <p className="text-gray-400 text-xs px-2 mb-2">Where are you at? Pick your chapter and we&apos;ll show you trips that fit.</p>
          {lifeMoments.map((moment) => (
            <Link
              key={moment.label}
              href={moment.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-blue/40 hover:bg-tru-blue/10 transition-all duration-200"
            >
              <span className="text-lg">{moment.emoji}</span>
              <span className="text-sm font-semibold text-white uppercase tracking-wider font-heading">{moment.label}</span>
              <svg className="h-4 w-4 text-gray-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const travelStyles = [
  { label: "Backpacker", logo: "/backpacker-logo.png", description: "Hostels, night buses, street food — maximum adventure, minimum spend.", color: "#6BD495", href: "/travel-styles/backpacker" },
  { label: "Classic", logo: "/classic-logo.png", description: "The perfect balance of comfort and adventure. Our most popular style.", color: "#2172D5", href: "/travel-styles/classic" },
  { label: "Flashpacker", logo: "/flashpacker-logo.png", description: "Boutique stays, premium experiences — all the adventure, none of the roughing it.", color: "#FF3F99", href: "/travel-styles/flashpacker" },
  { label: "Multi Country", logo: "/multi-country-logo.png", description: "Cross borders, collect stamps, and see how the world changes.", color: "#FCA501", href: "/travel-styles/multi-country" },
  { label: "Limited Edition", logo: "/limited-edition-logo.png", description: "Exclusive routes and one-off experiences. Once it's gone, it's gone.", color: "#FF3F99", href: "/travel-styles/limited-edition" },
];

function TravelStylesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading">Your Way</p>
            <p className="text-white text-sm font-bold font-heading uppercase">Travel Styles</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-gray-400 text-xs px-2 mb-2">How do you like to travel? Pick a style and we&apos;ll show you trips that match.</p>
          {travelStyles.map((style) => (
            <Link
              key={style.label}
              href={style.href}
              onClick={onClose}
              className="flex items-start gap-3 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:bg-white/10 transition-all duration-200"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = style.color + "66")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <img src={style.logo} alt={style.label} className="h-16 w-auto flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-white uppercase tracking-wider font-heading block">{style.label}</span>
                <span className="text-gray-400 text-xs leading-snug block mt-0.5">{style.description}</span>
              </div>
              <svg className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const lastMinuteDeals = [
  { label: "Within 30 Days", emoji: "⏱️", description: "Trips departing in the next 30 days. Spontaneous wins.", href: "/deals" },
  { label: "Up to 20% Off", emoji: "🔥", description: "Great savings on selected departures.", href: "/deals#deals" },
  { label: "Up to 40% Off", emoji: "💥", description: "Our biggest discounts. Limited availability.", href: "/deals#deals" },
  { label: "All Deals", emoji: "🎉", description: "Browse every deal we've got right now.", href: "/deals" },
];

function LastMinuteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-tru-green animate-pulse" />
              Leaving Soon
            </p>
            <p className="text-white text-sm font-bold font-heading uppercase">Last-Minute Deals</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-gray-400 text-xs px-2 mb-2">Don&apos;t overthink it. The best trips are the ones you just go for.</p>
          {lastMinuteDeals.map((deal) => (
            <Link
              key={deal.label}
              href={deal.href}
              onClick={onClose}
              className="flex items-start gap-3 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-green/40 hover:bg-tru-green/10 transition-all duration-200"
            >
              <span className="text-lg mt-0.5">{deal.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-white uppercase tracking-wider font-heading block">{deal.label}</span>
                <span className="text-gray-400 text-xs leading-snug block mt-0.5">{deal.description}</span>
              </div>
              <svg className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiscoveryPathways() {
  const [inspireOpen, setInspireOpen] = useState(false);
  const [lifeMomentsOpen, setLifeMomentsOpen] = useState(false);
  const [travelStylesOpen, setTravelStylesOpen] = useState(false);
  const [lastMinuteOpen, setLastMinuteOpen] = useState(false);

  return (
    <div className="relative py-16 sm:py-20 overflow-hidden">
    {/* Navy panel that fades to transparent at top + bottom (no hard seam) */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tru-navy to-transparent pointer-events-none" />
    {/* Sticker montage — SVG icons scattered around the edges as a playful background */}
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* Top edge */}
      <img src="/bg-assets/tru-logo.svg" className="absolute top-4 sm:top-8 left-6 sm:left-1/4 lg:left-1/3 w-24 sm:w-32 lg:w-40 rotate-[-12deg] opacity-[0.12] brightness-0 invert" alt="" />
      <img src="/bg-assets/mask.svg" className="absolute top-4 sm:top-8 right-6 sm:right-1/4 lg:right-1/3 w-24 sm:w-32 lg:w-40 rotate-[14deg] opacity-[0.12] brightness-0 invert" alt="" />
      <img src="/bg-assets/komodo-dragon.svg" className="hidden sm:block absolute top-4 -right-8 lg:right-10 w-36 lg:w-52 rotate-[10deg] opacity-[0.10] brightness-0 invert" alt="" />
      {/* Middle accents */}
      <img src="/bg-assets/lantern.svg" className="absolute top-1/2 -translate-y-1/2 -left-6 sm:-left-2 lg:left-6 w-16 sm:w-24 lg:w-32 -rotate-[14deg] opacity-[0.12] brightness-0 invert" alt="" />
      <img src="/bg-assets/peru-bird.svg" className="absolute top-1/2 -translate-y-1/2 -right-6 sm:-right-2 lg:right-6 w-20 sm:w-28 lg:w-36 rotate-[20deg] opacity-[0.12] brightness-0 invert" alt="" />
      <img src="/bg-assets/bali-flower.svg" className="hidden lg:block absolute top-[28%] left-[18%] w-28 -rotate-[6deg] opacity-[0.10] brightness-0 invert" alt="" />
      <img src="/bg-assets/eyes.svg" className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[12%] w-24 rotate-[8deg] opacity-[0.10] brightness-0 invert lg:top-[28%] lg:right-[18%] lg:translate-y-0 lg:w-32" alt="" />
      {/* Bottom edge */}
      <img src="/bg-assets/ramen.svg" className="absolute -bottom-4 left-8 sm:left-1/4 lg:left-1/3 w-20 sm:w-28 lg:w-36 -rotate-[8deg] opacity-[0.12] brightness-0 invert" alt="" />
      <img src="/bg-assets/good-vibes.svg" className="hidden sm:block absolute -bottom-6 right-8 lg:right-1/4 w-32 lg:w-44 rotate-[12deg] opacity-[0.10] brightness-0 invert" alt="" />
      <img src="/bg-assets/brazil.svg" className="hidden lg:block absolute -bottom-8 left-[16%] w-32 -rotate-[10deg] opacity-[0.10] brightness-0 invert" alt="" />
      <img src="/bg-assets/community.svg" className="hidden md:block lg:hidden absolute -bottom-4 right-1/2 translate-x-1/2 w-32 rotate-[6deg] opacity-[0.10] brightness-0 invert" alt="" />
      <img src="/bg-assets/sun.svg" className="absolute bottom-2 -right-4 sm:right-2 lg:right-4 w-14 sm:w-20 lg:w-24 rotate-[-8deg] opacity-[0.14] brightness-0 invert" alt="" />
    </div>
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-3 font-heading">
          Your Way
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
          Pick Your <span className="text-tru-pink">Path</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg font-handwriting text-gray-300">
          however you want to search&hellip;
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">
        <button
          onClick={() => setLastMinuteOpen(true)}
          className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-green/40 hover:bg-tru-green/10 transition-all duration-300"
        >
          <span className="h-2 w-2 rounded-full bg-tru-green animate-pulse flex-shrink-0" />
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-heading group-hover:text-tru-green transition-colors whitespace-nowrap">Last-Minute Deals</span>
        </button>

        <button
          onClick={() => setTravelStylesOpen(true)}
          className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-pink/40 hover:bg-tru-pink/10 transition-all duration-300"
        >
          <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-heading group-hover:text-tru-pink transition-colors whitespace-nowrap">Travel Styles</span>
        </button>

        <button
          onClick={() => setLifeMomentsOpen(true)}
          className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-blue/40 hover:bg-tru-blue/10 transition-all duration-300"
        >
          <svg className="h-4 w-4 text-tru-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-heading group-hover:text-tru-blue transition-colors whitespace-nowrap">Life Moments</span>
        </button>

        <button
          onClick={() => setInspireOpen(true)}
          className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-tru-pink/40 hover:bg-tru-pink/10 transition-all duration-300"
        >
          <svg className="h-4 w-4 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-heading group-hover:text-tru-pink transition-colors whitespace-nowrap">Inspire Me</span>
        </button>

        <Link
          href="/explore"
          className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-tru-navy px-4 py-3 hover:border-white/30 hover:bg-white/10 transition-all duration-300 col-span-2 sm:col-span-1"
        >
          <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider font-heading group-hover:text-gray-300 transition-colors whitespace-nowrap">Browse All</span>
        </Link>
      </div>

      <InspireMeModal isOpen={inspireOpen} onClose={() => setInspireOpen(false)} />
      <LifeMomentsModal isOpen={lifeMomentsOpen} onClose={() => setLifeMomentsOpen(false)} />
      <TravelStylesModal isOpen={travelStylesOpen} onClose={() => setTravelStylesOpen(false)} />
      <LastMinuteModal isOpen={lastMinuteOpen} onClose={() => setLastMinuteOpen(false)} />
    </div>
    </div>
  );
}
