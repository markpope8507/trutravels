import ContactForm from "@/components/contact-form";

export const metadata = {
  title: "Contact Us — TruTravels",
  description:
    "Got a question about a trip, a booking, or just want to talk travel? Get in touch with the TruTravels team.",
};

const DETAILS = [
  {
    label: "Live Chat",
    value: "9:30am–5pm GMT, Mon–Sat",
    sub: "Tap the chat bubble, bottom-right.",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 3v-3z",
  },
  {
    label: "Call Us",
    value: "+44 203 542 2463",
    sub: "Speak to a real human.",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  {
    label: "TruHQ",
    value: "6 Fife Road, Kingston Upon Thames",
    sub: "Surrey, KT1 1SZ, United Kingdom",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function ContactUsPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg"
          alt="The TruTravels crew"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Get In Touch
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Got A<br />
              <span className="text-tru-pink">Question?</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;There are no stupid questions — so ask away.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-3 font-heading">Say Hello</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[1.05] mb-4">
              Here&apos;s The Place <span className="text-tru-pink">To Ask It</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Curious about a specific trip, want to know more about how we do things, or just fancy a chat about your next adventure? Drop us a message and we&apos;ll get back to you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
            {/* Form */}
            <ContactForm />

            {/* Contact details */}
            <div className="space-y-4">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex items-start gap-4 rounded-[12px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="h-11 w-11 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={d.icon} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-1">{d.label}</p>
                    <p className="text-white text-sm font-semibold">{d.value}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{d.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
