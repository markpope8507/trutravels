import SnapshotBookButton from "@/components/snapshot-book-button";

type Departure = {
  date: string;
  price: number;
  originalPrice?: number;
  status: "available" | "almost-full" | "full" | "discount";
  discount?: string;
};

export default function TripPricingCard({
  price,
  originalPrice,
  duration,
  departures,
  depositPrice,
}: {
  price: number;
  originalPrice?: number;
  duration: string;
  departures?: Departure[];
  depositPrice: number;
}) {
  const discountPct = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const savings = originalPrice ? originalPrice - price : 0;
  const days = parseInt(duration, 10) || 1;
  const perDay = Math.round(price / days);

  return (
    <div className="bg-white/[0.06] border border-white/15 rounded-[16px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-heading">
              From
            </span>
            {originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                &pound;{originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-white text-4xl font-black font-heading leading-none">
              &pound;{price}
            </span>
            <span className="text-gray-400 text-sm">/ person</span>
            {discountPct === 0 && (
              <span className="text-gray-400 text-xs">
                &middot; Just <span className="text-white font-bold">&pound;{perDay}</span> per day
              </span>
            )}
          </div>
          {discountPct > 0 && (
            <p className="text-gray-400 text-xs mt-2">
              Just <span className="text-white font-bold">&pound;{perDay}</span> per day
            </p>
          )}
        </div>
        {discountPct > 0 && (
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="h-16 w-16 rounded-full bg-red-600 text-white flex flex-col items-center justify-center font-heading shadow-xl ring-2 ring-red-500/40"
              style={{ transform: "rotate(-10deg)" }}
            >
              <span className="text-[8px] font-black uppercase tracking-[0.18em] leading-none mb-0.5 opacity-90">
                Save
              </span>
              <span className="text-xl font-black leading-none">{discountPct}%</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mt-0.5">
                Off
              </span>
            </div>
            <p className="text-white text-[11px] font-bold uppercase tracking-wider font-heading mt-2 whitespace-nowrap">
              Save &pound;{savings}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/10">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-heading mb-1">
            Next Departure
          </p>
          <p className="text-white text-sm font-semibold">
            {departures?.[0]
              ? new Date(departures[0].date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Multiple dates"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-heading mb-1">
            Duration
          </p>
          <p className="text-white text-sm font-semibold">{duration}</p>
        </div>
      </div>

      <SnapshotBookButton />
      <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-white uppercase tracking-wider font-heading">
        <svg className="h-4 w-4 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Flexible payments
      </div>
      <p className="mt-1.5 text-center text-xs leading-snug text-gray-400">
        Pay a <span className="text-white font-bold">&pound;{depositPrice} deposit</span> and spread the rest interest-free.
      </p>
      <p className="mt-1 text-center text-xs leading-snug text-gray-400">
        Balance due 60 days before departure.
      </p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <img src="/images/atol-logo.png" alt="ATOL Protected" className="h-7 w-auto" />
        <img
          src="/images/abta-logo.png"
          alt="ABTA — Travel With Confidence"
          className="h-6 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
    </div>
  );
}
