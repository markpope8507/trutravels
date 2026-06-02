"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Trip } from "@/lib/data";
import TripCard from "@/components/trip-card";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function RelatedTrips({ trips, currentTripId }: { trips: Trip[]; currentTripId: string }) {
  const related = trips.filter((t) => t.id !== currentTripId).slice(0, 8);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Explore More</p>
      <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-8">You Might Like</h2>
      <div className="related-carousel relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          freeMode={false}
          navigation={{ nextEl: ".related-next", prevEl: ".related-prev" }}
          breakpoints={{
            480: { slidesPerView: 1.4, centeredSlides: true },
            640: { slidesPerView: 2.2, centeredSlides: false },
            1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
          }}
          speed={600}
        >
          {related.map((trip) => (
            <SwiperSlide key={trip.id} className="!h-auto">
              <TripCard trip={trip} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="related-prev absolute top-[calc(50%-40px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="related-next absolute top-[calc(50%-40px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}
