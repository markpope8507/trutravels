import Link from "next/link";
import { trips, stories, drops, videoDiaries, experienceTypes } from "@/lib/data";
import ExperienceCarousel from "@/components/experience-carousel";
import { DesignA as ExperienceTypesCarousel } from "@/components/experience-types-v2";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import DropsCarousel from "@/components/drops-carousel";
import InspireMeWrapper from "@/components/inspire-me-wrapper";
import DiscoveryPathways from "@/components/discovery-pathways";
import SearchPrompt from "@/components/search-prompt";

export default function HomePage() {
  const featuredStories = stories.filter((s) => !s.memberOnly).slice(0, 3);

  return (
    <>
      {/* ================================================================
          1. HERO — Clean cinematic headline over looping video
          ================================================================ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        >
          <source src="https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-tru-navy/60 via-tru-navy/50 to-tru-navy" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="animate-fade-up mb-6 flex justify-center">
            <img src="/logo-white.png" alt="TruTravels" className="h-16 sm:h-20" />
          </div>
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight uppercase font-heading">
            Leave Ordinary<br />Behind
          </h1>
          <p className="animate-fade-up delay-200 text-3xl sm:text-4xl mb-10 max-w-2xl mx-auto font-handwriting text-tru-pink">
            Find your Extraordinary&hellip;
          </p>
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/destinations"
              className="rounded-[10px] border border-white bg-transparent px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300 uppercase tracking-wider w-56 text-center"
            >
              Explore Experiences
            </Link>
            <InspireMeWrapper />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-heading">Scroll</p>
            <div className="w-px h-8 bg-gradient-to-b from-tru-pink to-transparent" />
          </div>
        </div>
      </section>

      {/* ================================================================
          TICKER — Brand manifesto strip in hot pink
          ================================================================ */}
      <section className="bg-tru-pink py-3 overflow-hidden">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 text-white text-xs font-bold uppercase tracking-[0.2em] mx-4 font-heading">
              <span>Leave Ordinary Behind</span>
              <span className="text-white/40">/</span>
              <span>Find Your Extraordinary</span>
              <span className="text-white/40">/</span>
              <span>Chase Sunsets Not Schedules</span>
              <span className="text-white/40">/</span>
              <span>Strangers Who Become Family</span>
              <span className="text-white/40">/</span>
              <span>Step Into The Unknown</span>
              <span className="text-white/40">/</span>
              <span>Connect Deeply</span>
              <span className="text-white/40">/</span>
              <span>Make Every Journey Count</span>
              <span className="text-white/40">/</span>
              <span>We Don&apos;t Do Average</span>
              <span className="text-white/40">/</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================================================================
          2. FEATURED EXPERIENCES — Swipeable carousel
          ================================================================ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Experiences</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
                Find Your<br /><span className="text-gradient">Extraordinary</span>
              </h2>
            </div>
            <Link href="/destinations" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-tru-pink transition group uppercase tracking-wider font-semibold">
              View all
              <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ExperienceCarousel trips={trips} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/destinations" className="text-sm text-tru-pink font-semibold uppercase tracking-wider">View all experiences &rarr;</Link>
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
      <section className="py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
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
      </section>

      {/* ================================================================
          3. VIDEO DIARIES — Swipeable vertical video carousel
          Real video content from travellers, creators, and influencers.
          ================================================================ */}
      <section className="py-24 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VideoDiariesCarousel diaries={videoDiaries} />
        </div>
      </section>

      {/* ================================================================
          5. THE DROP — Limited experiences & events carousel
          ================================================================ */}
      <section className="py-24 bg-gradient-to-b from-transparent via-tru-green/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
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
          6. STORIES — Editorial content
          ================================================================ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Stories</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">From The Road</h2>
          </div>
          <Link href="/stories" className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-tru-pink transition group uppercase tracking-wider font-semibold">
            All stories
            <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured story — large */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[10px] aspect-[16/9]">
            <img
              src={featuredStories[0].image}
              alt={featuredStories[0].title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/90 via-tru-navy/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-2 font-heading">
                {featuredStories[0].category} &middot; {featuredStories[0].author}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-tru-pink transition-colors uppercase font-heading">
                {featuredStories[0].title}
              </h3>
              <p className="text-gray-300 text-sm max-w-lg">{featuredStories[0].excerpt}</p>
            </div>
          </div>

          {/* Stacked stories */}
          <div className="flex flex-col gap-6">
            {featuredStories.slice(1).map((story) => (
              <article key={story.id} className="group flex-1">
                <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-3">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider mb-1 font-heading">
                  {story.category}
                </p>
                <h3 className="text-base font-bold text-white group-hover:text-tru-pink transition mb-1 font-heading">
                  {story.title}
                </h3>
                <p className="text-gray-500 text-xs">By {story.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          7. MEMBERSHIP CTA — The big sell.
          Navy background, pink + green brand CTAs.
          ================================================================ */}
      <section className="relative py-32 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Beach at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-tru-navy/85" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-4 font-heading">Membership</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 uppercase font-heading">
                This Is More<br />Than A Trip<br />Company
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                TruTravels is a community. A lifestyle. A way of seeing the world differently. Membership is free — and it unlocks everything.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="rounded-[10px] bg-tru-green px-8 py-3.5 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 text-center uppercase tracking-wider"
                >
                  Join Free Today
                </Link>
                <Link
                  href="/login"
                  className="rounded-[10px] border border-tru-pink px-8 py-3.5 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white transition-all duration-300 text-center uppercase tracking-wider"
                >
                  Already a member? Log in
                </Link>
              </div>
            </div>

            {/* Right — member perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Exclusive Experiences",
                  text: "Member-only trips, early access to new routes, and limited drops before anyone else.",
                },
                {
                  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                  title: "Personalised For You",
                  text: "Recommendations based on your travel style, saved trips, and where you've been.",
                },
                {
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
                  title: "Global Community",
                  text: "Connect with travellers worldwide. Share tips, plan trips together, and make friends before you even leave.",
                },
                {
                  icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
                  title: "Insider Content",
                  text: "Stories, guides, and hidden gems that only members can access. Written by creators, not copywriters.",
                },
              ].map((perk) => (
                <div key={perk.title} className="glass rounded-[10px] p-5 hover:border-tru-pink/20 transition-all duration-300">
                  <div className="h-10 w-10 rounded-full bg-tru-pink/15 flex items-center justify-center mb-3">
                    <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={perk.icon} />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 uppercase font-heading">{perk.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{perk.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof strip */}
          <div className="mt-16 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["SC", "JM", "PK", "TA", "MR"].map((initials, i) => (
                  <div
                    key={initials}
                    className="h-8 w-8 rounded-full border-2 border-tru-navy flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      background: i % 2 === 0 ? "var(--tru-pink)" : "var(--tru-green)",
                      zIndex: 5 - i,
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">50,000+</span> travellers in the community
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-tru-pink" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 average rating
              </span>
              <span>25+ destinations</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
