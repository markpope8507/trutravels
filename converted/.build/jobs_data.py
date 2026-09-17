"""
Open roles, structured.

Source: trutravels.com/join-the-crew/jobs — read off the live page rather than
retyped, so the wording is the real wording. What changes here is the SHAPE:
the live page hides everything behind a bare accordion title and runs the body
as one wall of text, so this splits each posting into typed parts the board and
the detail view can lay out properly.

  facts     the Location / Department / Reports to / … block, which the live
            page runs as a paragraph of "Label: value" lines
  hook      one line shown on the collapsed card — the live board shows nothing
  wins      "what success looks like", which reads as bullets on the live page
            but is really a set of named outcomes, so each keeps its own name
  groups    responsibilities that come pre-grouped under sub-headings
  musts /   "Requirements" and "Preferred Qualifications & Experience", shown
  nices     side by side so the difference between them is obvious

Roles 2 and 3 carry their real facts, hook, nutshell and responsibility groups.
Their remaining sections are not transcribed in full — paste the rest in from
the source when the board goes live.

Shared by build_careers.py (the page) and the job-listing component demo.
"""

APPLY_EMAIL = "recruitment@trutravels.com"
APPLY_CONTACT = "Roxanne"

# The five values, matching src/app/about/our-values — chips link there rather
# than restating the list inside every posting.
VALUES = [
    "We Don't Do Average",
    "For The Benefit Of All",
    "Create Opportunity",
    "We Are Family",
]

EQUAL_OPPS = (
    "We are committed to building a team that reflects the diverse communities we serve. A wide "
    "range of perspectives, backgrounds and experiences makes us stronger, and we actively encourage "
    "applications from candidates of all backgrounds. If you&rsquo;re excited about this role but your "
    "experience doesn&rsquo;t line up with every point above, we&rsquo;d still love to hear from you &mdash; "
    "skills can be developed; curiosity, ownership and a willingness to learn matter just as much."
)

