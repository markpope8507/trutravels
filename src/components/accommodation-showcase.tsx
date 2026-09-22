"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { TravelStyle, travelStyleConfig } from "@/lib/data";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

/**
 * "Where You'll Stay" — the carousel of stays with a video lightbox.
 *
 * Shared by the country pages and the travel style pages. It lived inside
 * country-page.tsx, and the style pages had a second, simpler viewer of their
 * own (AccommodationMediaCarousel) that behaved differently on the same kind
 * of content — same section, same data shape, two answers.
 *
 * The item shape is Country["accommodation"][number], which is also what the
 * travel style content uses.
 */

export type StayItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
  /** Travel style this stay belongs to — shown on the card. */
  travelStyle?: TravelStyle;
};

/**
 * The style logo in the card corner.
 *
 * NO PER-STYLE COLOUR. This used to wash the card in the style's own hue —
 * blue for Classic, green for Backpacker, amber for Multi Country — which
 * made five versions of the same card. Pink is the site's accent everywhere
 * else, so it's pink here too.
 */
function TravelStyleMark({ style }: { style?: TravelStyle }) {
  const config = style ? travelStyleConfig[style] : undefined;
  if (!config) return null;
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(80% 70% at 0% 0%, rgba(255,63,153,0.1) 0%, transparent 55%)" }}
      />
      {/* The logo PNGs are square canvases with the artwork as a band in the middle —
          ~13% transparent padding at the sides but ~32% top and bottom. The negative
          offsets cancel that padding so the visible mark sits in the card corner. */}
      <div className="absolute -top-6 -left-1 sm:-top-8 sm:-left-1.5">
        <img
          src={config.logo}
          alt={`${config.label} travel style`}
          className="h-28 w-28 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:h-32 sm:w-32"
        />
      </div>
    </>
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED_MOTION);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export default function AccommodationShowcase({ items }: { items: StayItem[] }) {
  const [playing, setPlaying] = useState<StayItem | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openStay = (item: StayItem) => (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setPlaying(item);
  };

  // Lock body scroll, trap focus, close on Escape, and pause muted card videos
  // so the enlarged player is the only thing playing.
  useEffect(() => {
    if (!playing) return;
    const cardVideos = [...(carouselRef.current?.querySelectorAll("video") ?? [])];
    cardVideos.forEach((v) => v.pause());
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () => {
      const root = dialogRef.current;
      if (!root) return [] as HTMLElement[];
      return [...root.querySelectorAll<HTMLElement>(
        "button, video, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      )].filter((el) => !el.hasAttribute("disabled"));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlaying(null);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      if (!reduceMotion) cardVideos.forEach((v) => v.play().catch(() => {}));
      triggerRef.current?.focus();
    };
  }, [playing, reduceMotion]);

  return (
    <div className="stays-carousel relative" ref={carouselRef}>
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.1}
        freeMode={{ enabled: true, sticky: false }}
        navigation={{ nextEl: ".stays-next", prevEl: ".stays-prev" }}
        breakpoints={{
          480: { slidesPerView: 1.4 },
          640: { slidesPerView: 2.1, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
        }}
        speed={600}
      >
        {items.map((item) => (
          <SwiperSlide key={item.title} className="!h-auto">
            <div className="group h-full flex flex-col overflow-hidden rounded-[10px] bg-tru-navy border border-white/10 hover:border-tru-pink/30 transition-all duration-300" style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}>
              {/* Media */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay={!reduceMotion}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img src={item.src} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
                <TravelStyleMark style={item.travelStyle} />
                {item.type === "video" && (
                  <button
                    type="button"
                    onClick={openStay(item)}
                    aria-label={reduceMotion ? `Play video: ${item.title}` : `Enlarge video: ${item.title}`}
                    className="absolute inset-0 z-10 flex items-center justify-center transition-colors hover:bg-black/20 focus-visible:bg-black/20 focus-visible:outline-none"
                  >
                    {reduceMotion && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="ml-1 h-6 w-6 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="line-clamp-2 min-h-[2lh] text-lg font-black text-white uppercase font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">{item.title}</h3>
                <p className="line-clamp-3 min-h-[3lh] text-gray-400 text-sm leading-relaxed">{item.caption}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="stays-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button className="stays-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Enlarged video player */}
      {playing &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={playing.title}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 p-4"
            onClick={() => setPlaying(null)}
          >
            <button
              ref={closeRef}
              onClick={() => setPlaying(null)}
              aria-label="Close video"
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <video
                src={playing.src}
                poster={playing.poster}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[75vh] rounded-[10px] bg-black object-contain"
              />
              <h3 className="mt-4 font-heading text-lg font-bold text-white">{playing.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-300">{playing.caption}</p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
