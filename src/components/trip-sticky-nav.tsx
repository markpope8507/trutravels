"use client";

import { useState, useEffect } from "react";

const navSections = [
  { id: "overview", label: "Overview" },
  { id: "inclusions", label: "Inclusions" },
  { id: "itinerary", label: "Itinerary" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
];

const allSections = [
  { id: "overview" },
  { id: "highlights" },
  { id: "inclusions" },
  { id: "itinerary" },
  { id: "map" },
  { id: "reviews" },
  { id: "faqs" },
];

export default function TripStickyNav({
  price,
  originalPrice,
  tripTitle,
  onBookNow,
}: {
  price: number;
  originalPrice?: number;
  tripTitle: string;
  onBookNow: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("trip-hero");
      if (!hero) return;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setVisible(window.scrollY > heroBottom);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      for (const section of [...allSections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            const navMatch = navSections.find((s) => s.id === section.id);
            setActive(navMatch ? section.id : active);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Line 1: Tour title (left) | Savings → Price → Check Dates (right) */}
        <div className="flex items-center justify-between gap-4 h-14 border-b border-white/5">
          <p className="text-white font-black text-base sm:text-lg uppercase font-heading tracking-tight truncate min-w-0">
            {tripTitle}
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
          {originalPrice && originalPrice !== price && (
            <span className="text-white text-[11px] font-bold uppercase tracking-wider font-heading whitespace-nowrap hidden sm:inline">
              Save &pound;{originalPrice - price}
            </span>
          )}
          <div className="flex items-baseline gap-2 flex-shrink-0">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-heading hidden sm:inline">
              From
            </span>
            {originalPrice && (
              <span className="text-gray-500 text-xs sm:text-sm line-through">
                &pound;{originalPrice}
              </span>
            )}
            <span className="text-white font-black text-2xl sm:text-3xl font-heading leading-none">
              &pound;{price}
            </span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">/ person</span>
          </div>
          <button
            onClick={onBookNow}
            className="rounded-[10px] px-4 sm:px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider font-heading transition-all duration-200 border whitespace-nowrap flex-shrink-0"
            style={{
              backgroundColor: "#FFD814",
              borderColor: "#FCD200",
              color: "#0F1111",
            }}
          >
            Check Dates &rarr;
          </button>
          </div>
        </div>

        {/* Line 2: Section shortcuts */}
        <div className="flex items-center justify-between h-10">
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex-1 text-center py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading whitespace-nowrap transition-all duration-200 ${
                active === s.id
                  ? "text-tru-pink border-b-2 border-tru-pink"
                  : "text-gray-400 hover:text-white border-b-2 border-transparent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
