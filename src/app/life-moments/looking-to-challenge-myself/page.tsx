import Breadcrumbs from "@/components/breadcrumbs";
import { lifeMomentCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import {
  trips,
  stories,
  videoDiaries,
} from "@/lib/data";
import TripCarouselSection from "@/components/trip-carousel-section";
import { otherLifeMoments } from "@/lib/life-moments";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";

export const metadata = {
  title: "Looking To Challenge Myself — TruTravels",
  description:
    "Treks, summits, jungle climbs and the recovery on the other side. Trips for travellers who want to be tested.",
};

const TRIP_IDS = [
  "bali-experience",
  "northern-thailand-adventure",
  "sumatra-uncovered",
  "costa-rica-adventure",
  "bali-sumatra-adventure",
  "komodo-island-hopper",
  "bali-and-beyond",
];

const VIDEO_IDS = ["v2", "v3", "v5", "v7", "v9"];
const STORY_IDS = ["wellness-reset-bali", "why-i-quit-my-job-to-travel", "member-secret-itinerary-vietnam"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ChallengePage() {
  const pageTrips = TRIP_IDS
    .map((id) => trips.find((t) => t.id === id))
    .filter(Boolean) as typeof trips;

  const pageVideos = videoDiaries.filter((v) => VIDEO_IDS.includes(v.id));
  const pageStories = stories.filter((s) => STORY_IDS.includes(s.id));

  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80"
          alt="Hiker on a misty mountain ridge at sunrise"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Life Moments
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Looking To<br />Challenge<br />Myself
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Comfort zones don&apos;t move. You do.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={lifeMomentCrumbs("Looking To Challenge Myself")} />

      {/* ========================================================
          TRIPS — Rise Up itineraries
          ======================================================== */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <img
          src="/bg-assets/komodo-dragon.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[280px] sm:w-[440px] lg:w-[640px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/peru-bird.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-10 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.06] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Rise Up · Test Yourself
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Trips That <span className="text-tru-pink">Push Back</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Pre-dawn volcano summits, orangutan trekking, jungle ziplines, river rafts. The against-the-grain itineraries built around the moments that make you better.
            </p>
          </div>
          <TripCarouselSection
            id="challenge-trips"
            label="Rise Up"
            title="Built To Test You"
            labelColor="#FF3F99"
            trips={pageTrips}
          />
        </div>
      </section>

      {/* ========================================================
          DIARIES — challenge moments on video
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.07] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            Diaries · The 3am Start
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
            What It Looks Like <span className="text-tru-pink">From The Top</span>
          </h2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Real clips from summit treks, jungle hikes, and the bit after — when everyone in the group is suddenly best mates.
          </p>
        </div>
        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden relative">
          <VideoDiariesCarousel diaries={pageVideos} />
        </div>
      </section>

      {/* ========================================================
          READ — Challenge + recovery / wellness
          ======================================================== */}
      {pageStories.length > 0 && (
        <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
          <img
            src="/bg-assets/eyes.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-10 w-[220px] sm:w-[340px] lg:w-[480px] opacity-[0.06] brightness-0 invert"
          />
          <img
            src="/bg-assets/bali-flower.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-12 sm:-left-20 lg:-left-24 -bottom-12 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.06] brightness-0 invert"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Read · Effort & Recovery
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                Push, Then <span className="text-tru-pink">Restore</span>
              </h2>
              <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
                Yoga in Ubud, jungle resets, and the honest reads on what travel actually does to your head.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageStories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories#${story.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider font-heading px-2.5 py-1 rounded-full">
                      {story.readTime} min
                    </span>
                  </div>
                  <p className="text-tru-pink text-xs font-bold uppercase tracking-wider mb-1 font-heading">
                    {story.category}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-tru-pink transition mb-2 leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{story.excerpt}</p>
                  <p className="text-xs text-gray-500">
                    {story.author} &middot; {formatDate(story.date)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          YOU MIGHT LIKE — other life moments
          ======================================================== */}
      <section className="relative pt-12 pb-16 overflow-hidden border-t border-white/5">
        <img
          src="/bg-assets/lantern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert"
        />
        <img
          src="/bg-assets/ramen.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              You Might Like
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Other <span className="text-tru-pink">Life Moments</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Different chapter, same energy. Pick the one that fits where you are.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherLifeMoments("looking-to-challenge-myself").map((moment) => (
              <Link
                key={moment.name}
                href={moment.href}
                className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
              >
                <img
                  src={moment.image}
                  alt={moment.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xl mb-2 block">{moment.emoji}</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                    {moment.name}
                  </h3>
                  <p className="text-[12px] text-gray-200 leading-snug">{moment.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="pt-12 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
            Earn The View
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-6">
            Pick The One That <span className="text-tru-pink">Scares You</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
            You don&apos;t come home from these trips the same person. The legs ache. The mind clears. The story&apos;s yours forever.
          </p>
          <Link
            href="/explore"
            className="inline-flex rounded-[10px] bg-tru-pink px-8 py-3.5 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider"
          >
            Browse All Trips
          </Link>
        </div>
      </section>
    </>
  );
}