JOBS = [
    {
        "slug": "accounts-payable-assistant",
        "title": "Accounts Payable Assistant",
        "suffix": "Fixed-Term Maternity Cover",
        "location": "Dalung, Bali",
        "department": "Finance",
        "type": "Fixed-term",
        "hook": (
            "Keep the day-to-day finance operation running &mdash; supplier invoices, payments, "
            "reconciliations and month-end &mdash; covering maternity leave from September 2026."
        ),
        "facts": [
            ("Location", "Dalung, Bali"),
            ("Department", "Finance"),
            ("Reports to", "Junior Accountant"),
            ("Role type", "Fixed-term maternity cover"),
            ("Contract period", "September 2026 &ndash; January 2027"),
            ("Start date", "September 2026, or as soon as possible"),
        ],
        "nutshell": [
            "We&rsquo;re looking for a motivated, organised and detail-oriented Accounts Payable Assistant to "
            "join our Finance team in Bali on a fixed-term basis, providing maternity cover from September "
            "2026 to January 2027.",
            "You&rsquo;ll play an important role in keeping our day-to-day finance operations running smoothly, "
            "supporting the team with supplier invoices, payments, reconciliations, expense tracking and "
            "month-end activities.",
            "This is a brilliant opportunity for someone who enjoys working with numbers, has a keen eye for "
            "detail and wants to build hands-on experience within a fast-paced, international travel business. "
            "You&rsquo;ll work closely with colleagues across Finance, Reservations and other teams, giving you "
            "great exposure to how finance supports the wider operation.",
            "<strong>You don&rsquo;t need to know everything from day one.</strong> We&rsquo;re looking for someone "
            "who is organised, curious, reliable and keen to learn, with the confidence to ask questions and "
            "take ownership of their work.",
        ],
        "wins": [
            ("Accurate Accounts Payable",
             "Supplier invoices are reviewed, processed and recorded accurately, with the right supporting "
             "documentation and account coding."),
            ("Payments Stay On Track",
             "Payment information is organised and up to date, helping the team make accurate and timely "
             "supplier payments."),
            ("Records We Can Rely On",
             "Expense trackers, payment records and financial documentation are complete, organised and easy "
             "to follow."),
            ("A Smooth Month-End",
             "Actual costs, accruals and supporting information are recorded accurately and provided on time "
             "to support month-end reporting."),
            ("Great Cross-Team Communication",
             "You build positive working relationships with Finance, Reservations and other teams, following "
             "up on missing information and helping resolve queries quickly."),
            ("Continuous Improvement",
             "You spot opportunities to make everyday finance processes simpler, clearer and more efficient "
             "&mdash; and aren&rsquo;t afraid to share your ideas."),
        ],
        "resp_intro": (
            "As our Accounts Payable Assistant, you&rsquo;ll support the day-to-day accounts payable function "
            "and the wider Finance team. Your responsibilities will include:"
        ),
        "responsibilities": [
            "Reviewing supplier invoices to ensure they are accurate, complete and supported by the "
            "appropriate documentation.",
            "Supporting the processing, tracking and recording of supplier invoices and payments.",
            "Checking invoice information against internal records and following up on any discrepancies or "
            "missing details.",
            "Coordinating with the Reservations, Finance and wider operational teams to obtain invoices, "
            "approvals and supporting documentation.",
            "Uploading approved supplier invoices into Xero, ensuring the correct supplier and account coding.",
            "Providing general administrative support to the Finance team when required.",
            "Working collaboratively with colleagues across the business to help keep finance processes "
            "running smoothly.",
            "Identifying and sharing ideas for improving accounts payable processes, accuracy and efficiency.",
            "Carrying out other reasonable finance-related duties in support of the team during the maternity "
            "cover period.",
        ],
        "suits_intro": "You&rsquo;ll probably love this role if you:",
        "suits": [
            "Have an interest in accounting, finance or business operations and want to develop your "
            "practical experience.",
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
        "musts": [
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
        "nices": [
            "A qualification, ongoing study or recent graduation in Accounting, Finance, Business "
            "Administration or a related field.",
            "Previous experience in an accounts payable, finance, bookkeeping or administrative role.",
            "Experience processing invoices, payments or expense records.",
            "Previous experience using Xero or another accounting system.",
            "Experience working with spreadsheets, including basic formulas and data management.",
            "Experience within travel, tourism, hospitality or another fast-paced international business.",
        ],
        "matters_quote": "It might all happen behind the scenes, but the impact reaches right across Tru.",
        "matters": [
            "Behind every incredible TruTravels experience is a huge amount happening behind the scenes, and "
            "strong financial processes are a big part of keeping everything moving.",
            "Our suppliers and partners are essential to the experiences we create around the world, and "
            "accurate invoice processing, reliable financial records and timely payments help keep those "
            "relationships strong.",
            "As our Accounts Payable Assistant, you&rsquo;ll help make sure the detail is taken care of &mdash; "
            "supporting accurate reporting, strong supplier relationships and a Finance team that can rely on "
            "its numbers.",
        ],
    },
    {
        "slug": "philippines-reservations-assistant",
        "title": "Philippines Reservations Assistant",
        "suffix": "Fixed-Term Contract",
        "location": "Malaybalay, Philippines",
        "department": "Operations",
        "type": "Fixed-term",
        "hook": (
            "Book and confirm everything a Philippines tour runs on &mdash; accommodation, transport, domestic "
            "flights and activities &mdash; on a six-month contract."
        ),
        "facts": [
            ("Location", "Malaybalay, Philippines"),
            ("Department", "Operations / Reservations"),
            ("Role type", "Fixed-term contract"),
            ("Contract length", "6 months"),
        ],
        "nutshell": [
            "The Philippines Reservations Assistant is responsible for supporting the accurate and timely "
            "booking of all services required for tours operating across the Philippines. Working closely with "
            "the Reservations, Operations and Sales teams, the role helps ensure that accommodation, "
            "transport, domestic flights, activities and other tour services are correctly reserved and "
            "confirmed in line with each itinerary.",
            "This is a detail-focused operational role requiring strong organisation, accuracy and "
            "communication. The Reservations Assistant acts as an important link between internal teams, local "
            "suppliers, Tour Leaders and managers.",
        ],
        "groups": [
            ("Reservations &amp; Booking Management", [
                "Work closely with the Operations teams to secure and confirm accurate bookings for all "
                "Philippines tours.",
                "Book and manage accommodation, domestic flights, transportation, activities and transfers "
                "according to each itinerary.",
                "Input and update reservations received through all booking channels, ensuring information is "
                "accurate and complete.",
                "Process booking amendments, cancellations and changes, communicating updates promptly to "
                "relevant teams and suppliers.",
                "Monitor outstanding reservations and follow up with suppliers so services are confirmed "
                "within required timelines.",
            ]),
            ("Supplier &amp; Operational Coordination", [
                "Communicate regularly with hotels, transport providers, activity suppliers and other local "
                "partners regarding availability and confirmations.",
                "Maintain clear communication with suppliers so tour requirements are understood and met.",
            ]),
            ("Administration &amp; Documentation", [
                "Keep customer and tour information &mdash; flight details, arrival times, check-in dates &mdash; "
                "accurate and up to date.",
            ]),
            ("Cross-Team Communication", [
                "Act as the link between Reservations, Operations, Sales, Tour Leaders and managers on "
                "anything affecting a booking.",
            ]),
        ],
    },
    {
        "slug": "local-legend-team-lead",
        "title": "Local Legend Team Lead",
        "suffix": "Indonesia / Thailand",
        # Short enough to sit in a tag and a filter chip; the facts rail below
        # carries the full "In destination (Bali / Thailand)" wording.
        "location": "Bali / Thailand",
        "department": "On-Tour Experience",
        "type": "Contractor",
        "hook": (
            "Keep leading trips, and start leading the people who lead them &mdash; coaching, onboarding and "
            "backing the Local Legends in your destination."
        ),
        "facts": [
            ("Location", "In destination (Bali / Thailand)"),
            ("Department", "On-Tour Experience"),
            ("Role type", "Independent contractor"),
            ("Start date", "August / September 2026"),
        ],
        "nutshell": [
            "At TruTravels, we believe unforgettable trips start with unforgettable people. We&rsquo;re looking "
            "for passionate, energetic and experienced Team Leads to help us keep raising the bar for our "
            "travellers and our Local Legend community.",
            "This is a brilliant opportunity for someone who loves being on the road, thrives on creating "
            "incredible experiences and wants to take the next step into leadership &mdash; <strong>without "
            "stepping away from the part of the job they love most.</strong>",
            "You&rsquo;ll be leading amazing TruTravels tours while taking on greater responsibility for "
            "supporting, coaching and developing the Local Legends around you.",
        ],
        "groups": [
            ("Leading Unforgettable Tours", [
                "Keep doing what our Local Legends do best &mdash; delivering incredible trips and creating "
                "memorable experiences for travellers.",
            ]),
            ("Supporting &amp; Developing Our Local Legends", [
                "Act as a trusted point of support for Local Legends in your destination, helping people "
                "navigate challenges on the road.",
            ]),
            ("Training &amp; Onboarding", [
                "Welcome and develop new Local Legends, supporting onboarding and refresher training and "
                "sharing what you know.",
            ]),
            ("Championing The Guest Experience", [
                "Help review guest feedback and keep the traveller experience at the heart of every decision.",
            ]),
            ("Supporting Smooth Operations", [
                "Help keep things running behind the scenes, supporting Local Legends with day-to-day "
                "operational questions.",
            ]),
        ],
        "suits_intro": (
            "We&rsquo;re much more interested in how you show up than in ticking every box on a traditional job "
            "description. You&rsquo;ll probably thrive here if:"
        ),
        "suits": [
            "People naturally turn to you for advice, and you lead by example rather than by title.",
            "You still love being on the road and have no interest in leaving it behind.",
            "You&rsquo;re experienced enough to coach others through a bad day on tour.",
        ],
    },
]


def by_slug(slug):
    for j in JOBS:
        if j["slug"] == slug:
            return j
    raise KeyError(slug)
