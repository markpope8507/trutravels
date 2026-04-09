"use client";

import { useState } from "react";

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  image?: string;
};

export default function CollapsibleItinerary({ days }: { days: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  const toggle = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const isOpen = openDay === day.day;
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
