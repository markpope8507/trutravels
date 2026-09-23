"use client";

import { useState, useEffect } from "react";
import ShareButtons from "@/components/share-buttons";
import { CountdownInline, useCountdown } from "@/components/trip-countdown";
import type { TripLaunch } from "@/lib/data";

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
  launch,
  onRegisterInterest,
}: {
  price: number;
  originalPrice?: number;
  tripTitle: string;
  onBookNow: () => void;
  /** Set on a trip that hasn't gone on sale: the price and Check Dates are
   *  replaced by the same countdown the launch card shows, and a Notify Me
   *  button. The countdown follows you down the page because that urgency is
   *  the whole point of the pre-launch page. */
  launch?: TripLaunch;
  onRegisterInterest?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("overview");
  const left = useCountdown(launch?.onSale ?? "");
  const preLaunch = Boolean(launch) && !(left?.done ?? false);

  useEffect(() => {
    const handleScroll = () => {
      const isDesktop = window.innerWidth >= 1024;
      const gate =
        (!isDesktop && document.getElementById("mobile-pricing")) ||
        document.getElementById("trip-hero");
      if (!gate) return;
      // Show sticky only once the bottom of the gate element has fully scrolled
      // past the top of the viewport.
      const rect = gate.getBoundingClientRect();
      setVisible(rect.bottom <= 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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
        {/* Line 1: Share + Title (left) | Savings → Price → Check Dates (right) */}
        <div className="flex items-center justify-between gap-4 h-14 border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <ShareButtons title={tripTitle} />
            </div>
            <p className="hidden sm:block text-white font-black text-base sm:text-lg uppercase font-heading tracking-tight truncate min-w-0">
              {tripTitle}
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
          {preLaunch ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="hidden font-heading text-[10px] uppercase tracking-wider text-tru-pink sm:inline">
                  On sale in
                </span>
                <CountdownInline
                  iso={launch!.onSale}
                  className="font-heading text-xl font-black leading-none text-white sm:text-2xl"
                />
              </div>
              <button
                onClick={onRegisterInterest}
                className="flex-shrink-0 whitespace-nowrap rounded-[10px] bg-tru-pink px-4 py-2.5 font-heading text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light sm:px-5"
              >
                Notify Me
              </button>
            </>
          ) : (
          <>
          {originalPrice && originalPrice !== price && (
            <span className="text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading whitespace-nowrap">
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
          </>
          )}
          </div>
        </div>

        {/* Line 2: Section shortcuts. Reviews is dropped pre-launch — the
            section isn't on the page, and a shortcut that scrolls nowhere is
            worse than one fewer shortcut. */}
        <div className="flex items-center justify-between h-10">
          {navSections.filter((s) => !(preLaunch && s.id === "reviews")).map((s) => (
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
