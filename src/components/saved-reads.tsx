"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { stories, type Story } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import StoryCard from "@/components/story-card";
import SectionHeading from "@/components/section-heading";
import {
  subscribeSavedStories,
  getSavedSnapshot,
  getServerSnapshot,
} from "@/lib/saved-stories";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

/**
 * Stories saved to the account. Same StoryCard and same carousel settings as
 * the trip rows and Suggested Reads above it, so the dashboard is one pattern
 * throughout rather than a different card design per section.
 */
export default function SavedReads() {
  const { isLoggedIn } = useAuth();
  const raw = useSyncExternalStore(subscribeSavedStories, getSavedSnapshot, getServerSnapshot);
  const ids: string[] = JSON.parse(raw);
  const saved = ids
    .map((id) => stories.find((s) => s.id === id))
    .filter((s): s is Story => Boolean(s));

  return (
    <section className="relative mb-12">
      <div className="relative">
      <SectionHeading eyebrow="Your Reads" title="Saved Reads" href="/stories" linkLabel="Browse stories" />

      {saved.length > 0 ? (
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.2}
          freeMode
          navigation
          breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
          className="experience-carousel"
        >
          {saved.map((story) => (
            <SwiperSlide key={story.id} className="h-auto">
              <StoryCard story={story} isLoggedIn={isLoggedIn} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
          <p className="text-gray-400 text-sm mb-3">You haven&apos;t saved any reads yet.</p>
          <Link
            href="/stories"
            className="text-tru-pink hover:text-tru-pink-light text-sm font-semibold uppercase tracking-wider transition"
          >
            Explore stories
          </Link>
        </div>
      )}
      </div>
    </section>
  );
}
