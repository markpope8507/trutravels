"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { useAuth } from "@/lib/auth-context";
import MemberGate from "@/components/member-gate";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const mockHubs: Record<string, any> = {};

mockHubs["b1"] = {
  bookingRef: "TRU-2026-04871",
  tripTitle: "Thailand Island Hopper",
  duration: "14 Days",
  departureDate: "12 Apr 2026",
  endDate: "25 Apr 2026",
  startLocation: "Bangkok",
  endLocation: "Phuket",
  image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80",
  countries: ["Thailand"],
  tourLeader: {
    name: "Orty",
    image: "/images/orty-thumbnail.png",
    bio: "Born and raised in Chiang Mai. Been leading TruTravels trips for 3 years. I know every hidden beach, the best street food stalls, and exactly where to watch the sunset. Can't wait to show you my Thailand.",
    video: "/videos/orty-welcome.MOV",
  },
  travelGroup: [
    { name: "Alex T.", avatar: "AT", trip: "Thailand Island Hopper", days: "12-25 Apr", color: "#FF3F99", flag: "🇬🇧", age: "25-29", sex: "Male", tripCount: 2 },
    { name: "Sophie C.", avatar: "SC", trip: "Thailand Island Hopper", days: "12-25 Apr", color: "#6BD495", flag: "🇬🇧", age: "20-24", sex: "Female", tripCount: 1, travellingWith: "Jake M." },
    { name: "Jake M.", avatar: "JM", trip: "Thailand Island Hopper", days: "12-25 Apr", color: "#FCA501", flag: "🇦🇺", age: "25-29", sex: "Male", tripCount: 1, travellingWith: "Sophie C." },
    { name: "Priya K.", avatar: "PK", trip: "Thailand Island Hopper", days: "12-25 Apr", color: "#2172D5", flag: "🇮🇳", age: "25-29", sex: "Female", tripCount: 1 },
    { name: "Marcus R.", avatar: "MR", trip: "Total Thailand", days: "5 Apr-1 May", color: "#FF3F99", flag: "🇺🇸", age: "30-34", sex: "Male", tripCount: 3, travellingWith: "Chloe W." },
    { name: "Chloe W.", avatar: "CW", trip: "Total Thailand", days: "5 Apr-1 May", color: "#6BD495", flag: "🇬🇧", age: "20-24", sex: "Female", tripCount: 1, travellingWith: "Marcus R." },
    { name: "Tom A.", avatar: "TA", trip: "Full Moon Island Hopper", days: "10-25 Apr", color: "#FCA501", flag: "🇨🇦", age: "25-29", sex: "Male", tripCount: 2 },
    { name: "Nina W.", avatar: "NW", trip: "Discover Asia", days: "1 Apr-7 May", color: "#2172D5", flag: "🇩🇪", age: "25-29", sex: "Female", tripCount: 4 },
  ],
  chatMessages: [
    { from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Hey everyone! Welcome to your Thailand Island Hopper group chat 🎉 I'm Tru.D — your AI travel assistant. Tag me anytime with @Tru.D and I can help with anything about your trip!", time: "3 days ago", isBot: true },
    { from: "Sophie C.", avatar: "SC", color: "#6BD495", text: "Hiii! Coming from London, first time in Thailand! SO excited 🌴", time: "2 days ago" },
    { from: "Marcus R.", avatar: "MR", color: "#2172D5", text: "Doing the Total Thailand so I'll be with you guys for the island hopper section!", time: "1 day ago" },
    { from: "Jake M.", avatar: "JM", color: "#FCA501", text: "@Tru.D do we need to get the digital arrival card sorted before we fly?", time: "5 hours ago" },
    { from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Yes! Register at tdac.immigration.go.th at least 3 days before arrival 🛂", time: "5 hours ago", isBot: true },
  ],
  preDeparture: [
    { icon: "🏨", label: "Meeting Point", value: "Your start hotel in Bangkok — exact address sent 1 week before. Check-in 2pm, welcome meeting 6pm." },
    { icon: "🛂", label: "Visa & Entry", value: "Most nationalities 30-60 days visa-free. Register for Digital Arrival Card online within 3 days of arrival." },
    { icon: "✈️", label: "Fly Into", value: "Suvarnabhumi Airport (BKK) — Bangkok's main international airport. Don Muang (DMK) also accepted." },
    { icon: "🛫", label: "Fly Home", value: "Phuket International Airport (HKT). Return to Bangkok not included — fly (~£65) or bus/ferry (~£30)." },
    { icon: "💰", label: "Currency", value: "Thai Baht (THB). ATMs everywhere, 220 THB (~£5) fee per withdrawal." },
    { icon: "🛒", label: "Spending", value: "Budget £15-25/day. Street food £1-2, beers £1-3." },
    { icon: "💉", label: "Health", value: "Recommended: Hepatitis A, Typhoid, Tetanus. Consult GP 6 weeks before." },
    { icon: "🆘", label: "Emergency", value: "24/7 emergency line: +66 XX XXX XXXX" },
  ],
  packing: [
    { item: "Backpack (not suitcase)", emoji: "🎒" },
    { item: "Reef-safe suncream", emoji: "🧴" },
    { item: "Reusable water bottle", emoji: "💧" },
    { item: "Mosquito repellent", emoji: "🦟" },
    { item: "Light rain jacket", emoji: "🌧️" },
    { item: "Warm layer for train", emoji: "🧥" },
    { item: "Swimwear (multiple)", emoji: "👙" },
    { item: "Quick-dry towel", emoji: "🏖️" },
    { item: "Flip flops + trainers", emoji: "👟" },
    { item: "Portable charger", emoji: "🔋" },
    { item: "Padlock for lockers", emoji: "🔒" },
    { item: "Passport + insurance copies", emoji: "📄" },
  ],
  itinerary: [
    { day: 1, title: "Welcome to Thailand!", location: "Bangkok" },
    { day: 2, title: "Temples & River Cruise", location: "Bangkok" },
    { day: 3, title: "Overnight Train South", location: "Bangkok → South" },
    { day: 4, title: "Khao Sok National Park", location: "Khao Sok" },
    { day: 5, title: "Bottle Beach", location: "Koh Phangan" },
    { day: 6, title: "Muay Thai Lesson", location: "Koh Phangan" },
    { day: 7, title: "Island Boat Trip", location: "Koh Phangan" },
    { day: 8, title: "Koh Tao", location: "Koh Tao" },
    { day: 9, title: "Koh Nang Yuan", location: "Koh Tao" },
    { day: 10, title: "Free Day", location: "Koh Tao" },
    { day: 11, title: "Phi Phi Islands", location: "Phi Phi" },
    { day: 12, title: "Maya Bay", location: "Phi Phi" },
    { day: 13, title: "Phuket", location: "Phuket" },
    { day: 14, title: "Check Out", location: "Phuket" },
  ],
  videoReviews: [
    { id: "vr1", poster: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400&q=80", name: "Jess W.", flag: "🇬🇧", caption: "Khao Sok was genuinely magical. Waking up on the floating bungalows — unreal.", date: "Mar 2026", tripCount: "1st Trip" },
    { id: "vr2", poster: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=400&q=80", name: "Ryan K.", flag: "🇦🇺", caption: "Bottle Beach is something else. The fire show at night was the highlight of my whole trip.", date: "Feb 2026", tripCount: "2nd Trip" },
    { id: "vr3", poster: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80", name: "Amara D.", flag: "🇺🇸", caption: "Maya Bay in real life hits different. I cried. Not even embarrassed about it.", date: "Jan 2026", tripCount: "1st Trip" },
    { id: "vr4", poster: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400&q=80", name: "Tom H.", flag: "🇬🇧", caption: "Best two weeks of my life, no exaggeration. Already booked Vietnam for July.", date: "Dec 2025", tripCount: "1st Trip" },
    { id: "vr5", poster: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80", name: "Mia C.", flag: "🇨🇦", caption: "I came solo and left with 15 new mates. The group vibe is unmatched.", date: "Nov 2025", tripCount: "3rd Trip" },
    { id: "vr6", poster: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80", name: "Luca B.", flag: "🇮🇹", caption: "Koh Tao diving was incredible. Crystal clear water and the group was so fun.", date: "Oct 2025", tripCount: "1st Trip" },
  ],
};

mockHubs["b2"] = {
  bookingRef: "TRU-2026-05912",
  tripTitle: "Vietnam Explorer",
  duration: "13 Days",
  departureDate: "5 Jul 2026",
  endDate: "17 Jul 2026",
  startLocation: "Ho Chi Minh City",
  endLocation: "Hanoi",
  image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80",
  countries: ["Vietnam"],
  tourLeader: null,
  travelGroup: [
    { name: "Alex T.", avatar: "AT", trip: "Vietnam Explorer", days: "5-17 Jul", color: "#FF3F99", flag: "🇬🇧", age: "25-29", sex: "Male", tripCount: 2 },
    { name: "Liam O.", avatar: "LO", trip: "Vietnam Explorer", days: "5-17 Jul", color: "#2172D5", flag: "🇮🇪", age: "25-29", sex: "Male", tripCount: 1, travellingWith: "Emma S." },
    { name: "Emma S.", avatar: "ES", trip: "Vietnam Explorer", days: "5-17 Jul", color: "#6BD495", flag: "🇬🇧", age: "20-24", sex: "Female", tripCount: 1, travellingWith: "Liam O." },
    { name: "Mei L.", avatar: "ML", trip: "Vietnam Explorer", days: "5-17 Jul", color: "#FCA501", flag: "🇸🇬", age: "25-29", sex: "Female", tripCount: 1 },
    { name: "Yuki T.", avatar: "YT", trip: "Cambodia & Vietnam Explorer", days: "22 Jun-17 Jul", color: "#FCA501", flag: "🇯🇵", age: "25-29", sex: "Female", tripCount: 3 },
  ],
  chatMessages: [
    { from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Hey everyone! Welcome to your Vietnam Explorer group chat 🎉 I'm Tru.D — your AI travel assistant. Your tour leader hasn't been assigned yet but I'm here to answer any questions in the meantime!", time: "1 day ago", isBot: true },
    { from: "Liam O.", avatar: "LO", color: "#2172D5", text: "Can't wait! First time in Vietnam. Any must-try street food?", time: "5 hours ago" },
    { from: "Tru.D", avatar: "✨", color: "#FF3F99", text: "Oh you're in for a treat Liam! Must-tries: Pho (obviously), Banh Mi, Bun Cha, Cao Lau in Hoi An, and egg coffee in Hanoi. Budget about £1-3 per meal — it's incredible value 🍜", time: "5 hours ago", isBot: true },
  ],
  preDeparture: [
    { icon: "🏨", label: "Meeting Point", value: "Your start hotel in Ho Chi Minh City — exact address sent 1 week before. Check-in 2pm, welcome meeting 6pm." },
    { icon: "🛂", label: "Visa & Entry", value: "Most nationalities need an e-visa (~$25 USD, 3-5 working days). Apply at evisa.xuatnhapcanh.gov.vn" },
    { icon: "✈️", label: "Fly Into", value: "Tan Son Nhat International Airport (SGN) — Ho Chi Minh City." },
    { icon: "🛫", label: "Fly Home", value: "Noi Bai International Airport (HAN) — Hanoi." },
    { icon: "💰", label: "Currency", value: "Vietnamese Dong (VND). ATMs widely available. Cards accepted in cities." },
    { icon: "🛒", label: "Spending", value: "Budget £10-20/day. Vietnam is incredibly affordable — street food under £1." },
    { icon: "💉", label: "Health", value: "Recommended: Hepatitis A, Typhoid, Tetanus. Consult GP 6 weeks before." },
    { icon: "🆘", label: "Emergency", value: "24/7 emergency line: +84 XX XXX XXXX" },
  ],
  packing: [
    { item: "Backpack (40-60L)", emoji: "🎒" },
    { item: "Lightweight rain jacket", emoji: "🌧️" },
    { item: "Mosquito repellent", emoji: "🦟" },
    { item: "Reusable water bottle", emoji: "💧" },
    { item: "Sun hat & sunglasses", emoji: "🕶️" },
    { item: "Trainers for trekking", emoji: "👟" },
    { item: "Swimwear", emoji: "👙" },
    { item: "Portable charger", emoji: "🔋" },
    { item: "Long sleeves for temples", emoji: "👕" },
    { item: "Passport + insurance copies", emoji: "📄" },
  ],
  itinerary: [
    { day: 1, title: "Welcome to Vietnam!", location: "Ho Chi Minh City" },
    { day: 2, title: "Cu Chi Tunnels", location: "Ho Chi Minh City" },
    { day: 3, title: "Mekong Delta", location: "Mekong Delta" },
    { day: 4, title: "Fly to Da Nang", location: "Hoi An" },
    { day: 5, title: "Hoi An Ancient Town", location: "Hoi An" },
    { day: 6, title: "Hai Van Pass", location: "Hue" },
    { day: 7, title: "Imperial Citadel", location: "Hue" },
    { day: 8, title: "Phong Nha Caves", location: "Phong Nha" },
    { day: 9, title: "Train to Hanoi", location: "Hanoi" },
    { day: 10, title: "Hanoi Old Quarter", location: "Hanoi" },
    { day: 11, title: "Ha Long Bay Cruise", location: "Ha Long Bay" },
    { day: 12, title: "Ha Long Bay", location: "Ha Long Bay" },
    { day: 13, title: "Departure", location: "Hanoi" },
  ],
  videoReviews: [
    { id: "vr1", poster: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80", name: "Chloe R.", flag: "🇬🇧", caption: "Ha Long Bay on the cruise was a dream. Woke up surrounded by limestone towers in the mist.", date: "Feb 2026", tripCount: "1st Trip" },
    { id: "vr2", poster: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80", name: "Dan S.", flag: "🇮🇪", caption: "Hoi An is pure magic. The lanterns, the food, the tailors — I could have stayed a week.", date: "Jan 2026", tripCount: "2nd Trip" },
    { id: "vr3", poster: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=400&q=80", name: "Priya M.", flag: "🇮🇳", caption: "The Hai Van Pass on motorbikes was the most exhilarating thing I've ever done.", date: "Dec 2025", tripCount: "1st Trip" },
    { id: "vr4", poster: "https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&q=80", name: "Jake T.", flag: "🇺🇸", caption: "Street food in Hanoi is next level. Egg coffee changed my life. Not joking.", date: "Nov 2025", tripCount: "1st Trip" },
  ],
};

const techItinerary = [
  { day: 1, title: "Welcome to Thailand!", description: "A city with as much history as it has traffic, more sticky rice than you could ever imagine. Tonight you'll meet your group and tour leader on the famous Khao San Road — grab some local street food, sink a few cold ones, and get to know the people you're about to have the time of your life with.", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80", hotel: "NapPark Hostel", hotelAddress: "5 Tani Rd, Khao San, Bangkok 10200", mapLink: "https://maps.google.com/?q=NapPark+Hostel+Bangkok", meetingPoint: "Hotel lobby", meetingTime: "6:00 PM", startTime: "Free day — check-in from 2:00 PM", meals: "Dinner included", experiences: [] },
  { day: 2, title: "Bangkok Temples & River Cruise", description: "Start with a traditional boat journey through Bangkok's back canals and along the Chao Phraya River — it's like seeing a completely different side of the city. Visit the stunning Wat Arun temple glowing in the morning light, then head to Wat Pho to see the famous reclining Buddha. Tonight, it's your call — rooftop cocktails or dive into Bangkok's legendary nightlife.", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80", hotel: "NapPark Hostel", hotelAddress: "5 Tani Rd, Khao San, Bangkok 10200", mapLink: "https://maps.google.com/?q=NapPark+Hostel+Bangkok", meetingPoint: "Hotel lobby", meetingTime: "8:00 AM", startTime: "8:00 AM — Full day", meals: "Breakfast included", experiences: [{ name: "Local Lens", color: "#2172D5" }, { name: "Bucket List", color: "#FCA501" }] },
  { day: 3, title: "Massage & Overnight Train", description: "You've earned a treat — kick off the day with a traditional Thai massage before boarding the overnight train heading south towards Khao Sok National Park. There's something magical about falling asleep to the rhythm of the rails, watching Thailand's countryside slip by through the window.", image: "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=800&q=80", hotel: "Overnight train (sleeper berth)", hotelAddress: "Hua Lamphong Station, Bangkok", mapLink: "https://maps.google.com/?q=Hua+Lamphong+Station+Bangkok", meetingPoint: "Hotel lobby for massage, then station", meetingTime: "10:00 AM", startTime: "10:00 AM — Train departs 5:30 PM", meals: "Breakfast included", experiences: [{ name: "Local Lens", color: "#2172D5" }, { name: "Unplugged", color: "#00BBB4" }] },
  { day: 4, title: "Khao Sok National Park", description: "Wake up to one of Thailand's best-kept secrets. Khao Sok is all emerald lakes, towering limestone mountains, and floating bungalows that feel like something from a movie. Spend the day kayaking across the lake, swimming in impossibly green water, and soaking it all in. Dinner tonight is a Thai buffet at the floating restaurant — doesn't get much better than this.", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80", hotel: "Khao Sok Floating Bungalows", hotelAddress: "Cheow Lan Lake, Khao Sok National Park", mapLink: "https://maps.google.com/?q=Cheow+Lan+Lake+Khao+Sok", meetingPoint: "Arrive by boat from park entrance", meetingTime: "Arrival ~10:00 AM", startTime: "All day at the lake", meals: "Lunch & dinner included", experiences: [{ name: "Tru-ly Unique", color: "#6BD495" }, { name: "Unplugged", color: "#00BBB4" }] },
  { day: 5, title: "Bottle Beach Experience", description: "One of our absolute favourite spots in the world — Bottle Beach. It's a stunningly beautiful little beach only accessible by boat, and today it's all yours. Swim, play volleyball, trek through the jungle, or just do absolutely nothing. As the sun goes down, we put on a TruExclusive evening — dinner on the sand, cocktails, and a private fire show. Pure magic.", image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80", hotel: "Bottle Beach Bungalows", hotelAddress: "Bottle Beach, Koh Phangan", mapLink: "https://maps.google.com/?q=Bottle+Beach+Koh+Phangan", meetingPoint: "Boat pickup from Thong Sala pier", meetingTime: "11:00 AM", startTime: "11:00 AM — Boat to Bottle Beach", meals: "Dinner included (TruExclusive)", experiences: [{ name: "Tru-ly Unique", color: "#6BD495" }, { name: "Bucket List", color: "#FCA501" }] },
  { day: 6, title: "Morning Chill & Muay Thai", description: "No alarms today. Sleep in, soak up the beach vibes, or hike up to the Bottle Beach viewpoint for jaw-dropping views across the coast. In the afternoon, get your hands wrapped for an intro lesson in Muay Thai — Thailand's national sport. Whether you're a natural or completely useless, it's an absolute laugh.", image: "https://images.unsplash.com/photo-1504276048855-f3d1e4c69a17?w=800&q=80", hotel: "Bottle Beach Bungalows", hotelAddress: "Bottle Beach, Koh Phangan", mapLink: "https://maps.google.com/?q=Bottle+Beach+Koh+Phangan", meetingPoint: "Beach area", meetingTime: "Free morning — Muay Thai at 2:00 PM", startTime: "Free morning", meals: "None included", experiences: [{ name: "Rise Up", color: "#FF3F99" }] },
  { day: 7, title: "Koh Phangan Island Boat Trip", description: "Jump on a boat and spend the day island-hopping around Koh Phangan's stunning coastline. Stop off at secret snorkelling spots, swim in crystal-clear coves, and soak up the sun on deck. Lunch is included on the boat. Get back to shore just in time for sunset, then head out for dinner and drinks.", image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80", hotel: "Haad Rin Beach Resort", hotelAddress: "Haad Rin Beach, Koh Phangan", mapLink: "https://maps.google.com/?q=Haad+Rin+Koh+Phangan", meetingPoint: "Thong Sala pier", meetingTime: "9:00 AM", startTime: "9:00 AM — Full day boat trip", meals: "Lunch included", experiences: [{ name: "Bucket List", color: "#FCA501" }] },
  { day: 8, title: "Koh Tao Bound", description: "Speed boat across to Koh Tao — the diving capital of Thailand. Check into your spot near Sairee Beach, lined with cool little restaurants and beach bars. The afternoon is yours to explore — rent a scooter, find a quiet beach, or just wander and take it all in. This island has serious vibes.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", hotel: "Sairee Cottage Resort", hotelAddress: "Sairee Beach, Koh Tao", mapLink: "https://maps.google.com/?q=Sairee+Beach+Koh+Tao", meetingPoint: "Thong Sala pier for boat", meetingTime: "8:30 AM", startTime: "8:30 AM — Arrive Koh Tao ~11:00 AM", meals: "None included", experiences: [] },
  { day: 9, title: "Koh Nang Yuan Day Trip", description: "Today's a big one. Boat trip to the iconic Koh Nang Yuan — three tiny islands connected by a white sand bar that you've definitely seen on Instagram. Snorkel in some of the clearest water you'll ever see, or just chill on the boat and take in the views. Group dinner tonight followed by beach bar hopping.", image: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&q=80", hotel: "Sairee Cottage Resort", hotelAddress: "Sairee Beach, Koh Tao", mapLink: "https://maps.google.com/?q=Sairee+Beach+Koh+Tao", meetingPoint: "Mae Haad pier", meetingTime: "9:30 AM", startTime: "9:30 AM — Return ~4:00 PM", meals: "Lunch included", experiences: [{ name: "Bucket List", color: "#FCA501" }] },
  { day: 10, title: "Get Active or Relax", description: "Your last full day on Koh Tao — make it count. Head to Tanote Bay for some of the island's best swimming, try your hand at wakeboarding or cliff jumping, or just claim a sun lounger and do absolutely nothing. No judgement either way. Soak up every last second of island life.", image: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=80", hotel: "Sairee Cottage Resort", hotelAddress: "Sairee Beach, Koh Tao", mapLink: "https://maps.google.com/?q=Sairee+Beach+Koh+Tao", meetingPoint: "No group meeting — free day", meetingTime: "Free day", startTime: "Free day", meals: "None included", experiences: [{ name: "Unplugged", color: "#00BBB4" }] },
  { day: 11, title: "Travel to Phi Phi Islands", description: "Say goodbye to Koh Tao and hop on the afternoon speed boat to the Phi Phi Islands. Check in, freshen up, and get ready for a group dinner on one of the most beautiful islands on the planet. The views here are absolutely unreal — you'll understand when you see them.", image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80", hotel: "PP Charlie Beach Resort", hotelAddress: "Loh Dalum Bay, Phi Phi Island", mapLink: "https://maps.google.com/?q=Phi+Phi+Island+Loh+Dalum", meetingPoint: "Koh Tao pier — boat departs 9:00 AM", meetingTime: "8:30 AM", startTime: "8:30 AM — Arrive Phi Phi ~3:00 PM", meals: "Dinner included", experiences: [] },
  { day: 12, title: "Maya Bay — The Beach", description: "Full-day island excursion to Maya Bay — the filming location from 'The Beach' with Leonardo DiCaprio. Snorkel at Monkey Beach, explore Viking Cave, and cruise past towering limestone cliffs. Lunch on the boat, sunset views from the deck. This is one of those days you'll never forget.", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80", hotel: "PP Charlie Beach Resort", hotelAddress: "Loh Dalum Bay, Phi Phi Island", mapLink: "https://maps.google.com/?q=Phi+Phi+Island+Loh+Dalum", meetingPoint: "Tonsai pier", meetingTime: "8:00 AM", startTime: "8:00 AM — Full day trip", meals: "Lunch included", experiences: [{ name: "Bucket List", color: "#FCA501" }] },
  { day: 13, title: "Phuket", description: "Optional early morning viewpoint hike in Phi Phi — worth the effort if you're up for it. Then transfer to Phuket for your final afternoon of freedom. Relax by the pool, hit the beach, or explore the town. Tonight is the big farewell — group dinner followed by a proper send-off night out in Patong.", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80", hotel: "Lub d Phuket Patong", hotelAddress: "Bangla Rd, Patong, Phuket", mapLink: "https://maps.google.com/?q=Lub+d+Phuket+Patong", meetingPoint: "Phi Phi pier for boat", meetingTime: "10:00 AM", startTime: "10:00 AM — Arrive Phuket ~1:00 PM", meals: "Dinner included", experiences: [{ name: "Rise Up", color: "#FF3F99" }] },
  { day: 14, title: "Chilled Check Out", description: "And just like that, it's over. But not really — because you've just made friends for life, filled your camera roll with bangers, and had the kind of adventure most people only dream about. We'll help you sort onward travel, swap details with the crew, and say those bittersweet goodbyes. See you on the next one.", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80", hotel: "Lub d Phuket Patong", hotelAddress: "Bangla Rd, Patong, Phuket", mapLink: "https://maps.google.com/?q=Lub+d+Phuket+Patong", meetingPoint: "Hotel reception", meetingTime: "Check out by 11:00 AM", startTime: "Check out by 11:00 AM", meals: "Breakfast included", experiences: [] },
];

function TripHubItinerary() {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      {techItinerary.map((day) => {
        const isOpen = openDay === day.day;
        return (
          <div key={day.day} className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
            <button onClick={() => setOpenDay(isOpen ? null : day.day)} className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-white/5 transition-colors">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-tru-pink text-white flex items-center justify-center text-sm font-bold">{day.day}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base">{day.title}</p>
              </div>
              <svg className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>

            <div className={`transition-all duration-300 ease-out overflow-hidden ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="px-4 sm:pl-[72px] pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-5">
                  {day.image && (
                    <div className="rounded-lg overflow-hidden mb-4 sm:mb-0 sm:w-48 sm:h-36 sm:flex-shrink-0">
                      <img src={day.image} alt={day.title} className="w-full h-48 sm:h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{day.description}</p>

                    {/* Tech details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-tru-pink flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Start Time</p>
                          <p className="text-white text-xs">{day.startTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-tru-green flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <div>
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Meeting Point</p>
                          <p className="text-white text-xs">{day.meetingPoint} &middot; {day.meetingTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Hotel */}
                    <div className="rounded-lg bg-white/5 border border-white/5 px-3 py-2.5 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <svg className="h-4 w-4 text-tru-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                          <div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Accommodation</p>
                            <p className="text-white text-xs font-semibold">{day.hotel}</p>
                            <p className="text-gray-500 text-[10px]">{day.hotelAddress}</p>
                          </div>
                        </div>
                        <a href={day.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-full bg-tru-blue/20 px-3 py-1.5 text-[10px] font-semibold text-tru-blue hover:bg-tru-blue/30 transition flex-shrink-0">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Map
                        </a>
                      </div>
                    </div>

                    {/* Meals */}
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="h-3.5 w-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513" /></svg>
                      <p className="text-gray-400 text-xs">{day.meals}</p>
                    </div>

                    {/* Experience types */}
                    {day.experiences.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {day.experiences.map((exp: any) => (
                          <span key={exp.name} className="text-[9px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-full" style={{ background: exp.color }}>{exp.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TripHubFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "What time should I arrive on Day 1?", a: "Check-in is from 2pm at the start hotel. The welcome meeting and group dinner is at 6pm — don't miss it! That's where you'll meet everyone and your tour leader will run through the plan." },
    { q: "Do I need travel insurance?", a: "Yes — travel insurance is mandatory for all TruTravels trips. Make sure your policy covers medical expenses, repatriation, and any adventure activities you plan to do (diving, etc). Upload your details in the Good to Go section of your booking." },
    { q: "What if I arrive late or miss the welcome meeting?", a: "No stress. Let us know your arrival time and we'll make sure your tour leader has your details. You can catch up with the group at the hotel — they'll fill you in on everything." },
    { q: "How much luggage should I bring?", a: "One backpack (40-60L) is ideal. You'll be moving between islands by boat, bus, and train — a big suitcase is a nightmare. Most places have laundry services for about £1-2 per kilo." },
    { q: "Is it safe to drink the tap water?", a: "No — don't drink the tap water in Thailand. Bottled water is cheap and available everywhere. Bring a reusable bottle and refill at filtered water stations (most hostels have them)." },
    { q: "Will I have free time or is everything scheduled?", a: "It's a mix. Some days are packed with activities, others have loads of free time. Your tour leader will always let you know what's optional and what's a must. There's no pressure to do everything." },
    { q: "What happens if I get sick on the trip?", a: "Your tour leader is first-aid trained and knows the local hospitals and clinics. Thailand has excellent medical facilities in tourist areas. Make sure your travel insurance is sorted and keep a copy of your policy handy." },
    { q: "Can I extend my trip or change my return flight?", a: "Absolutely. Many travellers extend in Phuket or fly to another destination after the trip ends. Your tour leader can help with onward travel on the last day. Just make sure your visa allows the extra time." },
    { q: "Is there Wi-Fi available?", a: "Most hotels and cafes have Wi-Fi, but don't count on it being fast or reliable everywhere — especially on the islands. We'd recommend getting a local SIM card at the airport (around £5-10 for data)." },
    { q: "What's the group size?", a: "Groups are typically 10-25 people depending on the tour and time of year. It's the perfect size to make close friendships without feeling like a massive tour group." },
  ];
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors">
            <span className="text-white text-sm font-semibold pr-4">{faq.q}</span>
            <svg className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div className={`transition-all duration-300 ease-out overflow-hidden ${openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-5 pb-4"><p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TripHubContent({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const hub = mockHubs[bookingId] || mockHubs["b1"];
  const tripGroups = [...new Set(hub.travelGroup.map((t: any) => t.trip))] as string[];

  const sections = [
    { id: "leader", label: "Leader" },
    { id: "group", label: "Group" },
    { id: "chat", label: "Chat" },
    { id: "itinerary", label: "Itinerary" },
    { id: "prep", label: "Prep" },
    { id: "faqs", label: "FAQs" },
  ];

  const [activeSection, setActiveSection] = useState("leader");
  const [navSticky, setNavSticky] = useState(false);
  const [truDOpen, setTruDOpen] = useState(false);
  const [leaderVideoOpen, setLeaderVideoOpen] = useState(false);
  const [truDInput, setTruDInput] = useState("");
  const [truDMessages, setTruDMessages] = useState([
    { from: "Tru.D", text: "Hey! I'm Tru.D, your AI travel assistant ✨ Ask me anything about your trip — visa info, packing tips, currency, itinerary questions, or anything else. I'm here to help!", isBot: true },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const bar = document.getElementById("hub-bar");
      if (bar) setNavSticky(bar.getBoundingClientRect().bottom < 0);

      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero — compact like explore page */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tru-pink/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/member/dashboard" className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition mb-6">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.2em] mb-2 font-heading">🔑 Your Trip Hub</p>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight mb-2">
                {hub.tripTitle}
              </h1>
              <p className="text-xl sm:text-2xl font-handwriting text-tru-pink mb-3">{hub.departureDate} &mdash; {hub.endDate}</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {hub.startLocation} &rarr; {hub.endLocation}
                </span>
                <span>{hub.duration}</span>
                <span>{hub.travelGroup.length} travellers</span>
              </div>
            </div>

            {/* Tour leader mini card */}
            {hub.tourLeader ? (
              <div className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3">
                <img src={hub.tourLeader.image} alt={hub.tourLeader.name} className="h-12 w-12 rounded-full object-cover border-2 border-tru-pink" />
                <div>
                  <p className="text-white text-sm font-bold">{hub.tourLeader.name}</p>
                  <p className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider">Tour Leader</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-[10px] border border-dashed border-white/20 bg-white/5 px-4 py-3">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-gray-500 border-2 border-dashed border-white/20">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-bold">TBC</p>
                  <p className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider">Tour Leader</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section bar — in flow */}
      <div id="hub-bar" className="bg-tru-navy/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 overflow-x-auto scrollbar-hide">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex-1 text-center py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading whitespace-nowrap transition-all duration-200 ${
                  activeSection === s.id ? "text-tru-pink border-b-2 border-tru-pink" : "text-gray-400 hover:text-white border-b-2 border-transparent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed duplicate when scrolled past */}
      <div className={`fixed top-0 left-0 right-0 z-[60] bg-tru-navy/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${navSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 overflow-x-auto scrollbar-hide">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`flex-1 text-center py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider font-heading whitespace-nowrap transition-all duration-200 ${
                  activeSection === s.id ? "text-tru-pink border-b-2 border-tru-pink" : "text-gray-400 hover:text-white border-b-2 border-transparent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* LEADER */}
        <section id="leader">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Your Guide</p>
          {hub.tourLeader ? (
            <>
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Meet {hub.tourLeader.name}</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Vertical video thumbnail */}
                <div
                  className="relative w-full sm:w-56 flex-shrink-0 aspect-[9/16] rounded-[10px] overflow-hidden cursor-pointer group"
                  onClick={() => setLeaderVideoOpen(true)}
                >
                  <img src={hub.tourLeader.image} alt={hub.tourLeader.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-tru-pink text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Tour Leader</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-bold">{hub.tourLeader.name}</p>
                    <p className="text-gray-300 text-xs">Tap to watch welcome message</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={hub.tourLeader.image} alt={hub.tourLeader.name} className="h-14 w-14 rounded-full object-cover border-2 border-tru-pink" />
                    <div>
                      <p className="text-white font-black text-lg font-heading uppercase">{hub.tourLeader.name}</p>
                      <p className="text-tru-pink text-[10px] font-semibold uppercase tracking-wider">Tour Leader &middot; {hub.countries.join(", ")}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{hub.tourLeader.bio}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Your Tour Leader</h2>
              <div className="rounded-[10px] border border-dashed border-white/20 bg-white/5 p-8 sm:p-10 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center mb-5">
                  <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <p className="text-white text-lg font-bold font-heading uppercase mb-2">Coming Soon</p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-4">
                  Your tour leader will be assigned within 60 days of your departure date. Once assigned, you&apos;ll see their welcome video, bio, and they&apos;ll join the group chat on Day 1.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-tru-pink/10 border border-tru-pink/20 px-4 py-2">
                  <svg className="h-4 w-4 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-tru-pink text-xs font-semibold">Departure: {hub.departureDate}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Leader video fullscreen */}
        {hub.tourLeader && leaderVideoOpen && (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <button onClick={() => setLeaderVideoOpen(false)} className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="relative w-full h-full max-w-md mx-auto">
              <video autoPlay playsInline src={hub.tourLeader.video} poster={hub.tourLeader.image} className="absolute inset-0 h-full w-full object-cover sm:rounded-[16px]" controls />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none sm:rounded-b-[16px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-tru-pink flex items-center justify-center text-xs font-bold text-white">T</div>
                  <div>
                    <p className="text-white text-sm font-bold">{hub.tourLeader.name}</p>
                    <p className="text-gray-300 text-xs">Your Tour Leader</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GROUP */}
        <section id="group">
          <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Your People</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-2">Travel Group</h2>
          <p className="text-gray-400 text-sm mb-6">Everyone on overlapping dates — including combo and multi-country tours.</p>
          {tripGroups.map((tripName) => {
            const members = hub.travelGroup.filter((t: any) => t.trip === tripName);
            return (
              <div key={tripName} className="mb-6">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">{tripName}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {members.map((m: any, i: number) => (
                    <div key={i} className="rounded-[10px] border border-white/10 bg-white/5 p-4 flex items-center gap-3 hover:border-white/20 transition">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: m.color }}>{m.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <p className="text-white text-base font-semibold">{m.name}</p>
                            <span className="text-lg">{m.flag}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white">
                            {m.tripCount === 1 ? "1st Trip" : `${m.tripCount}${m.tripCount === 2 ? "nd" : m.tripCount === 3 ? "rd" : "th"} Trip`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-gray-400 text-xs">{m.sex} · Age {m.age}</p>
                          <p className="text-gray-500 text-xs">{m.days}</p>
                        </div>
                        {(m as any).travellingWith && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            <p className="text-gray-400 text-xs">Travelling with {(m as any).travellingWith}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* CHAT — preview + CTA */}
        <section id="chat">
          <p className="text-tru-blue text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Connect</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-2">Group Chat</h2>
          <p className="text-gray-400 text-sm mb-6">Chat with everyone on your dates — your group, combo travellers, and Tru.D your AI assistant.</p>
          <div className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden relative">
            <div className="p-4 sm:p-6 space-y-4 max-h-[220px] overflow-hidden">
              {hub.chatMessages.slice(0, 3).map((msg: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${(msg as any).isBot ? "bg-gradient-to-br from-tru-pink to-tru-blue text-base" : "text-[9px] font-bold text-white"}`} style={!(msg as any).isBot ? { background: msg.color } : undefined}>{msg.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 mb-1">{(msg as any).isBot ? <span className="text-tru-pink font-semibold">Tru.D</span> : msg.from} &middot; {msg.time}</p>
                    <p className="text-gray-300 text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-tru-navy via-tru-navy/80 to-transparent flex flex-col items-center justify-end pb-8">
              <div className="flex -space-x-2 mb-3">
                {hub.travelGroup.slice(0, 5).map((t: any, i: number) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-tru-navy flex items-center justify-center text-[8px] font-bold text-white" style={{ background: t.color }}>{t.avatar}</div>
                ))}
              </div>
              <p className="text-white font-semibold text-sm mb-1">{hub.chatMessages.length} messages</p>
              <p className="text-gray-400 text-xs mb-4">{hub.travelGroup.length} people in this chat</p>
              <Link
                href={`/member/trip-hub/${bookingId}/chat`}
                className="rounded-[10px] bg-tru-blue px-8 py-3 text-sm font-semibold text-white hover:bg-tru-blue/80 transition-all duration-300 uppercase tracking-wider font-heading flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Enter Chat
              </Link>
            </div>
          </div>
        </section>

        {/* ITINERARY */}
        <section id="itinerary">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Day by Day</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Your Itinerary</h2>
          <TripHubItinerary />
        </section>

        {/* PREP */}
        <section id="prep">
          <p className="text-tru-blue text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Need to Know</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Before You Go</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hub.preDeparture.map((item: any) => (
              <div key={item.label} className="rounded-[10px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-white text-sm font-bold font-heading uppercase tracking-wider">{item.label}</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PACKING */}
        <section id="packing">
          <p className="text-tru-green text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Get Ready</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-2">Packing Checklist</h2>
          <p className="text-gray-400 text-sm mb-6">Pack light — backpack not suitcase. You&apos;ll be moving between islands.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {hub.packing.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-lg flex-shrink-0">{item.emoji}</span>
                <p className="text-gray-300 text-sm">{item.item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIPPING */}
        <section id="tipping">
          <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Good to Know</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Tipping Culture</h2>
          <div className="rounded-[10px] border border-white/10 bg-white/5 p-5 sm:p-6 space-y-5">
            <p className="text-gray-300 text-sm leading-relaxed">Tipping isn&apos;t mandatory in Thailand, but it&apos;s appreciated and a great way to show gratitude for good service. Here&apos;s a quick guide:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { who: "Tour Leader", tip: "200-500 THB per day (~£5-12)", note: "Totally optional but a lovely gesture at the end of the trip if they made your experience special." },
                { who: "Restaurants", tip: "Round up or 10%", note: "Not expected at street food stalls. At sit-down restaurants, rounding up or leaving 20-50 THB is appreciated." },
                { who: "Taxi / Tuk-Tuk", tip: "Round up the fare", note: "No need to tip on metered taxis. For tuk-tuks, agree a price before you get in." },
                { who: "Hotel Staff", tip: "20-50 THB", note: "For housekeeping or porters. Leave on the pillow or hand directly." },
                { who: "Massage", tip: "50-100 THB", note: "Standard practice after a Thai massage. They work hard!" },
                { who: "Boat Crews / Guides", tip: "50-100 THB per person", note: "For day trip guides and boat crews who make the experience memorable." },
              ].map((item) => (
                <div key={item.who} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-sm font-semibold">{item.who}</p>
                    <p className="text-tru-green text-xs font-semibold">{item.tip}</p>
                  </div>
                  <p className="text-gray-500 text-xs">{item.note}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs italic">Remember: tipping is always optional and should reflect your experience. Never feel pressured.</p>
          </div>
        </section>

        {/* VIDEO REVIEWS */}
        {hub.videoReviews && hub.videoReviews.length > 0 && (
          <section id="reviews">
            <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Real Stories</p>
            <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-2">Traveller Reviews</h2>
            <p className="text-gray-400 text-sm mb-6">Hear from people who&apos;ve done this trip. Unfiltered, unscripted, real.</p>
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={12}
              slidesPerView={2.3}
              freeMode
              navigation
              breakpoints={{
                640: { slidesPerView: 3.3 },
                1024: { slidesPerView: 4.5 },
              }}
              className="video-carousel"
            >
              {hub.videoReviews.map((review: any) => (
                <SwiperSlide key={review.id}>
                  <div className="group relative overflow-hidden rounded-[10px] cursor-pointer">
                    <div className="relative aspect-[9/16] overflow-hidden bg-black">
                      <img
                        src={review.poster}
                        alt={review.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                      {/* Play icon */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="h-5 w-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>

                      {/* Top — trip count badge */}
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-tru-pink font-heading">{review.tripCount}</span>
                      </div>

                      {/* Bottom — name, flag, caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <p className="text-white text-xs font-bold">{review.name}</p>
                          <span className="text-sm">{review.flag}</span>
                        </div>
                        <p className="text-gray-300 text-[10px] leading-snug line-clamp-3">{review.caption}</p>
                        <p className="text-gray-500 text-[9px] mt-1.5">{review.date}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* FAQS */}
        <section id="faqs">
          <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading mb-1">Questions?</p>
          <h2 className="text-2xl font-black text-white uppercase font-heading tracking-wide mb-6">Tour FAQs</h2>
          <TripHubFaqs />
        </section>

      </div>

      {/* Bottom CTA */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-[10px] border border-white/10 bg-white/5 p-8 sm:p-10 text-center">
          <p className="text-2xl sm:text-3xl font-handwriting text-tru-pink mb-3">See you out there!</p>
          <p className="text-gray-400 text-sm mb-6">Got questions? Ask Tru.D in the group chat or reach out to the team.</p>
          <Link href="/member/dashboard" className="inline-block rounded-[10px] border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition uppercase tracking-wider font-heading">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tru.D floating chat */}
      <button
        onClick={() => setTruDOpen(!truDOpen)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center text-2xl shadow-lg shadow-black/30 hover:scale-105 transition-transform ${truDOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        ✨
      </button>

      {truDOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] max-h-[500px] rounded-[10px] border border-white/10 bg-tru-navy shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-tru-pink/10 to-tru-blue/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center text-base">✨</div>
              <div>
                <p className="text-white text-sm font-bold">Tru.D</p>
                <p className="text-tru-green text-[9px] font-semibold">Online &middot; AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setTruDOpen(false)} className="text-gray-400 hover:text-white transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-[350px]">
            {truDMessages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.isBot ? "" : "flex-row-reverse"}`}>
                {msg.isBot && <div className="h-7 w-7 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center text-sm flex-shrink-0">✨</div>}
                <div className={`max-w-[85%] rounded-[10px] px-3 py-2 ${msg.isBot ? "bg-gradient-to-br from-tru-pink/10 to-tru-blue/10 border border-tru-pink/20" : "bg-tru-green/10 border border-tru-green/20"}`}>
                  <p className="text-gray-200 text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 px-3 py-2 flex gap-2">
            <input
              value={truDInput}
              onChange={(e) => setTruDInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && truDInput.trim()) {
                  const q = truDInput.trim();
                  setTruDMessages((prev) => [...prev, { from: "You", text: q, isBot: false }]);
                  setTruDInput("");
                  setTimeout(() => {
                    setTruDMessages((prev) => [...prev, { from: "Tru.D", text: "Great question! Let me look into that for you... I'll have an answer shortly. If I can't help, I'll pass it to the team! 🙌", isBot: true }]);
                  }, 1000);
                }
              }}
              placeholder="Ask Tru.D anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-tru-pink/50 transition"
            />
            <button
              onClick={() => {
                if (truDInput.trim()) {
                  const q = truDInput.trim();
                  setTruDMessages((prev) => [...prev, { from: "You", text: q, isBot: false }]);
                  setTruDInput("");
                  setTimeout(() => {
                    setTruDMessages((prev) => [...prev, { from: "Tru.D", text: "Great question! Let me look into that for you... I'll have an answer shortly. If I can't help, I'll pass it to the team! 🙌", isBot: true }]);
                  }, 1000);
                }
              }}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-tru-pink to-tru-blue flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripHubPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  return (
    <MemberGate>
      <TripHubContent bookingId={bookingId} />
    </MemberGate>
  );
}
