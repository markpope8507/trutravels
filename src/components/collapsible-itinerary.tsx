"use client";

import { useRef, useState } from "react";
import { experienceTypes } from "@/lib/data";

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  location?: string;
  transport?: string;
  meals?: string[];
};

type Activity = {
  name: string;
  experienceType?: string;
  day?: number;
};

export default function CollapsibleItinerary({
  days,
  activities = [],
}: {
  days: ItineraryDay[];
  activities?: Activity[];
}) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const toggle = (day: number, headerEl?: HTMLElement | null) => {
    // Keep the clicked header fixed in the viewport while the panel animates
    // open/closed, so the content only grows below it (no upward scroll jump).
    if (headerEl) {
      const anchorTop = headerEl.getBoundingClientRect().top;
      const started = performance.now();
      const pin = () => {
        const delta = headerEl.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
        if (performance.now() - started < 420) requestAnimationFrame(pin);
      };
      requestAnimationFrame(pin);
    }
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div className="space-y-3 [overflow-anchor:none]">
      {days.map((day) => {
        const isOpen = openDays.has(day.day);
        const dayActivities = activities.filter((a) => a.day === day.day);
        const dayTypeIds = new Set(
          dayActivities
            .map((a) => a.experienceType)
            .filter(Boolean) as string[],
        );
        const dayExpTypes = experienceTypes.filter((e) => dayTypeIds.has(e.id));
        const dayImages = day.images?.length ? day.images : day.image ? [day.image] : [];
        return (
          <div
            key={day.day}
            className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden transition-all duration-200"
          >
            {/* Header — always visible */}
            <button
              onClick={(e) => toggle(day.day, e.currentTarget)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-white/5 transition-colors duration-200"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-tru-pink text-white flex items-center justify-center text-sm font-bold">
                {day.day}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {day.title}
                </h3>
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expandable content — grid-rows transition animates to true height */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
              <div className="px-4 sm:pl-[72px] pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">
                  {/* Image(s) */}
                  {dayImages.length > 1 ? (
                    <DayImageSlider images={dayImages} alt={day.title} />
                  ) : dayImages.length === 1 ? (
                    <div className="rounded-lg overflow-hidden mb-4 sm:mb-0 sm:w-72 lg:w-80 sm:h-52 lg:h-56 sm:flex-shrink-0">
                      <img
                        src={dayImages[0]}
                        alt={day.title}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    </div>
                  ) : null}

                  {/* Body text */}
                  <p className="text-gray-300 text-sm leading-relaxed sm:flex-1">
                    {day.description}
                  </p>
                </div>

                {/* What's included today — icon rows for location, transport, activities, meals */}
                {(day.location ||
                  day.transport ||
                  day.meals?.length ||
                  dayActivities.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    {day.location && (
                      <DayIncludedRow
                        icon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        }
                        label={day.location}
                      />
                    )}
                    {day.transport && (
                      <DayIncludedRow
                        icon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="4" y="4" width="16" height="14" rx="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M8 18v2m8-2v2" />
                            <circle cx="8" cy="15" r="0.5" fill="currentColor" />
                            <circle cx="16" cy="15" r="0.5" fill="currentColor" />
                          </svg>
                        }
                        label={day.transport}
                      />
                    )}
                    {dayActivities.map((a) => (
                      <DayIncludedRow
                        key={a.name}
                        icon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        }
                        label={a.name}
                      />
                    ))}
                    {day.meals?.map((m) => (
                      <DayIncludedRow
                        key={m}
                        icon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18M5 11V5a1 1 0 011-1h12a1 1 0 011 1v6M5 11l-1 8a1 1 0 001 1h14a1 1 0 001-1l-1-8" />
                          </svg>
                        }
                        label={m}
                      />
                    ))}
                  </div>
                )}

                {/* Experience-type cards for this day — mirrors the activities selector */}
                {dayExpTypes.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {dayExpTypes.map((e) => (
                      <div
                        key={e.id}
                        className="rounded-[10px] border p-3 flex flex-col items-center gap-2.5 text-center text-white"
                        style={{ borderColor: e.color, background: `${e.color}1f` }}
                      >
                        <span className="h-10 w-10 flex items-center justify-center">
                          <img src={e.icon} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading leading-tight">
                          {e.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayIncludedRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-gray-300">
      <span className="text-tru-pink flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function DayImageSlider({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const startX = useRef(0);
  const n = images.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div
      className="relative rounded-lg overflow-hidden mb-4 sm:mb-0 sm:w-72 lg:w-80 sm:h-52 lg:h-56 sm:flex-shrink-0 group"
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx > 40) go(-1);
        else if (dx < -40) go(1);
      }}
    >
      {/* Sliding track — images swipe out/in */}
      <div
        className="flex h-48 sm:h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={alt} className="w-full h-full flex-shrink-0 object-cover" />
        ))}
      </div>

      {/* Count badge */}
      <div className="absolute top-2 right-2 rounded-full bg-black/55 backdrop-blur-sm px-2 py-0.5 text-white text-[10px] font-bold font-heading">
        {i + 1}/{n}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/45 hover:bg-black/70 flex items-center justify-center text-white transition sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Next image"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/45 hover:bg-black/70 flex items-center justify-center text-white transition sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => { e.stopPropagation(); setI(idx); }}
            aria-label={`Go to image ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
