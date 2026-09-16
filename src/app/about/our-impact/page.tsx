import Link from "next/link";
import { CTES, CTE_DEFINITION } from "@/lib/ctes";
export const metadata = {
  title: "Our Impact — TruTravels",
  description: "Our People & Planet Promise — the commitments we've made, the progress so far, and the projects we support.",
};

// The three People & Planet Promise goals, mirroring the brand artwork and the
// wording that goes with each one. The badges are the supplied lock-ups, so the
// goal reads exactly as it does everywhere else it appears.
const threePromises = [
  {
    number: "01",
    badge: "/images/impact/impact-250000-lives.png",
    alt: "01 — Positively impact 250k lives by 2030",
    title: "Positively impact 250k lives by 2030",
    description:
      "We have calculated this number in two ways. First, the total number of people our brand comes into contact with by 2030 will mean we will have positively impacted 80,000 customers and staff who travel or work with us. The second contribution to this number is the number of people who will stand to benefit from our charitable donations and the community projects we create, which will be 170,000 by 2030.",
  },
  {
    number: "02",
    badge: "/images/impact/generate-millions-for-initiatives.png",
    alt: "02 — Generate £1.25million for people & planet initiatives by 2030",
    title: "Generate £1.25million for people & planet initiatives by 2030",
    description:
      "We have committed to gifting 1% of our yearly revenue to be spent on people and planet initiatives. Meaning our impact is not reliant on donations post profit, it is directly built into our business model.",
  },
  {
    number: "03",
    badge: "/images/impact/be-climate-positive.png",
    alt: "03 — Be climate positive now",
    title: "Be climate positive now",
    description:
      "In 2022 we signed the Glasgow Declaration on Climate Action in Tourism and created our own Climate Action plan to help support the global commitment to halve emissions by 2030 and reach net zero before 2050. In doing so, we now measure and declare our carbon footprint as a business every month and decarbonise by offsetting all carbon emissions through a variety of projects and tree planting initiatives.",
  },
];

// Live figures from trutravels.com/people-planet-promise. These are the numbers
// edited in the CMS on the current site, so they sit together here as the one
// place to update rather than being scattered through the markup.
const progress = {
  trees: "332,482",
  donated: "£320,123",
  initiatives: "29",
  countries: "12",
  carbon: "8,903",
  miles: "10,000,000",
};

