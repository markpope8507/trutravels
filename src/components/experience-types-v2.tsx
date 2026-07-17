"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ExperienceType } from "@/lib/data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

/*
 * DESIGN A: "Bold Name" — Minimal card with large handwriting tagline.
 * Inspired by the Brand Pillars carousel. No description, no bullet list.
 * Just: emoji badge, name, handwriting tagline, and the message as a quote.
 */
export function DesignA({ types }: { types: ExperienceType[] }) {
  return (
    <div className="exp-v2-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".exp-v2-next", prevEl: ".exp-v2-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.4 },
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.2, spaceBetween: 20 },
          1280: { slidesPerView: 3.5, spaceBetween: 20 },
        }}
        speed={600}
      >
        {types.map((type) => (
          <SwiperSlide key={type.id}>
            <div className="group relative overflow-hidden rounded-[10px] h-full">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={type.image} alt={type.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* Gradient overlay — dark only at the base for text legibility, photo brighter up top */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(120% 65% at 20% 100%, ${type.color}1a 0%, transparent 55%)` }} />

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  {/* New icon glyph — larger, directly over the image (no circle) */}
                  <img src={type.icon} alt="" className="h-16 w-16 sm:h-[72px] sm:w-[72px] object-contain object-left mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]" />

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide leading-none">
                    {type.name}
                  </h3>
                  <p className="text-tru-pink text-[0.68rem] font-bold uppercase tracking-[0.25em] mt-1.5 font-heading">
                    Experiences
                  </p>

                  {/* Reserve 4 lines so every card's title lines up (3-line copy keeps the title put) */}
                  <p className="text-gray-300 text-xs sm:text-[0.8rem] leading-relaxed mt-3 min-h-[5.6rem] line-clamp-4">
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="exp-v2-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="exp-v2-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/*
 * DESIGN B: "Icon Grid" — Wider landscape cards, no image.
 * Clean dark glass cards with large emoji, name, and short tagline only.
 * Very minimal — feels like feature tiles.
 */
export function DesignB({ types }: { types: ExperienceType[] }) {
  return (
    <div className="exp-v2b-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={12}
        slidesPerView={1.3}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".exp-v2b-next", prevEl: ".exp-v2b-prev" }}
        breakpoints={{
          480: { slidesPerView: 2.2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
          1280: { slidesPerView: 5, spaceBetween: 16 },
        }}
        speed={600}
      >
        {types.map((type) => (
          <SwiperSlide key={type.id}>
            <div className="group rounded-[10px] border border-white/10 bg-white/5 p-6 h-full hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: `${type.color}20` }}>
                {type.emoji}
              </div>
              <h3 className="text-white font-black text-sm uppercase font-heading tracking-wider mb-2">
                {type.name}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {type.tagline}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="exp-v2b-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="exp-v2b-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/*
 * DESIGN C: "Split Card" — Image on top half, content on bottom half.
 * Square aspect ratio. Image fills top, coloured bar divider,
 * then name + tagline below on dark background. No bullets.
 */
export function DesignC({ types }: { types: ExperienceType[] }) {
  return (
    <div className="exp-v2c-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.2}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".exp-v2c-next", prevEl: ".exp-v2c-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.8 },
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
        speed={600}
      >
        {types.map((type) => (
          <SwiperSlide key={type.id}>
            <div className="group rounded-[10px] overflow-hidden border border-white/10 h-full">
              {/* Image top */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={type.image} alt={type.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-lg" style={{ background: type.color }}>
                    {type.emoji}
                  </div>
                </div>
              </div>
              {/* Coloured bar */}
              <div className="h-1" style={{ background: type.color }} />
              {/* Content bottom */}
              <div className="p-4 bg-white/5">
                <h3 className="text-white font-black text-sm uppercase font-heading tracking-wider mb-1">
                  {type.name}
                </h3>
                <p className="font-handwriting text-lg leading-snug" style={{ color: type.color }}>
                  {type.tagline.replace(/\.$/, "")}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="exp-v2c-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="exp-v2c-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
