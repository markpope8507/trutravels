import Breadcrumbs from "@/components/breadcrumbs";
import { aboutCrumbs } from "@/lib/breadcrumbs";
import VideoDiariesCarousel from "@/components/video-diaries-carousel";
import ReviewsSection from "@/components/reviews-section";
import { videoDiaries } from "@/lib/data";
import { otherAboutPages } from "@/lib/about-pages";
import Link from "next/link";

export const metadata = {
  title: "Our Community — TruTravels",
  description:
    "The travellers, creators and Local Legends who make TruTravels what it is — a bunch of fun-loving legends with a passion for travel and doing good.",
};

// Everything except the Local Legends, which get their own carousel below.
const communityDiaries = videoDiaries.filter((v) => v.tag !== "Local Legend");
const localLegends = videoDiaries.filter((v) => v.tag === "Local Legend");

export default function OurCommunityPage() {
  return (
    <>
      {/* HERO — right-aligned overlay, same language as the other About pages */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg"
          alt="A TruTravels group together on the road"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Our Community
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              The People<br />
              <span className="text-tru-pink">Who Make It</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Bound by how we show up &mdash; for each other, and for the places we visit.&rdquo;
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={aboutCrumbs("Our Community")} />

      {/* ========================================================
          OPENING STATEMENT
          ======================================================== */}
      <section className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            A bunch of fun loving legends with{" "}
            <span className="text-tru-pink">a passion for travel.</span>
          </p>

          <p>
            That&rsquo;s the community. Travellers, creators and Local Legends — and a shared
            habit of doing good while we&rsquo;re at it.
          </p>

          <p>
            What holds it together isn&rsquo;t a destination or a price point. It&rsquo;s a set of
            beliefs and a way of showing up — for each other, and for the communities we visit.
          </p>

          <p>
            Leave a place better than you found it. Make sure nobody sits on the edge of the
            group. Follow the people who actually live there, not a script. And say yes to the
            detour, because the best bits are never on the itinerary.
          </p>

          <p className="text-white font-bold">
            Here&rsquo;s who they are, and what they stand for.
          </p>
        </div>
      </section>

      {/* ========================================================
          STORIES FROM OUR COMMUNITY
          ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-8 bg-gradient-to-b from-transparent via-tru-pink/[0.03] to-transparent">
        <img
          src="/bg-assets/good-vibes.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-6 w-[260px] sm:w-[400px] md:w-[520px] lg:w-[680px] opacity-[0.08] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Video Diaries
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
            Stories From Our <span className="text-tru-pink">Community</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg">
            Real stories from real people. Tap to play &mdash; raw, unfiltered moments from
            travellers, creators and partners on the road.
          </p>
        </div>

        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel diaries={communityDiaries} />
        </div>
      </section>

      {/* ========================================================
          MEET YOUR LOCAL LEGENDS — same carousel, the guides
          ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <img
          src="/bg-assets/peru-bird.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
            Led By Locals
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
            Meet Your <span className="text-tru-pink">Local Legends</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg">
            The people who actually run your trip. Born where they guide, and they&rsquo;ll take
            you to the bits that never make the itinerary.
          </p>
        </div>

        <div className="mx-auto max-w-7xl pl-4 sm:pl-6 lg:pl-8 overflow-hidden">
          <VideoDiariesCarousel diaries={localLegends} />
        </div>
      </section>

      {/* ========================================================
          REVIEWS — same block as the homepage
          ======================================================== */}
      <ReviewsSection />

      {/* ========================================================
          MORE ABOUT US
          ======================================================== */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.07] brightness-0 invert" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              More About Us
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              The Rest Of <span className="text-tru-pink">The Story</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAboutPages("/about/our-community").map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group relative overflow-hidden rounded-[10px] aspect-[5/3] block"
              >
                <img
                  src={page.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/15" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-2 group-hover:text-tru-pink transition-colors">
                    {page.name}
                  </h3>
                  <p className="text-[12px] text-gray-200 leading-snug">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
