// Author profiles for the blog. Story `author` strings vary ("Sophie" vs
// "Sophie Chen", plus a few team bylines), so each profile lists aliases and we
// resolve a story's author string to a canonical profile.

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  aliases?: string[];
};

export const authors: Author[] = [
  {
    slug: "sophie-chen",
    name: "Sophie Chen",
    role: "Senior Travel Writer",
    bio: "Sophie has spent the last eight years chasing sunrises across Southeast Asia and beyond. She writes the destination guides and first-timer features, and firmly believes the best travel stories start with saying yes to the unplanned.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    aliases: ["Sophie"],
  },
  {
    slug: "jake-morrison",
    name: "Jake Morrison",
    role: "Adventure Editor",
    bio: "Jake covers the adrenaline end of the trips — diving, trekking, and anything involving a boat at sunrise. Former dive instructor, full-time storyteller, happiest somewhere with no phone signal.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    slug: "nina-waves",
    name: "Nina Waves",
    role: "Islands & Beaches Writer",
    bio: "Nina maps out the island-hopping routes and the beaches worth the detour. If there's a hammock and a good playlist, she's already written about it.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    slug: "priya-kapoor",
    name: "Priya Kapoor",
    role: "Culture & Food Writer",
    bio: "Priya follows the food — street markets, family kitchens, and the little spots only the locals know. She writes the culture and cuisine stories that make you book the flight.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    slug: "tom-ashworth",
    name: "Tom Ashworth",
    role: "Backpacking Correspondent",
    bio: "Tom has done the long-haul, low-budget, big-adventure thing more times than he can count. He writes the honest, money-saving guides for first-time backpackers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    slug: "marcus-cole",
    name: "Marcus Cole",
    role: "Outdoors & Trekking Writer",
    bio: "Marcus covers the summits, jungle climbs and multi-day treks. He's of the firm opinion that the best views are the ones you have to earn.",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
  },
  {
    slug: "kamala-hewavitharana",
    name: "Kamala Hewavitharana",
    role: "Sri Lanka Local Expert",
    bio: "Born and raised in Sri Lanka, Kamala writes the local-eye guides — the temples, the train rides, and the tea-country corners the guidebooks miss.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  {
    slug: "orty",
    name: "Orty",
    role: "Creator & Storyteller",
    bio: "Orty is a TruTravels creator capturing the trips as they happen — the people, the parties, and the in-between moments that make a trip unforgettable.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
  },
  {
    slug: "trutravels-team",
    name: "TruTravels Team",
    role: "The Crew",
    bio: "Stories, guides and updates from the wider TruTravels crew — the leaders, the office team, and the community that keeps the adventures rolling.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80",
    aliases: ["Tru Community", "Tru Crew"],
  },
];

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name === name || a.aliases?.includes(name));
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
