"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { CSSProperties } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type GalleryImage = { src: string; caption: string };

const swiperVars = {
  "--swiper-navigation-color": "#ffffff",
  "--swiper-navigation-size": "26px",
  "--swiper-pagination-color": "#FF3F99",
  "--swiper-pagination-bullet-inactive-color": "#ffffff",
} as CSSProperties;

export default function InclusionGallery({
  images,
  alt,
}: {
  images: GalleryImage[];
  alt: string;
}) {
  return (
    <div className="rounded-[16px] overflow-hidden border border-white/10">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        loop={images.length > 1}
        navigation
        pagination={{ clickable: true }}
        speed={500}
        style={swiperVars}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative aspect-[4/3]">
              <img
                src={img.src}
                alt={`${alt} — ${img.caption}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <p className="absolute bottom-9 left-5 right-5 text-white text-sm sm:text-base font-bold font-heading uppercase tracking-wide drop-shadow">
                {img.caption}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
