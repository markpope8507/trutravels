"use client";

import { useRef, useState } from "react";

// Swipeable image box used on itinerary days and activities. Handles a single
// image (plain box) or multiple (arrows, dots, count, touch-swipe). Box size
// mirrors the single-image day box exactly.
export default function ImageSlider({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const startX = useRef(0);
  const n = images.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div
      className="relative rounded-lg overflow-hidden mb-4 sm:mb-0 w-full sm:w-72 lg:w-80 aspect-[1.91/1] sm:flex-shrink-0 group"
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (n < 2) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx > 40) go(-1);
        else if (dx < -40) go(1);
      }}
    >
      {/* Sliding track — images swipe out/in */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img key={idx} src={src} alt={alt} className="w-full h-full flex-shrink-0 object-cover" />
        ))}
      </div>

      {n > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}
