import Link from "next/link";
import SupportCenter from "@/components/support-center";

export const metadata = {
  title: "Support — TruTravels",
  description:
    "Find answers fast with Ask Tru, our support assistant — or jump straight to live chat, email or a call if you get stuck.",
};

const CONTACT = [
  {
    label: "Live Chat",
    value: "9:30am–5pm GMT · Mon–Sat",
    action: "Start a chat",
    href: "/contact-us",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z",
  },
  {
    label: "Email Us",
    value: "Drop us a message anytime",
    action: "Send a message",
    href: "/contact-us",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    label: "Call Us",
    value: "+44 203 542 2463",
    action: "Give us a ring",
    href: "tel:+442035422463",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
];

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

      {/* Escalation — still stuck? */}
      <section className="relative overflow-hidden pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 sm:p-10">
            <div className="text-center mb-8">
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Still Stuck?</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight">
                Talk To A <span className="text-tru-pink">Human</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-3 max-w-md mx-auto">
                Can&apos;t find what you&apos;re after? Our team is happy to help — take your pick.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CONTACT.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6 text-center hover:border-tru-pink/30 hover:bg-white/[0.05] transition-all duration-200 group"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                    </svg>
                  </div>
                  <p className="text-white font-black uppercase font-heading text-sm tracking-wide mb-1">{c.label}</p>
                  <p className="text-gray-400 text-xs mb-3">{c.value}</p>
                  <span className="text-tru-pink text-[11px] font-bold uppercase tracking-wider font-heading group-hover:text-tru-pink-light transition">{c.action} &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
