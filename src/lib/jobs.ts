/**
 * Open roles.
 *
 * Source: trutravels.com/join-the-crew/jobs — read off the live page rather than
 * retyped, so the wording is the real wording. What changes here is the SHAPE:
 * the live page hides everything behind a bare accordion title and runs the body
 * as one wall of text, so each posting is split into typed parts the board and
 * the detail view can lay out properly.
 *
 *   facts     the Location / Department / Reports to block, which the live page
 *             runs as a paragraph of "Label: value" lines
 *   hook      one line shown on the collapsed card — the live board shows nothing
 *   wins      "what success looks like", which reads as bullets on the live page
 *             but is really a set of named outcomes, so each keeps its own name
 *   groups    responsibilities that come pre-grouped under sub-headings
 *   musts /   "Requirements" and "Preferred Qualifications & Experience", shown
 *   nices     side by side so the difference between them is obvious
 *
 * Roles 2 and 3 carry their real facts, hook, nutshell and responsibility
 * groups. Their remaining sections are not transcribed in full — paste the rest
 * in from the source before the board goes live.
 *
 * Mirrored by converted/.build/jobs_data.py for the static build.
 */

export const APPLY_EMAIL = "recruitment@trutravels.com";
export const APPLY_CONTACT = "Roxanne";

/**
 * The five core values, each with its brand lockup (pink circular icon + navy
 * wordmark). The navy keylines drop out against the dark page, so the artwork
 * needs no dark-background variant. All five PNGs are trimmed and normalised to
 * a 360px height, so a fixed CSS height keeps every icon the same size while
 * each wordmark keeps its own width.
 *
 * NOTE: the live job posting lists four and omits "Live The Dream". Included
 * here because the values page has five.
 */
export const VALUES = [
  { name: "We Don't Do Average", asset: "we-dont-do-average", w: 1390, h: 360 },
  { name: "For The Benefit Of All", asset: "for-the-benefit-of-all", w: 1639, h: 360 },
  { name: "Create Opportunity", asset: "create-opportunity", w: 1502, h: 360 },
  { name: "We Are Family", asset: "we-are-family", w: 1047, h: 360 },
  { name: "Live The Dream", asset: "live-the-dream", w: 1262, h: 360 },
];

export const EQUAL_OPPS =
  "We are committed to building a team that reflects the diverse communities we serve. A wide range of perspectives, backgrounds and experiences makes us stronger, and we actively encourage applications from candidates of all backgrounds. If you're excited about this role but your experience doesn't line up with every point above, we'd still love to hear from you — skills can be developed; curiosity, ownership and a willingness to learn matter just as much.";

export type Job = {
  slug: string;
  title: string;
  suffix?: string;
  /** Short enough for a tag and a filter chip — the facts rail carries the full wording. */
  location: string;
  department: string;
  type: string;
  hook: string;
  facts: [string, string][];
  nutshell: string[];
  wins?: [string, string][];
  respIntro?: string;
  responsibilities?: string[];
  groups?: [string, string[]][];
  suitsIntro?: string;
  suits?: string[];
  musts?: string[];
  nices?: string[];
  matters?: string[];
  mattersQuote?: string;
};

