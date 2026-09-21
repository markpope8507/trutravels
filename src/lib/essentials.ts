/**
 * The Essentials section — the practical pages.
 *
 * Lifted out of navbar.tsx so the nav's Essentials menu and the /essentials
 * landing page read the SAME four. A second copy is how they'd end up
 * disagreeing.
 *
 * NAV, NOT FOOTER. The footer's Essentials column also lists Book With
 * Confidence, Share Your Photos and Package Travel Regulations. Those live
 * elsewhere in the hierarchy (The Tru Way, and a section inside Booking
 * Conditions), so this page follows the nav — which is also the rule the
 * breadcrumbs use.
 */

export type Essential = { name: string; href: string; description: string; image: string };

export const essentialsNav: Essential[] = [
  { name: "Travel Insurance", href: "/travel-insurance", description: "Stay covered on the road.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80" },
  { name: "Visa & Passports", href: "/visas-and-passports", description: "Entry requirements by country.", image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80" },
  { name: "Booking Conditions", href: "/terms-conditions", description: "Terms and conditions.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" },
  { name: "Help & Support", href: "/support", description: "Answers fast, with Ask Tru.D.", image: "https://images.unsplash.com/photo-1455894127589-22f75500213a?w=800&q=80" },
];
