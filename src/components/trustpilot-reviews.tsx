// TrustPilot-style scrolling reviews. The reviews below are placeholders for the
// prototype — wire these to the live Trustpilot feed/widget (business API or the
// TrustBox embed) when the real account is connected.

const TRUSTPILOT_GREEN = "#00B67A";

type Review = {
  title: string;
  text: string;
  name: string;
  trip: string;
  date: string;
};

const REVIEWS: Review[] = [
  { title: "Best trip of my life", text: "Everything was sorted from the second we landed. The group felt like family within a day and our leader was an absolute legend. Already booking my next one.", name: "Sophie C.", trip: "Thailand Island Hopper", date: "2 weeks ago" },
  { title: "Zero stress, all adventure", text: "I was nervous travelling solo but I never felt alone for a second. Every detail was handled so I could just enjoy it. Worth every penny.", name: "Jake M.", trip: "Bali Experience", date: "1 month ago" },
  { title: "Met friends for life", text: "Came on my own, left with a whole crew I still speak to every day. The Full Moon Party night was unreal. Can't recommend Tru enough.", name: "Priya K.", trip: "Thailand Island Hopper", date: "3 weeks ago" },
  { title: "Seamless from start to finish", text: "Flights, transfers, hotels, activities — all handled. Our guide knew every hidden spot. This is how travel should be done.", name: "Marcus R.", trip: "Vietnam Explorer", date: "1 month ago" },
  { title: "Absolutely unforgettable", text: "The floating bungalows in Khao Sok were a dream and the local food tour blew me away. The little TruExclusive moments made it.", name: "Hannah B.", trip: "Sri Lanka Uncovered", date: "2 months ago" },
  { title: "10/10 would book again", text: "Brilliant balance of culture, adventure and downtime. Nothing felt rushed and the group size was perfect. Easily my favourite holiday ever.", name: "Tom A.", trip: "Philippines East", date: "3 weeks ago" },
  { title: "Better than I imagined", text: "I'd built it up in my head and it still exceeded everything. The leaders genuinely care and it shows in every detail.", name: "Mia L.", trip: "Costa Rica Adventure", date: "1 month ago" },
  { title: "Made travel easy", text: "First time in Asia and I'd have been lost without Tru. Felt safe, looked after and had the time of my life. Thank you!", name: "Ben D.", trip: "Discover Asia", date: "5 weeks ago" },
];

function Stars({ size = "h-4 w-4" }: { size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${size} flex items-center justify-center rounded-[2px]`} style={{ background: TRUSTPILOT_GREEN }}>
          <svg className="h-[60%] w-[60%] text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function TrustpilotWordmark() {
  return (
    <span className="inline-flex items-center gap-1.5 text-white font-bold text-sm">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill={TRUSTPILOT_GREEN}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Trustpilot
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className="w-[300px] sm:w-[340px] flex-shrink-0 rounded-[10px] border border-white/10 bg-tru-navy p-5 flex flex-col"
      style={{ boxShadow: "0px 5px 25px -5px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <Stars />
        <TrustpilotWordmark />
      </div>
      <h3 className="text-white font-bold font-heading text-base mb-1.5">{r.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 mb-4">{r.text}</p>
      <div className="mt-auto pt-3 border-t border-white/5 flex items-center gap-2">
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke={TRUSTPILOT_GREEN} strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-xs text-gray-400">
          <span className="text-white font-semibold">{r.name}</span> &middot; {r.trip} &middot; {r.date}
        </p>
      </div>
    </div>
  );
}

export default function TrustpilotReviews() {
  // Duplicate the list so the ticker (translateX 0 → -50%) loops seamlessly.
  const marquee = [...REVIEWS, ...REVIEWS];

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-3">The Reviews</p>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95] mb-5">
          But Don&apos;t Just Take <span className="text-tru-pink">Our Word For It</span>
        </h2>
        <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-300">
          <span className="font-bold text-white">Excellent</span>
          <Stars size="h-5 w-5" />
          <span>
            Rated <span className="text-white font-semibold">4.9 / 5</span> from <span className="text-white font-semibold">2,400+</span> reviews on
          </span>
          <TrustpilotWordmark />
        </div>
      </div>

      {/* Scrolling marquee */}
      <div className="relative">
        <div className="flex gap-5 w-max animate-ticker hover:[animation-play-state:paused]">
          {marquee.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-tru-navy to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-tru-navy to-transparent" />
      </div>
    </section>
  );
}
