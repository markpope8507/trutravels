/**
 * The Essentials section — the practical pages.
 *
 * Lifted out of navbar.tsx so the nav's Essentials menu and the /essentials
 * landing page read the SAME four. A second copy is how they'd end up
 * disagreeing.
 *
 * `image` is each page's OWN hero, not a stock photo. The nav data used
 * Unsplash stock that worked at 40px in a menu and fell apart at card size on
 * /essentials — Booking Conditions was a photo of US tax forms and Visa &
 * Passports a portrait of a stranger. A card should show the page it opens;
 * if one of these heroes changes, change it here too.
 *
 * NAV, NOT FOOTER. The footer's Essentials column also lists Book With
 * Confidence, Share Your Photos and Package Travel Regulations. Those live
 * elsewhere in the hierarchy (The Tru Way, and a section inside Booking
 * Conditions), so this page follows the nav — which is also the rule the
 * breadcrumbs use.
 */

export type Essential = { name: string; href: string; description: string; image: string };

export const essentialsNav: Essential[] = [
  { name: "Travel Insurance", href: "/travel-insurance", description: "Stay covered on the road.", image: "https://cdn.trutravels.com/indonesia-images/surfing-lesson-bali.jpg" },
  { name: "Visa & Passports", href: "/visas-and-passports", description: "Entry requirements by country.", image: "https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg" },
  { name: "Booking Conditions", href: "/terms-conditions", description: "Terms and conditions.", image: "https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg" },
  { name: "Help & Support", href: "/support", description: "Answers fast, with Ask Tru.D.", image: "https://cdn.trutravels.com/greece/greece-island-hopper-017.jpg" },
];
