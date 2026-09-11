import { stories, MEMBER_CONTENT_ENABLED } from "@/lib/data";
import FeaturedStoryCard from "@/components/featured-story-card";
import PillButton from "@/components/pill-button";

// "Stories From The Road" feature block — shared by the homepage and FAQs page.
export default function StoriesFeature() {
  const featuredStory = [...stories]
    .filter((s) => !MEMBER_CONTENT_ENABLED || !s.memberOnly)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <section className="relative overflow-hidden py-24">
      <img
        src="/bg-assets/eyes.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-10 w-[220px] sm:w-[340px] md:w-[460px] lg:w-[600px] opacity-[0.08] brightness-0 invert"
      />
      <img
        src="/bg-assets/bali-flower.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-32 -bottom-12 w-[240px] sm:w-[380px] md:w-[500px] lg:w-[640px] opacity-[0.08] brightness-0 invert"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
          <div className="max-w-lg">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Stories</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading leading-[0.95] mb-4">
              Stories From <span className="text-tru-pink">The Road</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              First-timer tips, destination deep-dives and honest stories from travellers and the Tru crew — long-reads to lose an afternoon in and video diaries to watch. The good, the unexpected and the unforgettable, straight from the road.
            </p>
          </div>
          <div className="hidden sm:block flex-shrink-0">
            <PillButton href="/stories" className="whitespace-nowrap">Explore All Stories</PillButton>
          </div>
        </div>

        {/* Featured story — shared wide featured card */}
        <FeaturedStoryCard story={featuredStory} isLoggedIn={false} />

        <div className="mt-8 flex justify-center sm:hidden">
          <PillButton href="/stories">Explore All Stories</PillButton>
        </div>
      </div>
    </section>
  );
}
