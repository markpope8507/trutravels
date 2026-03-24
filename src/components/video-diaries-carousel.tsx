"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { VideoDiary } from "@/lib/data";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

function VideoCard({ diary }: { diary: VideoDiary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const tagColors: Record<string, string> = {
    Traveller: "#6BD495",
    Creator: "#FF3F99",
    Influencer: "#2172D5",
  };

  return (
    <div className="group relative overflow-hidden rounded-[10px] h-full cursor-pointer" onClick={togglePlay}>
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {/* Video */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster={diary.poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={diary.video} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

        {/* Play/pause indicator */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Top — tag + handle */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span
            className="text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full font-heading"
            style={{ background: tagColors[diary.tag] }}
          >
            {diary.tag}
          </span>
          <span className="text-white/70 text-xs font-medium">
            {diary.handle}
          </span>
        </div>

        {/* Bottom — content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          {/* Caption */}
          <p className="text-white text-sm leading-relaxed mb-3">
            {diary.caption}
          </p>

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: tagColors[diary.tag] }}
            >
              {diary.avatar}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{diary.author}</p>
              <p className="text-gray-400 text-[10px]">{diary.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoDiariesCarousel({
  diaries,
}: {
  diaries: VideoDiary[];
}) {
  return (
    <div className="video-carousel relative">
      <Swiper
        modules={[Navigation, Pagination, FreeMode]}
        spaceBetween={12}
        slidesPerView={1.8}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{
          nextEl: ".video-next",
          prevEl: ".video-prev",
        }}
        pagination={{
          el: ".video-pagination",
          clickable: true,
        }}
        breakpoints={{
          480: { slidesPerView: 2.3, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 14 },
          1024: { slidesPerView: 4.5, spaceBetween: 16 },
          1280: { slidesPerView: 5.2, spaceBetween: 16 },
        }}
        speed={600}
        className="!overflow-visible"
      >
        {diaries.map((diary) => (
          <SwiperSlide key={diary.id}>
            <VideoCard diary={diary} />
          </SwiperSlide>
        ))}

        {/* CTA card */}
        <SwiperSlide>
          <div className="relative rounded-[10px] h-full border border-dashed border-tru-pink/30 flex items-center justify-center aspect-[9/16]">
            <div className="text-center px-6">
              <div className="h-12 w-12 rounded-full border border-tru-pink/30 flex items-center justify-center mx-auto mb-4">
                <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-bold mb-1 uppercase text-sm font-heading">Share Yours</p>
              <p className="text-gray-500 text-xs mb-4">Tag @trutravels and your video could be here.</p>
              <Link href="/signup" className="text-tru-pink text-sm font-semibold hover:text-tru-pink-light transition">
                Join free &rarr;
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Navigation arrows */}
      <button className="video-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="video-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination dots */}
      <div className="video-pagination flex justify-center gap-2 mt-8" />
    </div>
  );
}
