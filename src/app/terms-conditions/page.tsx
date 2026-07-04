import { TERMS_BLOCKS } from "@/lib/terms-content";

export const metadata = {
  title: "Terms & Conditions — TruTravels",
  description:
    "TruTravels booking terms and conditions — the nitty gritty information you need before you book.",
};

export default function TermsConditionsPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg"
          alt="TruTravels adventure"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Essentials · The Nitty Gritty
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Terms &amp;<br />
              <span className="text-tru-pink">Conditions</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;The important bit — please give it a read before you book.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative pt-16 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {TERMS_BLOCKS.map((block, i) =>
            block.type === "h" ? (
              <h2
                key={i}
                className="text-white font-black uppercase font-heading text-lg sm:text-xl tracking-wide mt-10 mb-3 first:mt-0"
              >
                {block.text}
              </h2>
            ) : (
              <p key={i} className="text-gray-300 text-sm sm:text-[15px] leading-relaxed mb-4">
                {block.text}
              </p>
            ),
          )}
        </div>
      </section>
    </>
  );
}
