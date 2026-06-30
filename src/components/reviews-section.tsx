"use client";

// Multi-platform social proof. Ratings and reviews below are placeholders for the
// prototype — wire each platform to its live source when accounts are connected
// (Trustpilot Business API / TrustBox, Google Places reviews, TourRadar feed).
import { useState } from "react";
import { PlatformLogo, PlatformMark } from "@/components/platform-logos";
import PillButton from "@/components/pill-button";

type Platform = {
  name: string;
  score: string;
  reviews: string;
  color: string;
};

const PLATFORMS: Platform[] = [
  { name: "Google", score: "4.8", reviews: "1,200+", color: "#4285F4" },
  { name: "Trustpilot", score: "4.9", reviews: "2,400+", color: "#00B67A" },
  { name: "TourRadar", score: "4.9", reviews: "900+", color: "#0CA4A5" },
];

type Review = {
  title: string;
  text: string;
  name: string;
  trip: string;
  date: string;
  platform: string;
};

const REVIEWS: Review[] = [
  { title: "Best trip of my life", text: "Everything was sorted from the second we landed. The group felt like family within a day and our leader was an absolute legend.", name: "Sophie C.", trip: "Thailand Island Hopper", date: "2 weeks ago", platform: "Trustpilot" },
  { title: "Zero stress, all adventure", text: "I was nervous travelling solo but never felt alone for a second. Every detail was handled so I could just enjoy it. Worth every penny.", name: "Jake M.", trip: "Bali Experience", date: "1 month ago", platform: "Google" },
  { title: "Met friends for life", text: "Came on my own, left with a whole crew I still speak to every day. The Full Moon Party night was unreal. Can't recommend Tru enough.", name: "Priya K.", trip: "Thailand Island Hopper", date: "3 weeks ago", platform: "TourRadar" },
  { title: "Seamless from start to finish", text: "Flights, transfers, hotels, activities — all handled. Our guide knew every hidden spot. This is how travel should be done.", name: "Marcus R.", trip: "Vietnam Explorer", date: "1 month ago", platform: "Trustpilot" },
  { title: "Absolutely unforgettable", text: "The floating bungalows in Khao Sok were a dream and the local food tour blew me away. The little TruExclusive moments made it.", name: "Hannah B.", trip: "Sri Lanka Uncovered", date: "2 months ago", platform: "Google" },
  { title: "10/10 would book again", text: "Brilliant balance of culture, adventure and downtime. Nothing felt rushed and the group size was perfect. My favourite holiday ever.", name: "Tom A.", trip: "Philippines East", date: "3 weeks ago", platform: "TourRadar" },
];

function Stars({ size = "h-4 w-4", color = "#FBBC05" }: { size?: string; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function PlatformCard({ p }: { p: Platform }) {
  return (
    <div
      className="rounded-[10px] border border-white/10 bg-tru-navy p-5 flex items-center gap-4"
      style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
    >
      <span className="text-4xl font-black font-heading leading-none" style={{ color: p.color }}>
        {p.score}
      </span>
      <div className="min-w-0">
        <PlatformLogo name={p.name} markClassName="h-4 w-4" textClassName="text-white font-bold font-heading text-sm" />
        <div className="my-1.5">
          <Stars color={p.color} size="h-3.5 w-3.5" />
        </div>
        <p className="text-gray-500 text-xs">{p.reviews} reviews</p>
      </div>
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className="rounded-[10px] border border-white/10 bg-tru-navy p-5 flex flex-col h-full"
      style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
    >
      <div className="mb-3">
        <Stars />
      </div>
      <h3 className="text-white font-bold font-heading text-base mb-1.5">{r.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{r.text}</p>
      <div className="mt-auto pt-3 border-t border-white/5 flex items-end justify-between gap-3">
        <p className="text-xs text-gray-400">
          <span className="text-white font-semibold">{r.name}</span> &middot; {r.trip} &middot; {r.date}
        </p>
        <PlatformMark name={r.platform} className="h-5 w-5 flex-shrink-0" />
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative pt-4 pb-24 bg-gradient-to-b from-tru-pink/[0.03] to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">The Reviews</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            But Don&apos;t Just Take <span className="text-tru-pink">Our Word For It</span>
          </h2>
        </div>

        {/* Platform ratings — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          {PLATFORMS.map((p) => (
            <PlatformCard key={p.name} p={p} />
          ))}
        </div>

        {/* Toggle */}
        <div className="text-center">
          <PillButton onClick={() => setOpen((o) => !o)} arrow="down">
            {open ? "Hide Reviews" : "Read The Reviews"}
          </PillButton>
        </div>

        {/* Reviews grid — collapsible */}
        <div
          className={`grid transition-all duration-500 ease-out ${
            open ? "grid-rows-[1fr] opacity-100 mt-10" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-1 pb-1">
              {REVIEWS.map((r, i) => (
                <ReviewCard key={i} r={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
