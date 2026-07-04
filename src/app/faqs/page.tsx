import Link from "next/link";
import FaqAccordion, { type Faq } from "@/components/faq-accordion";
import StoriesFeature from "@/components/stories-feature";

export const metadata = {
  title: "FAQs — TruTravels",
  description:
    "Everything you need to know before you go — group sizes, what's included, payments, insurance, visas and more.",
};

const FAQ_GROUPS: { category: string; faqs: Faq[] }[] = [
  {
    category: "Before You Book",
    faqs: [
      { q: "What's the age range?", a: "Most of our travellers are 18–35, though our trips are open up to 45. Our Backpacker style is exclusively for 18–29s." },
      { q: "Do many people travel solo?", a: "Absolutely — most people book on their own. Within a day you're part of a ready-made group of like-minded travellers." },
      { q: "How many people are on a trip?", a: "Group sizes vary by trip but max out at around 20. Spots tend to fill up fast, so book early." },
      { q: "Can non-UK travellers join?", a: "Definitely — our trips are open to travellers from all over the world, and the mix of nationalities is part of the fun." },
      { q: "Is everything included?", a: "Accommodation, transport between destinations, the activities on your itinerary and a Local Legend are all included. Some meals too. Flights and travel insurance aren't." },
      { q: "Is TruTravels financially protected?", a: "Yes — we're ABTA members (membership Y6506), so your booking is 100% financially protected." },
    ],
  },
  {
    category: "Getting Ready",
    faqs: [
      { q: "Do I need travel insurance?", a: "Yes — it's compulsory and needs to cover your entire trip. We recommend World Nomads." },
      { q: "Are flights included?", a: "No — book your own flights (try Skyscanner or Kayak) and send us the details once you're sorted." },
      { q: "What day should I book flights for?", a: "Aim to arrive on the trip start date, or the day before if you fancy settling in. There are no set activities on Day 1 — just a welcome dinner around 7pm." },
      { q: "Do I need a visa?", a: "It depends on your nationality and where you're headed. Check our Visa & Passport guide for the details before you travel." },
      { q: "Do I need vaccinations?", a: "Most destinations don't require specific vaccines, but keep your tetanus up to date and check with your doctor or a travel clinic." },
      { q: "How much spending money should I bring?", a: "Budget around £150–£250 per week for food, drinks and shopping. Accommodation, transport and included activities are already covered." },
      { q: "How should I carry money?", a: "A travel card with good exchange rates is easiest — top up cash from local ATMs rather than carrying loads with you." },
      { q: "Backpack or suitcase?", a: "A backpack, every time. Suitcases don't cope well with boats, tuk-tuks and sandy paths." },
      { q: "How do I stay connected?", a: "Grab an eSIM before you fly — we recommend Airalo (use code TRUTRAVELS15 for 15% off)." },
      { q: "What if I have an allergy?", a: "Let us know when you book so your Local Legend is aware. We'd also suggest carrying allergy cards in the local language for restaurants." },
    ],
  },
  {
    category: "On The Trip",
    faqs: [
      { q: "Who's my guide?", a: "A Local Legend — a local expert who's with you day and night, sharing the shortcuts, the best food stalls and the spots you'd never find on your own." },
      { q: "What accommodation will I stay in?", a: "Mostly twin-share rooms with a same-sex roommate — hotels, hostels, homestays, beach huts, even boats. Occasionally dorm or triple-share." },
      { q: "Is food included?", a: "Some meals are included depending on the trip, and the group eats out together most nights. You'll have plenty of free meals to explore local food too." },
      { q: "Is there free time?", a: "Yes — itineraries balance included activities with free time to explore, shop or do absolutely nothing." },
      { q: "What if I don't want to do an activity?", a: "No pressure. Every activity is optional — sit out anything you're not feeling." },
      { q: "What happens in the evenings?", a: "The group heads out for dinner most nights at cool local spots. Evenings aren't compulsory, and there are non-drinking options too." },
      { q: "Can I find out who's in my group?", a: "You'll get a welcome message from your Local Legend about a week before you go, with a WhatsApp group to join. You can also join our 'TruTravellers' Facebook group any time." },
      { q: "Are airport transfers included?", a: "Not on every trip. Where they're available you can add them in your account or via the sales team — at least 7 days before you travel." },
    ],
  },
  {
    category: "Payments & Changes",
    faqs: [
      { q: "Can I pay a deposit?", a: "Yes — secure your spot with a £200 deposit per person, per trip, as long as the balance is paid 60 days before departure. Booking inside 60 days is paid in full." },
      { q: "Can I pay the deposit off in instalments?", a: "Yes — set up flexible payments through your account, via the links in your confirmation email, or with the sales team." },
      { q: "Is my spot guaranteed once I've paid a deposit?", a: "Yes — your place is locked in as soon as the deposit's paid, provided the balance clears 60 days before you go." },
      { q: "How do I book?", a: "Book online with 'Book Now' on any trip page, or call our UK office on +44 203 542 2463." },
      { q: "Can I pay in my own currency?", a: "Prices show in GBP, AUD, CAD, EUR and USD, and any debit or credit card works — your bank handles the exchange." },
      { q: "Can I change my trip date?", a: "Give us 60+ days' notice for one free date change (subject to availability). Changes inside 60 days may incur an admin fee." },
    ],
  },
  {
    category: "After Your Trip",
    faqs: [
      { q: "What time does the trip finish?", a: "On the final checkout day — treat it as a travel day. Your Local Legend will suggest things to do if you've got a late flight." },
      { q: "Can I book extra nights at the end?", a: "We can't book them for you, but your Local Legend will share the final hotel name and recommendations so you can extend your stay." },
      { q: "Is transport to the airport included at the end?", a: "Not included, but your Local Legend can help you arrange a transfer." },
      { q: "Can you help with onward travel?", a: "Yes — your Local Legend will point you in the right direction for wherever you're headed next." },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      {/* HERO — standard right-aligned overlay */}
      <section className="relative h-[60vh] min-h-[460px] flex items-center overflow-hidden">
        <img
          src="https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg"
          alt="TruTravels group at a viewpoint"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Essentials · Need To Know
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              Got<br />
              <span className="text-tru-pink">Questions?</span>
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;Everything you need to know before you go. Can&apos;t find it? Just ask.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-1/2 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 -bottom-10 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-14">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-wide mb-6">
                {group.category}
              </h2>
              <FaqAccordion faqs={group.faqs} />
            </div>
          ))}

          {/* Still stuck CTA */}
          <div className="rounded-[16px] border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.05] p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading tracking-tight mb-3">
              Still Not <span className="text-tru-pink">Sure?</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto">
              The best way to picture it is to find the trip that&apos;s calling your name. Browse the adventures and the rest falls into place.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition-all duration-200"
            >
              Find Your Trip
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stories From The Road */}
      <StoriesFeature />
    </>
  );
}
