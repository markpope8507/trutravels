"use client";

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
              <div className="relative aspect-[16/10] bg-black">
                {item.video ? (
                  <video
                    src={item.video}
                    poster={item.poster || item.image}
                    controls
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                )}
                {item.video && (
                  <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-tru-pink/90 px-2.5 py-1 text-white text-[10px] font-bold uppercase tracking-wider font-heading">
                    <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Video
                  </span>
                )}
              </div>
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
    </div>
  );
}
