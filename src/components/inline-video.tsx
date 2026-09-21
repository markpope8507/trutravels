"use client";

import { useRef, useState } from "react";

/**
 * Click-to-play video that sits inline in a column of prose.
 *
 * Not TripVideoPlayer: that one opens a fullscreen modal, which is right for a
 * trip page where the video is the thing you came for, and wrong here where it
 * is one beat inside a page you are reading top to bottom.
 *
 * `preload="metadata"` so the file isn't pulled down for everyone who scrolls
 * past — the poster is all they get until they ask for the video. Controls
 * appear only once play is pressed, so the poster stays clean until then.
 *
 * 16/9 rather than the 4/3 the article image boxes use: at 4/3 in a reading
 * column the video fills most of the viewport before anyone has asked for it.
 *
 * Mirrored by the .art-video insert in converted/ (components/blog-video.html).
 */
export default function InlineVideo({
  src,
  poster,
  caption,
  className = "",
}: {
  src: string;
  poster: string;
  caption?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative aspect-video overflow-hidden rounded-[10px]">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          preload="metadata"
          playsInline
          poster={poster}
          controls={playing}
        >
          <source src={src} type="video/mp4" />
        </video>
        {!playing && (
          <>
            <span className="absolute left-3 top-3 z-20 rounded-full bg-black/60 px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Video
            </span>
            <button
              type="button"
              aria-label="Play video"
              onClick={() => {
                setPlaying(true);
                ref.current?.play();
              }}
              className="group absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition hover:bg-black/15"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tru-pink/90 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition group-hover:scale-105">
                <svg className="ml-1 h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-gray-500">{caption}</figcaption>}
    </figure>
  );
}
