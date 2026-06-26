"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Trip } from "@/lib/data";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export default function TripCarouselSection({
  label,
  title,
  labelColor,
  trips: sectionTrips,
  id,
}: {
  label: string;
  title: string;
  labelColor: string;
  trips: Trip[];
  id: string;
}) {
  if (sectionTrips.length === 0) return null;
  const visibleTrips = sectionTrips.slice(0, 6);
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1" style={{ color: labelColor }}>
            {label}
          </p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide">{title}</h2>
        </div>
      </div>
      <div className={`${id}-carousel trip-carousel relative`}>
        <Swiper
          modules={[Navigation, Pagination, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.15}
          freeMode={{ enabled: true, sticky: false }}
          navigation={{ nextEl: `.${id}-next`, prevEl: `.${id}-prev` }}
          pagination={{ el: `.${id}-pagination`, clickable: true }}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 3.2, spaceBetween: 20 },
          }}
          speed={600}
        >
          {visibleTrips.map((trip) => (
            <SwiperSlide key={trip.id}>
              <TripCard trip={trip} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button className={`${id}-prev absolute top-[calc(50%-40px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default`}>
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className={`${id}-next absolute top-[calc(50%-40px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default`}>
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className={`${id}-pagination flex justify-center gap-2 mt-8`} />
      </div>
    </section>
  );
}