export const JOBS: Job[] = [
  {
    slug: "accounts-payable-assistant",
    title: "Accounts Payable Assistant",
    suffix: "Fixed-Term Maternity Cover",
    location: "Dalung, Bali",
    department: "Finance",
    type: "Fixed-term",
    hook: "Keep the day-to-day finance operation running — supplier invoices, payments, reconciliations and month-end — covering maternity leave from September 2026.",
    facts: [
      ["Location", "Dalung, Bali"],
      ["Department", "Finance"],
      ["Reports to", "Junior Accountant"],
      ["Role type", "Fixed-term maternity cover"],
      ["Contract period", "September 2026 – January 2027"],
      ["Start date", "September 2026, or as soon as possible"],
    ],
    nutshell: [
      "We're looking for a motivated, organised and detail-oriented Accounts Payable Assistant to join our Finance team in Bali on a fixed-term basis, providing maternity cover from September 2026 to January 2027.",
      "You'll play an important role in keeping our day-to-day finance operations running smoothly, supporting the team with supplier invoices, payments, reconciliations, expense tracking and month-end activities.",
      "This is a brilliant opportunity for someone who enjoys working with numbers, has a keen eye for detail and wants to build hands-on experience within a fast-paced, international travel business. You'll work closely with colleagues across Finance, Reservations and other teams, giving you great exposure to how finance supports the wider operation.",
      "**You don't need to know everything from day one.** We're looking for someone who is organised, curious, reliable and keen to learn, with the confidence to ask questions and take ownership of their work.",
    ],
    wins: [
      ["Accurate Accounts Payable", "Supplier invoices are reviewed, processed and recorded accurately, with the right supporting documentation and account coding."],
      ["Payments Stay On Track", "Payment information is organised and up to date, helping the team make accurate and timely supplier payments."],
      ["Records We Can Rely On", "Expense trackers, payment records and financial documentation are complete, organised and easy to follow."],
      ["A Smooth Month-End", "Actual costs, accruals and supporting information are recorded accurately and provided on time to support month-end reporting."],
      ["Great Cross-Team Communication", "You build positive working relationships with Finance, Reservations and other teams, following up on missing information and helping resolve queries quickly."],
      ["Continuous Improvement", "You spot opportunities to make everyday finance processes simpler, clearer and more efficient — and aren't afraid to share your ideas."],
    ],
    respIntro:
      "As our Accounts Payable Assistant, you'll support the day-to-day accounts payable function and the wider Finance team. Your responsibilities will include:",
    responsibilities: [
      "Reviewing supplier invoices to ensure they are accurate, complete and supported by the appropriate documentation.",
      "Supporting the processing, tracking and recording of supplier invoices and payments.",
      "Checking invoice information against internal records and following up on any discrepancies or missing details.",
      "Coordinating with the Reservations, Finance and wider operational teams to obtain invoices, approvals and supporting documentation.",
      "Uploading approved supplier invoices into Xero, ensuring the correct supplier and account coding.",
      "Providing general administrative support to the Finance team when required.",
      "Working collaboratively with colleagues across the business to help keep finance processes running smoothly.",
      "Identifying and sharing ideas for improving accounts payable processes, accuracy and efficiency.",
      "Carrying out other reasonable finance-related duties in support of the team during the maternity cover period.",
    ],
    suitsIntro: "You'll probably love this role if you:",
    suits: [
      "Have an interest in accounting, finance or business operations and want to develop your practical experience.",
      "Enjoy working with numbers and have a strong eye for detail.",
      "Are organised and comfortable managing multiple tasks and deadlines.",
      "Take pride in getting things right, and will double-check something rather than simply assuming.",
      "Are confident using spreadsheets and working with financial information.",
      "Communicate clearly and professionally with different teams and stakeholders.",
      "Are comfortable following up when information or documentation is missing.",
      "Are curious and willing to learn new systems, processes and ways of working.",
      "Can handle confidential and sensitive information responsibly.",
      "Are comfortable in a fast-moving environment where priorities can occasionally change.",
      "Enjoy working as part of a collaborative team while also being comfortable working independently.",
    ],
    musts: [
      "Based in Bali, or able to work from our Dalung, Bali location for the duration of the contract.",
      "Available for the full maternity cover period, September 2026 to January 2027.",
      "Good numerical skills and strong attention to detail.",
      "Good written and verbal communication skills.",
      "Basic to intermediate knowledge of Microsoft Excel and/or Google Sheets.",
      "Comfortable working with digital systems and learning new software.",
      "Able to organise your workload, meet deadlines and maintain accurate records.",
      "Professional approach to handling confidential financial and business information.",
      "Working proficiency in English.",
    ],
    nices: [
      "A qualification, ongoing study or recent graduation in Accounting, Finance, Business Administration or a related field.",
      "Previous experience in an accounts payable, finance, bookkeeping or administrative role.",
      "Experience processing invoices, payments or expense records.",
      "Previous experience using Xero or another accounting system.",
      "Experience working with spreadsheets, including basic formulas and data management.",
      "Experience within travel, tourism, hospitality or another fast-paced international business.",
    ],
    mattersQuote: "It might all happen behind the scenes, but the impact reaches right across Tru.",
    matters: [
      "Behind every incredible TruTravels experience is a huge amount happening behind the scenes, and strong financial processes are a big part of keeping everything moving.",
      "Our suppliers and partners are essential to the experiences we create around the world, and accurate invoice processing, reliable financial records and timely payments help keep those relationships strong.",
      "As our Accounts Payable Assistant, you'll help make sure the detail is taken care of — supporting accurate reporting, strong supplier relationships and a Finance team that can rely on its numbers.",
    ],
  },
  {
    slug: "philippines-reservations-assistant",
    title: "Philippines Reservations Assistant",
    suffix: "Fixed-Term Contract",
    location: "Malaybalay, Philippines",
    department: "Operations",
    type: "Fixed-term",
    hook: "Book and confirm everything a Philippines tour runs on — accommodation, transport, domestic flights and activities — on a six-month contract.",
    facts: [
      ["Location", "Malaybalay, Philippines"],
      ["Department", "Operations / Reservations"],
      ["Role type", "Fixed-term contract"],
      ["Contract length", "6 months"],
    ],
    nutshell: [
      "The Philippines Reservations Assistant is responsible for supporting the accurate and timely booking of all services required for tours operating across the Philippines. Working closely with the Reservations, Operations and Sales teams, the role helps ensure that accommodation, transport, domestic flights, activities and other tour services are correctly reserved and confirmed in line with each itinerary.",
      "This is a detail-focused operational role requiring strong organisation, accuracy and communication. The Reservations Assistant acts as an important link between internal teams, local suppliers, Tour Leaders and managers.",
    ],
    groups: [
      ["Reservations & Booking Management", [
        "Work closely with the Operations teams to secure and confirm accurate bookings for all Philippines tours.",
        "Book and manage accommodation, domestic flights, transportation, activities and transfers according to each itinerary.",
        "Input and update reservations received through all booking channels, ensuring information is accurate and complete.",
        "Process booking amendments, cancellations and changes, communicating updates promptly to relevant teams and suppliers.",
        "Monitor outstanding reservations and follow up with suppliers so services are confirmed within required timelines.",
      ]],
      ["Supplier & Operational Coordination", [
        "Communicate regularly with hotels, transport providers, activity suppliers and other local partners regarding availability and confirmations.",
        "Maintain clear communication with suppliers so tour requirements are understood and met.",
      ]],
      ["Administration & Documentation", [
        "Keep customer and tour information — flight details, arrival times, check-in dates — accurate and up to date.",
      ]],
      ["Cross-Team Communication", [
        "Act as the link between Reservations, Operations, Sales, Tour Leaders and managers on anything affecting a booking.",
      ]],
    ],
  },
  {
    slug: "local-legend-team-lead",
    title: "Local Legend Team Lead",
    suffix: "Indonesia / Thailand",
    location: "Bali / Thailand",
    department: "On-Tour Experience",
    type: "Contractor",
    hook: "Keep leading trips, and start leading the people who lead them — coaching, onboarding and backing the Local Legends in your destination.",
    facts: [
      ["Location", "In destination (Bali / Thailand)"],
      ["Department", "On-Tour Experience"],
      ["Role type", "Independent contractor"],
      ["Start date", "August / September 2026"],
    ],
    nutshell: [
      "At TruTravels, we believe unforgettable trips start with unforgettable people. We're looking for passionate, energetic and experienced Team Leads to help us keep raising the bar for our travellers and our Local Legend community.",
      "This is a brilliant opportunity for someone who loves being on the road, thrives on creating incredible experiences and wants to take the next step into leadership — **without stepping away from the part of the job they love most.**",
      "You'll be leading amazing TruTravels tours while taking on greater responsibility for supporting, coaching and developing the Local Legends around you.",
    ],
    groups: [
      ["Leading Unforgettable Tours", [
        "Keep doing what our Local Legends do best — delivering incredible trips and creating memorable experiences for travellers.",
      ]],
      ["Supporting & Developing Our Local Legends", [
        "Act as a trusted point of support for Local Legends in your destination, helping people navigate challenges on the road.",
      ]],
      ["Training & Onboarding", [
        "Welcome and develop new Local Legends, supporting onboarding and refresher training and sharing what you know.",
      ]],
      ["Championing The Guest Experience", [
        "Help review guest feedback and keep the traveller experience at the heart of every decision.",
      ]],
      ["Supporting Smooth Operations", [
        "Help keep things running behind the scenes, supporting Local Legends with day-to-day operational questions.",
      ]],
    ],
    suitsIntro:
      "We're much more interested in how you show up than in ticking every box on a traditional job description. You'll probably thrive here if:",
    suits: [
      "People naturally turn to you for advice, and you lead by example rather than by title.",
      "You still love being on the road and have no interest in leaving it behind.",
      "You're experienced enough to coach others through a bad day on tour.",
    ],
  },
];

/** Filter options with real counts — never offer a filter that returns nothing. */
export function facetCounts(key: "department" | "location") {
  const counts = new Map<string, number>();
  for (const j of JOBS) counts.set(j[key], (counts.get(j[key]) ?? 0) + 1);
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}
