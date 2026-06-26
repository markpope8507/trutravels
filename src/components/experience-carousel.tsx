"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Trip } from "@/lib/data";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export default function ExperienceCarousel({ trips }: { trips: Trip[] }) {
  return (
    <div className="experience-carousel relative">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.15}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{
          nextEl: ".exp-next",
          prevEl: ".exp-prev",
        }}
        pagination={{
          el: ".exp-pagination",
          clickable: true,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 3.2, spaceBetween: 20 },
        }}
        speed={600}
        className=""
      >
        {trips.slice(0, 6).map((trip) => (
          <SwiperSlide key={trip.id} className="!h-auto">
            <TripCard trip={trip} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation arrows */}
      <button className="exp-prev absolute top-[calc(50%-60px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="exp-next absolute top-[calc(50%-60px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="exp-pagination flex justify-center gap-2 mt-8" />
    </div>
  );
}
