import DealsBrowser from "@/components/deals-browser";

export const metadata = {
  title: "Deals — TruTravels",
  description:
    "Sale departures, last-minute discounts, and trips with the biggest savings on right now. Gone when they're gone.",
};

export default function DealsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80"
          alt="Tropical beach at sunset — pack and go"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Deals
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Best Prices<br />On The Road
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Sale departures, last-minute discounts, biggest savings — gone when they&apos;re gone.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Deals + departures content */}
      <div className="pt-20 pb-12 border-t border-white/5">
        <DealsBrowser />
      </div>
    </>
  );
}
