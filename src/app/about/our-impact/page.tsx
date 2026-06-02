export const metadata = {
  title: "Our Impact — TruTravels",
  description: "Our People & Planet Promise — the commitments we've made, the progress so far, and the projects we support.",
};

const threePromises = [
  {
    number: "01",
    eyebrow: "Impact On Lives",
    title: "250,000 lives by 2030",
    description:
      "80,000 customers and staff plus 170,000 beneficiaries from charitable donations and community projects. Every trip helps move the needle.",
  },
  {
    number: "02",
    eyebrow: "Revenue Commitment",
    title: "1% of our yearly revenue",
    description:
      "Dedicated to people and planet initiatives — built directly into our business model, not added on after profits. It's a line on the spreadsheet, every year.",
  },
  {
    number: "03",
    eyebrow: "Climate Action",
    title: "Halve emissions by 2030",
    description:
      "We signed the Glasgow Declaration on Climate Action in Tourism in 2022. Goal: halve emissions by 2030, net zero before 2050. We measure our carbon footprint monthly and offset through projects and tree planting.",
  },
];

const progressStats = [
  { value: "296,368", label: "Trees Planted" },
  { value: "£113,957", label: "Donated to 29 initiatives across 12 countries" },
  { value: "6,687", label: "Tonnes of Carbon Offset" },
];

const communityEnterprises = [
  {
    name: "Salaam Baalak Trust",
    location: "Delhi, India",
    description:
      "A street-children support organisation that gives our travellers a chance to meet, learn from and contribute to the kids they look after.",
    image: "https://images.unsplash.com/photo-1545506348-3aa01dfb8b1c?w=800&q=80",
  },
  {
    name: "Jarvis's Jungle Trek",
    location: "Chiang Mai, Thailand",
    description:
      "A Karen Hill Tribe village trek led by local guides — community-owned tourism that funnels income directly back to the families running it.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
  },
  {
    name: "Hul's Family Farm",
    location: "Rural Cambodia",
    description:
      "A countryside homestay with Hul and his family. You sleep in his home, eat at his table, and learn what daily life actually looks like in rural Cambodia.",
    image: "https://images.unsplash.com/photo-1599708153386-62bf3c39c5d6?w=800&q=80",
  },
];

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
            Our founding goal has always been simple.
          </p>

          <p>
            Always give more than we take. Every customer, every supplier, every community we touch — we want them to be better off because of us, not worse.
          </p>

          <p>
            In 2022, we made that goal a lot more specific. We committed to weighting people and planet equally, set ourselves three measurable promises, and started publishing our progress.
          </p>

          <p className="text-white font-bold">
            Here&apos;s what we said we&apos;d do, and where we are with it now.
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
              The Three Promises
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              What We&apos;ve <span className="text-tru-pink">Committed</span> To
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Three measurable promises that shape how we run the business — not nice-to-haves bolted on afterwards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {threePromises.map((p) => (
              <div
                key={p.number}
                className="rounded-[14px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 hover:border-tru-pink/30 hover:bg-white/[0.06] transition"
              >
                <p className="text-5xl font-black font-heading text-tru-pink leading-none mb-5">
                  {p.number}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 font-heading mb-2">
                  {p.eyebrow}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading leading-[0.95] mb-4">
                  {p.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          PROGRESS SO FAR — BIG STATS
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              Progress So Far
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              The <span className="text-tru-pink">Numbers</span> That Count
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            {progressStats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-6xl sm:text-7xl lg:text-8xl font-black font-heading text-tru-pink leading-[0.9] mb-3">
                  {s.value}
                </p>
                <div className="h-px w-12 bg-tru-pink mb-3 mx-auto md:mx-0" />
                <p className="text-gray-300 text-sm sm:text-base uppercase tracking-wider font-heading">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          COMMUNITY TOURISM ENTERPRISES
          ======================================================== */}
      <section className="pt-20 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <p className="text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] font-heading mb-3">
              On The Ground
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Community Tourism <span className="text-tru-pink">Enterprises</span>
            </h2>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed">
              Real experiences run by real people, where the money you spend stays where you spent it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {communityEnterprises.map((c) => (
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
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-tru-pink font-heading mb-2">
                    {c.location}
                  </p>
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
