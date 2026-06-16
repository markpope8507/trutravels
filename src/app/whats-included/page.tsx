import Link from "next/link";

export const metadata = {
  title: "What's Included — TruTravels",
  description:
    "Every TruTravels trip includes accommodation, transport, activities, some meals, and an awesome TRU leader. Plus the financial protection of ABTA & ATOL.",
};

const INCLUSIONS = [
  {
    eyebrow: "Roof Over Your Head",
    title: "Accommodation",
    body: "Hotels, hostels, beach huts, homestays, even boats. We mix things up to fit the destination — high-end where it counts, local and characterful everywhere else. You'll always have a clean bed, hot water, and somewhere to dump your bag.",
    bullets: [
      "All nights covered — no gaps to book yourself",
      "Hand-picked properties we'd stay in ourselves",
      "Mix of styles — hotels, hostels, homestays, even live-aboards",
    ],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    ),
  },
  {
    eyebrow: "Getting Around",
    title: "Transport",
    body: "Trains, planes, minivans, longtail boats, tuk-tuks, sleeper buses. Whatever the route calls for, we've sorted it. You just turn up and enjoy the view out the window.",
    bullets: [
      "All transport between destinations included",
      "Airport pickups on arrival day",
      "Local rides for activities and excursions",
    ],
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 00-.879-2.121l-3.496-3.496A2.999 2.999 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z" />
    ),
  },
  {
    eyebrow: "All The Good Stuff",
    title: "Activities",
    body: "The bits that turn a trip into the trip. Sunrise treks, snorkelling spots, cooking classes, full moon parties, river tubes, temple tours — the icons are baked in, and the hidden gems too. No bolt-ons. No tier menus.",
    bullets: [
      "Every activity on the itinerary is included",
      "Mix of icons (you've seen them on Instagram) and locals-only finds",
      "Optional add-ons available — but never required",
    ],
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&q=80",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    ),
  },
  {
    eyebrow: "Food For The Soul",
    title: "Some Meals",
    body: "We don't lock you into every dinner — you'll want to roam the street markets and find your own spots. But the welcome dinners, group feasts, and the unmissable meals (think family-style on a beach, hill-tribe homestays) are sorted.",
    bullets: [
      "Welcome and farewell dinners on every trip",
      "Group meals that double as your best stories",
      "Plenty of free meals so you can explore local food",
    ],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
    ),
  },
  {
    eyebrow: "The Secret Sauce",
    title: "An Awesome TRU Leader",
    body: "Someone who feels like a friend but happens to know the way. Local legends who know every shortcut, the best street stall, and which beach the sunset hits perfectly. They're the difference between a holiday and the trip you'll tell stories about for years.",
    bullets: [
      "Local-born, locally-trained, locally-legendary",
      "Logistics handled — you just turn up",
      "First-hand recommendations on free days",
    ],
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80",
    svg: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    ),
  },
];

const PROMISES = [
  {
    eyebrow: "Low Deposit",
    title: "Lock In Your Spot With Just £200",
    body: "Secure your place on tour today with a low deposit and start planning your next adventure.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    ),
  },
  {
    eyebrow: "Flexible Payments",
    title: "Pay Your Way",
    body: "Choose what works for you. Set up an automatic payment plan, make flexible payments along the way, or pay in full upfront.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    ),
  },
  {
    eyebrow: "Fully Protected",
    title: "ABTA & ATOL Protected",
    body: "Travel with confidence knowing your booking is financially protected.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
];

export default function WhatsIncludedPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[440px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=80"
          alt="Group of travellers laughing at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              What&apos;s Included
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Everything<br />
              <span className="text-tru-pink">You Need</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;You turn up. We&apos;ve sorted the rest.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-3 font-heading">
          The Tru Way
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-6">
          Everything Sorted<br />
          <span className="text-tru-pink">So You Don&apos;t Have To</span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          Every TruTravels trip includes accommodation, transport, activities, some meals, and an awesome TRU leader who feels more like a friend who happens to know the way. Local legends, all of them.
        </p>
      </section>

      {/* Detailed inclusions — alternating rows */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-16 sm:space-y-24">
          {INCLUSIONS.map((item, idx) => (
            <div
              key={item.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden border border-white/10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/40 via-transparent to-transparent" />
              </div>
              <div>
                <div className="mb-4 h-14 w-14 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center">
                  <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.svg}
                  </svg>
                </div>
                <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-3 font-heading">
                  {item.eyebrow}
                </p>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase font-heading leading-[1.05] mb-5">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {item.body}
                </p>
                <ul className="space-y-2.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="mt-1 h-4 w-4 rounded-full bg-tru-pink/15 flex items-center justify-center flex-shrink-0">
                        <svg className="h-2.5 w-2.5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book With Confidence */}
      <section className="relative overflow-hidden pb-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.04] overflow-hidden">
            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 px-6 py-4 border-b border-white/10 bg-tru-pink/10">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] font-heading">
                Rated 4.9 / 5 · Based on 25,000+ Verified Reviews
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="text-center mb-10">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center">
                  <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">
                  The TRU Promise
                </p>
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-heading leading-[1.05]">
                  Book With <span className="text-tru-pink">Confidence</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {PROMISES.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6 hover:border-tru-pink/30 hover:bg-white/[0.05] transition-all duration-200"
                  >
                    <div className="h-12 w-12 rounded-full bg-tru-pink/15 flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        {item.icon}
                      </svg>
                    </div>
                    <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-2">
                      {item.eyebrow}
                    </p>
                    <h4 className="text-white text-base sm:text-lg font-black uppercase font-heading leading-tight mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <h3 className="text-2xl sm:text-4xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-6">
          Ready When You <span className="text-tru-pink">Are</span>
        </h3>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-full bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
        >
          Find Your Trip
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </>
  );
}
