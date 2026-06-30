import Link from "next/link";
import { trips, stories, drops, videoDiaries, experienceTypes, storyArticles } from "@/lib/data";
import HeroSlider from "@/components/hero-slider";
import ExperienceCarousel from "@/components/experience-carousel";
import { DesignA as ExperienceTypesCarousel } from "@/components/experience-types-v2";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import DropsCarousel from "@/components/drops-carousel";
import DiscoveryPathways from "@/components/discovery-pathways";
import SearchPrompt from "@/components/search-prompt";
import PillButton from "@/components/pill-button";
import ReviewsSection from "@/components/reviews-section";

export default function HomePage() {
  const featuredStory = [...stories]
    .filter((s) => !s.memberOnly)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const featuredStoryHref = storyArticles[featuredStory.id]
    ? `/stories/${featuredStory.id}`
    : `/stories#${featuredStory.id}`;

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
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading text-center">The Tru Difference</p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading mb-10 text-center">
            Why Choose <span className="text-gradient">Our Trips?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Small Group Adventures */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Small Group Adventures</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Our groups stay between 10&ndash;20 in size, so every experience feels personal.</p>
            </div>

            {/* Local Guides & Experiences */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Local Legends</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Who better to show you around than someone who calls it home?</p>
            </div>

            {/* Logistics Locked In */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Logistics Locked In</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">Zero stress, maximum adventure. Every detail is sorted before you even pack your bag.</p>
            </div>

            {/* Community & Connection */}
            <div>
              <div className="flex flex-col items-center gap-2 mb-3 text-center">
                <svg className="h-9 w-9 text-tru-pink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <h3 className="text-white font-black uppercase font-heading text-lg sm:text-xl leading-tight">Community &amp; Connection</h3>
              </div>
              <p className="text-gray-400 text-base leading-relaxed text-center max-w-xs mx-auto">A shared adventure creates bonds that stick long after the trip ends.</p>
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-4">
            {/* Heading — first on mobile, top-right on desktop */}
            <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Stories</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading leading-[0.95]">
                Stories From <span className="text-tru-green">The Road</span>
              </h2>
            </div>

            {/* Featured story */}
            <Link
              href={featuredStoryHref}
              className="group relative block overflow-hidden rounded-[10px] aspect-[4/3] lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-center"
              style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
            >
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <span className="absolute top-4 left-4 bg-tru-pink text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full font-heading">
                Featured Story
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                  {featuredStory.category} &middot; {featuredStory.readTime} min read
                </p>
                <h3 className="text-2xl font-black text-white uppercase font-heading leading-tight group-hover:text-tru-pink transition">
                  {featuredStory.title}
                </h3>
              </div>
            </Link>

            {/* Copy + link — below the feature on mobile, bottom-right on desktop */}
            <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                First-timer tips, destination deep-dives and honest stories from travellers and the Tru crew — long-reads to lose an afternoon in and video diaries to watch. The good, the unexpected and the unforgettable, straight from the road.
              </p>
              <PillButton href="/stories">Explore All Stories</PillButton>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
