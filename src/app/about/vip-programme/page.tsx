import Breadcrumbs from "@/components/breadcrumbs";
import { ABOUT, sectionCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";

const tiers = [
  {
    name: "Game-Changer",
    days: "30+",
    color: "#6BD495",
    description: "You've caught the travel bug. Welcome to the family.",
    benefits: [
      "5% off all full-priced tours",
      "\u00a350 travel credit per year",
      "Early access to flash sales",
      "Entry into quarterly prize draws",
    ],
  },
  {
    name: "Icon",
    days: "50+",
    color: "#2172D5",
    description: "You're becoming a regular. People are starting to notice.",
    benefits: [
      "10% off all full-priced tours",
      "\u00a3100 travel credit per year",
      "Priority access to new destinations",
      "Free airport transfer on every trip",
      "Exclusive Icon merch pack",
    ],
  },
  {
    name: "Legend",
    days: "100+",
    color: "#FF3F99",
    description: "Triple digits. You're officially a legend in our books.",
    benefits: [
      "15% off all full-priced tours",
      "\u00a3200 travel credit per year",
      "Free pre-night hotel on every trip",
      "Priority room upgrades (subject to availability)",
      "Invite to annual Legend meetup event",
      "Dedicated VIP support line",
    ],
  },
  {
    name: "MVP",
    days: "365+",
    color: "#FF3F99",
    gradient: true,
    description: "A full year on the road with us. You are the most valuable player.",
    benefits: [
      "20% off all full-priced tours",
      "\u00a3500 travel credit per year",
      "Free pre-night hotel + airport transfers",
      "Complimentary room upgrade on every trip",
      "Annual all-expenses-paid trip for two",
      "Personal travel concierge",
      "MVP-only experiences and events",
      "Lifetime membership — benefits never expire",
    ],
  },
];

export default function VipProgrammePage() {
  return (
    <div className="pt-28 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs noHero crumbs={sectionCrumbs(ABOUT, "VIP Programme")} />
      <Link href="/my-account/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-8">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </Link>

      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-2">Loyalty Rewards</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight mb-4">
          VIP Programme
        </h1>
        <p className="text-xl sm:text-2xl font-handwriting text-tru-pink mb-4">The more you travel, the more you earn</p>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Every day you spend on a TruTravels trip counts towards your VIP status. Unlock bigger discounts, free upgrades, travel credit, and exclusive experiences as you level up through the tiers.
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-[10px] border border-white/10 bg-white/5 p-6 sm:p-8 mb-16">
        <h2 className="text-xl font-black text-white uppercase font-heading tracking-wide mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Travel with us", desc: "Every day on a TruTravels trip counts towards your total. Multi-country? Every single day counts." },
            { step: "2", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Level up", desc: "Hit day milestones to unlock new tiers. Your status is calculated automatically and never expires." },
            { step: "3", icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7", title: "Enjoy rewards", desc: "Discounts, travel credit, free upgrades, exclusive events, and more — rewards that actually matter." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="h-14 w-14 rounded-full bg-tru-pink/10 border border-tru-pink/20 flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              </div>
              <p className="text-white font-bold text-sm font-heading uppercase mb-1">{item.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-8 text-center">The Tiers</h2>
        <div className="space-y-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Tier badge */}
                <div
                  className="sm:w-56 flex-shrink-0 p-6 sm:p-8 flex flex-col items-center justify-center text-center"
                  style={{ background: `${tier.color}10` }}
                >
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 ${tier.gradient ? "bg-gradient-to-br from-tru-pink to-tru-blue" : ""}`}
                    style={!tier.gradient ? { background: `${tier.color}20` } : undefined}
                  >
                    <svg className="h-8 w-8" style={{ color: tier.gradient ? "white" : tier.color }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-white font-black text-lg font-heading uppercase">{tier.name}</p>
                  <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.days} days</p>
                </div>

                {/* Benefits */}
                <div className="flex-1 p-6 sm:p-8">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{tier.description}</p>
                  <div className="space-y-2">
                    {tier.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2">
                        <svg className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <p className="text-white text-sm">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-8 text-center">FAQs</h2>
        <div className="space-y-3 max-w-3xl mx-auto">
          {[
            { q: "How are my days calculated?", a: "Every day you spend on a TruTravels trip counts. A 14-day Thailand Island Hopper = 14 days. If you do a 28-day multi-country combo, that's 28 days. Simple." },
            { q: "Do my days expire?", a: "Never. Once you've earned days, they're yours for life. Your tier status is permanent — you'll never be downgraded." },
            { q: "When do I receive my travel credit?", a: "Travel credit is applied to your account at the start of each calendar year, based on your current tier. It can be used towards any future booking." },
            { q: "Can I combine my discount with sale prices?", a: "VIP discounts apply to full-priced tours only. However, your travel credit can be applied to any booking, including sale trips." },
            { q: "How do I track my progress?", a: "Your VIP status and progress are visible on your member dashboard. You'll also receive an email notification when you level up." },
          ].map((faq) => (
            <div key={faq.q} className="rounded-[10px] border border-white/10 bg-white/5 p-5">
              <p className="text-white text-sm font-semibold mb-2">{faq.q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-[10px] border border-white/10 bg-white/5 p-8 sm:p-10 text-center">
        <p className="text-2xl sm:text-3xl font-handwriting text-tru-pink mb-3">Ready to start earning?</p>
        <p className="text-gray-400 text-sm mb-6">Book your next trip and start climbing the tiers.</p>
        <Link href="/explore" className="inline-block rounded-[10px] bg-tru-pink px-8 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition uppercase tracking-wider font-heading">
          Explore Trips
        </Link>
      </div>
    </div>
  );
}
