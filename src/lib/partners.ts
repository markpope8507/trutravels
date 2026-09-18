/**
 * The Partners section — /partner-with-us, /affiliates, /host-a-trip.
 *
 * WHY THREE PAGES AND ONE FORM
 * The footer has carried five dead Partners links since it was built. The
 * brief covers three of them, and the copy for all three is one proposition
 * split by who is asking: a creator with an audience either sends people to us
 * (affiliates) or brings them with them (host a trip), and some don't know
 * which yet. The hub page carries the choice; each form is the same base plus
 * the two to four questions that only matter for that route.
 *
 * That base lives ONCE, in `BASE_QUESTIONS` below and in PartnerForm. Don't
 * copy a field into a page — add it to that page's `extra`. Three
 * near-identical forms drifting apart is the failure this repo keeps hitting.
 *
 * Mirrored by converted/.build/build_partners.py.
 */

export const PARTNER_CONTACT = "partnerships@trutravels.com";

/**
 * Real partners, from the shared Drive folder. Name and description only —
 * NO QUOTES have been collected, so none are invented here. The testimonial
 * carousel renders an "awaiting copy" tag instead of putting words a partner
 * never said under their own logo. Drop the quote into `quote` and the tag
 * disappears on its own.
 *
 * Logos were trimmed to their alpha box and resized to 480px on the long edge.
 * Two of the six are solid black, which is why they sit on white tiles rather
 * than straight on the navy.
 */
export type Partner = { slug: string; name: string; what: string; quote?: string };

export const PARTNERS: Partner[] = [
  { slug: "gals-who", name: "Gals Who Travel", what: "Community & events" },
  { slug: "sea-gals", name: "Sea Gals", what: "Surf & ocean community" },
  { slug: "amigas-y-mas", name: "Amigas Y Más Social", what: "Latina travel social" },
  { slug: "someday-travel-club", name: "Someday Travel Club", what: "Solo travel club" },
  { slug: "dwh", name: "DWH", what: "Creator collective" },
  { slug: "we-got-you-boo", name: "We Got You Boo", what: "Womens travel community" },
];

/** Verified CDN images — the obvious-sounding paths mostly 302. */
export const PARTNER_HERO = {
  hub: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg",
  affiliates: "https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg",
  host: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg",
};

/** [title, description, icon key from BENEFIT_ICONS in partner-blocks.tsx] */
export type Benefit = [string, string, string];

export const AFFILIATE_BENEFITS: Benefit[] = [
  [
    "Your Own Bespoke URL",
    "A TruTravels landing page that is yours, so you can send people somewhere that already speaks to your community rather than a generic homepage.",
    "window",
  ],
  [
    "Trackable Links",
    "Personalised links across every trip, so every booking is attributed to you automatically. No codes to remember, nothing to claim after the fact.",
    "link",
  ],
  [
    "Minimum 5% Commission",
    "Five per cent is the floor, not the target. It goes up with volume and it goes up with the incentives below.",
    "percent",
  ],
  [
    "Commission Incentives",
    "Boosted rates run through the year, tied to launches, seasons and specific trips. You’ll know about them before they go public.",
    "trend",
  ],
  [
    "Bespoke Assets & Templates",
    "Imagery, trip information and post templates made for your platforms, so posting about a trip takes minutes rather than an afternoon.",
    "assets",
  ],
];

export const HOST_BENEFITS: Benefit[] = [
  [
    "Your Community, In Person",
    "The chance to turn a comment section into a group of people who’ve watched the same sunrise. That’s the whole point of it.",
    "group",
  ],
  [
    "You Travel Too",
    "You’re on the trip, not running it. Your Local Legend handles the days; you get to actually be there with your people.",
    "plane",
  ],
  [
    "A Bespoke Website Page",
    "Your own page on this site, built around your trip and your audience, that you can send people straight to.",
    "window",
  ],
  [
    "Commission On Bookings",
    "You earn on every place sold on your trip — paid on completed bookings, with nothing to chase.",
    "money",
  ],
  [
    "A Scalable Structure",
    "The more of your community comes, the higher the rate goes. A full departure pays considerably better than a half-full one.",
    "bars",
  ],
];

export const AFFILIATE_STEPS: [string, string][] = [
  ["Apply", "Fill in the form below. We want to understand your community more than your follower count."],
  ["Get Set Up", "We build your bespoke URL and your trackable links, and send over the asset pack."],
  ["Post", "Share the trips that suit your people. Everything booked through your links is attributed to you."],
  ["Get Paid", "Commission on every completed booking, at minimum 5%, plus whatever incentives are running."],
];

export const HOST_STEPS: [string, string][] = [
  ["Tell Us The Idea", "Who your community is, roughly how many might come, and where you’ve always wanted to take them."],
  ["We Build It", "We shape the itinerary, price it, assign a Local Legend and set the dates with you. You approve it before anything goes live."],
  ["You Build The Hype", "Your page goes up and you do what you already do — talk to your people. We supply the assets."],
  ["You Go", "We run the trip on the ground. You’re on it as a traveller, not a tour manager."],
];

/** The age bands the brief names. Multi-select — an audience usually spans a few. */
export const AUDIENCE_BANDS = ["18–24", "25–30", "31–35", "36–40"];
