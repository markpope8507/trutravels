"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import SearchOverlay from "@/components/search-overlay";

// ============================================================
// NAV DATA — Real TruTravels destinations & structure
// ============================================================

const destinations = [
  {
    region: "Asia",
    countries: [
      { name: "Thailand", tag: "Top Seller", href: "/destinations/country/thailand" },
      { name: "Indonesia", tag: "Popular", href: "/destinations/country/indonesia" },
      { name: "Philippines", tag: "Popular", href: "/destinations/country/philippines" },
      { name: "Vietnam", tag: "Top Seller", href: "/destinations/country/vietnam" },
      { name: "Cambodia", tag: "", href: "/destinations/country/cambodia" },
      { name: "Sri Lanka", tag: "", href: "/destinations/country/sri-lanka" },
      { name: "India", tag: "", href: "/destinations/country/india" },
      { name: "Japan", tag: "", href: "/destinations/country/japan" },
      { name: "China", tag: "New", href: "/destinations/country/china" },
    ],
  },
  {
    region: "Latin America",
    countries: [
      { name: "Mexico", tag: "Popular", href: "/destinations/country/mexico" },
      { name: "Costa Rica", tag: "", href: "/destinations/country/costa-rica" },
      { name: "Colombia", tag: "", href: "/destinations/country/colombia" },
      { name: "Peru", tag: "", href: "/destinations/country/peru" },
      { name: "Brazil", tag: "", href: "/destinations/country/brazil" },
      { name: "Belize", tag: "", href: "/destinations/country/belize" },
      { name: "Guatemala", tag: "", href: "/destinations/country/guatemala" },
    ],
  },
  {
    region: "Europe",
    countries: [
      { name: "Greece", tag: "Popular", href: "/destinations/country/greece" },
      { name: "Italy", tag: "", href: "/destinations/country/italy" },
      { name: "Albania", tag: "New", href: "/destinations/country/albania" },
      { name: "Europe By Rail", tag: "New" },
    ],
  },
  {
    region: "Africa & Middle East",
    countries: [
      { name: "Morocco", tag: "Popular", href: "/destinations/country/morocco" },
      { name: "Jordan", tag: "", href: "/destinations/country/jordan" },
    ],
  },
  {
    region: "Oceania",
    countries: [
      { name: "New Zealand", tag: "", href: "/destinations/country/new-zealand" },
    ],
  },
];

const travelStylesNav = [
  { name: "Backpacker", description: "Maximum adventure, minimum spend", logo: "/backpacker-logo.png" },
  { name: "Classic", description: "The perfect balance of comfort and adventure", logo: "/classic-logo.png" },
  { name: "Flashpacker", description: "Adventure with an upgrade", logo: "/flashpacker-logo.png" },
  { name: "Multi Country", description: "Cross borders, collect stamps", logo: "/multi-country-logo.png" },
  { name: "Limited Edition", description: "Once it's gone, it's gone", logo: "/limited-edition-logo.png" },
];

const dealsNav = [
  { name: "Flash Sale", description: "Save up to 30% on 2026 departures", tag: "🔥" },
  { name: "Last-Minute Deals", description: "Trips leaving within 30 days", tag: "⏱️" },
  { name: "All Deals", description: "Browse every deal we've got", tag: "🎉" },
];

const aboutNav = [
  { name: "Our Story", href: "/about", description: "How TruTravels started and where we're going" },
  { name: "Our Impact", href: "/about", description: "Our People & Planet Promise" },
  { name: "Led By Locals", href: "/about", description: "Meet the people who make it real" },
  { name: "Stories & Blog", href: "/stories", description: "Real stories from the road" },
];

