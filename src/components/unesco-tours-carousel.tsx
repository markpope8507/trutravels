"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Trip } from "@/lib/data";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function UnescoToursCarousel({
  tours,
}: {
  tours: Trip[];
}) {
  if (tours.length === 0) return null;

  return (
    <div className="unesco-tours-carousel relative">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.15}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{
          nextEl: ".unesco-tours-next",
          prevEl: ".unesco-tours-prev",
        }}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 3.2, spaceBetween: 20 },
        }}
        speed={600}
      >
        {tours.map((tour) => (
          <SwiperSlide key={tour.id} className="!h-auto">
            <TripCard trip={tour} href={tour.bookingUrl} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="unesco-tours-prev absolute top-[calc(50%-40px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default"
        aria-label="Previous tours"
      >
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="unesco-tours-next absolute top-[calc(50%-40px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default"
        aria-label="Next tours"
      >
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
