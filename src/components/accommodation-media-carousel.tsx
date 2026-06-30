"use client";

import { useState } from "react";

export type AccommodationMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
};

export default function AccommodationMediaCarousel({ items }: { items: AccommodationMedia[] }) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const current = items[active];
  const goNext = () => setActive((active + 1) % items.length);
  const goPrev = () => setActive((active - 1 + items.length) % items.length);

  return (
    <div>
      {/* Main media */}
      <div className="relative rounded-[12px] overflow-hidden aspect-[16/9] sm:aspect-[2/1] mb-4 border border-white/10 bg-black">
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={current.src}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {current.type === "image" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
              <h3 className="text-white text-lg font-black uppercase font-heading">{current.title}</h3>
            </div>
          </>
        )}

        {/* Nav arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition z-10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition z-10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      <p className="text-gray-300 text-sm leading-relaxed mb-5">
        <span className="text-white font-semibold">{current.title}.</span> {current.caption}
      </p>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={item.title}
            className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
              active === i ? "ring-2 ring-tru-pink opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={item.type === "video" ? item.poster ?? item.src : item.src}
              alt={item.title}
              className="h-16 w-24 object-cover"
            />
            {item.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <svg className="h-3 w-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
