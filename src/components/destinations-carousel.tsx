"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const DESTINATIONS = [
  { name: "Indonesia", slug: "indonesia", region: "asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Island of the Gods" },
  { name: "Vietnam", slug: "vietnam", region: "asia", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", tagline: "The Hidden Gem of Asia" },
  { name: "Sri Lanka", slug: "sri-lanka", region: "asia", image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80", tagline: "The Teardrop of India" },
  { name: "Philippines", slug: "philippines", region: "asia", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "7,000 Islands of Paradise" },
  { name: "Cambodia", slug: "cambodia", region: "asia", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", tagline: "Temples, History & Heart" },
  { name: "Mexico", slug: "mexico", region: "central-and-south-america", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Colour, Culture & Chaos" },
  { name: "Thailand", slug: "thailand", region: "asia", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", tagline: "The Land of Smiles" },
];

export type DestinationCard = {
  name: string;
  slug: string;
  region: string;
  image: string;
  tagline: string;
};

export default function DestinationsCarousel({
  excludeName,
  eyebrow = "Explore More",
  title = "You Might Also Like",
  items: itemsProp,
  limit = 6,
}: {
  excludeName?: string;
  eyebrow?: string;
  title?: string;
  items?: DestinationCard[];
  limit?: number;
}) {
  const items = (itemsProp ?? DESTINATIONS).filter((c) => c.name !== excludeName).slice(0, limit);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-8">{title}</h2>
      <div className="also-like-carousel relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.3}
          freeMode={{ enabled: true, sticky: false }}
          navigation={{ nextEl: ".also-like-next", prevEl: ".also-like-prev" }}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            640: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2, spaceBetween: 20 },
          }}
          speed={600}
        >
          {items.map((c) => (
            <SwiperSlide key={c.slug}>
              <Link href={`/destinations/${c.region}/${c.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-[10px] aspect-[3/4]">
                  <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-black text-white uppercase font-heading mb-1">{c.name}</h3>
                    <p className="text-lg font-handwriting" style={{ color: "#FF3F99" }}>{c.tagline}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="also-like-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="also-like-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}
