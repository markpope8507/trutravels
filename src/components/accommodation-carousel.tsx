"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

type AccommodationItem = {
  title: string;
  description: string;
  image: string;
  video?: string;
  poster?: string;
};

export default function AccommodationCarousel({ items }: { items: AccommodationItem[] }) {
  const [playing, setPlaying] = useState<AccommodationItem | null>(null);

  // Lock body scroll + close on Escape while the player is open.
  useEffect(() => {
    if (!playing) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [playing]);

  return (
    <div className="accommodation-carousel relative">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={12}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".acc-next", prevEl: ".acc-prev" }}
        pagination={{ el: ".acc-pagination", clickable: true }}
        breakpoints={{
          480: { slidesPerView: 1.2, spaceBetween: 14 },
          640: { slidesPerView: 1.6, spaceBetween: 16 },
          1024: { slidesPerView: 1.15, spaceBetween: 14 },
          1280: { slidesPerView: 1.25, spaceBetween: 16 },
        }}
        speed={600}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i} className="!h-auto">
            <div className="rounded-[10px] overflow-hidden border border-white/10 bg-white/5 h-full flex flex-col">
              {item.video ? (
                <button
                  onClick={() => setPlaying(item)}
                  className="group relative aspect-square bg-black block w-full"
                  aria-label={`Play video of ${item.title}`}
                >
                  <img src={item.poster || item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-white ml-1 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                  <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-tru-pink/90 px-2.5 py-1 text-white text-[10px] font-bold uppercase tracking-wider font-heading">
                    <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Video
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setPlaying(item)}
                  className="group relative aspect-square bg-black block w-full"
                  aria-label={`View photo of ${item.title}`}
                >
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
              <div className="p-4 flex-1">
                <h3 className="text-white text-base font-bold font-heading mb-1.5">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      <button className="acc-prev absolute top-[22%] -left-2 sm:-left-4 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="acc-next absolute top-[22%] -right-2 sm:-right-4 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="acc-pagination flex justify-center gap-2 mt-6" />

      {/* Video player popup */}
      {playing &&
        createPortal(
          <div className="fixed inset-0 z-[120] bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setPlaying(null)}>
            <button
              onClick={() => setPlaying(null)}
              aria-label="Close"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {playing.video ? (
                <video
                  src={playing.video}
                  poster={playing.poster || playing.image}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[75vh] rounded-[10px] bg-black object-contain"
                />
              ) : (
                <img
                  src={playing.image}
                  alt={playing.title}
                  className="w-full max-h-[75vh] rounded-[10px] bg-black object-contain"
                />
              )}
              <h3 className="text-white font-bold font-heading text-lg mt-4">{playing.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mt-1">{playing.description}</p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
