import Link from "next/link";
import { trips, stories, drops, videoDiaries, experienceTypes } from "@/lib/data";
import HeroSlider from "@/components/hero-slider";
import ExperienceCarousel from "@/components/experience-carousel";
import { DesignA as ExperienceTypesCarousel } from "@/components/experience-types-v2";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import DropsCarousel from "@/components/drops-carousel";
import DiscoveryPathways from "@/components/discovery-pathways";
import SearchPrompt from "@/components/search-prompt";
import PillButton from "@/components/pill-button";
import ReviewsSection from "@/components/reviews-section";
import FeaturedStoryCard from "@/components/featured-story-card";
import DestinationsCarousel from "@/components/destinations-carousel";

export default function HomePage() {
  const featuredStory = [...stories]
    .filter((s) => !s.memberOnly)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <>
      {/* ================================================================
          1. HERO SLIDER — Three rotating video slides with shared CTAs
          ================================================================ */}
      <HeroSlider />

      {/* ================================================================
          TICKER — Brand manifesto strip in hot pink
          ================================================================ */}
      <section className="bg-tru-navy py-3 overflow-hidden border-y border-white/10">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mx-4 font-heading">
              <span>Leave Ordinary Behind</span>
              <span className="text-tru-pink/40">/</span>
              <span>Find Your Extraordinary</span>
              <span className="text-tru-pink/40">/</span>
              <span>Chase Sunsets Not Schedules</span>
              <span className="text-tru-pink/40">/</span>
              <span>Strangers Who Become Family</span>
              <span className="text-tru-pink/40">/</span>
              <span>Step Into The Unknown</span>
              <span className="text-tru-pink/40">/</span>
              <span>Connect Deeply</span>
              <span className="text-tru-pink/40">/</span>
              <span>Make Every Journey Count</span>
              <span className="text-tru-pink/40">/</span>
              <span>We Don&apos;t Do Average</span>
              <span className="text-tru-pink/40">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================================================================
          2. FEATURED EXPERIENCES — Swipeable carousel
          ================================================================ */}
      <section className="relative overflow-hidden py-24">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-10 w-[260px] sm:w-[420px] md:w-[560px] lg:w-[720px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Experiences</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Find Your<br /><span className="text-gradient">Extraordinary</span>
              </h2>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <PillButton href="/explore" className="whitespace-nowrap">View All Experiences</PillButton>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceCarousel trips={(() => {
            const featured = [
              "thailand-island-hopper",
              "bali-experience",
              "philippines-island-hopper",
              "vietnam-explorer",
              "cambodia-explorer",
              "sri-lanka-uncovered",
              "mexico-yucatan-experience",
              "costa-rica-adventure",
              "greece-island-hopper",
              "discover-asia",
            ];
            return featured.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as typeof trips;
          })()} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <PillButton href="/explore">View All Experiences</PillButton>
        </div>

      </section>

      {/* ================================================================
          DISCOVERY PATHWAYS — Last-minute, travel styles, life moments
          Bridge inspiration into action.
          ================================================================ */}
      <DiscoveryPathways />

      {/* ================================================================
          THE TRU EXPERIENCE — 5 experience type USPs as swipeable carousel
          "Leave Ordinary Behind has to live in our product."
          ================================================================ */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/komodo-dragon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-20 sm:-left-32 lg:-left-40 top-10 w-[300px] sm:w-[480px] md:w-[640px] lg:w-[820px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">How It Works</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                The Tru <span className="text-gradient">Experience</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Every TruTravels trip is built around five intentional experience types. This isn&apos;t just travel — it&apos;s a framework for moments that actually matter.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceTypesCarousel types={experienceTypes} />
        </div>

        {/* Why Choose Our Tours — the Tru difference */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading text-center">Are We Right For You?</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading mb-10 text-center">
            Here&apos;s What We&apos;re <span className="text-gradient">About</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Find Your People */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Find Your People</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Small groups of 10&ndash;20 like-minded travellers — the kind of crew that turns into friends for life.</p>
            </div>

            {/* Logistics Locked In */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Logistics Locked In</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Accommodation, activities and transport all included — every detail sorted before you even pack your bag.</p>
            </div>

            {/* Local Legends */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Local Legends</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Your guide — we call them Local Legends. Knows places inside out and feels more like a mate who happens to know the way.</p>
            </div>

            {/* Fully Protected */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Fully Protected</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">ABTA &amp; ATOL protected, low deposits and flexible payments — book with total confidence.</p>
            </div>
          </div>
        </div>

        {/* What's Included CTA */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <PillButton href="/whats-included">See What&apos;s Included</PillButton>
        </div>

      </section>

      {/* ================================================================
          3. VIDEO DIARIES — Swipeable vertical video carousel
          Real video content from travellers, creators, and influencers.
          ================================================================ */}
      <section className="relative overflow-hidden pt-24 pb-8 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[680px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Video Diaries</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Moments From Our<br className="hidden sm:block" /> <span className="text-tru-pink">Community</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Real stories from real people. Tap to play — raw, unfiltered moments from travellers, creators, and influencer partners on the road.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel
            diaries={videoDiaries.filter((v) =>
              ["v1", "v4", "v7", "v8", "v9", "v10"].includes(v.id),
            )}
          />
        </div>
      </section>

      {/* ================================================================
          4. REVIEWS — multi-platform social proof (Google, Trustpilot, TourRadar)
          ================================================================ */}
      <ReviewsSection />

      {/* ================================================================
          5. THE DROP — Limited experiences & events carousel
          ================================================================ */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-transparent via-tru-green/[0.03] to-transparent">
        <img
          src="/bg-assets/lantern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-8 w-[240px] sm:w-[380px] md:w-[500px] lg:w-[640px] opacity-[0.08] brightness-0 invert"
        />
        <img
          src="/bg-assets/community.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-6 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[520px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-green text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Coming Soon</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                The Drop
              </h2>
              <p className="text-gray-400 mt-4 max-w-lg">
                Limited spots. Exclusive launches. Members get first access.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DropsCarousel drops={drops} />
        </div>
      </section>

      {/* ================================================================
          6. STORIES — Watch · Read · Listen
          ================================================================ */}
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

      {/* ================================================================
          9. DESTINATIONS — "You Might Also Like" carousel
          ================================================================ */}
      <DestinationsCarousel />

    </>
  );
}
