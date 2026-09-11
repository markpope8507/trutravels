"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { VideoDiary } from "@/lib/data";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const SLIDE_MS = 380;

/* Keyframes live with the component: declared in globals.css they were silently
   dropped by the Tailwind v4 build, leaving animation-name set but nothing to run. */
const slideKeyframes = `
@keyframes vd-in-right  { from { transform: translateX(100%); }  to { transform: translateX(0); } }
@keyframes vd-in-left   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes vd-out-left  { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes vd-out-right { from { transform: translateX(0); } to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .vd-slide { animation: none !important; }
}`;

const tagColors: Record<string, string> = {
  Traveller: "#FF3F99",        // Tru pink
  Creator: "#FF3F99",          // Tru pink
  Influencer: "#2172D5",       // Tru blue
  Partner: "#F5A623",
  "Local Legend": "#09213E",   // Tru navy
  Community: "#A855F7",
  Planeterra: "#003B31",       // Planeterra's own brand green (planeterra.org)
};
/* ============================================================
   THUMBNAIL CARD — shown in the carousel
   ============================================================ */
function VideoCard({ diary, onClick }: { diary: VideoDiary; onClick: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[10px] h-full cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {/* A frame lifted from this very clip, not a <video>. Chrome only lets a handful
            of media elements load at once, and with nine on the page the six thumbnails
            never got a slot — they issued no request at all and stayed black. */}
        <img
          src={diary.poster}
          alt={`${diary.author} in ${diary.location}`}
          /* not lazy: all six sit in one row and are ~40KB each, and lazy loading got
             starved behind the hero videos saturating the connection */
          decoding="async"
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

        {/* Bottom — caption only. The avatar, name and location were dropped from the
            carousel card; they still appear in the full-screen viewer. */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          <p className="text-white text-sm leading-relaxed">{diary.caption}</p>
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
  /* The outgoing diary is kept on screen as a still while it slides away, so the two
     clips cross over instead of the old fade-to-black-then-pop. It's a poster rather
     than a second <video> on purpose — Chrome only grants so many media elements. */
  const [leaving, setLeaving] = useState<{ diary: VideoDiary; dir: "left" | "right" } | null>(null);
  const [enterFrom, setEnterFrom] = useState<"left" | "right">("right");
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const current = diaries[activeIndex];
  const nextIndex = (activeIndex + 1) % diaries.length;
  const prevIndex = (activeIndex - 1 + diaries.length) % diaries.length;

  /* `direction` is where the CURRENT diary exits. Going forward it leaves to the left
     and the new one slides in from the right — matching the carousel, where the next
     card sits to the right. The swap is immediate; only the slide is animated. */
  const goTo = useCallback((index: number, direction: "left" | "right" = "left") => {
    setLeaving((prev) => prev ?? { diary: diaries[activeIndexRef.current], dir: direction });
    setEnterFrom(direction === "left" ? "right" : "left");
    setActiveIndex(index);
    setProgress(0);
    setIsPlaying(true);
    window.setTimeout(() => setLeaving(null), SLIDE_MS);
  }, [diaries]);

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
    // A swipe ends in a click too — don't pause the video on the way past.
    if (swiped.current) { swiped.current = false; return; }
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

  // Swipe left/right to move between diaries on touch devices
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    swiped.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // horizontal intent only, so a vertical scroll never changes the video
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      if (dx < 0) goNext(); else goPrev();
    }
  };

  const nextDiary = diaries[nextIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style href="vd-slide-keyframes" precedence="default">{slideKeyframes}</style>
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
      <div className="h-full flex items-stretch justify-center">
        {/* Main active video. The wrapper clips the slide so neither panel spills out. */}
        <div className="relative w-full sm:max-w-md sm:mr-4 overflow-hidden sm:rounded-[16px]">
        {leaving && (
          <div
            key={`leaving-${leaving.diary.id}`}
            className="vd-slide absolute inset-0 z-10 pointer-events-none"
            style={{ animation: `vd-out-${leaving.dir} ${SLIDE_MS}ms cubic-bezier(.22,.61,.36,1) forwards` }}
          >
            <img src={leaving.diary.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>
        )}
        <div
          key={activeIndex}
          className="vd-slide relative h-full w-full"
          style={{ animation: `vd-in-${enterFrom} ${SLIDE_MS}ms cubic-bezier(.22,.61,.36,1)` }}
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

          {/* Back a diary — was an invisible tap zone, so there was no way to tell you
              could go back. Now a visible twin of the forward chevron. */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous video"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Forward a diary */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next video"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Familiar "stories" tap zones, kept beneath the visible chevrons (z-10 vs z-20) */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-hidden="true" tabIndex={-1}
            className="absolute left-0 top-14 bottom-24 w-1/4 z-10"
          />
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-hidden="true" tabIndex={-1}
            className="absolute right-0 top-14 bottom-24 w-1/4 z-10"
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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  /* Swiper initialises before these sibling buttons are attached, so anything handed to
     it during render — a ref or a selector string — resolves to null and the arrows do
     nothing. Bind them once everything is mounted, then re-init navigation. */
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;
    const nav = swiper.params.navigation;
    if (!nav || typeof nav === "boolean") return;
    nav.prevEl = prevRef.current;
    nav.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

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
          /* Selector strings, not refs: an object without prevEl/nextEl makes Swiper
             render its own default arrows (in Swiper blue) on top of ours. These are
             re-bound to the real elements by the effect above once mounted. */
          navigation={{ prevEl: ".video-prev", nextEl: ".video-next" }}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
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

        {/* Navigation arrows. These used to sit at -left-5 / -right-5, outside the
            section wrapper that clips its overflow — so both were invisible. They now
            overlay the row's edges, inside the clip. */}
        <button
          ref={prevRef}
          aria-label="Previous videos"
          className="video-prev absolute top-[calc(50%-20px)] left-2 z-20 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          ref={nextRef}
          aria-label="More videos"
          className="video-next absolute top-[calc(50%-20px)] right-2 z-20 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:pointer-events-none"
        >
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
