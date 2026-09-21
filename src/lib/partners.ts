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
 * Real partners, from the shared Drive folder.
 *
 * !!! THE QUOTES ARE INVENTED. !!!
 * They are sample copy written to fill the layout, attributed to real, named
 * organisations. Nobody at these companies said any of it. They exist so the
 * cards can be reviewed at full size; replace each one with what the partner
 * actually sends BEFORE this page is shown to anyone outside the company.
 * `placeholder` is true on every one — flip it as each real quote lands, and
 * grep for it before launch.
 *
 * `photo` is placeholder too: a TruTravels library shot chosen to suit that
 * partner's region, not a photograph of their own departure. A logo sitting on
 * a photo reads as a picture of that partner's trip.
 *
 * Logos were trimmed to their alpha box and resized to 480px on the long edge.
 * Two of the six are solid black, which is why they sit on white tiles rather
 * than straight on the navy.
 */
export type Partner = {
  slug: string;
  name: string;
  what: string;
  photo: string;
  quote: string;
  /** True while `quote` is sample copy rather than the partner's own words. */
  placeholder: boolean;
  /** Optional MP4 — the card's media becomes a button that opens the lightbox. */
  video?: string;
  /** Intrinsic pixel size of the logo PNG. A lazy <img> with width:auto has NO
   *  intrinsic size until it loads, so without these the white tile lays out
   *  at zero width and the card reflows when the logo arrives. */
  w: number;
  h: number;
};

export const PARTNERS: Partner[] = [
  {
    slug: "gals-who", name: "Gals Who Travel", what: "Community & events", w: 480, h: 373,
    photo: "https://cdn.trutravels.com/greece/greece-island-hopper-017.jpg",
    // landscape; a portrait clip letterboxes inside the lightbox, which is
    // sized for a wide frame
    video: "https://videos.pexels.com/video-files/36218992/15359210_2560_1440_24fps.mp4",
    placeholder: true,
    quote:
      "We\u2019d been talking about taking the community somewhere for two years and never got past a spreadsheet. Tru had it costed and dated in about six weeks. We brought the people; they did absolutely everything else.",
  },
  {
    slug: "sea-gals", name: "Sea Gals", what: "Surf & ocean community", w: 480, h: 292,
    photo: "https://cdn.trutravels.com/indonesia-images/surfing-lesson-bali.jpg",
    placeholder: true,
    quote:
      "Our lot care about the water and not much else. Tru actually built the trip around that instead of bolting a surf morning onto a standard itinerary, which is what everyone else offered us.",
  },
  {
    slug: "amigas-y-mas", name: "Amigas Y M\u00e1s Social", what: "Latina travel social", w: 480, h: 480,
    photo: "https://cdn.trutravels.com/images/cusco-markets.jpg",
    placeholder: true,
    quote:
      "Half our community had never travelled outside their own country. Knowing there was someone local with them the whole way is the thing that turned a maybe into a booking.",
  },
  {
    slug: "someday-travel-club", name: "Someday Travel Club", what: "Solo travel club", w: 480, h: 171,
    photo: "https://cdn.trutravels.com/thailand/longtail-boat.jpg",
    placeholder: true,
    quote:
      "Everyone booked on their own and came home with a group chat that is somehow still going a year later. That is the entire product as far as our members are concerned.",
  },
  {
    slug: "dwh", name: "DWH", what: "Creator collective", w: 378, h: 480,
    photo: "https://cdn.trutravels.com/south-korea/seoul-day-4.jpg",
    placeholder: true,
    quote:
      "The links just work. We post, people book, and the number we see at the end of the month is the number we expected \u2014 which is not something we can say about every programme we\u2019ve run.",
  },
  {
    slug: "we-got-you-boo", name: "We Got You Boo", what: "Womens travel community", w: 480, h: 480,
    photo: "https://cdn.trutravels.com/indonesia/pink-beach-komodo-islands.jpg",
    placeholder: true,
    quote:
      "Nobody asked us to change how we talk to our audience. They sent the assets, answered questions fast, and otherwise got out of the way. That is rarer than it should be.",
  },
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
