// ============================================================
// MOCK DATA — This replaces a real database for the prototype.
// Every page pulls from here so content is easy to update.
// ============================================================

export type TravelStyle = "classic" | "backpacker" | "flashpacker" | "multi_country" | "limited_edition";

export const travelStyleConfig: Record<TravelStyle, { label: string; color: string; icon: string; logo: string; description: string }> = {
  classic: {
    label: "Classic",
    color: "#2172D5",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    logo: "/classic-logo.png",
    description: "We've perfected the balance between culture, adventure, beaches and parties. A high level of inclusions at a low cost. Highlights, hotspots & hidden gems are crafted into each itinerary with our own TruExclusives. We stay in a variety of different accommodations such as hotels, hostels, homestays, beach huts & even boats.",
  },
  backpacker: {
    label: "Backpacker",
    color: "#6BD495",
    icon: "M20 7h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 4h4v3h-4V4z",
    logo: "/backpacker-logo.png",
    description: "Maximum adventure, minimum cost. Hostels, street food, local transport, and raw experiences — designed for travellers who want to stretch their budget without missing out.",
  },
  flashpacker: {
    label: "Flashpacker",
    color: "#FF3F99",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    logo: "/flashpacker-logo.png",
    description: "All the adventure with an upgrade. Think boutique hotels, premium experiences, and a few extra touches that make every day feel special — for those who like comfort with their chaos.",
  },
  multi_country: {
    label: "Multi Country",
    color: "#FCA501",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    logo: "/multi-country-logo.png",
    description: "Why pick one country when you can have several? Cross borders, experience contrasting cultures, and pack more into every trip with seamless multi-country itineraries.",
  },
  limited_edition: {
    label: "Limited Edition",
    color: "#FF3F99",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    logo: "/limited-edition-logo.png",
    description: "Exclusive trips that run only a handful of times. Unique routes, special events, and once-in-a-lifetime experiences you won't find anywhere else. When they're gone, they're gone.",
  },
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  region: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  video?: string;
  tagline: string;
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string; image?: string }[];
  inclusions?: {
    accommodation?: string;
    transport?: string;
    meals?: string;
    leader?: string;
    activities: { name: string; experienceType?: string }[];
    truExclusive?: { name: string; description: string };
    extras?: string[];
  };
  departures?: {
    date: string;
    price: number;
    originalPrice?: number;
    status: "available" | "almost-full" | "full" | "discount";
    discount?: string;
  }[];
  depositPrice?: number;
  startLocation?: string;
  endLocation?: string;
  accommodation?: { title: string; description: string; image: string }[];
  travelStyle: TravelStyle;
  memberOnly?: boolean;
  rating?: number;
  reviewCount?: number;
};

export type StoryType = "story" | "guide" | "tips" | "exclusive";

export type Story = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  memberOnly?: boolean;
  type: StoryType;
  topics: string[];
  lifeMoments: string[];
  destinations: string[];
  readTime: number;
};

// Filter taxonomies used on the Stories landing page
export const storyTopics = [
  "Adventure",
  "Food & Culture",
  "Solo Travel",
  "Wellness",
  "Sustainability",
  "Nightlife",
  "Budget Tips",
  "Local Stories",
] as const;

export const storyLifeMoments = [
  "Gap Year",
  "First Big Trip",
  "Career Break",
  "Quarter-Life Reset",
  "Post-Uni",
  "Sabbatical",
] as const;

export const storyLifeMomentEmojis: Record<string, string> = {
  "Gap Year": "🌍",
  "First Big Trip": "🎒",
  "Career Break": "🌴",
  "Quarter-Life Reset": "🔄",
  "Post-Uni": "🎓",
  "Sabbatical": "🧘",
};

export const storyTopicEmojis: Record<string, string> = {
  "Adventure": "🏔️",
  "Food & Culture": "🍜",
  "Solo Travel": "🚶",
  "Wellness": "🧘",
  "Sustainability": "🌱",
  "Nightlife": "🌃",
  "Budget Tips": "💸",
  "Local Stories": "📍",
};

export const storyTypes: { value: StoryType; label: string }[] = [
  { value: "story", label: "Stories" },
  { value: "guide", label: "Guides" },
  { value: "tips", label: "Tips" },
  { value: "exclusive", label: "Member Exclusive" },
];