const charityProjects = [
  {
    name: "Charity Water",
    description:
      "We've funded eight wells in rural Cambodia, bringing clean drinking water to communities that needed it most.",
    image: "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=800&q=80",
  },
  {
    name: "Bali Street Mums",
    description:
      "A five-year-plus partnership supporting women and children living on the streets in Indonesia.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
  },
  {
    name: "Indigenous Literacy Foundation",
    description:
      "100 books donated to Australian Aboriginal communities — supporting literacy and storytelling from the ground up.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  },
  {
    name: "Sungai Watch",
    description:
      "We funded our second trash barrier with this incredible team — they've removed 1.6 million kg of non-organic waste from Bali's rivers.",
    image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80",
  },
  {
    name: "Children of Vietnam",
    description:
      "Sponsored 64 scholarships to help break the cycle of poverty for children and young people across the country.",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
  },
];

export default function OurImpactPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80"
          alt="A globe held in hands — our shared responsibility"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Our Impact
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              People &amp;<br />Planet Promise
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Always give more than we take.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          OPENING STATEMENT
          ======================================================== */}
      <section className="pt-24 pb-20 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Always give more than we take.
          </p>

          <p>
            Our goal since we started has been to always give more than we take. In 2022, we decided to double down on our efforts of doing good and really put our money where our mouth is.
          </p>

          <p>
            But instead of just focusing on the climate crisis, we wanted to put equal emphasis on both people and the planet.
          </p>

          <p className="text-white font-bold">
            Here is an overview of the promises we have made and our progress so far.
          </p>
        </div>
      </section>

      {/* ========================================================
          THE THREE PROMISES
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              The Promises
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              People &amp; Planet <span className="text-tru-pink">Promise</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Three measurable promises that shape how we run the business — not nice-to-haves bolted on afterwards.
            </p>
          </div>

          {/* Badge and copy alternate sides, the way the promise artwork is laid
              out. On mobile the badge always leads. */}
          <div className="space-y-16 lg:space-y-24">
            {threePromises.map((p, i) => (
              <div
                key={p.number}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
              >
                <div className={i % 2 === 1 ? "lg:order-1" : "lg:order-2"}>
                  <img
                    src={p.badge}
                    alt={p.alt}
                    className="w-full max-w-[420px] mx-auto lg:mx-0 h-auto"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:order-2" : "lg:order-1"}>
                  {/* The badge carries the goal visually; this keeps it available
                      to screen readers and to anyone with images off. */}
                  <h3 className="sr-only">{p.title}</h3>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PROGRESS SO FAR — BIG STATS
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* The pink thread that links the figures on the printed version.
              Drawn behind the stats and only on wide screens, where the
              zig-zag layout it follows actually applies. */}
          <svg
            className="hidden lg:block absolute inset-0 h-full w-full text-tru-pink pointer-events-none"
            viewBox="0 0 1000 760"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Coordinates are tuned to the gaps between the four blocks —
                the row gutter at y≈185, the empty right column, and the
                gutter at y≈480 — so the thread never crosses any text. */}
            <g stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke">
              {/* trees → donated, out right then back through the row gutter */}
              <path d="M900 152 C 980 168, 978 204, 880 210 C 650 222, 400 174, 200 194 C 120 202, 80 204, 55 220" />
              {/* donated → carbon, down the left and along the lower gutter */}
              <path d="M55 448 C 55 502, 150 522, 252 530 C 292 533, 316 530, 336 522" />
              {/* flourish out to the right of the mileage line */}
              <path d="M900 566 C 976 578, 990 644, 934 692 C 900 722, 862 732, 828 744" />
            </g>
          </svg>

          <div className="relative lg:grid lg:grid-cols-12 lg:gap-y-20 space-y-14 lg:space-y-0">
            {/* Heading */}
            <div className="lg:col-span-5 lg:row-start-1">
              <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
                Progress So Far
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
                Our Progress<br />So Far<span className="text-tru-pink">&hellip;</span>
              </h2>
            </div>

            {/* Trees planted */}
            <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading text-white leading-[0.9] tabular-nums">
                    {progress.trees}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black uppercase font-heading text-white leading-tight mt-1">
                    Trees Planted
                  </p>
                </div>
                {/* seedling */}
                <svg className="h-14 w-14 sm:h-20 sm:w-20 flex-shrink-0 text-tru-pink" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M32 60V28" stroke="currentColor" strokeWidth={6} strokeLinecap="round" />
                  <path d="M32 30C32 18 24 10 10 10c0 14 8 22 22 20Z" fill="currentColor" />
                  <path d="M34 26c0-10 7-17 19-17 0 12-7 19-19 17Z" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Donated */}
            <div className="lg:col-span-6 lg:row-start-2">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading text-white leading-[0.9] tabular-nums">
                {progress.donated}
              </p>
              <p className="text-2xl sm:text-3xl font-black uppercase font-heading text-white leading-tight mt-1">
                Donated to {progress.initiatives} Initiatives
              </p>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-tru-pink/40 bg-tru-pink/10 pl-4 pr-5 py-2">
                <svg className="h-6 w-6 text-tru-pink flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
                </svg>
                <span className="font-heading uppercase tracking-wider text-sm text-white">
                  Across <span className="text-tru-pink font-black text-lg">{progress.countries}</span> Countries
                </span>
              </div>
            </div>

            {/* Carbon offset */}
            <div className="lg:col-span-7 lg:col-start-5 lg:row-start-3">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase font-heading text-white leading-[0.9] tabular-nums">
                    {progress.carbon} Tonnes
                  </p>
                  <p className="text-2xl sm:text-3xl font-black uppercase font-heading text-white leading-tight mt-1">
                    Of Carbon Offset
                  </p>
                </div>
                {/* car */}
                <svg className="h-10 w-10 sm:h-14 sm:w-14 flex-shrink-0 text-tru-pink mt-2" viewBox="0 0 64 40" fill="none" aria-hidden="true">
                  <path d="M6 26h52v-6c0-3-2-5-5-5h-4l-5-8c-1-2-2-3-4-3H21c-2 0-3 1-4 3l-5 8H9c-2 0-3 2-3 4v7Z" fill="currentColor" />
                  <circle cx="18" cy="30" r="6" fill="currentColor" />
                  <circle cx="46" cy="30" r="6" fill="currentColor" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm uppercase tracking-[0.2em] font-heading mt-5">
                Equivalent to driving over
              </p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase font-heading text-tru-pink leading-tight mt-1 tabular-nums">
                {progress.miles} Miles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          COMMUNITY TOURISM ENTERPRISES
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              On The Ground
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Community Tourism <span className="text-tru-pink">Enterprises</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              {CTE_DEFINITION.lead}
            </p>
          </div>

          {/* What makes something a CTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {CTE_DEFINITION.characteristics.map((c) => (
              <div
                key={c.title}
                className="rounded-[10px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="font-heading text-sm font-black uppercase tracking-wide text-tru-pink mb-2">
                  {c.title}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>

          {/* The enterprises themselves — same card as the country pages. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CTES.map((cte) => (
              <Link
                key={cte.slug}
                href={`/about/our-impact/${cte.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-white/10 bg-tru-navy transition-all duration-300 hover:border-tru-pink/30"
                style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img
                    src={cte.image}
                    alt={cte.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
                  <p className="absolute top-4 left-5 font-heading text-sm font-black uppercase leading-none tracking-wide text-white">
                    {cte.country}
                    <span className="mt-1 block font-heading text-[0.58rem] font-bold uppercase tracking-[0.22em] text-tru-pink">
                      Community Tourism
                    </span>
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {/* Fixed line boxes keep the footer bar level across cards. */}
                  <h3 className="mb-2 line-clamp-2 min-h-[2lh] font-heading text-lg font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink">
                    {cte.name}
                  </h3>
                  <p className="mb-4 line-clamp-4 min-h-[4lh] text-sm leading-relaxed text-gray-400">
                    {cte.summary}
                  </p>

                  {/* Same treatment as the "Read story" link on a blog card. */}
                  <div className="mt-auto border-t border-white/10 pt-3 text-right">
                    <span className="text-xs text-tru-pink font-semibold uppercase tracking-wider group-hover:text-tru-pink-light transition whitespace-nowrap">
                      Read their story &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          CHARITY PROJECTS
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Who We Support
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              The <span className="text-tru-pink">Projects</span> We Back
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Where our 1% goes. Long-term partnerships, not one-off PR moments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {charityProjects.map((c) => (
              <div
                key={c.name}
                className="group rounded-[12px] overflow-hidden border border-white/10 bg-white/[0.04] hover:border-tru-pink/30 transition"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading leading-tight mb-3 group-hover:text-tru-pink transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          CLOSING NOTE
          ======================================================== */}
      <section className="pb-24 border-t border-white/5 pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed text-center">
          <p className="border-l-2 border-tru-pink pl-6 my-8 text-4xl sm:text-5xl font-black uppercase font-heading leading-[0.95] text-left">
            <span className="block text-white">Always give</span>
            <span className="block text-tru-pink">more than we take.</span>
          </p>
          <p className="text-left">
            It&apos;s not a slogan — it&apos;s the test every decision has to pass before we make it. Every trip we run, every partner we choose, every quid we spend.
          </p>
        </div>
      </section>
    </>
  );
}
