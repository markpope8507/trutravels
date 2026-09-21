import Breadcrumbs from "@/components/breadcrumbs";
import { aboutCrumbs } from "@/lib/breadcrumbs";
export const metadata = {
  title: "Our Brand — TruTravels",
  description: "Leave ordinary behind — the TruTravels manifesto.",
};

const brandPillars = [
  {
    titleA: "Adventure",
    titleB: "Without Limits",
    tagline: "Say yes more.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
    body: [
      "Adventure isn't a destination — it's a mindset. It's in every spontaneous decision, every “why not?” moment that reminds you life's meant to be lived.",
      "Whether you're crossing borders or just stepping outside your comfort zone, adventure begins when you stop playing it safe and start saying yes.",
    ],
  },
  {
    titleA: "Good Vibes",
    titleB: "With Global Impact",
    tagline: "Fun with purpose.",
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1200&q=80",
    body: [
      "We believe the best kind of fun is the kind that does good.",
      "When you travel with us, every good time, laugh, and dance has a positive ripple effect. It's about respecting cultures, supporting local businesses, and leaving every place better than we found it.",
      "Through our People & Planet Promise, we prove that travel can create joy and impact in equal measure. Good vibes aren't just for us — they're for the world we explore.",
    ],
  },
  {
    titleA: "Stories",
    titleB: "Worth Telling",
    tagline: "Every journey writes a story worth telling.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
    body: [
      "The Tru lifestyle is about stories that stay with you — the ones that make you laugh, change how you see the world, and connect you to people who feel like family.",
      "It's also about the local people who welcome us in and teach us something new about life, culture, and the planet we share. These moments shape who we are and remind us that the best stories aren't just told — they're lived.",
    ],
  },
  {
    titleA: "Community",
    titleB: "Through Connection",
    tagline: "Together is our favourite place.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
    body: [
      "Community isn't something we join — it's something we build through connection. Every conversation, every moment of belonging, adds to something bigger than ourselves.",
      "Our Tru Community lives across countries and time zones, united by our beliefs, our behaviours, and how we show up for one another. It's a community that feels like home, wherever we are.",
    ],
  },
];

export default function OurBrandPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80"
          alt="Friends splashing in the sea at sunset — leaving ordinary behind"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Our Brand
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Leave <span className="font-light">Ordinary</span><br />Behind
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-tru-pink text-3xl sm:text-4xl font-handwriting leading-tight">
              Find Your Extraordinary…
            </p>
          </div>
        </div>
      </section>
      <Breadcrumbs crumbs={aboutCrumbs("Our Brand")} />

      {/* ========================================================
          MANIFESTO
          ======================================================== */}
      <section className="pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            We weren&apos;t made for the <span className="font-light">ordinary</span>.
          </p>

          <p>
            We were made for the moments that take our breath away, for chasing sunsets, not schedules.<br />
            For finding strangers who become family,<br />
            and stories that stay with us long after we&apos;re home.
          </p>

          <p className="text-white font-bold pt-2">The world doesn&apos;t need more travellers.</p>

          <p>
            It needs people who care, who show up,<br />
            connect deeply, and make every journey count.
          </p>

          <p>Because the best memories aren&apos;t made in comfort zones.</p>

          <p className="text-white text-xl sm:text-2xl font-bold font-heading leading-tight">
            They&apos;re made when you step into the unknown.
          </p>

          <p className="border-l-2 border-tru-pink pl-6 my-8 text-4xl sm:text-5xl font-black uppercase font-heading leading-[0.95]">
            <span className="block text-white">Leave <span className="font-light">Ordinary</span></span>
            <span className="block text-tru-pink">Behind.</span>
          </p>

          <p className="text-3xl sm:text-4xl text-tru-pink font-handwriting leading-tight pt-2">
            and find your Extraordinary…
          </p>
        </div>
      </section>

      {/* ========================================================
          BRAND PILLARS
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Brand Pillars
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              What We <span className="text-tru-pink">Stand</span> On
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Brand pillars are the core principles that define what we stand for. They&apos;re the building blocks that support our identity, our purpose, and our promise — the things that stay consistent no matter how the brand evolves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {brandPillars.map((p, i) => (
              <div
                key={p.titleA}
                className="group rounded-[12px] overflow-hidden border border-white/10 bg-white/[0.04] hover:border-tru-pink/30 transition flex flex-col"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.titleA} ${p.titleB}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-tru-pink font-heading mb-3">
                    Pillar &middot; {`0${i + 1}`}
                  </p>
                  <h3 className="font-heading leading-[0.9] mb-4">
                    <span className="block text-2xl sm:text-3xl font-black uppercase text-white">
                      {p.titleA}
                    </span>
                    <span className="block text-2xl sm:text-3xl font-black uppercase text-tru-pink">
                      {p.titleB}
                    </span>
                  </h3>
                  <p className="text-white text-base sm:text-lg font-bold font-heading mb-4">
                    {p.tagline}
                  </p>
                  <div className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                    {p.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
