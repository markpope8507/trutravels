"use client";

import { useEffect, useRef, useState } from "react";

export default function TripVideoPlayer({
  video,
  poster,
  title,
  /** Defaults to "Watch The Trip" — every trip page says that. The Partners
   *  pages reuse this block for a clip that isn't the trip being sold, so they
   *  override it; without this the static and prototype builds disagreed. */
  label = "Watch The Trip",
}: {
  video: string;
  poster: string;
  title: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handler);
    };
  }, [open]);

  return (
    <>
      {/* Thumbnail with play button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden rounded-[10px] border border-white/10 hover:border-tru-pink/40 transition-all duration-300"
        aria-label={`Play trip video: ${title}`}
      >
        <div className="relative aspect-video">
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 group-hover:from-black/50 transition-colors" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-tru-pink flex items-center justify-center shadow-xl shadow-tru-pink/40 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="h-7 w-7 sm:h-9 sm:w-9 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Label */}
          <p className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white font-heading">
            {label}
          </p>
        </div>
      </button>

      {/* Full-screen modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition"
            aria-label="Close video"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-6xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={video}
              poster={poster}
              autoPlay
              controls
              playsInline
              className="w-full h-auto max-h-[85vh] rounded-[10px]"
            />
          </div>
        </div>
      )}
    </>
  );
}
