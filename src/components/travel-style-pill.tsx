"use client";

import { useState } from "react";
import { TravelStyle, travelStyleConfig } from "@/lib/data";

export default function TravelStylePill({ style }: { style: TravelStyle }) {
  const [showModal, setShowModal] = useState(false);
  const config = travelStyleConfig[style];

  return (
    <>
      <div>
        <img
          src="/classic-logo.png"
          alt={`${config.label} travel style`}
          className="h-24 cursor-pointer mb-2"
          onClick={() => setShowModal(true)}
        />
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Travel Style</span>
          <button
            onClick={() => setShowModal(true)}
            className="h-5 w-5 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors"
            aria-label={`More info about ${config.label} travel style`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-80 rounded-[10px] border border-white/10 bg-tru-navy shadow-xl shadow-black/40 p-6 z-10 animate-fade-in text-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src="/classic-logo.png"
              alt={`${config.label} travel style`}
              className="h-16 w-16 mx-auto mb-4"
            />
            <p
              className="text-lg font-bold uppercase tracking-wider font-heading mb-3"
              style={{ color: config.color }}
            >
              {config.label}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