const essentialsNav = [
  { name: "FAQs", href: "/about", description: "Everything you need to know" },
  { name: "Travel Insurance", href: "/about", description: "Stay covered on the road" },
  { name: "Visa & Passports", href: "/about", description: "Entry requirements by country" },
  { name: "Booking Conditions", href: "/about", description: "Terms and conditions" },
  { name: "Contact Us", href: "/about", description: "Get in touch with the team" },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [mobileRegion, setMobileRegion] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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

  const tagColor = (tag: string) => {
    if (tag === "Top Seller") return "bg-tru-green text-tru-navy";
    if (tag === "Popular") return "bg-tru-pink text-white";
    if (tag === "New") return "bg-tru-blue text-white";
    return "";
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
        <div className={`transition-all duration-300 ${activeMenu ? "rounded-t-[20px] rounded-b-none" : "rounded-full"} bg-tru-navy/95 backdrop-blur-md border border-white/10`}>
          <div className="flex items-center h-14 px-5">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-4" onClick={closeAll}>
              <img src="/logo-white.png" alt="TruTravels" className="h-9" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center gap-0.5 flex-1">
              <button onClick={() => toggleMenu("destinations")} className={navLinkClass("destinations")}>
                Destinations
              </button>
              <button onClick={() => toggleMenu("styles")} className={navLinkClass("styles")}>
                Travel Styles
              </button>
              <button onClick={() => toggleMenu("deals")} className={navLinkClass("deals")}>
                Deals
              </button>
              <button onClick={() => toggleMenu("about")} className={navLinkClass("about")}>
                About Us
              </button>
              <button onClick={() => toggleMenu("essentials")} className={navLinkClass("essentials")}>
                Essentials
              </button>
              <Link href="/stories" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider font-heading rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200" onClick={closeAll}>
                Blog
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden xl:flex items-center gap-2 ml-auto">
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
                  className="ml-1 rounded-full bg-tru-green px-4 py-1.5 text-[10px] font-semibold text-tru-navy hover:bg-tru-green-light transition uppercase tracking-wider font-heading"
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
            <div className="hidden xl:block border-t border-white/10 px-5 pb-6 pt-4">
              <div className="grid grid-cols-5 gap-6">
                {destinations.map((region) => (
                  <div key={region.region}>
                    <p className="text-xs font-bold uppercase tracking-wider text-tru-pink font-heading mb-3">
                      {region.region}
                    </p>
                    <div className="space-y-1">
                      {region.countries.map((country) => (
                        <Link
                          key={country.name}
                          href={country.href || "/explore"}
                          onClick={closeAll}
                          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition px-2 py-1 rounded-md hover:bg-white/10"
                        >
                          {country.name}
                          {country.tag && (
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${tagColor(country.tag)}`}>
                              {country.tag}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <Link href="/explore" onClick={closeAll} className="text-[10px] font-semibold uppercase tracking-wider text-tru-pink hover:text-tru-pink-light transition mt-3 block px-2">
                      View all {region.region} &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ TRAVEL STYLES MEGA MENU ============ */}
          {activeMenu === "styles" && (
            <div className="hidden xl:block border-t border-white/10 px-5 pb-6 pt-4">
              <div className="grid grid-cols-5 gap-4">
                {travelStylesNav.map((style) => (
                  <Link key={style.name} href="/explore" onClick={closeAll} className="group rounded-[10px] border border-white/10 p-4 hover:border-tru-pink/30 hover:bg-white/5 transition-all duration-200 text-center">
                    <img src={style.logo} alt={style.name} className="h-24 mx-auto mb-3" />
                    <p className="text-xs text-gray-400">{style.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ============ DEALS MEGA MENU ============ */}
          {activeMenu === "deals" && (
            <div className="hidden xl:block border-t border-white/10 px-5 pb-6 pt-4">
              <div className="grid grid-cols-3 gap-4">
                {dealsNav.map((deal) => (
                  <Link key={deal.name} href="/explore" onClick={closeAll} className="group rounded-[10px] border border-white/10 p-4 hover:border-tru-green/30 hover:bg-white/5 transition-all duration-200">
                    <p className="text-sm font-bold text-white font-heading group-hover:text-tru-green transition">
                      <span className="mr-2">{deal.tag}</span>{deal.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{deal.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ============ ABOUT MEGA MENU ============ */}
          {activeMenu === "about" && (
            <div className="hidden xl:block border-t border-white/10 px-5 pb-6 pt-4">
              <div className="grid grid-cols-4 gap-4">
                {aboutNav.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeAll} className="group rounded-[10px] border border-white/10 p-4 hover:border-tru-pink/30 hover:bg-white/5 transition-all duration-200">
                    <p className="text-sm font-bold text-white font-heading group-hover:text-tru-pink transition">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ============ ESSENTIALS MEGA MENU ============ */}
          {activeMenu === "essentials" && (
            <div className="hidden xl:block border-t border-white/10 px-5 pb-6 pt-4">
              <div className="grid grid-cols-5 gap-4">
                {essentialsNav.map((item) => (
                  <Link key={item.name} href={item.href} onClick={closeAll} className="group rounded-[10px] border border-white/10 p-4 hover:border-tru-pink/30 hover:bg-white/5 transition-all duration-200">
                    <p className="text-sm font-bold text-white font-heading group-hover:text-tru-pink transition">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  </Link>
                ))}
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
                            {country.tag && (
                              <span className={`text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${tagColor(country.tag)}`}>
                                {country.tag}
                              </span>
                            )}
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
            { label: "Travel Styles", key: "m-styles", items: travelStylesNav.map((s) => ({ name: s.name, href: "/explore" })) },
            { label: "Deals", key: "m-deals", items: dealsNav.map((d) => ({ name: d.name, href: "/explore" })) },
            { label: "About Us", key: "m-about", items: aboutNav.map((a) => ({ name: a.name, href: a.href })) },
            { label: "Essentials", key: "m-essentials", items: essentialsNav.map((e) => ({ name: e.name, href: e.href })) },
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
                  {section.items.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAll} className="block text-sm text-gray-400 hover:text-white py-1.5 transition">
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/stories" onClick={closeAll} className="block text-gray-300 hover:text-white font-semibold uppercase tracking-wider text-sm font-heading py-3 border-b border-white/10">
            Blog
          </Link>
          {isLoggedIn ? (
            <Link href="/member/dashboard" onClick={closeAll} className="block text-tru-pink font-semibold uppercase tracking-wider text-sm font-heading py-3">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" onClick={closeAll} className="block rounded-full bg-tru-green px-5 py-2.5 text-center text-sm font-semibold text-tru-navy mt-3">
              Join / Log in
            </Link>
          )}
        </div>
      )}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