export const trips: Trip[] = [
  {
    id: "thailand-island-hopper",
    title: "Thailand Island Hopper",
    destination: "Thailand",
    region: "Southeast Asia",
    duration: "14 Days",
    price: 736,
    originalPrice: 899,
    inclusions: {
      accommodation: "13 nights in hotels, floating bungalows & beach bungalows",
      transport: "All transport included — private van, overnight train, 2x ferry transfers",
      meals: "4 breakfasts, 4 lunches, 1 dinner",
      leader: "Professional tour leader throughout",
      activities: [
        { name: "Bangkok river cruise & temple visits", experienceType: "local-lens" },
        { name: "Khao Sok National Park exploration", experienceType: "unplugged" },
        { name: "Floating bungalows stay", experienceType: "tru-ly-unique" },
        { name: "Phi Phi Islands boat trip", experienceType: "bucket-list" },
        { name: "Traditional Thai massage", experienceType: "unplugged" },
        { name: "Overnight train journey", experienceType: "local-lens" },
        { name: "Boat trip & snorkelling around Koh Phangan", experienceType: "bucket-list" },
        { name: "Bottle Beach viewpoint hike", experienceType: "rise-up" },
        { name: "Muay Thai lesson", experienceType: "rise-up" },
        { name: "Koh Tao & Koh Nang Yuan day trip", experienceType: "bucket-list" },
        { name: "Phuket nightlife" },
      ],
      truExclusive: {
        name: "Bottle Beach Experience",
        description: "Secluded beach stay with private fire show, cocktails, and beach bonfire dinner — a Tru-ly Unique experience you won't find anywhere else.",
      },
      extras: ["Help with onward travel arrangements on final day"],
    },
    departures: [
      { date: "2026-04-12", price: 736, originalPrice: 899, status: "discount", discount: "18% off" },
      { date: "2026-04-26", price: 736, originalPrice: 899, status: "discount", discount: "18% off" },
      { date: "2026-05-10", price: 799, originalPrice: 899, status: "available" },
      { date: "2026-05-24", price: 799, originalPrice: 899, status: "almost-full" },
      { date: "2026-06-07", price: 736, originalPrice: 899, status: "discount", discount: "18% off" },
      { date: "2026-06-21", price: 799, originalPrice: 899, status: "available" },
      { date: "2026-07-05", price: 849, originalPrice: 899, status: "available" },
      { date: "2026-07-19", price: 849, originalPrice: 899, status: "almost-full" },
      { date: "2026-08-02", price: 899, status: "available" },
      { date: "2026-08-16", price: 899, status: "full" },
      { date: "2026-08-30", price: 849, originalPrice: 899, status: "available" },
      { date: "2026-09-13", price: 736, originalPrice: 899, status: "discount", discount: "18% off" },
      { date: "2026-09-27", price: 799, originalPrice: 899, status: "available" },
      { date: "2026-10-11", price: 799, originalPrice: 899, status: "available" },
      { date: "2026-10-25", price: 849, originalPrice: 899, status: "almost-full" },
      { date: "2026-11-08", price: 899, status: "available" },
      { date: "2026-11-22", price: 899, status: "available" },
      { date: "2026-12-06", price: 899, status: "full" },
      { date: "2026-12-20", price: 899, status: "available" },
    ],
    depositPrice: 150,
    accommodation: [
      {
        title: "Bangkok Hotel",
        description: "Start your trip in a comfortable hotel right in the heart of Bangkok, walking distance from Khao San Road and the city's best street food. Twin-share rooms with AC and hot showers.",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      },
      {
        title: "Khao Sok Floating Bungalows",
        description: "One of the most magical stays on the trip. Wake up on an emerald lake surrounded by towering limestone mountains. Basic but beautiful — hammocks, wooden decks, and water all around you.",
        image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
      },
      {
        title: "Bottle Beach Bungalows",
        description: "Rustic beach bungalows right on the sand at one of the most secluded beaches in Thailand. Fall asleep to the sound of waves and wake up to stunning views. Only accessible by boat.",
        image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80",
      },
      {
        title: "Koh Tao Beach Resort",
        description: "Your home base on the diving capital of Thailand. Simple, clean rooms steps from Sairee Beach — the island's best strip of sand, restaurants, and beach bars.",
        image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
      },
    ],
    startLocation: "Bangkok",
    endLocation: "Phuket",
    travelStyle: "classic",
    rating: 4.9,
    reviewCount: 305,
    image: "/images/thailand-island-hopper-hero.png",
    tagline: "Paradise found, one island at a time",
    description:
      "From the neon buzz of Bangkok to the crystal waters of the Andaman Sea. Explore hidden lagoons, sleep under stars on the beach, and discover why Thailand is every traveller's first love.",
    highlights: [
      "Full Moon Party on Koh Phangan",
      "Kayaking through Ang Thong Marine Park",
      "Thai cooking class in Chiang Mai",
      "Snorkelling at Koh Tao",
    ],
    itinerary: [
      { day: 1, title: "Welcome to Thailand!", description: "A city with as much history as it has traffic, more sticky rice than you could ever imagine. Tonight you'll meet your group and tour leader on the famous Khao San Road — grab some local street food, sink a few cold ones, and get to know the people you're about to have the time of your life with.", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80" },
      { day: 2, title: "Bangkok Temples & River Cruise", description: "Start with a traditional boat journey through Bangkok's back canals and along the Chao Phraya River — it's like seeing a completely different side of the city. Visit the stunning Wat Arun temple glowing in the morning light, then head to Wat Pho to see the famous reclining Buddha. Tonight, it's your call — rooftop cocktails or dive into Bangkok's legendary nightlife.", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80" },
      { day: 3, title: "Massage & Overnight Train", description: "You've earned a treat — kick off the day with a traditional Thai massage before boarding the overnight train heading south towards Khao Sok National Park. There's something magical about falling asleep to the rhythm of the rails, watching Thailand's countryside slip by through the window.", image: "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=800&q=80" },
      { day: 4, title: "Khao Sok National Park", description: "Wake up to one of Thailand's best-kept secrets. Khao Sok is all emerald lakes, towering limestone mountains, and floating bungalows that feel like something from a movie. Spend the day kayaking across the lake, swimming in impossibly green water, and soaking it all in. Dinner tonight is a Thai buffet at the floating restaurant — doesn't get much better than this.", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80" },
      { day: 5, title: "Bottle Beach Experience", description: "One of our absolute favourite spots in the world — Bottle Beach. It's a stunningly beautiful little beach only accessible by boat, and today it's all yours. Swim, play volleyball, trek through the jungle, or just do absolutely nothing. As the sun goes down, we put on a TruExclusive evening — dinner on the sand, cocktails, and a private fire show. Pure magic.", image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80" },
      { day: 6, title: "Morning Chill & Muay Thai", description: "No alarms today. Sleep in, soak up the beach vibes, or hike up to the Bottle Beach viewpoint for jaw-dropping views across the coast. In the afternoon, get your hands wrapped for an intro lesson in Muay Thai — Thailand's national sport. Whether you're a natural or completely useless, it's an absolute laugh.", image: "https://images.unsplash.com/photo-1504276048855-f3d1e4c69a17?w=800&q=80" },
      { day: 7, title: "Koh Phangan Island Boat Trip", description: "Jump on a boat and spend the day island-hopping around Koh Phangan's stunning coastline. Stop off at secret snorkelling spots, swim in crystal-clear coves, and soak up the sun on deck. Lunch is included on the boat. Get back to shore just in time for sunset, then head out for dinner and drinks.", image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80" },
      { day: 8, title: "Koh Tao Bound", description: "Speed boat across to Koh Tao — the diving capital of Thailand. Check into your spot near Sairee Beach, lined with cool little restaurants and beach bars. The afternoon is yours to explore — rent a scooter, find a quiet beach, or just wander and take it all in. This island has serious vibes.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
      { day: 9, title: "Koh Nang Yuan Day Trip", description: "Today's a big one. Boat trip to the iconic Koh Nang Yuan — three tiny islands connected by a white sand bar that you've definitely seen on Instagram. Snorkel in some of the clearest water you'll ever see, or just chill on the boat and take in the views. Group dinner tonight followed by beach bar hopping.", image: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&q=80" },
      { day: 10, title: "Get Active or Relax", description: "Your last full day on Koh Tao — make it count. Head to Tanote Bay for some of the island's best swimming, try your hand at wakeboarding or cliff jumping, or just claim a sun lounger and do absolutely nothing. No judgement either way. Soak up every last second of island life.", image: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=80" },
      { day: 11, title: "Travel Day to Phi Phi Islands", description: "Say goodbye to Koh Tao and hop on the afternoon speed boat to the Phi Phi Islands. Check in, freshen up, and get ready for a group dinner on one of the most beautiful islands on the planet. The views here are absolutely unreal — you'll understand when you see them.", image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80" },
      { day: 12, title: "Maya Bay — The Beach", description: "Full-day island excursion to Maya Bay — the filming location from 'The Beach' with Leonardo DiCaprio. Snorkel at Monkey Beach, explore Viking Cave, and cruise past towering limestone cliffs. Lunch on the boat, sunset views from the deck. This is one of those days you'll never forget.", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" },
      { day: 13, title: "Phuket", description: "Optional early morning viewpoint hike in Phi Phi — worth the effort if you're up for it. Then transfer to Phuket for your final afternoon of freedom. Relax by the pool, hit the beach, or explore the town. Tonight is the big farewell — group dinner followed by a proper send-off night out in Patong.", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80" },
      { day: 14, title: "Chilled Check Out", description: "And just like that, it's over. But not really — because you've just made friends for life, filled your camera roll with bangers, and had the kind of adventure most people only dream about. We'll help you sort onward travel, swap details with the crew, and say those bittersweet goodbyes. See you on the next one.", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80" },
    ],
  },
  // ============ THAILAND TOURS ============
  {
    id: "thailand-experience",
    title: "Thailand Experience",
    destination: "Thailand",
    region: "Southeast Asia",
    duration: "8 Days",
    price: 487,
    originalPrice: 695,
    startLocation: "Bangkok",
    endLocation: "Koh Phangan",
    travelStyle: "classic",
    rating: 4.8,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    tagline: "The complete mixture of culture, adventure, beaches and parties",
    description: "8 days of everything that makes Thailand incredible. From Bangkok's temples to Koh Phangan's beaches — culture, adventure, and good vibes packed into one week.",
    highlights: ["Bangkok temples & street food", "Overnight train south", "Ang Thong Marine Park", "Beach parties on Koh Phangan"],
    itinerary: [
      { day: 1, title: "Welcome to Bangkok", description: "Meet your group on Khao San Road." },
      { day: 2, title: "Bangkok Temples", description: "Wat Pho, Grand Palace, river cruise." },
      { day: 3, title: "Overnight Train", description: "Head south on the sleeper train." },
      { day: 4, title: "Koh Samui", description: "Beach arrival and island vibes." },
      { day: 5, title: "Ang Thong Marine Park", description: "Kayaking and snorkelling adventure." },
      { day: 6, title: "Koh Phangan", description: "Chill day, optional yoga or hike." },
      { day: 7, title: "Beach Day", description: "Free day to explore the island." },
      { day: 8, title: "Departure", description: "Farewell and onward travel." },
    ],
  },
  { id: "full-moon-party-pack", title: "Full Moon Party Pack", destination: "Thailand", region: "Southeast Asia", duration: "5 Days", price: 473, originalPrice: 525, startLocation: "Koh Phangan", endLocation: "Koh Phangan", travelStyle: "backpacker", rating: 4.7, reviewCount: 312, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", tagline: "The legendary beach party experience", description: "5 days of island life and the legendary Full Moon Party. Beach bars, boat trips, and the biggest party on Earth.", highlights: ["Full Moon Party", "Island boat trips", "Beach bars & nightlife", "Snorkelling"], itinerary: [{ day: 1, title: "Arrive Koh Phangan", description: "Check in and welcome drinks." }, { day: 2, title: "Island Boat Trip", description: "Snorkelling and beach hopping." }, { day: 3, title: "Free Day", description: "Beach, yoga, or explore." }, { day: 4, title: "Full Moon Party", description: "The legendary beach party." }, { day: 5, title: "Departure", description: "Recovery day and goodbyes." }] },
  { id: "full-moon-experience", title: "Full Moon Experience", destination: "Thailand", region: "Southeast Asia", duration: "10 Days", price: 1134, originalPrice: 1260, startLocation: "Bangkok", endLocation: "Koh Phangan", travelStyle: "classic", rating: 4.8, reviewCount: 198, image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80", tagline: "Culture meets the ultimate party", description: "10 days combining Bangkok's cultural highlights with the legendary Full Moon Party on Koh Phangan.", highlights: ["Bangkok temples", "Thai cooking class", "Full Moon Party", "Island hopping"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome dinner and city intro." }, { day: 2, title: "Bangkok Temples", description: "Cultural day in the capital." }, { day: 3, title: "Train South", description: "Overnight sleeper train." }, { day: 4, title: "Khao Sok", description: "National park and floating bungalows." }, { day: 5, title: "Koh Phangan", description: "Island arrival." }, { day: 6, title: "Boat Trip", description: "Snorkelling around the islands." }, { day: 7, title: "Free Day", description: "Beach or explore." }, { day: 8, title: "Full Moon Party", description: "The big night." }, { day: 9, title: "Recovery Day", description: "Chill on the beach." }, { day: 10, title: "Departure", description: "Farewell." }] },
  { id: "northern-thailand-adventure", title: "Northern Thailand Adventure", destination: "Thailand", region: "Southeast Asia", duration: "14 Days", price: 986, originalPrice: 1095, startLocation: "Bangkok", endLocation: "Chiang Mai", travelStyle: "classic", rating: 4.9, reviewCount: 145, image: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=80", tagline: "Elephants, hill tribes, and jungle ziplines", description: "14 days exploring Northern Thailand's mountains, temples, and jungle. Elephant sanctuary, hill-tribe homestay, and Chiang Mai's incredible night markets.", highlights: ["Elephant sanctuary visit", "Hill-tribe homestay", "Jungle zipline", "Chiang Mai night markets"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome dinner." }, { day: 2, title: "Bangkok", description: "Temple tour and street food." }, { day: 3, title: "Ayutthaya", description: "Ancient ruins exploration." }, { day: 4, title: "Train North", description: "Overnight to Chiang Mai." }, { day: 5, title: "Chiang Mai", description: "Temples and cooking class." }, { day: 6, title: "Elephant Sanctuary", description: "Ethical elephant experience." }, { day: 7, title: "Hill Tribe Trek", description: "Jungle trekking to hill-tribe village." }, { day: 8, title: "Hill Tribe Stay", description: "Overnight homestay." }, { day: 9, title: "Jungle Zipline", description: "Treetop adventure." }, { day: 10, title: "Chiang Rai", description: "White Temple and Golden Triangle." }, { day: 11, title: "Pai", description: "Canyon and hot springs." }, { day: 12, title: "Pai", description: "Waterfalls and free time." }, { day: 13, title: "Chiang Mai", description: "Night Bazaar and farewell." }, { day: 14, title: "Departure", description: "Goodbye Northern Thailand." }] },
  { id: "full-moon-island-hopper", title: "Full Moon Island Hopper", destination: "Thailand", region: "Southeast Asia", duration: "16 Days", price: 1328, originalPrice: 1475, startLocation: "Bangkok", endLocation: "Phuket", travelStyle: "classic", rating: 4.8, reviewCount: 167, image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80", tagline: "Southern beaches plus the legendary party", description: "16 days island-hopping through Southern Thailand with the Full Moon Party thrown in. The ultimate beach and party experience.", highlights: ["Full Moon Party", "Phi Phi Islands", "Koh Tao diving", "Phuket nightlife"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }, { day: 2, title: "Bangkok", description: "Temples." }, { day: 3, title: "Train South", description: "Overnight." }, { day: 4, title: "Khao Sok", description: "National park." }, { day: 5, title: "Koh Phangan", description: "Island arrival." }, { day: 6, title: "Boat Trip", description: "Snorkelling." }, { day: 7, title: "Free Day", description: "Beach." }, { day: 8, title: "Full Moon Party", description: "Party night." }, { day: 9, title: "Koh Tao", description: "Diving island." }, { day: 10, title: "Koh Tao", description: "Free day." }, { day: 11, title: "Travel Day", description: "To Phi Phi." }, { day: 12, title: "Phi Phi", description: "Maya Bay." }, { day: 13, title: "Phi Phi", description: "Free day." }, { day: 14, title: "Phuket", description: "Beach day." }, { day: 15, title: "Phuket", description: "Nightlife." }, { day: 16, title: "Departure", description: "Farewell." }] },
  { id: "total-thailand", title: "Total Thailand", destination: "Thailand", region: "Southeast Asia", duration: "27 Days", price: 1505, originalPrice: 2150, startLocation: "Bangkok", endLocation: "Phuket", travelStyle: "classic", rating: 4.9, reviewCount: 89, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", tagline: "The complete Thailand experience", description: "27 days covering every corner of Thailand. North to south, temples to beaches, cities to islands. The ultimate way to see the Land of Smiles.", highlights: ["Everything Thailand has to offer", "North and South", "Full Moon Party", "27 days of adventure"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }] },
  { id: "thailand-backpacker", title: "Thailand Backpacker", destination: "Thailand", region: "Southeast Asia", duration: "10 Days", price: 417, originalPrice: 695, startLocation: "Bangkok", endLocation: "Phuket", travelStyle: "backpacker", rating: 4.7, reviewCount: 256, image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80", tagline: "Maximum adventure, minimum spend", description: "A whirlwind backpacking adventure through Thailand. Hostels, street food, local transport, and raw experiences.", highlights: ["Bangkok street food", "Island beaches", "Budget-friendly", "Local experiences"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }] },
  { id: "songkran-festival", title: "Songkran Festival", destination: "Thailand", region: "Southeast Asia", duration: "7 Days", price: 595, startLocation: "Bangkok", endLocation: "Chiang Mai", travelStyle: "limited_edition", rating: 4.9, reviewCount: 45, image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80", tagline: "The world's largest water fight", description: "Thai New Year — the world's biggest and most epic water fight. 7 days of celebration, culture, and absolute chaos.", highlights: ["Songkran water fight", "Temple ceremonies", "Street parties", "Cultural immersion"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }] },
  // ============ INDONESIA TOURS ============
  { id: "bali-experience", title: "Bali Experience", destination: "Indonesia", region: "Southeast Asia", duration: "10 Days", price: 487, originalPrice: 695, startLocation: "Canggu", endLocation: "Gili Trawangan", travelStyle: "classic", rating: 4.8, reviewCount: 234, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Waterfalls, surfing, temples, and beaches", description: "The essential Bali experience. Surf in Canggu, explore Ubud's temples and rice terraces, trek Mount Batur, and end on the Gili Islands.", highlights: ["Mount Batur sunrise", "Ubud temples", "Surf lessons", "Gili Islands"], itinerary: [{ day: 1, title: "Canggu", description: "Welcome." }, { day: 2, title: "Ubud", description: "Temples and rice terraces." }, { day: 3, title: "Mount Batur", description: "Sunrise trek." }, { day: 4, title: "Nusa Penida", description: "Day trip." }, { day: 5, title: "Canggu", description: "Surf day." }, { day: 6, title: "Gili Islands", description: "Fast boat across." }, { day: 7, title: "Gili Free Day", description: "Snorkel with turtles." }, { day: 8, title: "Gili Free Day", description: "Explore or relax." }, { day: 9, title: "Uluwatu", description: "Clifftop sunset." }, { day: 10, title: "Departure", description: "Farewell." }] },
  { id: "bali-backpacker", title: "Bali Backpacker", destination: "Indonesia", region: "Southeast Asia", duration: "12 Days", price: 297, originalPrice: 495, startLocation: "Uluwatu", endLocation: "Gili Trawangan", travelStyle: "backpacker", rating: 4.7, reviewCount: 178, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "More Bali for your buck", description: "12 days of budget-friendly Bali. All the highlights without breaking the bank.", highlights: ["Budget-friendly", "12 days of Bali", "Gili Islands", "Surf and temples"], itinerary: [{ day: 1, title: "Uluwatu", description: "Welcome." }] },
  { id: "komodo-island-hopper", title: "Komodo Island Hopper", destination: "Indonesia", region: "Southeast Asia", duration: "9 Days", price: 767, originalPrice: 1095, startLocation: "Lombok", endLocation: "Labuan Bajo", travelStyle: "classic", rating: 4.9, reviewCount: 98, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "Dragons, diving, and pristine beaches", description: "9 days sailing through Komodo National Park. Meet real-life dragons, snorkel world-class waters, and sleep on a live-aboard boat.", highlights: ["Komodo dragons", "Live-aboard sailing", "Snorkelling & diving", "Pink Beach"], itinerary: [{ day: 1, title: "Lombok", description: "Welcome." }] },
  { id: "bali-and-beyond", title: "Bali & Beyond", destination: "Indonesia", region: "Southeast Asia", duration: "18 Days", price: 1243, originalPrice: 1775, startLocation: "Canggu", endLocation: "Labuan Bajo", travelStyle: "classic", rating: 4.8, reviewCount: 112, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Bali Experience meets Komodo", description: "18 days combining the best of Bali with the epic Komodo Island Hopper. Temples, surf, dragons, and diving.", highlights: ["Bali highlights", "Komodo dragons", "18 days of adventure", "Live-aboard sailing"], itinerary: [{ day: 1, title: "Canggu", description: "Welcome." }] },
  { id: "bali-sumatra-adventure", title: "Bali & Sumatra Adventure", destination: "Indonesia", region: "Southeast Asia", duration: "18 Days", price: 1397, originalPrice: 1995, startLocation: "Medan", endLocation: "Gili Trawangan", travelStyle: "flashpacker", rating: 4.8, reviewCount: 67, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Crystal waters, culture, and adventure", description: "18 days across Sumatra and Bali. Orangutans, volcanoes, surf, and island paradise.", highlights: ["Orangutan trekking", "Lake Toba", "Bali surf", "Gili Islands"], itinerary: [{ day: 1, title: "Medan", description: "Welcome." }] },
  { id: "sumatra-uncovered", title: "Sumatra Uncovered", destination: "Indonesia", region: "Southeast Asia", duration: "9 Days", price: 805, originalPrice: 1150, startLocation: "Medan", endLocation: "Alue Sungai Pinang", travelStyle: "classic", rating: 4.7, reviewCount: 45, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", tagline: "Indonesia's hidden secret", description: "9 days exploring Sumatra — orangutans, river tubing, turtle conservation, and raw jungle adventure.", highlights: ["Orangutan trekking", "River tubing", "Turtle conservation", "Jungle adventure"], itinerary: [{ day: 1, title: "Medan", description: "Welcome." }] },
  { id: "total-indonesia", title: "Total Indonesia", destination: "Indonesia", region: "Southeast Asia", duration: "26 Days", price: 1957, originalPrice: 2795, startLocation: "Medan", endLocation: "Labuan Bajo", travelStyle: "classic", rating: 4.9, reviewCount: 56, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "The complete Indonesia experience", description: "26 days from Sumatra to Komodo. Every highlight Indonesia has to offer in one epic trip.", highlights: ["Sumatra jungles", "Bali culture", "Komodo dragons", "26 days"], itinerary: [{ day: 1, title: "Medan", description: "Welcome." }] },
  // ============ PHILIPPINES TOURS ============
  { id: "philippines-east", title: "Philippines East", destination: "Philippines", region: "Southeast Asia", duration: "8 Days", price: 665, originalPrice: 950, startLocation: "Cebu City", endLocation: "Boracay Island", travelStyle: "classic", rating: 4.8, reviewCount: 134, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "Crystal waters, sunsets, and waterfalls", description: "8 days exploring the Philippines' eastern islands. Swim with whale sharks, chase waterfalls, and party on Boracay.", highlights: ["Whale shark swimming", "Kawasan Falls", "Boracay Island", "Island hopping"], itinerary: [{ day: 1, title: "Cebu", description: "Welcome." }] },
  { id: "philippines-west", title: "Philippines West", destination: "Philippines", region: "Southeast Asia", duration: "10 Days", price: 717, originalPrice: 1195, startLocation: "Manila", endLocation: "Coron Town", travelStyle: "classic", rating: 4.9, reviewCount: 112, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "Lagoons, shipwrecks, and castaway vibes", description: "10 days exploring Palawan and Coron. Swim through hidden lagoons, snorkel over WWII shipwrecks, and live the castaway dream.", highlights: ["El Nido lagoons", "Coron shipwrecks", "Castaway experience", "Snorkelling"], itinerary: [{ day: 1, title: "Manila", description: "Welcome." }] },
  { id: "philippines-island-hopper", title: "Philippines Island Hopper", destination: "Philippines", region: "Southeast Asia", duration: "17 Days", price: 1537, originalPrice: 2195, startLocation: "Manila", endLocation: "Boracay Island", travelStyle: "classic", rating: 4.9, reviewCount: 89, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "The best of East and West combined", description: "17 days combining both Philippines trips. The ultimate island-hopping experience.", highlights: ["17 days of islands", "East & West combined", "Whale sharks", "Castaway experience"], itinerary: [{ day: 1, title: "Manila", description: "Welcome." }] },
  { id: "philippines-backpacker", title: "Philippines Backpacker", destination: "Philippines", region: "Southeast Asia", duration: "11 Days", price: 627, originalPrice: 895, startLocation: "Manila", endLocation: "Coron", travelStyle: "backpacker", rating: 4.7, reviewCount: 98, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "11 epic days of island hopping", description: "Budget-friendly Philippines island hopping. Beach days, snorkelling, and all-around good vibes.", highlights: ["Budget-friendly", "Island hopping", "Beach parties", "Snorkelling"], itinerary: [{ day: 1, title: "Manila", description: "Welcome." }] },
  { id: "philippines-siargao", title: "Philippines Siargao Adventure", destination: "Philippines", region: "Southeast Asia", duration: "8 Days", price: 627, originalPrice: 895, startLocation: "Cebu", endLocation: "Siargao Island", travelStyle: "classic", rating: 4.8, reviewCount: 67, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "Surf, island-hop, and explore", description: "8 days on the Philippines' surf capital. Island hopping, beach days, and community experiences.", highlights: ["Surfing Siargao", "Island hopping", "Community projects", "Beach life"], itinerary: [{ day: 1, title: "Cebu", description: "Welcome." }] },
  { id: "total-philippines", title: "Total Philippines", destination: "Philippines", region: "Southeast Asia", duration: "24 Days", price: 2167, originalPrice: 3095, startLocation: "Manila", endLocation: "Siargao Island", travelStyle: "classic", rating: 4.9, reviewCount: 45, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", tagline: "The ultimate Philippines experience", description: "24 days exploring every incredible island the Philippines has to offer.", highlights: ["24 days", "Every island", "East & West", "Siargao surf"], itinerary: [{ day: 1, title: "Manila", description: "Welcome." }] },
  // ============ VIETNAM TOURS ============
  { id: "vietnam-backpacker", title: "Vietnam Backpacker", destination: "Vietnam", region: "Southeast Asia", duration: "12 Days", price: 525, originalPrice: 750, startLocation: "Hanoi", endLocation: "Ho Chi Minh City", travelStyle: "backpacker", rating: 4.7, reviewCount: 189, image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", tagline: "Highlights and hidden gems on a budget", description: "12 days packed with highlights including Lan Ha Bay cruise and lantern making in Hoi An.", highlights: ["Lan Ha Bay cruise", "Hoi An lanterns", "Street food", "Budget-friendly"], itinerary: [{ day: 1, title: "Hanoi", description: "Welcome." }] },
  { id: "vietnam-explorer", title: "Vietnam Explorer", destination: "Vietnam", region: "Southeast Asia", duration: "13 Days", price: 875, originalPrice: 1250, startLocation: "Ho Chi Minh City", endLocation: "Hanoi", travelStyle: "classic", rating: 4.8, reviewCount: 167, image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", tagline: "From bustling cities to misty mountains", description: "13 days exploring Vietnam's highlights and hidden gems from south to north.", highlights: ["Ha Long Bay", "Hoi An", "Hai Van Pass", "Cu Chi Tunnels"], itinerary: [{ day: 1, title: "Ho Chi Minh", description: "Welcome." }] },
  // ============ CAMBODIA TOURS ============
  { id: "cambodia-explorer", title: "Cambodia Explorer", destination: "Cambodia", region: "Southeast Asia", duration: "11 Days", price: 613, originalPrice: 875, startLocation: "Siem Reap", endLocation: "Phnom Penh", travelStyle: "classic", rating: 4.8, reviewCount: 123, image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", tagline: "Temples, beaches, and bustling cities", description: "11 days exploring Cambodia. Visit iconic Angkor Wat, relax on stunning beaches, and explore Phnom Penh.", highlights: ["Angkor Wat", "Sihanoukville beaches", "Phnom Penh", "Floating villages"], itinerary: [{ day: 1, title: "Siem Reap", description: "Welcome." }] },
  // ============ SRI LANKA TOURS ============
  { id: "sri-lanka-uncovered", title: "Sri Lanka Uncovered", destination: "Sri Lanka", region: "South Asia", duration: "10 Days", price: 697, originalPrice: 995, startLocation: "Negombo", endLocation: "Unawatuna", travelStyle: "classic", rating: 4.8, reviewCount: 156, image: "https://images.unsplash.com/photo-1546708770-599a0e47a9c7?w=800&q=80", tagline: "Culture, safari, and breathtaking scenery", description: "10 days diving into Sri Lanka. Climb Sigiriya, ride the famous Ella train, and safari through Yala National Park.", highlights: ["Sigiriya Rock", "Ella Blue Train", "Yala safari", "Surf in Weligama"], itinerary: [{ day: 1, title: "Negombo", description: "Welcome." }] },
  // ============ MEXICO TOURS ============
  { id: "mexico-yucatan-experience", title: "Mexico Yucatán Experience", destination: "Mexico", region: "Central America", duration: "11 Days", price: 1017, originalPrice: 1695, startLocation: "Cancún", endLocation: "Playa del Carmen", travelStyle: "classic", rating: 4.8, reviewCount: 134, image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Hotspots and hidden gems of Yucatán", description: "11 days exploring the best of Mexico's Yucatán Peninsula. Cenotes, Mayan ruins, Caribbean beaches, and incredible food.", highlights: ["Cenote swimming", "Chichén Itzá", "Tulum ruins", "Mexican street food"], itinerary: [{ day: 1, title: "Cancún", description: "Welcome." }] },
  { id: "mexico-yucatan-loop", title: "Mexico Yucatán Loop", destination: "Mexico", region: "Central America", duration: "7 Days", price: 767, originalPrice: 1095, startLocation: "Cancún", endLocation: "Playa del Carmen", travelStyle: "backpacker", rating: 4.7, reviewCount: 89, image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Beaches, ruins, and a wonder of the world", description: "7 days hitting the best of Yucatán on a budget. Cenotes, Chichén Itzá, and Caribbean coast.", highlights: ["Chichén Itzá", "Cenotes", "Caribbean beaches", "Budget-friendly"], itinerary: [{ day: 1, title: "Cancún", description: "Welcome." }] },
  { id: "day-of-the-dead", title: "Day of the Dead Festival", destination: "Mexico", region: "Central America", duration: "6 Days", price: 895, startLocation: "Mexico City", endLocation: "Mexico City", travelStyle: "limited_edition", rating: 4.9, reviewCount: 56, image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Experience the magic of Day of the Dead", description: "6 days celebrating Mexico's most iconic festival. Parades, altars, face painting, and cultural immersion in Mexico City.", highlights: ["Day of the Dead parade", "Traditional altars", "Mexico City exploration", "Cultural immersion"], itinerary: [{ day: 1, title: "Mexico City", description: "Welcome." }] },
  // ============ COSTA RICA TOURS ============
  { id: "costa-rica-adventure", title: "Costa Rica Adventure", destination: "Costa Rica", region: "Central America", duration: "10 Days", price: 945, originalPrice: 1350, startLocation: "San José", endLocation: "Santa Teresa", travelStyle: "classic", rating: 4.9, reviewCount: 112, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", tagline: "Jungles, volcanoes, and exotic wildlife", description: "10 days exploring Costa Rica's hotspots. Zip-lining, volcanic hot springs, wildlife safaris, and Pacific beaches.", highlights: ["Arenal hot springs", "Zip-lining", "Wildlife safari", "Pacific surf"], itinerary: [{ day: 1, title: "San José", description: "Welcome." }] },
  // ============ GREECE TOURS ============
  { id: "greece-island-hopper", title: "Greece Island Hopper", destination: "Greece", region: "Europe", duration: "9 Days", price: 1327, originalPrice: 1895, startLocation: "Athens", endLocation: "Santorini", travelStyle: "classic", rating: 4.9, reviewCount: 167, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", tagline: "Beaches, beers, and a bucket list 9 days", description: "The ultimate Greek island-hopping experience. Athens, Ios, and Santorini — history, parties, and the world's most famous sunset.", highlights: ["Santorini sunset", "Ios nightlife", "Athens Acropolis", "Island hopping"], itinerary: [{ day: 1, title: "Athens", description: "Welcome." }] },
  // ============ MULTI-COUNTRY TOURS ============
  { id: "cambodia-vietnam-explorer", title: "Cambodia & Vietnam Explorer", destination: "Cambodia", region: "Southeast Asia", duration: "23 Days", price: 1435, originalPrice: 2050, startLocation: "Siem Reap", endLocation: "Hanoi", travelStyle: "multi_country", rating: 4.8, reviewCount: 98, image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", tagline: "Epic scenery and unforgettable culture", description: "23 days across Cambodia and Vietnam. Angkor Wat, Ha Long Bay, Hoi An, and everything in between.", highlights: ["Angkor Wat", "Ha Long Bay", "Hoi An", "Two countries, one epic trip"], itinerary: [{ day: 1, title: "Siem Reap", description: "Welcome." }] },
  { id: "india-sri-lanka", title: "India & Sri Lanka Uncovered", destination: "India", region: "South Asia", duration: "23 Days", price: 1677, originalPrice: 2395, startLocation: "Delhi", endLocation: "Unawatuna", travelStyle: "multi_country", rating: 4.8, reviewCount: 78, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80", tagline: "Golden Triangle meets island paradise", description: "23 days combining India's famous Golden Triangle with Sri Lanka's beaches, temples, and train rides.", highlights: ["Taj Mahal", "Golden Triangle", "Ella train", "Sri Lanka beaches"], itinerary: [{ day: 1, title: "Delhi", description: "Welcome." }] },
  { id: "mexico-belize-guatemala", title: "Mexico, Belize & Guatemala", destination: "Mexico", region: "Central America", duration: "18 Days", price: 1925, originalPrice: 2750, startLocation: "Cancún", endLocation: "Antigua Guatemala", travelStyle: "multi_country", rating: 4.8, reviewCount: 67, image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", tagline: "Ultimate Central American whirlwind", description: "18 days through three incredible countries. Cenotes, barrier reefs, Mayan ruins, and volcanic landscapes.", highlights: ["Three countries", "Cenotes", "Barrier reef", "Lake Atitlán"], itinerary: [{ day: 1, title: "Cancún", description: "Welcome." }] },
  { id: "discover-asia", title: "Discover Asia", destination: "Thailand", region: "Southeast Asia", duration: "37 Days", price: 2485, originalPrice: 3550, startLocation: "Bangkok", endLocation: "Hanoi", travelStyle: "multi_country", rating: 4.9, reviewCount: 56, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", tagline: "Thailand, Cambodia, and Vietnam in one trip", description: "37 days across three countries. Beaches, temples, street food, and life-changing adventures.", highlights: ["3 countries", "37 days", "Full Moon Party", "Ha Long Bay"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }] },
  { id: "total-asia", title: "Total Asia", destination: "Thailand", region: "Southeast Asia", duration: "50 Days", price: 4185, originalPrice: 4650, startLocation: "Bangkok", endLocation: "Hanoi", travelStyle: "multi_country", rating: 5.0, reviewCount: 34, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", tagline: "The ultimate Asian adventure", description: "50 days. Three countries. Jaw-dropping beaches, rich culture, and life-changing adventures. The ultimate way to experience Asia.", highlights: ["50 days", "3 countries", "Every highlight", "Life-changing"], itinerary: [{ day: 1, title: "Bangkok", description: "Welcome." }] },
];

export const stories: Story[] = [
  {
    id: "why-i-quit-my-job-to-travel",
    title: "Why I Quit My Job to Travel Southeast Asia",
    excerpt:
      "I was 26, burnt out, and stuck in a cycle. One email changed everything. Here's what happened when I booked a one-way ticket.",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    author: "Sophie Chen",
    date: "2025-12-15",
    category: "Travel Stories",
    type: "story",
    topics: ["Solo Travel", "Local Stories"],
    lifeMoments: ["Career Break", "Quarter-Life Reset"],
    destinations: ["Southeast Asia", "Thailand"],
    readTime: 7,
  },
  {
    id: "hidden-gems-of-bali",
    title: "10 Hidden Gems in Bali Most Tourists Miss",
    excerpt:
      "Skip the crowds and discover secret waterfalls, empty surf breaks, and local warungs that'll change how you see Bali.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    author: "Jake Morrison",
    date: "2025-11-28",
    category: "Destination Guides",
    type: "guide",
    topics: ["Adventure", "Local Stories", "Food & Culture"],
    lifeMoments: ["Gap Year", "First Big Trip"],
    destinations: ["Southeast Asia", "Indonesia", "Bali"],
    readTime: 9,
  },
  {
    id: "solo-female-travel-tips",
    title: "Solo Female Travel: What I Wish I Knew Before My First Trip",
    excerpt:
      "From safety tips to the unexpected friendships, here's the honest guide I wish someone had given me.",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
    author: "Priya Kapoor",
    date: "2025-11-10",
    category: "Travel Tips",
    type: "tips",
    topics: ["Solo Travel", "Wellness"],
    lifeMoments: ["First Big Trip", "Post-Uni"],
    destinations: ["Southeast Asia"],
    readTime: 6,
  },
  {
    id: "best-hostels-in-thailand",
    title: "The Best Hostels in Thailand for Group Travellers",
    excerpt:
      "Not all hostels are created equal. These are the ones where you'll make lifelong friends and actually get a good night's sleep.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    author: "Tom Ashworth",
    date: "2025-10-22",
    category: "Destination Guides",
    type: "guide",
    topics: ["Budget Tips", "Nightlife"],
    lifeMoments: ["Gap Year", "First Big Trip", "Post-Uni"],
    destinations: ["Southeast Asia", "Thailand"],
    readTime: 8,
  },
  {
    id: "member-secret-itinerary-vietnam",
    title: "The Secret Vietnam Itinerary Only Locals Know",
    excerpt:
      "Our local guides shared the spots they take their own friends. This is the Vietnam you won't find on Google.",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    author: "TruTravels Team",
    date: "2025-10-05",
    category: "Member Exclusive",
    memberOnly: true,
    type: "exclusive",
    topics: ["Local Stories", "Food & Culture", "Adventure"],
    lifeMoments: ["Sabbatical", "Career Break"],
    destinations: ["Southeast Asia", "Vietnam"],
    readTime: 12,
  },
  {
    id: "member-packing-guide",
    title: "The Ultimate Packing Guide for 2+ Weeks in Asia",
    excerpt:
      "Pack like a pro. Our tried-and-tested list for travelling light without missing a thing.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    author: "TruTravels Team",
    date: "2025-09-18",
    category: "Member Exclusive",
    memberOnly: true,
    type: "exclusive",
    topics: ["Budget Tips"],
    lifeMoments: ["First Big Trip", "Gap Year"],
    destinations: ["Southeast Asia"],
    readTime: 5,
  },
  {
    id: "planeterra-elephant-sanctuary",
    title: "Inside Our Planeterra Project: A Day at the Elephant Sanctuary",
    excerpt:
      "How one Chiang Mai sanctuary is rewriting the rules of ethical tourism — and what it's like to spend a day there.",
    image: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=800&q=80",
    author: "TruTravels Team",
    date: "2025-09-02",
    category: "Sustainability",
    type: "story",
    topics: ["Sustainability", "Local Stories"],
    lifeMoments: ["Sabbatical", "First Big Trip"],
    destinations: ["Southeast Asia", "Thailand"],
    readTime: 8,
  },
  {
    id: "wellness-reset-bali",
    title: "A Two-Week Wellness Reset in Ubud",
    excerpt:
      "Yoga at sunrise, rice-paddy walks, and the cleanest food of your life. Here's how to do Ubud properly.",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
    author: "Nina Waves",
    date: "2025-08-20",
    category: "Wellness",
    type: "guide",
    topics: ["Wellness", "Food & Culture"],
    lifeMoments: ["Quarter-Life Reset", "Sabbatical", "Career Break"],
    destinations: ["Southeast Asia", "Indonesia", "Bali"],
    readTime: 10,
  },
];

export const regions = [
  { name: "Southeast Asia", count: 28 },
  { name: "South Asia", count: 3 },
  { name: "Central America", count: 5 },
  { name: "Europe", count: 1 },
];

// ============================================================
// BRAND PILLARS — "Leave Ordinary Behind" framework
// The 4 core principles that define what TruTravels stands for
// ============================================================

export type BrandPillar = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  points: string[];
  image: string;
  color: string;
  emoji: string;
};

export const brandPillars: BrandPillar[] = [
  {
    id: "adventure",
    name: "Adventure",
    tagline: "Without Limits",
    description:
      "Adventure isn't a destination — it's a mindset. We believe in saying yes more, embracing spontaneity, and stepping outside your comfort zone every single day.",
    points: [
      "Say yes more",
      "Embrace the spontaneous",
      "Step outside your comfort zone",
      "Every day is a new adventure",
    ],
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
    color: "#FF3F99",
    emoji: "⚡",
  },
  {
    id: "good-vibes",
    name: "Good Vibes",
    tagline: "With Global Impact",
    description:
      "Fun with purpose. Every trip creates positive ripple effects — respecting cultures, supporting local businesses, and leaving places better than we found them.",
    points: [
      "Fun with purpose",
      "Respect cultures, support locals",
      "People & Planet Promise",
      "Positive ripple effects everywhere",
    ],
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    color: "#6BD495",
    emoji: "🌍",
  },
  {
    id: "stories",
    name: "Stories",
    tagline: "Worth Telling",
    description:
      "Every journey writes a story worth telling. The connections with local people, the shared laughs, the unexpected moments — stories that shape who you are and remind you what it means to be human.",
    points: [
      "Connections that shape you",
      "Moments you can't plan",
      "Stories that last a lifetime",
      "The unexpected is the point",
    ],
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    color: "#FCA501",
    emoji: "✍️",
  },
  {
    id: "community",
    name: "Community",
    tagline: "Through Connection",
    description:
      "Together is our favourite place. A community built through connection — across countries and time zones, united by shared beliefs, shared experiences, and mutual support.",
    points: [
      "Together is our favourite place",
      "Across countries and time zones",
      "United by shared beliefs",
      "Friends become family",
    ],
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
    color: "#2172D5",
    emoji: "🤝",
  },
];

// ============================================================
// TRU EXPERIENCE TYPES — The 5 pillars of every TruTravels trip
// "Leave Ordinary Behind cannot just live in our marketing.
//  It has to live in our product."
// ============================================================

export type ExperienceType = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  message: string;
  image: string;
  color: string;
  experiences: string[];
};

export const experienceTypes: ExperienceType[] = [
  {
    id: "local-lens",
    name: "Local Lens",
    emoji: "🌍",
    tagline: "See the destination through local eyes.",
    description:
      "Direct connections with local culture, traditions, and communities. Cooking with families, exploring neighbourhoods with locals, and participating in generational cultural practices.",
    message: "Travel becomes more meaningful when you experience a place through the people who live there.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    color: "#2172D5",
    experiences: [
      "Cook pad thai with a Bangkok family",
      "Explore Hoi An with a local artisan",
      "Berber village homestay in the Atlas Mountains",
      "Morning alms ceremony in Luang Prabang",
    ],
  },
  {
    id: "rise-up",
    name: "Rise Up",
    emoji: "🔥",
    tagline: "Step beyond comfort and discover what you're capable of.",
    description:
      "Intentional challenges — physical, mental, or emotional — in supportive settings. Summit hikes, independent navigation, and experiences that push your limits.",
    message: "You arrive unsure. You leave stronger.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    color: "#FF3F99",
    experiences: [
      "Sunrise summit trek up Mount Batur",
      "White water rafting in La Fortuna",
      "Sigiriya Rock Fortress climb",
      "Hai Van Pass motorbike ride",
    ],
  },
  {
    id: "bucket-list",
    name: "Bucket List",
    emoji: "🏔",
    tagline: "The iconic experiences that define your journey.",
    description:
      "World-famous landmarks, extraordinary landscapes, and universally recognised destinations that inspire travel aspirations.",
    message: "Bucket List experiences create those unforgettable highlights that stay with you forever.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    color: "#FCA501",
    experiences: [
      "Ha Long Bay overnight junk boat cruise",
      "Full Moon Party on Koh Phangan",
      "Angkor Wat at sunrise",
      "Sahara Desert camp under the stars",
    ],
  },
  {
    id: "tru-ly-unique",
    name: "Tru-ly Unique",
    emoji: "✨",
    tagline: "Experiences designed exclusively for the Tru community.",
    description:
      "Proprietary experiences through exclusive partnerships, private access, and community-specific opportunities unavailable to general tourists.",
    message: "These moments don't just make your trip better — they make it distinctively Tru.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    color: "#6BD495",
    experiences: [
      "Private beach party — Tru members only",
      "Exclusive rooftop sunset in Bangkok",
      "Secret waterfall hike in Bali",
      "VIP lantern release in Chiang Mai",
    ],
  },
  {
    id: "unplugged",
    name: "Unplugged",
    emoji: "🌿",
    tagline: "Disconnect from distraction and reconnect with what matters.",
    description:
      "Intentional slowness, presence, and tech-free moments in nature or group settings enabling reflection and authentic connection.",
    message: "No pressure to perform, post, or move quickly. Just time to breathe, reflect, and be present.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    color: "#00BBB4",
    experiences: [
      "Silent sunrise on a Sri Lankan beach",
      "Digital detox day in the Gili Islands",
      "Jungle hammock afternoon in Costa Rica",
      "Stargazing night in the Sahara",
    ],
  },
];

// ============================================================
// CREATORS — The people who lead and shape TruTravels experiences
// ============================================================

export type Creator = {
  id: string;
  name: string;
  role: string;
  image: string;
  location: string;
  bio: string;
  speciality: string;
};

export const creators: Creator[] = [
  {
    id: "nina-waves",
    name: "Nina Waves",
    role: "Surf & Wellness Guide",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    location: "Bali, Indonesia",
    bio: "Former yoga instructor turned full-time surf guide. Runs sunrise sessions and reef clean-ups across Bali and Sri Lanka.",
    speciality: "Surf & Wellness",
  },
  {
    id: "marcus-cole",
    name: "Marcus Cole",
    role: "Street Food Explorer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    location: "Bangkok, Thailand",
    bio: "3 years living in Bangkok. Knows every hidden night market and the best pad thai you'll never find on Google Maps.",
    speciality: "Food & Culture",
  },
  {
    id: "aisha-nomad",
    name: "Aisha Kouri",
    role: "Desert & Culture Guide",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    location: "Marrakech, Morocco",
    bio: "Born in Marrakech, raised between worlds. Leads immersive medina tours and overnight desert expeditions under the stars.",
    speciality: "Culture & Adventure",
  },
  {
    id: "luca-jungle",
    name: "Luca Rivera",
    role: "Jungle & Wildlife Guide",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    location: "Manuel Antonio, Costa Rica",
    bio: "Wildlife biologist who traded the lab for the rainforest. Will make you fall in love with sloths and stop being afraid of spiders.",
    speciality: "Wildlife & Nature",
  },
];

// ============================================================
// DROPS — Limited experiences, upcoming launches, events
// ============================================================

export type Drop = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  tag: string;
  spotsLeft?: number;
};

export const drops: Drop[] = [
  {
    id: "full-moon-june",
    title: "Full Moon Takeover: Koh Phangan",
    subtitle: "Three nights, two islands, one legendary party. Our biggest group event of the summer.",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    tag: "Event",
    spotsLeft: 12,
  },
  {
    id: "morocco-launch",
    title: "Morocco Nomad: Now Open",
    subtitle: "Our newest route — Marrakech to the Sahara. Member-exclusive for the first 50 bookings.",
    date: "September 2026",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    tag: "New Route",
    spotsLeft: 50,
  },
  {
    id: "bali-retreat",
    title: "Bali Surf & Soul Retreat",
    subtitle: "A 5-day wellness add-on with Nina Waves. Surf, yoga, breathwork, and jungle recovery.",
    date: "August 2026",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tag: "Limited",
    spotsLeft: 8,
  },
];

// ============================================================
// VIDEO DIARIES — Real video content from travellers & partners
// Using free Pexels travel videos as placeholders
// ============================================================

// Featured content series for the Stories landing page (Watch & Learn)
export type StoryContentSeries = {
  id: string;
  title: string;
  description: string;
  image: string;
  episodes: number;
  tag: string;
};

export const storyContentSeries: StoryContentSeries[] = [
  {
    id: "scs-bangkok-48",
    title: "48 Hours in Bangkok",
    description:
      "The ultimate speed-run through Thailand's chaotic, beautiful capital. Temples, street food, rooftop bars, and more.",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    episodes: 6,
    tag: "City Guide",
  },
  {
    id: "scs-thai-cooking",
    title: "Thai Cooking Masterclass",
    description:
      "From market to plate — learn the secrets behind Thailand's most iconic dishes with a local Bangkok family.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
    episodes: 8,
    tag: "Food & Culture",
  },
  {
    id: "scs-island-hopper",
    title: "Island Hopper Diaries",
    description:
      "Follow a group of TruTravellers as they hop between Thailand's most stunning islands over 14 days.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    episodes: 6,
    tag: "Travel Series",
  },
  {
    id: "scs-khao-sok",
    title: "Khao Sok: Into The Wild",
    description:
      "Kayaking, floating bungalows, and the oldest rainforests on Earth. A four-part adventure in Thailand's hidden interior.",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
    episodes: 4,
    tag: "Adventure",
  },
  {
    id: "scs-bali-beyond",
    title: "Bali Beyond the Beach",
    description:
      "Discover Bali's spiritual side — temples, ceremonies, and the healing rituals only locals know.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    episodes: 5,
    tag: "Culture",
  },
  {
    id: "scs-vietnam-n2s",
    title: "Vietnam North to South",
    description:
      "The ultimate road trip from Hanoi to Ho Chi Minh City — every stop, every meal, every detour.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    episodes: 8,
    tag: "Travel Series",
  },
];

// ============================================================
// EXPERIENCE TYPE BREAKDOWN — used on tour cards
// ============================================================
// Classify a free-text activity/highlight into one of the 5 TRU experience types
// using deterministic keyword rules. Falls back to "local-lens" if nothing matches.
const EXP_KEYWORDS: Record<string, RegExp> = {
  "tru-ly-unique": /\b(exclusive|private|vip|hidden|secret|special|floating|live[- ]?aboard|sleeper|behind[- ]the[- ]scene|members?[- ]only|insider)\b/i,
  "bucket-list": /\b(angkor|ha\s?long|taj|full\s?moon|machu|sigiriya|chichen|wonder|santorini|maya bay|inca|sunrise|sunset|iconic|legendary|world[- ]famous|epic)\b/i,
  "rise-up": /\b(hike|trek|climb|surf|raft|summit|zip ?line|zipline|dive|kayak|cycle|bike|adventure|adrenalin|paddle|abseil|canyon|jungle trek|water fight|festival)\b/i,
  "unplugged": /\b(massage|beach|relax|yoga|hot spring|wellness|free day|chill|sail|cruise|hammock|spa|swim|snorkel|island|lagoon|recovery|sunbathing)\b/i,
  "local-lens": /\b(local|family|cook|village|market|artisan|homestay|culture|tradition|temple|street food|ceremony|community|tribe|cooking class|tea|night market|tribe|bazaar)\b/i,
};

const EXP_PRIORITY = ["tru-ly-unique", "bucket-list", "rise-up", "unplugged", "local-lens"] as const;

function classifyExperience(text: string): string {
  for (const id of EXP_PRIORITY) {
    if (EXP_KEYWORDS[id].test(text)) return id;
  }
  return "local-lens";
}

export type TripExperienceCount = {
  id: string;
  name: string;
  color: string;
  count: number;
};

export function getTripExperienceCounts(trip: Trip): {
  total: number;
  byType: TripExperienceCount[];
} {
  const explicit = trip.inclusions?.activities ?? [];
  const counts: Record<string, number> = {};

  // Prefer explicit data when at least one activity has an experienceType
  if (explicit.length > 0 && explicit.some((a) => a.experienceType)) {
    for (const a of explicit) {
      if (a.experienceType) counts[a.experienceType] = (counts[a.experienceType] ?? 0) + 1;
    }
    return {
      total: explicit.length,
      byType: experienceTypes
        .filter((e) => counts[e.id])
        .map((e) => ({ id: e.id, name: e.name, color: e.color, count: counts[e.id] })),
    };
  }

  // Fallback: classify highlights into experience types
  const highlights = trip.highlights ?? [];
  for (const h of highlights) {
    const id = classifyExperience(h);
    counts[id] = (counts[id] ?? 0) + 1;
  }

  return {
    total: highlights.length,
    byType: experienceTypes
      .filter((e) => counts[e.id])
      .map((e) => ({ id: e.id, name: e.name, color: e.color, count: counts[e.id] })),
  };
}

// Top-level podcasts for the Stories landing page (Listen section)
export type StoryPodcastEpisode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  episode: number;
  host: string;
};

export const storyPodcasts: StoryPodcastEpisode[] = [
  {
    id: "sp-01",
    title: "Why Travel Changes You (And Why That's a Good Thing)",
    description:
      "We sit down with three TruTravellers and one neuroscientist to unpack what really happens to your brain on the road.",
    duration: "42 min",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    episode: 12,
    host: "Sophie Chen",
  },
  {
    id: "sp-02",
    title: "The Real Cost of a Gap Year",
    description:
      "Honest money talk with people who quit jobs, sold flats, and lived to tell the tale.",
    duration: "35 min",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    episode: 11,
    host: "Tom Ashworth",
  },
  {
    id: "sp-03",
    title: "Local Lens: Bangkok Through Orty's Eyes",
    description:
      "Our Thailand trip leader takes us through the Bangkok he loves — the noodle stall corners, the late-night markets, the soi nobody tells you about.",
    duration: "28 min",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    episode: 10,
    host: "Orty",
  },
  {
    id: "sp-04",
    title: "Solo Travel: The Stuff Nobody Tells You",
    description:
      "Five women who travelled solo across Asia, Latin America, and Europe share what worked, what didn't, and what they'd do differently.",
    duration: "47 min",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
    episode: 9,
    host: "Priya Kapoor",
  },
  {
    id: "sp-05",
    title: "Inside Planeterra: Tourism That Actually Helps",
    description:
      "How a 25-year-old non-profit is rewriting the rules of community-led tourism, one project at a time.",
    duration: "39 min",
    image: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=800&q=80",
    episode: 8,
    host: "Tru Crew",
  },
  {
    id: "sp-06",
    title: "Hostels Are Cool Again (And This Is Why)",
    description:
      "The hostel renaissance — design, community, and why a £15 dorm bed might give you a better time than the £200 suite next door.",
    duration: "31 min",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    episode: 7,
    host: "Jake Morrison",
  },
];

export type VideoDiary = {
  id: string;
  video: string;
  poster: string;
  caption: string;
  author: string;
  handle: string;
  location: string;
  avatar: string;
  tag: "Traveller" | "Creator" | "Influencer" | "Partner" | "Guide" | "Community" | "Planeterra";
};

export const videoDiaries: VideoDiary[] = [
  {
    id: "v1",
    video: "/videos/traveller-diary.mp4",
    poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80",
    caption: "That moment when the boat drops you at a beach with no name and no Wi-Fi. This is what we came for.",
    author: "Sophie Chen",
    handle: "@sophietravels",
    location: "Koh Tao, Thailand",
    avatar: "SC",
    tag: "Traveller",
  },
  {
    id: "v2",
    video: "/videos/influencer-diary.mp4",
    poster: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80",
    caption: "Sunrise summit at Mount Batur. 15 strangers at 3am. Lifelong friends by 6am. This is TruTravels.",
    author: "Jake Morrison",
    handle: "@jakeontheroad",
    location: "Bali, Indonesia",
    avatar: "JM",
    tag: "Influencer",
  },
  {
    id: "v3",
    video: "https://videos.pexels.com/video-files/3015510/3015510-sd_506_960_24fps.mp4",
    poster: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&q=80",
    caption: "Lost in the lantern streets of Hoi An. Found the best bowl of cao lau of my life. No regrets.",
    author: "Priya Kapoor",
    handle: "@priyawanders",
    location: "Hoi An, Vietnam",
    avatar: "PK",
    tag: "Traveller",
  },
  {
    id: "v4",
    video: "/videos/creator-diary.mp4",
    poster: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
    caption: "Woke up on a junk boat in Ha Long Bay. Kayaked through caves before breakfast. Unreal.",
    author: "Nina Waves",
    handle: "@ninawaves",
    location: "Ha Long Bay, Vietnam",
    avatar: "NW",
    tag: "Creator",
  },
  {
    id: "v5",
    video: "https://videos.pexels.com/video-files/5752729/5752729-sd_506_960_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80",
    caption: "The Ella train. 7 hours of tea plantations, waterfalls, and hanging out the door. Worth every second.",
    author: "Tom Ashworth",
    handle: "@tomtravels",
    location: "Ella, Sri Lanka",
    avatar: "TA",
    tag: "Traveller",
  },
  {
    id: "v6",
    video: "https://videos.pexels.com/video-files/4434242/4434242-sd_506_960_24fps.mp4",
    poster: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80",
    caption: "Bangkok night market crawl with the crew. Every stall a different universe. This city never sleeps.",
    author: "Marcus Cole",
    handle: "@marcuseats",
    location: "Bangkok, Thailand",
    avatar: "MC",
    tag: "Creator",
  },
  {
    id: "v7",
    video: "https://videos.pexels.com/video-files/4108807/4108807-sd_506_960_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=400&q=80",
    caption: "Spent the day at our Planeterra elephant sanctuary partner. No riding, no chains — just elephants being elephants.",
    author: "Tru Crew",
    handle: "@trutravels",
    location: "Chiang Mai, Thailand",
    avatar: "TC",
    tag: "Planeterra",
  },
  {
    id: "v8",
    video: "https://videos.pexels.com/video-files/5077165/5077165-sd_360_640_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
    caption: "Meet Orty — your trip leader for Thailand. Born in Bangkok, knows every back-alley noodle stall worth its salt.",
    author: "Orty",
    handle: "@ortyleads",
    location: "Bangkok, Thailand",
    avatar: "OR",
    tag: "Guide",
  },
  {
    id: "v9",
    video: "https://videos.pexels.com/video-files/2169307/2169307-sd_540_960_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&q=80",
    caption: "Our homestay partner in Ella has been hosting Tru travellers for 7 years. The breakfasts alone are worth the trip.",
    author: "Kamala Hewavitharana",
    handle: "@kamalahomestay",
    location: "Ella, Sri Lanka",
    avatar: "KH",
    tag: "Partner",
  },
  {
    id: "v10",
    video: "https://videos.pexels.com/video-files/4763824/4763824-sd_360_640_25fps.mp4",
    poster: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80",
    caption: "The Tru Crew reunion in Lisbon. 14 countries, 23 humans, one rooftop. This is what stays after the trip ends.",
    author: "Tru Community",
    handle: "@trutravels",
    location: "Lisbon, Portugal",
    avatar: "TC",
    tag: "Community",
  },
];

// ============================================================
// COUNTRIES — Destination landing page data
// ============================================================

export type CountryFact = {
  icon: string;
  label: string;
  value: string;
};

export type BucketListItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
};

export type ContentSeries = {
  id: string;
  title: string;
  description: string;
  image: string;
  episodes: number;
  tag: string;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
};

export type Country = {
  id: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroVideo?: string;
  facts: CountryFact[];
  bucketList: BucketListItem[];
  contentSeries: ContentSeries[];
  podcasts: PodcastEpisode[];
  faqs: { question: string; answer: string }[];
};

export const countries: Country[] = [
  {
    id: "thailand",
    name: "Thailand",
    region: "Southeast Asia",
    tagline: "The Land of Smiles",
    description: "From the neon-lit streets of Bangkok to the crystal-clear waters of the Andaman Sea, Thailand has it all. Ancient temples, street food that'll blow your mind, legendary parties, and some of the most beautiful islands on the planet. There's a reason it's the number one destination for first-time travellers — and why people keep coming back.",
    heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
    facts: [
      { icon: "🗣️", label: "Language", value: "Thai" },
      { icon: "💰", label: "Currency", value: "Thai Baht (THB)" },
      { icon: "🍜", label: "National Dish", value: "Pad Thai" },
      { icon: "🍺", label: "Local Beer", value: "Chang" },
    ],
    bucketList: [
      {
        id: "bl-1",
        title: "Full Moon Party",
        description: "The world's most legendary beach party on Koh Phangan. Neon paint, fire dancers, and thousands of travellers dancing barefoot on the sand until sunrise.",
        image: "https://images.unsplash.com/photo-1504276048855-f3d1e4c69a17?w=800&q=80",
        emoji: "🌕",
      },
      {
        id: "bl-2",
        title: "Island Hopping",
        description: "Explore Thailand's 1,430 islands — from the iconic Phi Phi to hidden gems like Koh Lipe. Crystal water, white sand, and zero stress.",
        image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
        emoji: "🏝️",
      },
      {
        id: "bl-3",
        title: "Temple Visits",
        description: "From the golden spires of the Grand Palace to the ancient ruins of Ayutthaya. Thailand's 40,000+ temples are jaw-droppingly beautiful.",
        image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
        emoji: "🛕",
      },
      {
        id: "bl-4",
        title: "Thai Cooking Class",
        description: "Learn to make pad thai, green curry, and mango sticky rice from scratch. You'll never order takeaway the same way again.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        emoji: "👩‍🍳",
      },
      {
        id: "bl-5",
        title: "Floating Bungalows",
        description: "Wake up on an emerald lake surrounded by limestone mountains in Khao Sok National Park. One of the most magical stays in the world.",
        image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
        emoji: "🛖",
      },
      {
        id: "bl-6",
        title: "Muay Thai Lesson",
        description: "Get your hands wrapped and step into the ring for an intro to Thailand's national sport. Whether you're a natural or completely useless, it's an absolute laugh.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        emoji: "🥊",
      },
    ],
    contentSeries: [
      {
        id: "cs-1",
        title: "48 Hours in Bangkok",
        description: "The ultimate speed-run through Thailand's chaotic, beautiful capital. Temples, street food, rooftop bars, and hidden gems.",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
        episodes: 4,
        tag: "City Guide",
      },
      {
        id: "cs-2",
        title: "Thai Cooking Masterclass",
        description: "From market to plate — learn the secrets behind Thailand's most iconic dishes with a local Bangkok family.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        episodes: 3,
        tag: "Food & Culture",
      },
      {
        id: "cs-3",
        title: "Island Hopper Diaries",
        description: "Follow a group of TruTravellers as they hop between Thailand's most stunning islands over 14 days.",
        image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80",
        episodes: 6,
        tag: "Travel Series",
      },
      {
        id: "cs-4",
        title: "Khao Sok: Into The Wild",
        description: "Kayaking, floating bungalows, and jungle trekking in one of the oldest rainforests on Earth.",
        image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
        episodes: 2,
        tag: "Adventure",
      },
    ],
    podcasts: [
      {
        id: "pod-1",
        title: "Why Thailand is Still the Best First Trip",
        description: "We break down why Thailand remains the #1 destination for solo travellers and first-timers.",
        duration: "32 min",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80",
      },
      {
        id: "pod-2",
        title: "Full Moon Party: Worth the Hype?",
        description: "Our honest take on Koh Phangan's legendary party — plus tips to make it unforgettable.",
        duration: "28 min",
        image: "https://images.unsplash.com/photo-1504276048855-f3d1e4c69a17?w=400&q=80",
      },
      {
        id: "pod-3",
        title: "Street Food Tour: Bangkok's Best Eats",
        description: "A deep dive into Bangkok's street food scene with our local guide Marcus.",
        duration: "24 min",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80",
      },
    ],
    faqs: [
      { question: "When is the best time to visit Thailand?", answer: "The best time to visit is between November and March when it's cooler and drier. However, Thailand is amazing year-round — the 'rainy season' (June–October) usually means a quick downpour in the afternoon followed by sunshine." },
      { question: "Do I need a visa to visit Thailand?", answer: "Most nationalities get 30–60 days visa-free on arrival. You'll need to register for a Digital Arrival Card online within 3 days of arrival. Check the latest requirements for your nationality before travelling." },
      { question: "Is Thailand safe for solo travellers?", answer: "Absolutely. Thailand is one of the safest countries in Southeast Asia for solo travellers. It's well set up for tourism, locals are incredibly friendly, and roughly 65% of our TruTravellers come solo!" },
      { question: "How much spending money do I need?", answer: "Thailand is great value. Budget around £15–25 per day for food, drinks, and extras on top of your trip cost. Street food meals cost £1–2, beers £1–3, and activities like diving are much cheaper than back home." },
      { question: "What vaccinations do I need?", answer: "No vaccinations are legally required, but we recommend being up to date on Hepatitis A, Typhoid, and Tetanus. Consult your GP or a travel clinic at least 6 weeks before departure." },
      { question: "Can I use ATMs in Thailand?", answer: "Yes, ATMs are everywhere — even on small islands. They accept international cards but charge a 220 THB (~£5) fee per withdrawal. We recommend withdrawing larger amounts less frequently." },
      { question: "Is Thailand LGBTQ+ friendly?", answer: "Thailand is one of the most LGBTQ+ friendly countries in Asia. Bangkok has a vibrant scene, and you'll find acceptance across the country. Same-sex marriage was legalised in 2024." },
      { question: "What's the food like if I have dietary requirements?", answer: "Thai food is incredibly diverse and accommodating. Vegetarian and vegan options are widely available. Just let us know when you book and we'll make sure everything is sorted." },
    ],
  },
  {
    id: "indonesia", name: "Indonesia", region: "Southeast Asia", tagline: "Island of the Gods",
    description: "From the rice terraces of Ubud to the volcanic peaks of Mount Batur, Indonesia is a world of its own. Surf epic waves in Canggu, dive with manta rays in Komodo, and lose yourself in Bali's spiritual magic.",
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    facts: [{ icon: "🗣️", label: "Language", value: "Bahasa Indonesia" }, { icon: "💰", label: "Currency", value: "Indonesian Rupiah" }, { icon: "🍜", label: "National Dish", value: "Nasi Goreng" }, { icon: "🍺", label: "Local Beer", value: "Bintang" }],
    bucketList: [{ id: "bl-i1", title: "Sunrise at Mount Batur", description: "Trek through darkness to watch sunrise over Bali's active volcano.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", emoji: "🌋" }, { id: "bl-i2", title: "Surf in Canggu", description: "Learn to surf on Bali's hippest beach, then refuel with smoothie bowls.", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80", emoji: "🏄" }, { id: "bl-i3", title: "Komodo National Park", description: "Come face to face with real-life dragons and snorkel world-class waters.", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", emoji: "🐉" }, { id: "bl-i4", title: "Tegallalang Rice Terraces", description: "Walk through the iconic cascading rice paddies of Ubud.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", emoji: "🌾" }],
    contentSeries: [{ id: "cs-i1", title: "Bali Beyond the Beach", description: "Discover Bali's spiritual side — temples, ceremonies, and healing.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", episodes: 4, tag: "Culture" }],
    podcasts: [{ id: "pod-i1", title: "Bali: Hype vs Reality", description: "Is Bali still worth it? Our honest take.", duration: "29 min", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" }],
    faqs: [{ question: "Do I need a visa?", answer: "Most nationalities can get a 30-day Visa on Arrival for ~$35 USD, extendable for another 30 days." }, { question: "Is Bali safe?", answer: "Very safe for tourists. Keep valuables secure but violent crime is extremely rare." }],
  },
  { id: "philippines", name: "Philippines", region: "Southeast Asia", tagline: "7,000 Islands of Paradise", description: "White sand beaches, crystal lagoons, and the friendliest people on Earth. Swim with whale sharks, island-hop through paradise, and fall in love with Filipino culture.", heroImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Filipino & English" }, { icon: "💰", label: "Currency", value: "Philippine Peso" }, { icon: "🍜", label: "National Dish", value: "Adobo" }, { icon: "🍺", label: "Local Beer", value: "San Miguel" }], bucketList: [{ id: "bl-p1", title: "Swim with Whale Sharks", description: "Get in the water with the world's largest fish — truly humbling.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", emoji: "🐋" }, { id: "bl-p2", title: "El Nido Island Hopping", description: "Lagoons, hidden beaches, and limestone cliffs — Palawan's crown jewel.", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80", emoji: "🏝️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Is English widely spoken?", answer: "Yes! English is an official language and widely spoken throughout." }] },
  { id: "vietnam", name: "Vietnam", region: "Southeast Asia", tagline: "The Hidden Gem of Asia", description: "Cruise through Ha Long Bay, ride the Hai Van Pass, and eat your body weight in pho. Vietnam is a sensory overload in the best possible way.", heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Vietnamese" }, { icon: "💰", label: "Currency", value: "Vietnamese Dong" }, { icon: "🍜", label: "National Dish", value: "Pho" }, { icon: "🍺", label: "Local Beer", value: "Bia Hoi" }], bucketList: [{ id: "bl-v1", title: "Ha Long Bay Cruise", description: "Overnight junk boat surrounded by 1,600 limestone islands.", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", emoji: "⛵" }, { id: "bl-v2", title: "Hoi An Lanterns", description: "Ancient town lit by thousands of colourful lanterns. Magic after dark.", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", emoji: "🏮" }], contentSeries: [{ id: "cs-v1", title: "Vietnam North to South", description: "The ultimate road trip from Hanoi to Ho Chi Minh City.", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80", episodes: 6, tag: "Travel Series" }], podcasts: [{ id: "pod-v1", title: "Vietnam: Street Food Capital", description: "Why Vietnam has the best street food in the world.", duration: "31 min", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" }], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities need an e-visa (~$25 USD, 3-5 working days)." }] },
  { id: "cambodia", name: "Cambodia", region: "Southeast Asia", tagline: "Temples, History & Heart", description: "Home to Angkor Wat, Cambodia is a country of ancient wonders, warm-hearted people, and incredible resilience.", heroImage: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Khmer" }, { icon: "💰", label: "Currency", value: "Riel / USD" }, { icon: "🍜", label: "National Dish", value: "Fish Amok" }, { icon: "🍺", label: "Local Beer", value: "Angkor Beer" }], bucketList: [{ id: "bl-c1", title: "Angkor Wat at Sunrise", description: "Watch the sun rise behind the world's largest religious monument.", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", emoji: "🛕" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Yes, e-visa online or visa on arrival (~$30 USD)." }] },
  { id: "sri-lanka", name: "Sri Lanka", region: "South Asia", tagline: "The Teardrop of India", description: "Tea plantations, ancient temples, epic surf, and the world's most scenic train ride. Sri Lanka packs an unbelievable amount into one small island.", heroImage: "https://images.unsplash.com/photo-1546708770-599a0e47a9c7?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Sinhala & Tamil" }, { icon: "💰", label: "Currency", value: "Sri Lankan Rupee" }, { icon: "🍜", label: "National Dish", value: "Rice & Curry" }, { icon: "🍺", label: "Local Beer", value: "Lion Lager" }], bucketList: [{ id: "bl-sl1", title: "Ella Train Ride", description: "Seven hours of tea plantations, waterfalls, and hanging out the door.", image: "https://images.unsplash.com/photo-1546708770-599a0e47a9c7?w=800&q=80", emoji: "🚂" }, { id: "bl-sl2", title: "Sigiriya Rock", description: "Climb 1,200 steps to the top of this ancient fortress.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🏰" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Yes, you need an ETA which can be applied for online." }] },
  { id: "india", name: "India", region: "South Asia", tagline: "A Billion Stories", description: "From the Taj Mahal to Kerala's backwaters, from Rajasthan's colourful cities to the Himalayas — every corner is an adventure.", heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Hindi & English" }, { icon: "💰", label: "Currency", value: "Indian Rupee" }, { icon: "🍜", label: "National Dish", value: "Biryani" }, { icon: "🍺", label: "Local Beer", value: "Kingfisher" }], bucketList: [{ id: "bl-in1", title: "Taj Mahal at Sunrise", description: "The world's most beautiful building, glowing golden in morning light.", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80", emoji: "🕌" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Yes, most nationalities need an e-visa. Apply at least 4 days before." }] },
  { id: "japan", name: "Japan", region: "Southeast Asia", tagline: "Where Ancient Meets Future", description: "Bullet trains, cherry blossoms, neon cities, and ancient temples. Japan is like nowhere else on Earth.", heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Japanese" }, { icon: "💰", label: "Currency", value: "Japanese Yen" }, { icon: "🍜", label: "National Dish", value: "Ramen" }, { icon: "🍺", label: "Local Beer", value: "Asahi" }], bucketList: [{ id: "bl-j1", title: "Cherry Blossom Season", description: "Hanami under the sakura trees — Japan's most magical time of year.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", emoji: "🌸" }], contentSeries: [], podcasts: [], faqs: [{ question: "Is Japan expensive?", answer: "It can be done on a budget. Street food and convenience stores keep costs down. Budget £30-50/day." }] },
  { id: "china", name: "China", region: "Southeast Asia", tagline: "The Middle Kingdom", description: "The Great Wall, Terracotta Warriors, and megacities that feel like the future. Vast, ancient, and endlessly fascinating.", heroImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Mandarin" }, { icon: "💰", label: "Currency", value: "Chinese Yuan" }, { icon: "🍜", label: "National Dish", value: "Kung Pao Chicken" }, { icon: "🍺", label: "Local Beer", value: "Tsingtao" }], bucketList: [{ id: "bl-ch1", title: "The Great Wall", description: "Walk along one of the greatest man-made structures ever built.", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80", emoji: "🏯" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Yes, most nationalities need a visa. Some cities offer transit visa-free stays of 72-144 hours." }] },
  { id: "mexico", name: "Mexico", region: "Central America", tagline: "Colour, Culture & Chaos", description: "Tacos, tequila, and turquoise cenotes. Ancient Mayan ruins, vibrant street art, and some of the best food on the planet.", heroImage: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Spanish" }, { icon: "💰", label: "Currency", value: "Mexican Peso" }, { icon: "🍜", label: "National Dish", value: "Tacos" }, { icon: "🍺", label: "Local Beer", value: "Corona" }], bucketList: [{ id: "bl-m1", title: "Cenote Swimming", description: "Crystal-clear underground sinkholes — Mexico's natural swimming pools.", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", emoji: "💎" }, { id: "bl-m2", title: "Chichén Itzá", description: "One of the New Seven Wonders of the World.", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", emoji: "🏛️" }], contentSeries: [{ id: "cs-m1", title: "Mexico City in 48 Hours", description: "Street food, museums, and mezcal.", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80", episodes: 3, tag: "City Guide" }], podcasts: [{ id: "pod-m1", title: "Mexico Beyond Cancún", description: "Why Mexico has so much more to offer.", duration: "27 min", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&q=80" }], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 180 days visa-free." }] },
  { id: "costa-rica", name: "Costa Rica", region: "Central America", tagline: "Pura Vida", description: "Rainforests, volcanoes, and two coastlines. The ultimate adventure playground — zip-line, surf, and spot sloths in the wild.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Spanish" }, { icon: "💰", label: "Currency", value: "Colón (CRC)" }, { icon: "🍜", label: "National Dish", value: "Gallo Pinto" }, { icon: "🍺", label: "Local Beer", value: "Imperial" }], bucketList: [{ id: "bl-cr1", title: "White Water Rafting", description: "Class III-IV rapids through the jungle — pure adrenaline.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🚣" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 90 days visa-free." }] },
  { id: "colombia", name: "Colombia", region: "Central America", tagline: "The Real Magic", description: "Vibrant cities, Caribbean beaches, coffee country, and the warmest people. South America's most exciting destination.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Spanish" }, { icon: "💰", label: "Currency", value: "Colombian Peso" }, { icon: "🍜", label: "National Dish", value: "Bandeja Paisa" }, { icon: "🍺", label: "Local Beer", value: "Aguila" }], bucketList: [{ id: "bl-co1", title: "Lost City Trek", description: "4-day jungle trek to an ancient city older than Machu Picchu.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🌿" }], contentSeries: [], podcasts: [], faqs: [{ question: "Is Colombia safe?", answer: "Tourist areas are safe. It's now one of the most visited countries in South America." }] },
  { id: "peru", name: "Peru", region: "Central America", tagline: "Land of the Incas", description: "Machu Picchu, the Amazon, and the world's best ceviche. Bucket-list travel at its finest.", heroImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Spanish & Quechua" }, { icon: "💰", label: "Currency", value: "Peruvian Sol" }, { icon: "🍜", label: "National Dish", value: "Ceviche" }, { icon: "🍺", label: "Local Beer", value: "Cusqueña" }], bucketList: [{ id: "bl-pe1", title: "Machu Picchu", description: "The Lost City of the Incas — one of the most awe-inspiring places on Earth.", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80", emoji: "🏔️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 90-183 days visa-free." }] },
  { id: "brazil", name: "Brazil", region: "Central America", tagline: "Rhythm & Soul", description: "Carnival, Copacabana, and the Amazon. Larger than life — vibrant, loud, and absolutely intoxicating.", heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Portuguese" }, { icon: "💰", label: "Currency", value: "Brazilian Real" }, { icon: "🍜", label: "National Dish", value: "Feijoada" }, { icon: "🍺", label: "Local Beer", value: "Brahma" }], bucketList: [{ id: "bl-br1", title: "Christ the Redeemer", description: "Stand beneath one of the world's most iconic statues with panoramic Rio views.", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80", emoji: "✝️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Many nationalities now get visa-free entry for up to 90 days." }] },
  { id: "belize", name: "Belize", region: "Central America", tagline: "Unbelizeable", description: "Caribbean meets jungle. Snorkel the world's second-largest barrier reef, explore Mayan ruins, and tube through caves.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "English" }, { icon: "💰", label: "Currency", value: "Belize Dollar" }, { icon: "🍜", label: "National Dish", value: "Rice & Beans" }, { icon: "🍺", label: "Local Beer", value: "Belikin" }], bucketList: [{ id: "bl-bz1", title: "The Great Blue Hole", description: "Dive or fly over one of the most famous natural wonders.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🕳️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 30 days visa-free." }] },
  { id: "guatemala", name: "Guatemala", region: "Central America", tagline: "Heart of the Mayan World", description: "Volcanoes, colonial cities, and one of the most beautiful lakes in the world. Central America's cultural heartland.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Spanish" }, { icon: "💰", label: "Currency", value: "Quetzal (GTQ)" }, { icon: "🍜", label: "National Dish", value: "Pepián" }, { icon: "🍺", label: "Local Beer", value: "Gallo" }], bucketList: [{ id: "bl-gt1", title: "Lake Atitlán", description: "A volcanic lake surrounded by Mayan villages — the most beautiful lake in the world.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🌊" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 90 days visa-free (CA-4 agreement)." }] },
  { id: "greece", name: "Greece", region: "Europe", tagline: "Where Myths Come Alive", description: "Whitewashed villages, turquoise waters, and 6,000 years of history. The ultimate Mediterranean escape.", heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Greek" }, { icon: "💰", label: "Currency", value: "Euro (EUR)" }, { icon: "🍜", label: "National Dish", value: "Moussaka" }, { icon: "🍺", label: "Local Beer", value: "Mythos" }], bucketList: [{ id: "bl-gr1", title: "Santorini Sunset", description: "Watch the sun sink into the Aegean from Oia — the world's most famous sunset.", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", emoji: "🌅" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "EU/UK/US/Aus/NZ nationals visit visa-free for up to 90 days." }] },
  { id: "italy", name: "Italy", region: "Europe", tagline: "La Dolce Vita", description: "Pizza in Naples, gondolas in Venice, the Colosseum in Rome. A feast for every sense.", heroImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Italian" }, { icon: "💰", label: "Currency", value: "Euro (EUR)" }, { icon: "🍜", label: "National Dish", value: "Pasta" }, { icon: "🍺", label: "Local Beer", value: "Peroni" }], bucketList: [{ id: "bl-it1", title: "Amalfi Coast", description: "The world's most dramatic coastline — cliffs, lemon groves, and crystal water.", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80", emoji: "🍋" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "EU/UK/US/Aus/NZ nationals visit visa-free for up to 90 days." }] },
  { id: "albania", name: "Albania", region: "Europe", tagline: "Europe's Best Kept Secret", description: "Stunning beaches, ancient castles, and prices that'll make you do a double-take. The Albanian Riviera rivals Greece at a fraction of the cost.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Albanian" }, { icon: "💰", label: "Currency", value: "Albanian Lek" }, { icon: "🍜", label: "National Dish", value: "Tavë Kosi" }, { icon: "🍺", label: "Local Beer", value: "Korça" }], bucketList: [{ id: "bl-al1", title: "Albanian Riviera", description: "Pristine beaches without the crowds or the price tag.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🏖️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities visit visa-free for up to 90 days." }] },
  { id: "morocco", name: "Morocco", region: "Africa", tagline: "Gateway to Africa", description: "Sahara sunsets, bustling souks, and mint tea on rooftops. North Africa's most accessible adventure.", heroImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Arabic & French" }, { icon: "💰", label: "Currency", value: "Moroccan Dirham" }, { icon: "🍜", label: "National Dish", value: "Tagine" }, { icon: "🍺", label: "Local Beer", value: "Casablanca" }], bucketList: [{ id: "bl-mo1", title: "Sahara Desert Camp", description: "Sleep under a billion stars — an experience that changes your perspective.", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80", emoji: "🏜️" }], contentSeries: [{ id: "cs-mo1", title: "Marrakech to Sahara", description: "4 days from the medina to the desert.", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80", episodes: 4, tag: "Adventure" }], podcasts: [{ id: "pod-mo1", title: "Morocco: Beyond the Souks", description: "Why Morocco is so much more than Marrakech.", duration: "25 min", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&q=80" }], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get 90 days visa-free." }] },
  { id: "jordan", name: "Jordan", region: "Africa", tagline: "Ancient Wonders", description: "Petra, the Dead Sea, and Wadi Rum. Biblical landscapes and ancient wonders you won't believe are real.", heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "Arabic" }, { icon: "💰", label: "Currency", value: "Jordanian Dinar" }, { icon: "🍜", label: "National Dish", value: "Mansaf" }, { icon: "🍺", label: "Local Beer", value: "Carakale" }], bucketList: [{ id: "bl-jo1", title: "Petra", description: "Walk through the Siq and emerge in front of the Treasury. Indiana Jones vibes.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", emoji: "🏛️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "Most nationalities get visa on arrival. The Jordan Pass includes visa + Petra entry." }] },
  { id: "new-zealand", name: "New Zealand", region: "Oceania", tagline: "Adventure Capital", description: "Bungee jumping, glacier hiking, and Lord of the Rings landscapes. The ultimate adventure destination.", heroImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80", facts: [{ icon: "🗣️", label: "Language", value: "English & Māori" }, { icon: "💰", label: "Currency", value: "NZ Dollar" }, { icon: "🍜", label: "National Dish", value: "Hangi" }, { icon: "🍺", label: "Local Beer", value: "Steinlager" }], bucketList: [{ id: "bl-nz1", title: "Milford Sound", description: "Cruise through dramatic fiords — waterfalls, rainforest, and dolphins.", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", emoji: "🏔️" }], contentSeries: [], podcasts: [], faqs: [{ question: "Do I need a visa?", answer: "UK/EU/US/Aus citizens visit visa-free. You need an NZeTA applied for online." }] },
];
