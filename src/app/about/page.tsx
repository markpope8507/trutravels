import Link from "next/link";
import { brandPillars, creators } from "@/lib/data";
import BrandPillarsCarousel from "@/components/brand-pillars-carousel";
import CreatorsCarousel from "@/components/creators-carousel";

export const metadata = {
  title: "About — TruTravels",
  description: "We're on a mission to help 18-35s leave ordinary behind through unforgettable group travel experiences.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&q=80"
          alt="Travellers on a beach"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-tru-navy/70" />
        <div className="relative z-10 text-center px-4">
          <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-4 font-heading">About TruTravels</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading">
            We Help People Leave<br />Ordinary Behind
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-white mb-6 uppercase font-heading">Our Story</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              TruTravels started with a simple idea: travel should be about real experiences, not tourist traps. We began as a group tour operator for 18-35s, running adventures across Southeast Asia, and quickly built a community of thousands who shared our belief that the best trips are the ones you can&apos;t plan on paper.
            </p>
            <p>
              Now we&apos;re evolving into something bigger. TruTravels is becoming a lifestyle platform — a place where travel-obsessed people can discover their next adventure, access exclusive content and member-only deals, and connect with a global community of like-minded travellers.
            </p>
            <p>
              Whether you&apos;re planning your first big trip or your fifteenth, TruTravels is your home for leaving ordinary behind.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16 bg-white/5 rounded-[10px] p-8 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50,000+", label: "Travellers" },
              { number: "25+", label: "Destinations" },
              { number: "200+", label: "Trips Per Year" },
              { number: "4.9/5", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-tru-pink font-heading">{s.number}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* We Believe — Brand Pillars Carousel (full width) */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">We Believe</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-heading">
              We Weren&apos;t Made<br />For <span className="text-gradient">Ordinary</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-lg">
              Four pillars define everything we do — from the trips we design to the community we build.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BrandPillarsCarousel pillars={brandPillars} />
        </div>
      </section>

      {/* Led By Locals */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div>
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Led By Locals</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 uppercase font-heading">
              The People Who<br className="hidden sm:block" /> Make It Real
            </h2>
            <p className="text-gray-400 max-w-lg">
              Every TruTravels experience is shaped by someone who lives it. Not tour guides reading scripts — creators, explorers, and locals who know the real stuff.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CreatorsCarousel creators={creators} />
        </div>
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <section className="text-center">
          <h2 className="text-2xl font-black text-white mb-4 uppercase font-heading">Ready to Leave Ordinary Behind?</h2>
          <p className="text-gray-400 mb-8">Join the TruTravels community and start exploring.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/destinations"
              className="rounded-[10px] bg-tru-green px-8 py-3 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition uppercase tracking-wider"
            >
              Explore Trips
            </Link>
            <Link
              href="/signup"
              className="rounded-[10px] border border-tru-pink px-8 py-3 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white transition uppercase tracking-wider"
            >
              Join Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
