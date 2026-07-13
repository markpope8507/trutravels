"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AccommodationItem = {
  title: string;
  description: string;
  image: string;
  video?: string;
  poster?: string;
};

export default function AccommodationCarousel({ items }: { items: AccommodationItem[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);

  const goNext = () => setActive((a) => (a + 1) % items.length);
  const goPrev = () => setActive((a) => (a - 1 + items.length) % items.length);

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  // Lock body scroll + keyboard nav while the popup is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, items.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
  };

  const hasVideo = items.some((i) => i.video);
  const cover = items[0];
  const current = items[active];

  return (
    <>
      {/* Click-to-open trigger */}
      <button onClick={() => openAt(0)} className="group block w-full text-left">
        <div className="relative rounded-[12px] overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
          <img
            src={cover.image}
            alt={cover.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

          {/* Media count badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider font-heading">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {items.length} {items.length === 1 ? "Stay" : "Stays"}
          </div>

          {/* Play affordance if any videos */}
          {hasVideo && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-tru-pink/90 px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider font-heading">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Video
            </div>
          )}

          {/* Bottom content + CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <h3 className="text-white text-lg font-bold font-heading mb-2">{cover.title}</h3>
            <span className="inline-flex items-center gap-2 rounded-full bg-white text-tru-navy px-4 py-2 text-xs font-bold uppercase tracking-wider font-heading group-hover:bg-tru-pink group-hover:text-white transition-colors">
              Swipe through all {items.length} stays
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Peek thumbnail strip — signals there's more to swipe */}
        <div className="mt-2 flex gap-2">
          {items.slice(1, 5).map((item, i) => (
            <div key={i} className="relative flex-1 rounded-lg overflow-hidden aspect-[4/3]">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
              {item.video && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-6 w-6 rounded-full bg-black/50 flex items-center justify-center">
                    <svg className="h-3 w-3 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </button>

      {/* Swipeable popup */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-4 flex-shrink-0">
              <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] font-heading">
                Where You&apos;ll Stay · {active + 1} / {items.length}
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Media + text */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 min-h-0">
              <div className="w-full max-w-3xl relative">
                {current.video ? (
                  <video
                    key={current.video}
                    src={current.video}
                    poster={current.poster || current.image}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[55vh] rounded-[10px] bg-black object-contain"
                  />
                ) : (
                  <img src={current.image} alt={current.title} className="w-full max-h-[55vh] object-contain rounded-[10px]" />
                )}

                {/* Arrows */}
                {items.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      aria-label="Previous"
                      className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                      onClick={goNext}
                      aria-label="Next"
                      className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}
              </div>

              <div className="w-full max-w-3xl mt-4">
                <h3 className="text-white font-bold font-heading text-lg mb-1.5">{current.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{current.description}</p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex-shrink-0 px-4 pb-6 pt-4">
              <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
                {items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                      active === i ? "ring-2 ring-tru-pink opacity-100 scale-105" : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={item.image} alt={item.title} className="h-14 w-20 object-cover" />
                    {item.video && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-5 w-5 rounded-full bg-black/50 flex items-center justify-center">
                          <svg className="h-2.5 w-2.5 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
