"use client";

import { useState } from "react";

type AccommodationItem = {
  title: string;
  description: string;
  image: string;
};

export default function AccommodationCarousel({ items }: { items: AccommodationItem[] }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goNext = () => setActive((active + 1) % items.length);
  const goPrev = () => setActive((active - 1 + items.length) % items.length);

  const current = items[active];

  return (
    <>
      <div>
        {/* Main image — clickable to open fullscreen */}
        <div
          className="relative rounded-[10px] overflow-hidden aspect-[16/9] sm:aspect-[2/1] mb-4 sm:cursor-pointer group"
          onClick={() => { if (window.innerWidth >= 640) setFullscreen(true); }}
        >
          <img
            src={current.image}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Mobile nav arrows */}
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 flex items-center justify-center text-white z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Expand hint */}
          <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white text-lg font-bold font-heading">{current.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-5">{current.description}</p>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                active === i ? "ring-2 ring-tru-pink opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={item.image} alt={item.title} className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen popup */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-end px-4 py-4 flex-shrink-0">
            <button
              onClick={() => setFullscreen(false)}
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image + text container */}
          <div className="flex-1 flex flex-col items-center justify-center relative px-4">
            <div className="w-full max-w-3xl relative">
              <img
                src={current.image}
                alt={current.title}
                className="w-full max-h-[55vh] object-contain rounded-[10px]"
              />

              {/* Navigation arrows */}
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Title + description aligned with image */}
            <div className="w-full max-w-3xl mt-3">
              <h3 className="text-white font-bold font-heading text-base mb-0.5">{current.title}</h3>
              <p className="text-gray-500 text-xs mb-1">{active + 1} of {items.length}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{current.description}</p>
            </div>
          </div>

          {/* Bottom — thumbnails */}
          <div className="flex-shrink-0 px-4 pb-6 pt-4">
            <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    active === i ? "ring-2 ring-tru-pink opacity-100 scale-105" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <img src={item.image} alt={item.title} className="h-14 w-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
