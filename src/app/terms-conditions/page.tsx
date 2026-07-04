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
      <section id="top" className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
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
      <section className="relative overflow-hidden pt-16 pb-24">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/4 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-3/4 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -bottom-8 w-[200px] sm:w-[300px] lg:w-[420px] opacity-[0.04] brightness-0 invert" />
        <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[12%] w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/eyes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-[36%] w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-32 top-[56%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 top-[68%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[88%] w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-[92%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05] brightness-0 invert" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-tru-pink hover:text-tru-pink-light text-xs font-bold uppercase tracking-wider font-heading transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              Take Me To The Top
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
