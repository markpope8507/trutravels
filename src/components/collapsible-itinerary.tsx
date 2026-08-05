"use client";

import { useState } from "react";
import { experienceTypes } from "@/lib/data";
import ImageSlider from "@/components/image-slider";

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
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());

  const toggle = (day: number) => {
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
              onClick={() => toggle(day.day)}
              onMouseDown={(e) => e.preventDefault()}
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
                  {/* Image(s) */}
                  {dayImages.length > 0 && <ImageSlider images={dayImages} alt={day.title} />}

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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-3.496-3.496A2.999 2.999 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v3a2 2 0 004 0V3" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3c-2 0-3 2-3 4.5s1 4.5 3 4.5" />
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
