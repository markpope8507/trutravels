"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { VideoDiary } from "@/lib/data";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const tagColors: Record<string, string> = {
  Traveller: "#6BD495",
  Creator: "#FF3F99",
  Influencer: "#2172D5",
};

/* ============================================================
   THUMBNAIL CARD — shown in the carousel
   ============================================================ */
function VideoCard({ diary, onClick }: { diary: VideoDiary; onClick: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[10px] h-full cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        <video
          src={diary.video}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Top — tag + handle */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span
            className="text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full font-heading"
            style={{ background: tagColors[diary.tag] }}
          >
            {diary.tag}
          </span>
          <span className="text-white/70 text-xs font-medium">{diary.handle}</span>
        </div>

        {/* Bottom — author */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          <p className="text-white text-sm leading-relaxed mb-3">{diary.caption}</p>
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

/* ============================================================
   FULL-SCREEN VIEWER — opens on click
   ============================================================ */
function FullScreenViewer({
  diaries,
  startIndex,
  onClose,
}: {
  diaries: VideoDiary[];
  startIndex: number;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [transitioning, setTransitioning] = useState<"left" | "right" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = diaries[activeIndex];
  const nextIndex = (activeIndex + 1) % diaries.length;
  const prevIndex = (activeIndex - 1 + diaries.length) % diaries.length;

  const goTo = useCallback((index: number, direction: "left" | "right" = "left") => {
    setTransitioning(direction);
    setTimeout(() => {
      setActiveIndex(index);
      setProgress(0);
      setIsPlaying(true);
      setTransitioning(null);
    }, 300);
  }, []);

  const goNext = useCallback(() => goTo(nextIndex, "left"), [goTo, nextIndex]);
  const goPrev = useCallback(() => goTo(prevIndex, "right"), [goTo, prevIndex]);

  // Play video and track progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    const handleEnded = () => goNext();

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeIndex, goNext]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const nextDiary = diaries[nextIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Top-left controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => setMuted(!muted)}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
        >
          {muted ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Layout: main video + next preview peeking on right */}
      <div className="h-full flex items-stretch">
        {/* Main active video */}
        <div
          className={`relative flex-1 w-full sm:max-w-md sm:mx-0 sm:ml-auto sm:mr-4 transition-transform duration-300 ease-out ${
            transitioning === "left" ? "-translate-x-full opacity-0" : transitioning === "right" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
          }`}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            key={current.id}
            src={current.video}
            poster={current.poster}
            muted={muted}
            playsInline
            className="absolute inset-0 h-full w-full object-cover sm:rounded-[16px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none sm:rounded-[16px]" />

          {/* Play/pause */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
            <div className="flex gap-1">
              {diaries.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                    style={{
                      width: i < activeIndex ? "100%" : i === activeIndex ? `${progress}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tag + handle */}
          <div className="absolute top-9 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            <span
              className="text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full font-heading"
              style={{ background: tagColors[current.tag] }}
            >
              {current.tag}
            </span>
            <span className="text-white/70 text-xs font-medium">{current.handle}</span>
          </div>

          {/* Chevron arrow to advance */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Left tap zone for previous */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
          />

          {/* Bottom — caption + author */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none z-10">
            <p className="text-white text-sm leading-relaxed mb-3">{current.caption}</p>
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: tagColors[current.tag] }}
              >
                {current.avatar}
              </div>
              <div>
                <p className="text-white text-xs font-semibold">{current.author}</p>
                <p className="text-gray-400 text-[10px]">{current.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next video preview peeking on right */}
        <button
          onClick={() => goNext()}
          className="hidden sm:block relative w-32 lg:w-48 flex-shrink-0 cursor-pointer group"
        >
          <video
            src={nextDiary.video}
            poster={nextDiary.poster}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover rounded-l-[16px]"
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors rounded-l-[16px]" />
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <span
              className="text-[8px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full font-heading"
              style={{ background: tagColors[nextDiary.tag] }}
            >
              {nextDiary.tag}
            </span>
            <p className="text-white/70 text-xs font-semibold mt-2 truncate">{nextDiary.author}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN CAROUSEL EXPORT
   ============================================================ */
export default function VideoDiariesCarousel({
  diaries,
}: {
  diaries: VideoDiary[];
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
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
          {diaries.map((diary, i) => (
            <SwiperSlide key={diary.id}>
              <VideoCard diary={diary} onClick={() => openViewer(i)} />
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

      {/* Full-screen viewer */}
      {viewerOpen && (
        <FullScreenViewer
          diaries={diaries}
          startIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
