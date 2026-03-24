"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Creator } from "@/lib/data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export default function CreatorsCarousel({
  creators,
}: {
  creators: Creator[];
}) {
  return (
    <div className="creator-carousel relative">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{
          nextEl: ".creator-next",
          prevEl: ".creator-prev",
        }}
        pagination={{
          el: ".creator-pagination",
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
        {creators.map((creator) => (
          <SwiperSlide key={creator.id}>
            <div className="group relative overflow-hidden rounded-[10px] h-full">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* Top badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full font-heading bg-tru-pink">
                    {creator.speciality}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-heading">
                    <span className="text-lg sm:text-xl font-black text-white uppercase leading-tight block">
                      {creator.name}
                    </span>
                    <span className="text-2xl sm:text-3xl font-handwriting leading-none text-tru-pink">
                      {creator.role}
                    </span>
                  </h3>

                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2 mb-3 font-heading">
                    {creator.location}
                  </p>

                  <div className="w-8 h-[2px] bg-tru-pink mb-3" />

                  <p className="text-gray-300 text-xs leading-relaxed">
                    {creator.bio}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      <button className="creator-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="creator-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="creator-pagination flex justify-center gap-2 mt-8" />
    </div>
  );
}
