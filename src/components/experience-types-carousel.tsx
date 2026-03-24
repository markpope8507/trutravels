"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { ExperienceType } from "@/lib/data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export default function ExperienceTypesCarousel({
  types,
}: {
  types: ExperienceType[];
}) {
  return (
    <div className="usp-carousel relative">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{
          nextEl: ".usp-next",
          prevEl: ".usp-prev",
        }}
        pagination={{
          el: ".usp-pagination",
          clickable: true,
        }}
        breakpoints={{
          480: { slidesPerView: 1.4, spaceBetween: 16 },
          640: { slidesPerView: 2.1, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 20 },
          1280: { slidesPerView: 3.5, spaceBetween: 20 },
        }}
        speed={600}
        className="!overflow-visible"
      >
        {types.map((type) => (
          <SwiperSlide key={type.id}>
            <div className="group relative overflow-hidden rounded-[10px] h-full">
              {/* Background image */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={type.image}
                  alt={type.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                {/* Top — emoji + type badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: type.color }}
                  >
                    {type.emoji}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full font-heading"
                    style={{ background: type.color }}
                  >
                    {type.name} Experiences
                  </span>
                </div>

                {/* Bottom — content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  {/* Tagline */}
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase font-heading leading-tight mb-2">
                    {type.tagline}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-xs leading-relaxed mb-3">
                    {type.description}
                  </p>

                  {/* Divider */}
                  <div
                    className="w-8 h-[2px] mb-3"
                    style={{ background: type.color }}
                  />

                  {/* Experiences list */}
                  <ul className="space-y-1.5">
                    {type.experiences.map((exp) => (
                      <li key={exp} className="flex items-center gap-2">
                        <span
                          className="h-1 w-1 rounded-full flex-shrink-0"
                          style={{ background: type.color }}
                        />
                        <span className="text-gray-300 text-xs leading-snug">
                          {exp}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      <button className="usp-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="usp-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="usp-pagination flex justify-center gap-2 mt-8" />
    </div>
  );
}
