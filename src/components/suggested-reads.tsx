"use client";

import { useSyncExternalStore } from "react";
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
 * Reads we think you'd like, shown above Saved Reads on the account dashboard.
 * Uses the same StoryCard and the same carousel settings as the trip rows, so
 * every row on the dashboard reads as one pattern.
 *
 * Anything already saved is filtered out — it's sitting right below — so the
 * two sections never show the same story twice. Both subscribe to the same
 * store, so saving a story moves it between them without a reload.
 */
export default function SuggestedReads({ limit = 8 }: { limit?: number }) {
  const { isLoggedIn } = useAuth();
  const raw = useSyncExternalStore(subscribeSavedStories, getSavedSnapshot, getServerSnapshot);
  const savedIds: string[] = JSON.parse(raw);

  const suggested: Story[] = stories
    .filter((s) => !savedIds.includes(s.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  if (!suggested.length) return null;

  return (
    <section className="relative mb-12">
      <div className="relative">
      <SectionHeading eyebrow="Picked For You" title="Suggested Reads" href="/stories" linkLabel="Browse stories" />

      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={1.2}
        freeMode
        navigation
        breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
        className="experience-carousel"
      >
        {suggested.map((story) => (
          <SwiperSlide key={story.id} className="h-auto">
            <StoryCard story={story} isLoggedIn={isLoggedIn} />
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </section>
  );
}
