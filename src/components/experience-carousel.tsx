"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Trip } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import TravelStyleBadge from "@/components/travel-style-badge";

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
        slidesPerView={1.2}
        centeredSlides={true}
        freeMode={false}
        navigation={{
          nextEl: ".exp-next",
          prevEl: ".exp-prev",
        }}
        pagination={{
          el: ".exp-pagination",
          clickable: true,
        }}
        breakpoints={{
          480: { slidesPerView: 1.4, centeredSlides: true },
          640: { slidesPerView: 2.2, centeredSlides: false },
          1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
          1280: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
        }}
        speed={600}
        className=""
      >
        {trips.map((trip) => (
          <SwiperSlide key={trip.id}>
            <Link href={tripUrl(trip)} className="group block">
              <div
                className="relative overflow-hidden rounded-[10px] bg-white/5 border border-white/5 hover:border-tru-pink/20 transition-all duration-300"
                style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Travel style badge */}
                  <div className="absolute bottom-1 left-1">
                    <TravelStyleBadge style={trip.travelStyle} />
                  </div>

                  {/* Member badge */}
                  {trip.memberOnly && (
                    <div
                      className="absolute top-3 right-3 bg-tru-pink text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-heading"
                      style={{ filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.5))" }}
                    >
                      Members Only
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="p-4">
                  <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading mb-1">{trip.duration}</p>
                  <h3 className="text-sm font-black text-white font-heading leading-tight group-hover:text-tru-pink transition-colors mb-2 uppercase">
                    {trip.title}
                  </h3>

                  {trip.startLocation && trip.endLocation && (
                    <p className="text-gray-400 text-[10px] mb-2 flex items-center gap-1.5">
                      <svg className="h-3 w-3 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {trip.startLocation} &rarr; {trip.endLocation}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                    {trip.tagline}
                  </p>

                  <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                    {trip.region} &middot; {trip.destination}
                  </p>

                  {trip.rating && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-4 w-4 bg-[#00B67A] flex items-center justify-center rounded-[2px]">
                            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                      <span className="text-white text-[10px] font-bold">{trip.rating}</span>
                      <span className="text-gray-500 text-[10px]">({trip.reviewCount})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    {trip.originalPrice && (
                      <span className="text-gray-500 text-base line-through">
                        &pound;{trip.originalPrice}
                      </span>
                    )}
                    <span className="text-white font-bold text-2xl font-heading">
                      &pound;{trip.price}
                    </span>
                    {trip.originalPrice && (
                      <>
                        <span className="text-red-500 text-sm font-bold">
                          -{Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100)}%
                        </span>
                        <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ml-auto">
                          Save &pound;{trip.originalPrice - trip.price}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
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
