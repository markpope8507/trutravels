# Prototype component map

Every reusable building block in the Next.js prototype (`src/components/`, 79
components) plus the recurring inline page patterns — grouped so you can see
what's available to assemble into backend page templates.

**Reuse legend**
- **Global** — site-wide chrome, mount once (most live in `src/app/layout.tsx` via `site-chrome`)
- **Drop-in** — self-contained block, drop onto any page
- **Needs data** — reusable, but you pass it specific data (trips, stories, etc.)
- **Trip/context** — built for a specific context (mostly the trip-detail page)
- **Logic** — no UI (providers, trackers, gates)

> Copy-in **static** versions of the most common blocks already live in this
> folder: `trip-carousel.html` (trip-card carousel), `blog-card.html`
> (story-card), `blog-image-slider.html`, `blog-video.html`, `fomo-toast.html`,
> `auth-modal.html`. This map is the fuller picture of everything in the pt.

---

## 1. Global chrome (mount once, site-wide)

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `site-chrome` | Exports `SiteHeader` + `SiteChromeFooter`; conditionally renders navbar / footer / cart drawer | Global |
| `navbar` | Main nav — mega menus, mobile drawer, search, cart, auth state | Global |
| `footer` | Full footer — link columns (mobile accordion / desktop grid), newsletter, trust badges, socials | Global |
| `cart-drawer` | Right-side cart drawer — items, traveller controls, totals, checkout link | Global |
| `search-overlay` | Full-screen search modal across trips / stories / pages | Global |
| `theme-toggle` | Fixed dark/light mode toggle | Global |
| `reading-progress-bar` | Fixed top-of-page scroll-depth progress bar | Global |
| `back-to-top` | Scroll-to-top button (bottom of page) | Global |
| `back-button` | Fixed back-navigation button (`router.back()`) | Global |
| `fomo-toast` | Rotating social-proof toast, bottom-left (trip pages) — GDPR-safe aggregate counts | Global (trip pages) |

## 2. Headers, heroes & section intros

| Pattern / component | Purpose | Reuse |
|-----------|---------|-------|
| **Section header** (inline) | Small coloured eyebrow + large uppercase title + optional description — the standard block intro | Drop-in |
| **Hero – text over image** (inline) | Full-height bg image + navy gradient + right-aligned eyebrow / heading / divider / italic subtext | Drop-in |
| **Pillar header** (inline, stories) | Accent rule + eyebrow + title (last word accented) + description + big line-art icon | Drop-in |
| **CTA banner** (inline) | Bordered box, handwriting-font question + description + button (e.g. "Inspire Me") | Drop-in |
| **Inclusion pillar header** (inline) | Eyebrow + title + body + bullets + linked image gallery (used on `/the-tru-way`) | Drop-in |
| `travel-style-badge` | Travel-style logo image, sizeable | Drop-in |

## 3. Modals & popups

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `login-modal` | Log in — email/password + social shortcuts | Drop-in |
| `join-community` | `SignupModal` — create account, email/password + social | Drop-in |
| `booking-modal` | Multi-step: pick departure, traveller count, confirm | Needs data |
| `inspire-me` / `inspire-me-wrapper` | Multi-step quiz modal recommending trips | Needs data / Logic |
| `map-viewer` | Pinch/zoom/pan fullscreen image viewer | Drop-in |
| `travel-style-info` | Expandable panel revealing a travel style's detail | Needs data |
| `share-buttons` | Share popup — copy link, WhatsApp, Email, SMS | Drop-in |
| `member-gate` | Gates children behind login (renders nothing to guests) | Logic |

## 4. Cards

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `trip-card` | Trip card — image, pricing, rating, quick facts, collapsible experience types | Drop-in |
| `deal-card` | Expandable deal card — price, discount, next departure, more dates | Needs data |
| `story-card` | Story/blog card — read-time pill, category, title, excerpt, author·date, locked variant | Needs data |
| `featured-story-card` | Wide featured story — image left / content right, member-lock state | Needs data |
| `trip-pricing-card` | Pricing summary — savings badge, next departure, duration, book button | Drop-in |
| `travel-style-pill` | Travel-style logo + description label | Drop-in |
| `pill-button` | Secondary CTA (link or button) with optional arrow | Drop-in |

## 5. Carousels & browsers

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `hero-slider` | Full-screen auto-playing video hero carousel (eyebrows, headlines, CTAs, mute) | Global |
| `trip-carousel-section` | Horizontal trip-card carousel with label/title + arrows | Drop-in |
| `experience-carousel` | Swiper of `TripCard`s from a trips array | Needs data |
| `experience-types-carousel` / `experience-types-v2` | Experience-type cards (v2 = 3 layout variants) | Needs data |
| `accommodation-carousel` | Accommodation cards with image/video modals | Drop-in |
| `accommodation-media-carousel` | Main + thumbnails media gallery with play controls | Drop-in |
| `brand-pillars-carousel` | Brand-pillar cards (icon, tagline, key points) | Drop-in |
| `creators-carousel` | Creator/guide cards (photo, name, role, bio) | Drop-in |
| `destinations-carousel` | Destination cards (image, name, tagline) | Drop-in |
| `drops-carousel` | Limited-edition "drops" (tags, dates, availability) | Needs data |
| `image-slider` | Swipeable image gallery (dots, count, touch) | Drop-in |
| `inclusion-gallery` | Full-width captioned image carousel | Drop-in |
| `related-trips` | Swiper of related trips (filtered, max 8) | Needs data |
| `related-stories` | Grid of 3 most-relevant stories by destination/region | Needs data |
| `unesco-tours-carousel` | Carousel of UNESCO tour trip-cards | Drop-in |
| `video-diaries-carousel` | 9:16 short-form video carousel + immersive viewer | Drop-in |
| `video-diaries-immersive` | Centered video player, prev/next previews, dots, auto-advance | Drop-in |
| `trips-browser` | Explore page — hero, recently-viewed, pill nav, trip sections, Inspire Me | Needs data |
| `deals-browser` | Deals grid + sidebar filters (region, duration, budget) + sort | Needs data |
| `all-trips-browser` | Full trip search — sidebar filters (destination, style, duration, price, moments) + grid | Needs data |

