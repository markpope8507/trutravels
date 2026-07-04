import SupportCenter from "@/components/support-center";
import SupportEscalation from "@/components/support-escalation";

export const metadata = {
  title: "Support — TruTravels",
  description:
    "Find answers fast with Ask Tru, our support assistant — or jump straight to live chat, email or a call if you get stuck.",
};

export default function SupportPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/greece/greece-island-hopper-017.jpg"
          alt="TruTravels adventure"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Support
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              How Can We<br />
              <span className="text-tru-pink">Help?</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Answers in seconds — and if you&apos;re still stuck, we&apos;re one tap away.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Support hub */}
      <section className="relative overflow-hidden pt-16 pb-16">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-3 font-heading">Here To Help</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]">
              Help &amp; <span className="text-tru-pink">Support</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mt-4 max-w-2xl">
              Get instant answers with Ask Tru.D, our support assistant — just type your question and it&apos;ll dig out the answer. Prefer to browse? Pick a topic below. And if you&apos;re still stuck, live chat, email and phone are all a tap away.
            </p>
          </div>
          <SupportCenter />
        </div>
      </section>

      {/* Escalation — still stuck? (live chat / email / call, with modals) */}
      <SupportEscalation />
    </>
  );
}
