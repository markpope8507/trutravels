/**
 * Community Tourism Enterprises.
 *
 * A CTE is a locally owned and operated business or organisation offering
 * tourism experiences or services. Content is from the CTE deck; each one gets
 * its own page at /about/our-impact/<slug>, laid out like a story.
 *
 * NOTE: the images here are stand-ins from Unsplash — swap them for real
 * photography of each project when it's available.
 */

export type CteSection = {
  kicker?: string;
  heading: string;
  body: string[];
  image?: string;
  imageAlt?: string;
};

export type Cte = {
  slug: string;
  name: string;
  country: string;
  /** ISO date of the first tour to visit, for sorting and formatting. */
  firstTour: string;
  /** One line for the card on the impact page. */
  summary: string;
  image: string;
  imageAlt: string;
  intro: string[];
  sections: CteSection[];
  /** Optional headline numbers, shown as a strip under the intro. */
  impact?: { value: string; label: string }[];
};

/** What a CTE is — the explainer that sits above the cards. */
export const CTE_DEFINITION = {
  lead:
    "A CTE is a locally owned and operated business or organisation that offers tourism experiences or services — like homestays, food experiences, guiding, crafts, or cultural performances.",
  characteristics: [
    {
      title: "Community-Led",
      description: "Managed by local people, often collectively.",
    },
    {
      title: "Tourism-Focused",
      description: "Offers services to travellers — experiences, food, accommodation, or transport.",
    },
    {
      title: "Income-Generating",
      description: "Creates direct financial benefits for the community.",
    },
    {
      title: "Social Purpose",
      description:
        "Often supports social or environmental goals, like education, conservation, or women's empowerment.",
    },
  ],
};

export const CTES: Cte[] = [
  {
    slug: "bang-lamphu-community",
    name: "Bang Lamphu Community",
    country: "Thailand",
    firstTour: "2026-07-26",
    summary:
      "A guided walk through Bang Lamphu's riverside heritage, then a workshop turning bottle caps into keychains.",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1600&q=80",
    imageAlt: "Riverside Bangkok, where the Bang Lamphu walk begins",
    intro: [
      "The Bang Lamphu Community offers a unique tourism experience that begins with a guided walk through Santichaiprakarn Park by the Chao Phraya River, where visitors learn about the history of Phra Sumen Fort and the neighbourhood's heritage.",
    ],
    sections: [
      {
        kicker: "The Walk",
        heading: "Riverside Heritage",
        body: [
          "The experience starts in Santichaiprakarn Park on the bank of the Chao Phraya, with a guided walk through the neighbourhood led by the people who live in it.",
          "Along the way you learn the history of Phra Sumen Fort and how the area around it has changed — the kind of detail that only comes from someone who grew up there.",
        ],
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
        imageAlt: "Walking the riverside in Bangkok",
      },
      {
        kicker: "The Workshop",
        heading: "Bottle Caps To Keychains",
        body: [
          "Travellers then join a creative DIY workshop upcycling plastic bottle caps into colourful bead keychains.",
          "You choose from designs inspired by local icons — the mangrove apple tree life cycle, the fort itself, and the fireflies that light up the river at night.",
          "The result is a meaningful, eco-friendly souvenir that reflects Bang Lamphu's identity, and one you can give to someone back home.",
        ],
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80",
        imageAlt: "Hands at work in a craft workshop",
      },
    ],
  },
  {
    slug: "the-art-house-marrakech",
    name: "The Art House Marrakech",
    country: "Morocco",
    firstTour: "2026-07-14",
    summary:
      "A creative and cultural space in Marrakech where a local team cooks, teaches and eats with you.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80",
    imageAlt: "Marrakech, home of The Art House",
    intro: [
      "The Art House Marrakech is a community-focused creative and cultural experience space in Marrakech, Morocco. The project connects travellers with local Moroccan artisans, cooks, hosts and cultural practitioners through hands-on workshops that celebrate Moroccan heritage, everyday hospitality and traditional skills.",
    ],
    sections: [
      {
        kicker: "The Idea",
        heading: "Welcomed In, Not Looking On",
        body: [
          "The heart of the project is simple: to create meaningful tourism experiences where visitors do not just observe Moroccan culture from the outside, but are welcomed into it.",
          "That happens through food, craft, storytelling and human connection — with the artisans, cooks and hosts who do this every day.",
        ],
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
        imageAlt: "A Moroccan artisan at work",
      },
      {
        kicker: "The Workshop",
        heading: "Cooking Together",
        body: [
          "For TruTravels and Planeterra travellers, the cooking workshop is an accessible, joyful and culturally rich introduction to Moroccan hospitality.",
          "You prepare traditional Moroccan dishes alongside a local cooking team, learn about the ingredients and the customs around them, and then share the meal together in a warm, informal setting.",
        ],
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200&q=80",
        imageAlt: "A Moroccan meal shared at the table",
      },
    ],
  },
  {
    slug: "horses-of-gili",
    name: "Horses of Gili",
    country: "Indonesia",
    firstTour: "2026-07-14",
    summary:
      "A locally-led non-profit caring for the working horses the Gili Islands run on — and you spend the afternoon with them.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&q=80",
    imageAlt: "The Gili Islands, where the horses work",
    intro: [
      "Horses of Gili is a locally-led non-profit organisation dedicated to improving the welfare of the working horses that are an essential part of daily life on the Gili Islands.",
    ],
    impact: [
      { value: "30", label: "Horse owners receiving free care" },
      { value: "6", label: "Local people working with the project" },
      { value: "36+", label: "Households benefiting" },
      { value: "2,000+", label: "People reached indirectly" },
    ],
    sections: [
      {
        kicker: "Why It Matters",
        heading: "The Islands Run On Them",
        body: [
          "Motorised vehicles are prohibited on the Gilis, so horses do the work of moving people and goods — directly supporting the local economy and the tourism industry.",
          "The organisation works with local horse owners, carriage drivers, veterinarians and community members to provide free veterinary care, rehabilitation, farrier support and education that encourages responsible horse management and long-term welfare improvements.",
        ],
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&q=80",
        imageAlt: "A working horse on the Gili Islands",
      },
      {
        kicker: "The Visit",
        heading: "Stables, Grooming, Beach Walk",
        body: [
          "The group visits the stables and hears an educational talk about the working horses and the support the project provides.",
          "You then take part in grooming — hosing the horses down and brushing them — before joining an afternoon beach walk with the rescued horses, which lasts about an hour.",
        ],
        image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1200&q=80",
        imageAlt: "Horses on the beach at sunset",
      },
    ],
  },
];

export function getCte(slug: string) {
  return CTES.find((c) => c.slug === slug);
}

export function formatFirstTour(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
