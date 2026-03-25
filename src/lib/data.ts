// ============================================================
// MOCK DATA — This replaces a real database for the prototype.
// Every page pulls from here so content is easy to update.
// ============================================================

export type TravelStyle = "classic" | "backpacker" | "flashpacker" | "multi_country" | "limited_edition";

export const travelStyleConfig: Record<TravelStyle, { label: string; color: string; icon: string; description: string }> = {
  classic: {
    label: "Classic",
    color: "#2172D5",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    description: "We've perfected the balance between culture, adventure, beaches and parties. A high level of inclusions at a low cost. Highlights, hotspots & hidden gems are crafted into each itinerary with our own TruExclusives. We stay in a variety of different accommodations such as hotels, hostels, homestays, beach huts & even boats.",
  },
  backpacker: {
    label: "Backpacker",
    color: "#6BD495",
    icon: "M20 7h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 4h4v3h-4V4z",
    description: "Maximum adventure, minimum cost. Hostels, street food, local transport, and raw experiences — designed for travellers who want to stretch their budget without missing out.",
  },
  flashpacker: {
    label: "Flashpacker",
    color: "#FF3F99",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    description: "All the adventure with an upgrade. Think boutique hotels, premium experiences, and a few extra touches that make every day feel special — for those who like comfort with their chaos.",
  },
  multi_country: {
    label: "Multi Country",
    color: "#FCA501",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Why pick one country when you can have several? Cross borders, experience contrasting cultures, and pack more into every trip with seamless multi-country itineraries.",
  },
  limited_edition: {
    label: "Limited Edition",
    color: "#FF3F99",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
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
  travelStyle: TravelStyle;
  memberOnly?: boolean;
};

export type Story = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  memberOnly?: boolean;
};

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
    startLocation: "Bangkok",
    endLocation: "Phuket",
    travelStyle: "classic",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    video: "https://cdn.pixabay.com/video/2020/07/30/45349-445400181_large.mp4",
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
  {
    id: "bali-adventure",
    title: "Bali Adventure",
    destination: "Bali",
    region: "Southeast Asia",
    duration: "10 Days",
    price: 799,
    originalPrice: 999,
    travelStyle: "classic",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    tagline: "Temples, rice terraces, and surf breaks",
    description:
      "Discover the island of the gods — from sacred water temples and lush rice terraces to world-class surf and legendary sunsets in Uluwatu.",
    highlights: [
      "Sunrise trek up Mount Batur",
      "Surf lessons in Canggu",
      "Tegallalang Rice Terraces",
      "Uluwatu sunset & fire dance",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Seminyak", description: "Beach club welcome and group dinner." },
      { day: 2, title: "Ubud", description: "Monkey Forest, rice terraces, and artisan villages." },
      { day: 3, title: "Mount Batur Sunrise", description: "Early morning volcano trek with breakfast at the summit." },
      { day: 4, title: "Nusa Penida Day Trip", description: "Instagram-famous cliffs and manta ray snorkelling." },
      { day: 5, title: "Canggu", description: "Surf lessons, beach cafes, and sunset." },
      { day: 6, title: "Gili Islands", description: "Fast boat to Gili T — turquoise paradise." },
      { day: 7, title: "Gili Free Day", description: "Snorkel with turtles, cycle the island, or just float." },
      { day: 8, title: "Return to Bali", description: "Head to Uluwatu for clifftop vibes." },
      { day: 9, title: "Uluwatu", description: "Hidden beaches, fire dance at sunset temple." },
      { day: 10, title: "Departure", description: "Final brunch and airport transfer." },
    ],
  },
  {
    id: "vietnam-explorer",
    title: "Vietnam Explorer",
    destination: "Vietnam",
    region: "Southeast Asia",
    duration: "14 Days",
    price: 949,
    originalPrice: 1199,
    travelStyle: "multi_country",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    tagline: "From bustling cities to misty mountains",
    description:
      "Journey from Hanoi's Old Quarter through the limestone towers of Ha Long Bay, along the coast to Hoi An, and into the energy of Ho Chi Minh City.",
    highlights: [
      "Ha Long Bay overnight cruise",
      "Motorbike tour through Hanoi",
      "Lantern-lit streets of Hoi An",
      "Cu Chi Tunnels experience",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Hanoi", description: "Welcome street food tour." },
      { day: 2, title: "Hanoi", description: "Old Quarter, Ho Chi Minh Mausoleum, and egg coffee." },
      { day: 3, title: "Ha Long Bay", description: "Board the junk boat for an overnight cruise." },
      { day: 4, title: "Ha Long Bay", description: "Kayaking, cave exploring, and swimming." },
      { day: 5, title: "Ninh Binh", description: "Tam Coc boat ride through rice paddies." },
      { day: 6, title: "Fly to Hue", description: "Imperial citadel and royal tombs." },
      { day: 7, title: "Hai Van Pass", description: "Motorbike or bus over Vietnam's most scenic road." },
      { day: 8, title: "Hoi An", description: "Ancient town, lantern making, and tailor shops." },
      { day: 9, title: "Hoi An Free Day", description: "Beach, cooking class, or basket boat ride." },
      { day: 10, title: "Fly to Ho Chi Minh", description: "Saigon street food and rooftop bars." },
      { day: 11, title: "Cu Chi Tunnels", description: "History and war tunnels experience." },
      { day: 12, title: "Mekong Delta", description: "Floating markets and river life." },
      { day: 13, title: "Saigon Free Day", description: "Shopping, cafes, or spa day." },
      { day: 14, title: "Departure", description: "Farewell brunch." },
    ],
  },
  {
    id: "sri-lanka-odyssey",
    title: "Sri Lanka Odyssey",
    destination: "Sri Lanka",
    region: "South Asia",
    duration: "11 Days",
    price: 849,
    travelStyle: "backpacker",
    image: "https://images.unsplash.com/photo-1546708770-599a0e47a9c7?w=800&q=80",
    tagline: "The island that has it all",
    description:
      "Surf epic waves, hike through tea plantations, spot elephants on safari, and explore ancient temples — all on one incredible island.",
    highlights: [
      "Ella train ride through tea country",
      "Safari in Yala National Park",
      "Surfing in Weligama",
      "Sigiriya Rock Fortress climb",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Colombo", description: "Group welcome and city tour." },
      { day: 2, title: "Sigiriya", description: "Climb the ancient rock fortress." },
      { day: 3, title: "Dambulla & Kandy", description: "Cave temples and the Temple of the Tooth." },
      { day: 4, title: "Ella Train", description: "One of the most scenic train rides in the world." },
      { day: 5, title: "Ella", description: "Nine Arches Bridge, Little Adam's Peak." },
      { day: 6, title: "Yala Safari", description: "Leopards, elephants, and crocodiles." },
      { day: 7, title: "Mirissa", description: "Whale watching (seasonal) and beach day." },
      { day: 8, title: "Weligama", description: "Surf lessons and stilt fishermen." },
      { day: 9, title: "Galle", description: "Colonial fort and boutique shops." },
      { day: 10, title: "Unawatuna", description: "Final beach day and farewell dinner." },
      { day: 11, title: "Departure", description: "Transfer to Colombo airport." },
    ],
  },
  {
    id: "costa-rica-pura-vida",
    title: "Costa Rica: Pura Vida",
    destination: "Costa Rica",
    region: "Central America",
    duration: "10 Days",
    price: 1099,
    travelStyle: "flashpacker",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80",
    tagline: "Jungle, volcanoes, and pure life",
    description:
      "Zip-line through cloud forests, surf Pacific waves, soak in volcanic hot springs, and embrace the Pura Vida lifestyle.",
    highlights: [
      "Arenal volcano hot springs",
      "Zip-lining in Monteverde",
      "Surfing in Tamarindo",
      "Manuel Antonio National Park",
    ],
    itinerary: [
      { day: 1, title: "Arrive in San Jose", description: "Welcome dinner." },
      { day: 2, title: "Arenal Volcano", description: "Hot springs, hanging bridges, and waterfall hike." },
      { day: 3, title: "La Fortuna", description: "White water rafting and free time." },
      { day: 4, title: "Monteverde", description: "Cloud forest zip-line and night walk." },
      { day: 5, title: "Tamarindo", description: "Surf lessons and sunset." },
      { day: 6, title: "Tamarindo Free Day", description: "Surf, snorkel, or horseback ride." },
      { day: 7, title: "Manuel Antonio", description: "National park hike — monkeys, sloths, beaches." },
      { day: 8, title: "Manuel Antonio", description: "Free day at the beach." },
      { day: 9, title: "San Jose", description: "Return to the city, farewell dinner." },
      { day: 10, title: "Departure", description: "Pura Vida forever." },
    ],
  },
  {
    id: "morocco-nomad",
    title: "Morocco Nomad",
    destination: "Morocco",
    region: "Africa",
    duration: "9 Days",
    price: 749,
    travelStyle: "limited_edition",
    memberOnly: true,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
    tagline: "From medinas to the Sahara",
    description:
      "Lose yourself in the souks of Marrakech, camp under the stars in the Sahara Desert, and explore the blue city of Chefchaouen. A member-exclusive adventure.",
    highlights: [
      "Sahara Desert overnight camp",
      "Chefchaouen — the Blue City",
      "Marrakech medina tour",
      "Atlas Mountains day hike",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Marrakech", description: "Riad check-in and evening food tour." },
      { day: 2, title: "Marrakech", description: "Souks, palaces, and Jardin Majorelle." },
      { day: 3, title: "Atlas Mountains", description: "Day hike through Berber villages." },
      { day: 4, title: "Sahara Desert", description: "Camel ride and overnight desert camp." },
      { day: 5, title: "Todra Gorge", description: "Dramatic canyon and river walk." },
      { day: 6, title: "Fes", description: "World's oldest university and leather tanneries." },
      { day: 7, title: "Chefchaouen", description: "Wander the blue-washed streets." },
      { day: 8, title: "Return to Marrakech", description: "Free afternoon and farewell dinner." },
      { day: 9, title: "Departure", description: "Airport transfer." },
    ],
  },
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
  },
];

export const regions = [
  { name: "Southeast Asia", count: 3 },
  { name: "South Asia", count: 1 },
  { name: "Central America", count: 1 },
  { name: "Africa", count: 1 },
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

export type VideoDiary = {
  id: string;
  video: string;
  poster: string;
  caption: string;
  author: string;
  handle: string;
  location: string;
  avatar: string;
  tag: "Traveller" | "Creator" | "Influencer";
};

export const videoDiaries: VideoDiary[] = [
  {
    id: "v1",
    video: "https://videos.pexels.com/video-files/4763824/4763824-sd_506_960_24fps.mp4",
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
    video: "https://videos.pexels.com/video-files/3571264/3571264-sd_506_960_30fps.mp4",
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
    video: "https://videos.pexels.com/video-files/4328286/4328286-sd_506_960_25fps.mp4",
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
];
