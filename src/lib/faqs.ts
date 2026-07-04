// Shared help / FAQ content — used by the FAQs page and the Support hub.
export type Faq = { q: string; a: string };

export type FaqGroup = {
  category: string;
  description: string;
  /** SVG path `d` for the topic icon. */
  icon: string;
  color: string;
  faqs: Faq[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "Before You Book",
    description: "The big-picture stuff — who our trips are for, how they work, and what's covered before you commit.",
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#FF3F99",
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
    description: "Sorted your spot? Here's everything to organise before you fly — insurance, flights, money and packing.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#6BD495",
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
    description: "What day-to-day life on tour actually looks like — your Local Legend, the accommodation, food, free time and evenings.",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    color: "#2172D5",
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
    description: "Deposits, instalments, currencies and what happens if your plans change.",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    color: "#FCA501",
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
    description: "Wrapping up — finish times, extra nights and getting to wherever's next.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    color: "#00BBB4",
    faqs: [
      { q: "What time does the trip finish?", a: "On the final checkout day — treat it as a travel day. Your Local Legend will suggest things to do if you've got a late flight." },
      { q: "Can I book extra nights at the end?", a: "We can't book them for you, but your Local Legend will share the final hotel name and recommendations so you can extend your stay." },
      { q: "Is transport to the airport included at the end?", a: "Not included, but your Local Legend can help you arrange a transfer." },
      { q: "Can you help with onward travel?", a: "Yes — your Local Legend will point you in the right direction for wherever you're headed next." },
    ],
  },
];
