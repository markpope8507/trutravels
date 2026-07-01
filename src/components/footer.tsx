"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { name: "All Trips", href: "/explore" },
      { name: "Travel Styles", href: "/travel-styles" },
      { name: "Life Moments", href: "/life-moments/solo-soul-searcher" },
      { name: "How It Works", href: "/whats-included" },
      { name: "Deals", href: "/deals" },
      { name: "Stories", href: "/stories" },
      { name: "VIP Club", href: "/about/vip-programme" },
      { name: "My Account", href: "/member/dashboard" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Our Story", href: "/about/story" },
      { name: "Our Values", href: "/about/values" },
      { name: "Our Impact", href: "/about/impact" },
      { name: "Our Community", href: "/about/community" },
      { name: "Our Brand", href: "/about/brand" },
      { name: "Contact Us", href: "/about" },
      { name: "Careers", href: "/about" },
    ],
  },
  {
    title: "Essentials",
    links: [
      { name: "FAQs", href: "/about" },
      { name: "Travel Insurance", href: "/about" },
      { name: "Visa & Passport", href: "/about" },
      { name: "Package Travel Regulations", href: "/about" },
      { name: "Book With Confidence", href: "/whats-included" },
    ],
  },
  {
    title: "Partners",
    links: [
      { name: "Partner With Us", href: "/about" },
      { name: "Affiliate Program", href: "/about" },
      { name: "Host A Trip", href: "/about" },
      { name: "Agent Registration", href: "/about" },
      { name: "Agents Login", href: "/login" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    svg: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    svg: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />,
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    svg: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    svg: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.5 21l2-7.5M9 9.5a3 3 0 116 0c0 2.5-1.5 5-3.5 5-1 0-1.5-.7-1.3-1.8" />
      </>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    svg: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Footer() {
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-tru-navy text-gray-400 border-t border-white/10 overflow-clip">
      {/* Subtle pink glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-tru-pink/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-tru-pink/[0.04] blur-3xl" />

      {/* Background watermark icons */}
      <img
        src="/bg-assets/tru-logo.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 top-8 w-[260px] sm:w-[380px] lg:w-[520px] opacity-[0.05] brightness-0 invert"
      />
      <img
        src="/bg-assets/mask.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 -bottom-10 w-[220px] sm:w-[320px] lg:w-[420px] opacity-[0.06] brightness-0 invert"
      />
      <img
        src="/bg-assets/sun.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-[30%] -bottom-12 w-[160px] sm:w-[220px] lg:w-[280px] opacity-[0.04] brightness-0 invert hidden sm:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Brand + Link Columns side-by-side on desktop */}
        <div className="pb-10 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 lg:gap-12">
            {/* Brand */}
            <div>
              <img src="/logo-white.png" alt="TruTravels" className="h-20 sm:h-24 mb-5" />
              <p className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight font-heading leading-[1.05] mb-3">
                Leave Ordinary <span className="text-tru-pink">Behind</span>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Life-changing experiences. Game-changing travel. We&apos;re here for the in-between years
                — the bit where you find out who you are by going somewhere new.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-tru-pink hover:bg-tru-pink/10 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      {s.svg}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div>
              <div className="hidden md:grid md:grid-cols-4 gap-8">
                {FOOTER_COLUMNS.map((col) => (
                  <div key={col.title}>
                    <h4 className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] font-heading mb-4">
                      {col.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-300 hover:text-tru-pink transition"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile accordion */}
              <div className="md:hidden divide-y divide-white/10">
                {FOOTER_COLUMNS.map((col) => {
                  const isOpen = openMobile === col.title;
                  return (
                    <div key={col.title}>
                      <button
                        onClick={() => setOpenMobile(isOpen ? null : col.title)}
                        className="w-full flex items-center justify-between py-4 text-white font-heading uppercase tracking-wider text-sm"
                      >
                        {col.title}
                        <svg
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-2.5 pl-1">
                            {col.links.map((link) => (
                              <li key={link.name}>
                                <Link
                                  href={link.href}
                                  className="block text-sm text-gray-300 hover:text-tru-pink transition py-1"
                                >
                                  {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mailing list signup — below the nav dropdowns on mobile, inline row on desktop */}
        <div className="py-8 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
            {/* Heading (left on desktop) */}
            <div className="w-full lg:max-w-sm">
              <p className="text-white text-sm font-bold font-heading uppercase tracking-wide mb-1">Join the mailing list</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Trips, deals and stories &mdash; no account needed. Unsubscribe anytime.
              </p>
            </div>

            {/* Form, with the account note sitting beneath it */}
            <div className="w-full lg:flex-1 lg:max-w-md">
              {subscribed ? (
                <p className="flex items-center gap-2 text-sm text-tru-pink font-semibold">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;re on the list!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-tru-pink hover:bg-tru-pink-light text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200 whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </form>
              )}
              <p className="text-gray-500 text-xs leading-relaxed mt-3">
                Want the full experience? <Link href="/signup" className="text-gray-300 hover:text-tru-pink underline transition">Create an account</Link> for saved trips, member deals and more.
              </p>
            </div>
          </div>
        </div>

        {/* Trust + Payment row */}
        <div className="py-8 border-b border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <img
                src="/images/atol-logo.png"
                alt="ATOL Protected"
                className="h-12 sm:h-14 w-auto"
              />
              <img
                src="/images/abta-logo.png"
                alt="ABTA — Travel With Confidence — Y6506"
                className="h-12 sm:h-14 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 text-[9px]">4.9 · Trustpilot</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3 w-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 text-[9px]">4.8 · Google</p>
              </div>
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <img src="/images/visa.png" alt="Visa" className="h-8 w-auto" />
              <img src="/images/mastercard.png" alt="Mastercard" className="h-8 w-auto" />
              <img src="/images/amex.png" alt="American Express" className="h-8 w-auto" />
              <img src="/images/apple-pay.png" alt="Apple Pay" className="h-8 w-auto" />
              <img src="/images/google-pay.png" alt="Google Pay" className="h-8 w-auto" />
            </div>
          </div>
        </div>

        {/* Legal / Copyright */}
        <div className="pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-[11px] text-gray-500 leading-relaxed">
            <p>&copy; {new Date().getFullYear()} TruTravels Limited. All rights reserved.</p>
            <p className="mt-1">
              Registered Office: TruTravels Limited, TruHQ, 6 Fife Road, Kingston Upon Thames, Surrey, KT1 1SZ
            </p>
            <p className="mt-1">Company Reg: 08094426 · +44 203 542 2463</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px]">
            <Link href="/about" className="text-gray-400 hover:text-tru-pink transition">
              Terms &amp; Conditions
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-tru-pink transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-tru-pink transition">
              Cookie Preferences
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-tru-pink transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