## 6. Section blocks (drop onto any page)

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `reviews-section` | Multi-platform social proof — collapsible review cards + platform ratings | Drop-in |
| `trip-reviews` | Trustpilot stars + carousel of text-review cards | Drop-in |
| `faq-section` | FAQ category — heading, description + nested accordion | Drop-in |
| `faq-accordion` | Collapsible Q&A list | Drop-in |
| `feature-row` | Alternating image-gallery / text row (icon, eyebrow, title, body, bullets) | Needs data |
| `discovery-pathways` | Grid of modal-triggering buttons (deals, styles, life moments, inspire) | Drop-in |
| `stories-feature` | "Stories From The Road" — featured story + explore link | Drop-in |
| `support-escalation` | "Talk To A Human" — live chat / email / call options | Drop-in |
| `contact-form` | Name / email / phone / message + success state | Drop-in |
| `search-prompt` | CTA button that opens the search overlay | Drop-in |
| `platform-logos` | Brand marks for Google / Trustpilot / TourRadar | Logic |

## 7. Trip-detail components

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `trip-sticky-nav` | Sticky nav (section anchors + price CTA) after hero scroll | Trip/context |
| `collapsible-itinerary` | Expandable day-by-day itinerary (images, transport, meals, experience badges) | Trip/context |
| `activities-tabs` | Tabbed experience-type filter + expandable activity list | Trip/context |
| `trip-faqs` | Trip-specific FAQ accordion | Trip/context |
| `trip-video-player` | Video thumbnail + play → fullscreen modal | Drop-in |
| `trip-booking-wrapper` | Orchestrates sticky nav + booking modal (event bridge) | Logic |
| `trip-theme-wrapper` | Trip-detail theme (light/dark) context provider | Logic |
| `hero-book-button` | Small green "Book Now" — dispatches open-booking event | Global |
| `snapshot-book-button` | Yellow "Check Dates" — dispatches booking event | Drop-in |
| `track-trip-view` | Records the view in localStorage (no UI) | Logic |

## 8. Forms & filters

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `filter-section` | Collapsible filter group (title, count badge, chevron) | Drop-in |
| `contact-form` | Contact form with success state | Drop-in |
| `sherpa-visa-widget` | Embeds the third-party Sherpa visa checker | Needs data |

## 9. Buttons & actions

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `pill-button` | Secondary CTA (link/button) + arrow | Drop-in |
| `favourite-button` | Save/unsave a trip (login prompt for guests) | Global |
| `save-story-button` | Save/unsave a story (auth modal for guests) | Drop-in |
| `share-buttons` | Share popup (copy / WhatsApp / Email / SMS) | Drop-in |
| `hero-book-button` / `snapshot-book-button` | Open the booking modal via custom event | Drop-in |
| `back-button` / `back-to-top` | Navigation helpers | Global |

## 10. Member area

| Component | Purpose | Reuse |
|-----------|---------|-------|
| `booking-history` | Accordion of bookings — timeline, payments, status | Trip/context |
| `saved-reads` | Grid of the user's saved stories | Global |
| `member-gate` | Show content only to logged-in users | Logic |

## 11. Full page templates (assemble the above)

| Component | Purpose |
|-----------|---------|
| `country-page` | Destination page — hero, facts, trips, experiences, accommodation, stories, departures, reviews, FAQs |
| `region-page` | Region page — hero, trips, activities, stories, reviews, departures |
| `travel-style-page` | Style landing — hero, intro, accommodation gallery, trip browser, FAQs, comparison |
| `support-center` | "Ask Tru.D" — search, popular questions, topic browsing |

## 12. Utilities (logic, no UI)

`site-chrome` · `member-gate` · `inspire-me-wrapper` · `trip-booking-wrapper` ·
`trip-theme-wrapper` · `track-trip-view` · `platform-logos` · `sherpa-visa-widget`

---

### Page routes these assemble into

Home · `about` (+ our-brand / our-impact / our-story / our-values / vip-programme) ·
`checkout` · `contact-us` · `deals` · `destinations/[region]/[country]/[id]` ·
`explore` (+ `all-trips`) · `faqs` · `life-moments/*` · `login` · `signup` ·
`member/*` (dashboard, bookings, saved, profile, community, exclusive, trip-hub) ·
`stories` (+ `[slug]`, `author/[slug]`) · `support` · `the-tru-way` ·
`travel-insurance` · `travel-styles` (+ `[slug]`) · `visas-and-passports` ·
`whats-included` · `terms-conditions`
