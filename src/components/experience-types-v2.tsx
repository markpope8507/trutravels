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
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                {/* Top badge */}
                <div className="absolute top-4 left-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl" style={{ background: type.color }}>
                    {type.emoji}
                  </div>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 pb-7 sm:pb-8">
                  <div className="mb-1">
                    <span className="text-lg sm:text-xl font-black text-white uppercase font-heading tracking-wider">
                      {type.name}
                    </span>
                    <br />
                    <span className="text-3xl sm:text-4xl font-handwriting leading-none" style={{ color: type.color }}>
                      Experiences
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-white uppercase font-heading tracking-wider mt-3 mb-3 leading-snug">
                    {type.tagline}
                  </h3>

                  <div className="w-8 h-[2px] mb-3" style={{ background: type.color }} />

                  <ul className="space-y-1.5">
                    {type.experiences.slice(0, 3).map((exp) => (
                      <li key={exp} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: type.color }} />
                        <span className="text-gray-300 text-xs leading-snug">{exp}</span>
                      </li>
                    ))}
                  </ul>
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
