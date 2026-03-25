"use client";

import { useState } from "react";
import { TravelStyle, travelStyleConfig } from "@/lib/data";

export default function TravelStyleInfo({ style }: { style: TravelStyle }) {
  const [open, setOpen] = useState(false);
  const config = travelStyleConfig[style];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10 group w-full text-left"
      >
        {/* Icon circle */}
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: config.color }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-heading">Travel Style</p>
          <p className="text-white text-sm font-bold font-heading uppercase tracking-wide">
            {config.label}
          </p>
        </div>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable description */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-[10px] border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-gray-300 text-sm leading-relaxed">{config.description}</p>
        </div>
      </div>
    </div>
  );
}
