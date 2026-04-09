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
  onBookNow,
}: {
  price: number;
  originalPrice?: number;
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
        {/* Line 1: Price + Book Now */}
        <div className="flex items-center justify-between h-12 border-b border-white/5">
          <div className="flex items-center gap-3">
            {originalPrice && (
              <span className="text-gray-400 text-sm sm:text-base line-through">
                &pound;{originalPrice}
              </span>
            )}
            <span className="text-white font-bold text-2xl sm:text-4xl font-heading">
              &pound;{price}
            </span>
            {originalPrice && (
              <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Save &pound;{originalPrice - price}
              </span>
            )}
          </div>
          <button
            onClick={onBookNow}
            className="rounded-[10px] bg-tru-green px-5 py-2 text-[11px] font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 uppercase tracking-wider font-heading"
          >
            Book Now
          </button>
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
