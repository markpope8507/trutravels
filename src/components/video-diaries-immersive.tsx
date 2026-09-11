"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { VideoDiary } from "@/lib/data";

const tagColors: Record<string, string> = {
  Traveller: "#FF3F99",   // Tru pink
  Creator: "#FF3F99",     // Tru pink
  Influencer: "#2172D5",  // Tru blue
};

export default function VideoDiariesImmersive({ diaries }: { diaries: VideoDiary[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<number>(0);

  const current = diaries[activeIndex];
  const nextIndex = (activeIndex + 1) % diaries.length;
  const prevIndex = (activeIndex - 1 + diaries.length) % diaries.length;
  const next = diaries[nextIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const goNext = useCallback(() => goTo(nextIndex), [goTo, nextIndex]);
  const goPrev = useCallback(() => goTo(prevIndex), [goTo, prevIndex]);

  // Auto-advance when video ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (video.duration) {
        const p = (video.currentTime / video.duration) * 100;
        setProgress(p);
        progressRef.current = p;
      }
    };

    const handleEnded = () => goNext();

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeIndex, goNext]);

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

  return (
    <div className="relative w-full">
      {/* Main player area */}
      <div className="relative flex items-center justify-center gap-4">
        {/* Previous preview (desktop only) */}
        <button
          onClick={goPrev}
          className="hidden lg:block relative flex-shrink-0 w-48 aspect-[9/16] rounded-[10px] overflow-hidden opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer"
        >
          <video
            src={diaries[prevIndex].video}
            poster={diaries[prevIndex].poster}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white/70 text-xs font-semibold truncate">{diaries[prevIndex].author}</p>
          </div>
        </button>

        {/* Active video */}
        <div className="relative w-full max-w-sm aspect-[9/16] rounded-[10px] overflow-hidden cursor-pointer shadow-2xl shadow-black/50" onClick={togglePlay}>
          <video
            ref={videoRef}
            key={current.id}
            src={current.video}
            poster={current.poster}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Play/pause indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Top — tag + handle */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span
              className="text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full font-heading"
              style={{ background: tagColors[current.tag] }}
            >
              {current.tag}
            </span>
            <span className="text-white/70 text-xs font-medium">{current.handle}</span>
          </div>

          {/* Progress bar */}
          <div className="absolute top-14 left-4 right-4 pointer-events-none">
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

          {/* Bottom — caption + author */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
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

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition z-10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition z-10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Next preview (desktop only) */}
        <button
          onClick={goNext}
          className="hidden lg:block relative flex-shrink-0 w-48 aspect-[9/16] rounded-[10px] overflow-hidden opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer"
        >
          <video
            src={next.video}
            poster={next.poster}
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white/70 text-xs font-semibold truncate">{next.author}</p>
          </div>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {diaries.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-tru-pink" : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
