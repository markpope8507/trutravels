"use client";

import { useState } from "react";
import { experienceTypes } from "@/lib/data";

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  image?: string;
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
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggle = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isOpen = openDay === day.day;
        const dayActivities = activities.filter((a) => a.day === day.day);
        const dayTypeIds = new Set(
          dayActivities
            .map((a) => a.experienceType)
            .filter(Boolean) as string[],
        );
        const dayExpTypes = experienceTypes.filter((e) => dayTypeIds.has(e.id));
        return (
          <div
            key={day.day}
            className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden transition-all duration-200"
          >
            {/* Header — always visible */}
            <button
              onClick={() => toggle(day.day)}
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

            {/* Expandable content */}
            <div
              className={`transition-all duration-300 ease-out ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-4 sm:pl-[72px] pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">
                  {/* Image */}
                  {day.image && (
                    <div className="rounded-lg overflow-hidden mb-4 sm:mb-0 sm:w-48 sm:h-36 sm:flex-shrink-0">
                      <img
                        src={day.image}
                        alt={day.title}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    </div>
                  )}

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
