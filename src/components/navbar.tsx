"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import SearchOverlay from "@/components/search-overlay";
import { LIFE_MOMENTS } from "@/lib/life-moments";
import { regionPages } from "@/lib/data";
import { slugify } from "@/lib/utils";

const REGION_PAGE_SLUGS = new Set(regionPages.map((r) => r.slug));

// ============================================================
// NAV DATA — Real TruTravels destinations & structure
// ============================================================

const destinations: { region: string; countries: { name: string; flag: string; tag: string; href?: string; nickname: string; image: string }[] }[] = [
  {
    region: "Asia",
    countries: [
      { name: "Thailand", flag: "🇹🇭", tag: "Top Seller", href: "/destinations/asia/thailand", nickname: "The Land of Smiles", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80" },
      { name: "Indonesia", flag: "🇮🇩", tag: "Popular", href: "/destinations/asia/indonesia", nickname: "Emerald of the Equator", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80" },
      { name: "Philippines", flag: "🇵🇭", tag: "Popular", href: "/destinations/asia/philippines", nickname: "Pearl of the Orient Seas", image: "https://cdn.trutravels.com/images/philippines.jpg" },
      { name: "Vietnam", flag: "🇻🇳", tag: "Top Seller", href: "/destinations/asia/vietnam", nickname: "Land of the Ascending Dragon", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
      { name: "Cambodia", flag: "🇰🇭", tag: "", href: "/destinations/asia/cambodia", nickname: "Kingdom of Wonder", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Sri Lanka", flag: "🇱🇰", tag: "", href: "/destinations/asia/sri-lanka", nickname: "Pearl of the Indian Ocean", image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80" },
      { name: "India", flag: "🇮🇳", tag: "", href: "/destinations/asia/india", nickname: "Land of a Thousand Cultures", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
      { name: "Japan", flag: "🇯🇵", tag: "", href: "/destinations/asia/japan", nickname: "Land of the Rising Sun", image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80" },
      { name: "China", flag: "🇨🇳", tag: "New", href: "/destinations/asia/china", nickname: "The Middle Kingdom", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80" },
    ],
  },
  {
    region: "Latin America",
    countries: [
      { name: "Mexico", flag: "🇲🇽", tag: "Popular", href: "/destinations/latin-america/mexico", nickname: "Land of Colour", image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80" },
      { name: "Costa Rica", flag: "🇨🇷", tag: "", href: "/destinations/latin-america/costa-rica", nickname: "Pura Vida", image: "https://cdn.trutravels.com/images/costarica.jpg" },
      { name: "Colombia", flag: "🇨🇴", tag: "", href: "/destinations/latin-america/colombia", nickname: "Land of Magical Realism", image: "https://cdn.trutravels.com/images/colombia-view.jpg" },
      { name: "Peru", flag: "🇵🇪", tag: "", href: "/destinations/latin-america/peru", nickname: "Land of the Incas", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80" },
      { name: "Brazil", flag: "🇧🇷", tag: "", href: "/destinations/latin-america/brazil", nickname: "Land of Carnival", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80" },
      { name: "Belize", flag: "🇧🇿", tag: "", href: "/destinations/latin-america/belize", nickname: "Jewel of the Caribbean", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" },
      { name: "Guatemala", flag: "🇬🇹", tag: "", href: "/destinations/latin-america/guatemala", nickname: "Land of Eternal Spring", image: "https://cdn.trutravels.com/images/mexico-guatemala-belize3.png" },
    ],
  },
  {
    region: "Europe",
    countries: [
      { name: "Greece", flag: "🇬🇷", tag: "Popular", href: "/destinations/europe/greece", nickname: "Cradle of Civilization", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" },
      { name: "Italy", flag: "🇮🇹", tag: "", href: "/destinations/europe/italy", nickname: "Il Bel Paese", image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80" },
      { name: "Albania", flag: "🇦🇱", tag: "New", href: "/destinations/europe/albania", nickname: "Land of the Eagles", image: "https://cdn.trutravels.com/albania/kayaking-1.jpeg" },
      { name: "Europe By Rail", flag: "🚆", tag: "New", nickname: "Borderless Europe", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80" },
    ],
  },
  {
    region: "Africa & Middle East",
    countries: [
      { name: "Morocco", flag: "🇲🇦", tag: "Popular", href: "/destinations/africa-and-middle-east/morocco", nickname: "Gateway to Africa", image: "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg" },
      { name: "Jordan", flag: "🇯🇴", tag: "", href: "/destinations/africa-and-middle-east/jordan", nickname: "Cradle of Petra", image: "https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg" },
    ],
  },
  {
    region: "Oceania",
    countries: [
      { name: "New Zealand", flag: "🇳🇿", tag: "", href: "/destinations/oceania/new-zealand", nickname: "Land of the Long White Cloud", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80" },
    ],
  },
];

// Image-led promo tile shown on the right of each desktop mega menu
type MenuPromo = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

const menuPromos: Record<string, MenuPromo> = {
  destinations: {
    eyebrow: "New Trip Alert",
    title: "Rio Carnival 2027",
    description: "Limited edition launch — sign up for early access.",
    href: "/signup",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
  },
  styles: {
    eyebrow: "Featured Style",
    title: "Limited Edition",
    description: "Songkran, Day of the Dead, Rio Carnival — gone in a flash.",
    href: "/travel-styles/limited-edition",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80",
  },
  deals: {
    eyebrow: "Deal Of The Month",
    title: "Thailand Summer Sale",
    description: "Up to 40% off — beaches, parties, full moons.",
    href: "/destinations/asia/thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  },
  about: {
    eyebrow: "Make Travel Matter",
    title: "Our Impact",
    description: "Planeterra projects, local guides, and community-first travel.",
    href: "/about",
    image: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=800&q=80",
  },
  essentials: {
    eyebrow: "Need A Hand?",
    title: "Talk To A Human",
    description: "Real people, real advice — 9am to 9pm GMT.",
    href: "/about",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
  },
};

const travelStylesNav = [
  { name: "Backpacker", description: "Maximum adventure, minimum spend.", logo: "/backpacker-logo.png", href: "/travel-styles/backpacker", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80" },
  { name: "Classic", description: "The perfect balance of comfort and adventure.", logo: "/classic-logo.png", href: "/travel-styles/classic", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { name: "Flashpacker", description: "Adventure with an upgrade.", logo: "/flashpacker-logo.png", href: "/travel-styles/flashpacker", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
  { name: "Multi Country", description: "Cross borders, collect stamps.", logo: "/multi-country-logo.png", href: "/travel-styles/multi-country", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80" },
  { name: "Limited Edition", description: "Once it's gone, it's gone.", logo: "/limited-edition-logo.png", href: "/travel-styles/limited-edition", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&q=80" },
];

const dealsNav = [
  {
    name: "Browse Trips",
    eyebrow: "Start Here",
    description: "Most Popular, Perfect First, and Best Value picks.",
    href: "/explore",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  },
  {
    name: "Deals",
    eyebrow: "Limited Time",
    description: "Sale departures and the biggest savings on right now.",
    href: "/deals",
    image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&q=80",
  },
];

const aboutNav: {
  name: string;
  href: string;
  description: string;
  image: string;
}[] = [
  {
    name: "Our Story",
    href: "/about/our-story",
    description: "How TruTravels started — straight from the founders.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  },
  {
    name: "Our Values",
    href: "/about/our-values",
    description: "What we stand for and how we travel.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
  },
  {
    name: "Our Impact",
    href: "/about/our-impact",
    description: "Local guides, Planeterra projects, real change.",
    image: "https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=600&q=80",
  },
  {
    name: "Our Community",
    href: "/about",
    description: "The travellers, leaders, and creators in our world.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
  },
  {
    name: "Our Brand",
    href: "/about/our-brand",
    description: "Logo, voice, and the look of TruTravels.",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80",
  },
];

const essentialsNav = [
  { name: "FAQs", href: "/faqs", description: "Everything you need to know.", image: "https://images.unsplash.com/photo-1455894127589-22f75500213a?w=800&q=80" },
  { name: "Travel Insurance", href: "/travel-insurance", description: "Stay covered on the road.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80" },
  { name: "Visa & Passports", href: "/visas-and-passports", description: "Entry requirements by country.", image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80" },
  { name: "Booking Conditions", href: "/terms-conditions", description: "Terms and conditions.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" },
  { name: "Contact Us", href: "/about", description: "Get in touch with the team.", image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80" },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { count: cartCount, openDrawer: openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [mobileRegion, setMobileRegion] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ name: string; description: string; image: string; href: string; eyebrow: string } | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHoveredItem(null);
  }, [activeMenu]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleOpenSearch = () => setSearchOpen(true);
    document.addEventListener("click", handleClick);
    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileSubmenu(null);
  };

  const navLinkClass = (menu: string) =>
    `relative px-3 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading rounded-full transition-all duration-200 ${
      activeMenu === menu
        ? "bg-white/15 text-white"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav ref={navRef} className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div
          className={`transition-all duration-300 ${activeMenu ? "rounded-[20px]" : "rounded-full"} bg-tru-navy/95 backdrop-blur-md border border-white/10 overflow-hidden`}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="flex items-center h-14 px-5">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-4" onClick={closeAll} onMouseEnter={() => setActiveMenu(null)}>
              <img src="/logo-white.png" alt="TruTravels" className="h-9" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center gap-0.5 flex-1">
              <Link href="/explore" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200" onClick={closeAll} onMouseEnter={() => setActiveMenu(null)}>
                Explore
              </Link>
              <Link href="/deals" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200" onClick={closeAll} onMouseEnter={() => setActiveMenu(null)}>
                Deals
              </Link>
              <button onMouseEnter={() => setActiveMenu("destinations")} onClick={() => toggleMenu("destinations")} className={navLinkClass("destinations")}>
                Destinations
              </button>
              <button onMouseEnter={() => setActiveMenu("styles")} onClick={() => toggleMenu("styles")} className={navLinkClass("styles")}>
                Travel Styles
              </button>
              <button onMouseEnter={() => setActiveMenu("about")} onClick={() => toggleMenu("about")} className={navLinkClass("about")}>
                About Us
              </button>
              <button onMouseEnter={() => setActiveMenu("essentials")} onClick={() => toggleMenu("essentials")} className={navLinkClass("essentials")}>
                Essentials
              </button>
              <Link href="/stories" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200" onClick={closeAll} onMouseEnter={() => setActiveMenu(null)}>
                Stories
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden xl:flex items-center gap-2 ml-auto" onMouseEnter={() => setActiveMenu(null)}>
              <button onClick={() => { setSearchOpen(true); closeAll(); }} className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={() => { openCart(); closeAll(); }}
                className="relative h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition"
                aria-label={`Cart (${cartCount} item${cartCount === 1 ? "" : "s"})`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tru-pink text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center font-heading">
                    {cartCount}
                  </span>
                )}
              </button>
              {isLoggedIn ? (
                <div className="flex items-center gap-2 ml-1">
                  <Link href="/member/dashboard" className="h-8 w-8 rounded-full bg-tru-pink text-white flex items-center justify-center text-[10px] font-bold" onClick={closeAll}>
                    {user?.avatar}
                  </Link>
                  <button onClick={() => { logout(); closeAll(); }} className="text-[10px] text-gray-400 hover:text-white transition uppercase tracking-wider font-heading">
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-1 rounded-full bg-yellow-400 px-4 py-1.5 text-[10px] font-semibold text-tru-navy hover:bg-yellow-300 transition uppercase tracking-wider font-heading"
                  onClick={closeAll}
                >
                  Join / Log in
                </Link>
              )}
            </div>

            {/* Mobile search */}
            <button
              onClick={() => { setSearchOpen(true); closeAll(); }}
              className="xl:hidden ml-auto h-8 w-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden text-white"
              onClick={() => { setMobileOpen(!mobileOpen); setActiveMenu(null); setMobileSubmenu(null); }}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* ============ DESTINATIONS MEGA MENU ============ */}
          {activeMenu === "destinations" && (
            <div className="relative hidden xl:block border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden">
              <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-6 right-[28%] w-32 rotate-[-8deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-6 left-[20%] w-28 rotate-[12deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/brazil.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-8 -left-6 w-28 -rotate-[10deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-[42%] w-32 rotate-[6deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-8 right-[40%] w-28 rotate-[-12deg] opacity-[0.05] brightness-0 invert" />
              <div className="relative grid grid-cols-12 gap-6">
                <div className="col-span-9 grid grid-cols-5 gap-6">
                  {destinations.map((region) => {
                    const regionSlug = slugify(region.region);
                    const regionHref = REGION_PAGE_SLUGS.has(regionSlug) ? `/destinations/${regionSlug}` : null;
                    return (
                    <div key={region.region}>
                      {regionHref ? (
                        <Link href={regionHref} onClick={closeAll} className="block text-xs font-black uppercase tracking-[0.18em] text-tru-pink hover:text-tru-pink-light font-heading mb-3">
                          {region.region}
                        </Link>
                      ) : (
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-3">
                          {region.region}
                        </p>
                      )}
                      <div className="space-y-0.5">
                        {region.countries.map((country) => (
                          <Link
                            key={country.name}
                            href={country.href || "/explore"}
                            onClick={closeAll}
                            onMouseEnter={() =>
                              setHoveredItem({
                                name: country.name,
                                description: country.nickname,
                                image: country.image,
                                href: country.href || "/explore",
                                eyebrow: region.region,
                              })
                            }
                            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-2 py-1.5 rounded-md hover:bg-white/10"
                          >
                            <span className="flex-1 truncate">{country.name}</span>
                          </Link>
                        ))}
                      </div>
                      <Link href={regionHref || "/explore"} onClick={closeAll} className="text-[10px] font-semibold uppercase tracking-wider text-tru-pink hover:text-tru-pink-light transition mt-3 block px-2">
                        View all &rarr;
                      </Link>
                    </div>
                    );
                  })}
                </div>
                <div className="col-span-3">
                  {hoveredItem ? (
                    <ItemPromo item={hoveredItem} onClick={closeAll} />
                  ) : (
                    <PromoTile promo={menuPromos.destinations} onClick={closeAll} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ TRAVEL STYLES MEGA MENU ============ */}
          {activeMenu === "styles" && (
            <div className="relative hidden xl:block border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden">
              <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-8 right-[20%] w-32 rotate-[10deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-10 left-[18%] w-40 -rotate-[6deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-6 -left-4 w-28 -rotate-[14deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/3 left-[44%] w-24 rotate-[8deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-6 right-[38%] w-32 rotate-[10deg] opacity-[0.05] brightness-0 invert" />
              <div className="relative grid grid-cols-12 gap-4">
                <div className="col-span-9 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-3">
                      Travel Styles
                    </p>
                    <div className="space-y-0.5">
                      {travelStylesNav.map((style) => (
                        <Link
                          key={style.name}
                          href={style.href}
                          onClick={closeAll}
                          onMouseEnter={() =>
                            setHoveredItem({
                              name: style.name,
                              description: style.description,
                              image: style.image,
                              href: style.href,
                              eyebrow: "Travel Style",
                            })
                          }
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-2 py-1.5 rounded-md hover:bg-white/10"
                        >
                          <span className="flex-1 truncate">{style.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-3">
                      Life Moments
                    </p>
                    <div className="space-y-0.5">
                      {LIFE_MOMENTS.map((moment) => (
                        <Link
                          key={moment.slug}
                          href={moment.href}
                          onClick={closeAll}
                          onMouseEnter={() =>
                            setHoveredItem({
                              name: moment.name,
                              description: moment.description,
                              image: moment.image,
                              href: moment.href,
                              eyebrow: "Life Moment",
                            })
                          }
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-2 py-1.5 rounded-md hover:bg-white/10"
                        >
                          <span className="flex-1 truncate">{moment.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  {hoveredItem ? (
                    <ItemPromo item={hoveredItem} onClick={closeAll} />
                  ) : (
                    <PromoTile promo={menuPromos.styles} onClick={closeAll} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ DEALS MEGA MENU ============ */}
          {activeMenu === "deals" && (
            <div className="relative hidden xl:block border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden">
              <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-6 left-[22%] w-28 -rotate-[10deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-8 right-[28%] w-36 rotate-[8deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-4 right-[42%] w-20 rotate-[12deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-4 left-[8%] w-28 -rotate-[8deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/3 -left-4 w-24 rotate-[14deg] opacity-[0.05] brightness-0 invert" />
              <div className="relative grid grid-cols-12 gap-4">
                <div className="col-span-9 grid grid-cols-3 gap-4">
                  {dealsNav.map((deal) => (
                    <Link
                      key={deal.name}
                      href={deal.href}
                      onClick={closeAll}
                      onMouseEnter={() =>
                        setHoveredItem({
                          name: deal.name,
                          description: deal.description,
                          image: deal.image,
                          href: deal.href,
                          eyebrow: deal.eyebrow,
                        })
                      }
                      className="block group rounded-md p-3 hover:bg-white/5 transition"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-1.5 group-hover:text-tru-pink-light transition">
                        {deal.name}
                      </p>
                      <p className="text-xs text-gray-300 leading-snug group-hover:text-white transition">
                        {deal.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="col-span-3">
                  {hoveredItem ? (
                    <ItemPromo item={hoveredItem} onClick={closeAll} />
                  ) : (
                    <PromoTile promo={menuPromos.deals} onClick={closeAll} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ ABOUT MEGA MENU ============ */}
          {activeMenu === "about" && (
            <div className="relative hidden xl:block border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden">
              <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-6 left-[28%] w-24 -rotate-[12deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/eyes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-6 right-[26%] w-28 rotate-[10deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/mask.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-8 -left-6 w-32 rotate-[10deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-[44%] w-28 -rotate-[6deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/brazil.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-8 left-[12%] w-28 -rotate-[8deg] opacity-[0.05] brightness-0 invert" />
              <div className="relative grid grid-cols-12 gap-4">
                <div className="col-span-9 grid grid-cols-5 gap-3">
                  {aboutNav.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeAll}
                      onMouseEnter={() =>
                        setHoveredItem({
                          name: item.name,
                          description: item.description,
                          image: item.image,
                          href: item.href,
                          eyebrow: "About TruTravels",
                        })
                      }
                      className="block group rounded-md p-3 hover:bg-white/5 transition"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-1.5 group-hover:text-tru-pink-light transition">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-300 leading-snug group-hover:text-white transition">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="col-span-3">
                  {hoveredItem ? (
                    <ItemPromo item={hoveredItem} onClick={closeAll} />
                  ) : (
                    <PromoTile promo={menuPromos.about} onClick={closeAll} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ ESSENTIALS MEGA MENU ============ */}
          {activeMenu === "essentials" && (
            <div className="relative hidden xl:block border-t border-white/10 px-5 pb-6 pt-5 overflow-hidden">
              <img src="/bg-assets/ramen.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-8 right-[22%] w-28 rotate-[12deg] opacity-[0.06] brightness-0 invert" />
              <img src="/bg-assets/community.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-8 left-[22%] w-32 -rotate-[8deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/eyes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -top-6 -left-4 w-28 -rotate-[10deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/lantern.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-[46%] w-24 rotate-[6deg] opacity-[0.05] brightness-0 invert" />
              <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-6 right-[42%] w-28 rotate-[12deg] opacity-[0.05] brightness-0 invert" />
              <div className="relative grid grid-cols-12 gap-4">
                <div className="col-span-9 grid grid-cols-5 gap-3">
                  {essentialsNav.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeAll}
                      onMouseEnter={() =>
                        setHoveredItem({
                          name: item.name,
                          description: item.description,
                          image: item.image,
                          href: item.href,
                          eyebrow: "Essentials",
                        })
                      }
                      className="block group rounded-md p-3 hover:bg-white/5 transition"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-tru-pink font-heading mb-1.5 group-hover:text-tru-pink-light transition">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-300 leading-snug group-hover:text-white transition">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="col-span-3">
                  {hoveredItem ? (
                    <ItemPromo item={hoveredItem} onClick={closeAll} />
                  ) : (
                    <PromoTile promo={menuPromos.essentials} onClick={closeAll} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ MOBILE MENU ============ */}
      {mobileOpen && (
        <div className="xl:hidden bg-tru-navy/95 backdrop-blur-md mx-4 rounded-b-[20px] border border-t-0 border-white/10 px-5 pb-5 pt-2 max-h-[70vh] overflow-y-auto">
          {/* Mobile search */}
          <button
            onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
            className="flex items-center gap-3 w-full text-gray-400 hover:text-white py-3 border-b border-white/10 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider font-heading">Search</span>
          </button>
          <Link href="/explore" onClick={closeAll} className="block text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3 border-b border-white/10">
            Explore
          </Link>
          <Link href="/deals" onClick={closeAll} className="block text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3 border-b border-white/10">
            Deals
          </Link>
          {/* Destinations — nested collapsible */}
          <div className="border-b border-white/10">
            <button
              onClick={() => { setMobileSubmenu(mobileSubmenu === "m-dest" ? null : "m-dest"); setMobileRegion(null); }}
              className="flex items-center justify-between w-full text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3"
            >
              Destinations
              <svg className={`h-4 w-4 transition-transform ${mobileSubmenu === "m-dest" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileSubmenu === "m-dest" && (
              <div className="pb-3 pl-3 space-y-1">
                {destinations.map((region) => (
                  <div key={region.region}>
                    <button
                      onClick={() => setMobileRegion(mobileRegion === region.region ? null : region.region)}
                      className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-white py-1.5 transition"
                    >
                      {region.region}
                      <svg className={`h-3 w-3 transition-transform ${mobileRegion === region.region ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileRegion === region.region && (
                      <div className="pl-4 pb-2 space-y-1">
                        {region.countries.map((country) => (
                          <Link
                            key={country.name}
                            href={country.href || "/explore"}
                            onClick={closeAll}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white py-1 transition"
                          >
                            {country.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other sections */}
          {[
            {
              label: "Travel Styles",
              key: "m-styles",
              items: [
                ...travelStylesNav.map((s) => ({ name: s.name, href: s.href, group: "Travel Styles" })),
                ...LIFE_MOMENTS.map((m) => ({ name: m.name, href: m.href, group: "Life Moments" })),
              ],
            },
            { label: "About Us", key: "m-about", items: aboutNav.map((a) => ({ name: a.name, href: a.href, group: undefined })) },
            { label: "Essentials", key: "m-essentials", items: essentialsNav.map((e) => ({ name: e.name, href: e.href, group: undefined })) },
          ].map((section) => (
            <div key={section.key} className="border-b border-white/10">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === section.key ? null : section.key)}
                className="flex items-center justify-between w-full text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3"
              >
                {section.label}
                <svg className={`h-4 w-4 transition-transform ${mobileSubmenu === section.key ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenu === section.key && (
                <div className="pb-3 pl-3 space-y-1">
                  {section.items.map((item, idx) => {
                    const prevGroup = idx > 0 ? section.items[idx - 1].group : undefined;
                    const showGroupHeading = item.group && item.group !== prevGroup;
                    return (
                      <div key={item.name}>
                        {showGroupHeading && (
                          <p className={`text-[10px] font-bold uppercase tracking-[0.25em] font-heading pt-2 pb-1 ${item.group === "Life Moments" ? "text-tru-blue" : "text-tru-pink"}`}>
                            {item.group}
                          </p>
                        )}
                        <Link href={item.href} onClick={closeAll} className="block text-sm text-gray-400 hover:text-white py-1.5 transition">
                          {item.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <Link href="/stories" onClick={closeAll} className="block text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3 border-b border-white/10">
            Stories
          </Link>
          {isLoggedIn ? (
            <Link href="/member/dashboard" onClick={closeAll} className="block text-tru-pink font-semibold uppercase tracking-wider text-sm font-heading py-3">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" onClick={closeAll} className="block rounded-full bg-yellow-400 px-5 py-2.5 text-center text-sm font-semibold text-tru-navy mt-3">
              Join / Log in
            </Link>
          )}
        </div>
      )}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}

/* ============================================================
   PROMO TILE — image-led card on the right of every mega menu
   ============================================================ */
function PromoTile({ promo, onClick }: { promo: MenuPromo; onClick: () => void }) {
  return (
    <Link
      href={promo.href}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[10px] block h-full min-h-[200px]"
    >
      <img
        src={promo.image}
        alt={promo.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/45 to-tru-navy/15" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-tru-pink font-heading mb-1">
          {promo.eyebrow}
        </p>
        <p className="text-base font-black uppercase text-white font-heading leading-tight mb-1 group-hover:text-tru-pink transition-colors">
          {promo.title}
        </p>
        <p className="text-[11px] text-gray-200 leading-snug">{promo.description}</p>
      </div>
    </Link>
  );
}

function ItemPromo({
  item,
  onClick,
}: {
  item: { name: string; description: string; image: string; href: string; eyebrow: string };
  onClick: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[10px] block h-full min-h-[200px]"
    >
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tru-navy/95 via-tru-navy/50 to-tru-navy/20" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-tru-pink font-heading mb-1">
          {item.eyebrow}
        </p>
        <p className="text-2xl font-black uppercase text-white font-heading leading-[0.95] mb-1 group-hover:text-tru-pink transition-colors">
          {item.name}
        </p>
        <p className="text-[11px] text-gray-200 italic leading-snug">{item.description}</p>
      </div>
    </Link>
  );
}
