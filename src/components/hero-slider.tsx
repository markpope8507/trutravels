"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import InspireMeWrapper from "@/components/inspire-me-wrapper";

import "swiper/css";
import "swiper/css/pagination";

type Slide = {
  id: string;
  video: string;
  poster: string;
  eyebrow?: string;
  headline: React.ReactNode;
  tagline: string;
  taglineColor: string;
  cta:
    | { kind: "default" }
    | { kind: "single"; label: string; href: string };
  mobileBare?: boolean;
};

const slides: Slide[] = [
  {
    id: "leave-ordinary",
    video:
      "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80",
    headline: (
      <>
        Leave <span className="font-light">Ordinary</span>
        <br />
        Behind
      </>
    ),
    tagline: "Find your Extraordinary…",
    taglineColor: "text-tru-pink",
    cta: { kind: "default" },
  },
  {
    id: "thailand-summer-sale",
    video:
      "https://videos.pexels.com/video-files/1093661/1093661-uhd_2560_1440_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&q=80",
    eyebrow: "Limited Time · Up To 40% Off",
    headline: (
      <>
        Thailand
        <br />
        <span className="text-tru-pink">Summer Sale</span>
      </>
    ),
    tagline: "Beaches, parties, full moons — at our best prices.",
    taglineColor: "text-white",
    cta: {
      kind: "single",
      label: "Let's Go!",
      href: "/destinations/asia/thailand",
    },
    mobileBare: true,
  },
  {
    id: "rio-carnival-2027",
    video:
      "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80",
    eyebrow: "Limited Edition · Sign Up For The Launch Date",
    headline: (
      <>
        Rio Carnival
        <br />
        <span className="text-tru-green">2027</span>
      </>
    ),
    tagline: "Be first in line when it goes live.",
    taglineColor: "text-white",
    cta: { kind: "single", label: "Sign Me Up!", href: "/signup" },
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        pagination={{ clickable: true }}
        grabCursor
        allowTouchMove
        speed={900}
        className="h-full w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id} className="!h-full">
            <SlideContent slide={s} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-heading">
            Scroll
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-tru-pink to-transparent" />
        </div>
      </div>
    </section>
  );
}

function SlideContent({ slide: s }: { slide: Slide }) {
  return (
    <div className="relative h-full w-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={s.poster}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={s.video} type="video/mp4" />
      </video>
      <div
        className={`absolute inset-0 bg-gradient-to-b from-tru-navy/60 via-tru-navy/50 to-tru-navy ${
          s.mobileBare ? "hidden sm:block" : ""
        }`}
      />

      <div
        className={`relative z-10 h-full items-center justify-center px-4 ${
          s.mobileBare ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="text-center max-w-4xl">
          <div className="mb-6 flex justify-center">
            <img
              src="/logo-white.png"
              alt="TruTravels"
              className="h-16 sm:h-20"
            />
          </div>
          {s.eyebrow && (
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-tru-pink font-heading mb-4">
              {s.eyebrow}
            </p>
          )}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight uppercase font-heading">
            {s.headline}
          </h1>
          <p
            className={`text-3xl sm:text-4xl mb-10 max-w-2xl mx-auto font-handwriting ${s.taglineColor}`}
          >
            {s.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {s.cta.kind === "default" ? (
              <>
                <Link
                  href="/explore"
                  className="rounded-[10px] border border-white bg-transparent px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300 uppercase tracking-wider w-56 text-center"
                >
                  Explore Experiences
                </Link>
                <InspireMeWrapper />
              </>
            ) : (
              <Link
                href={s.cta.href}
                className="rounded-[10px] bg-tru-pink px-10 py-4 text-base font-bold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider text-center shadow-lg shadow-tru-pink/30"
              >
                {s.cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
