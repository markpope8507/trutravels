# Shared components

**Open [`index.html`](index.html) for a visual gallery** of every component
(links to each standalone demo).

Reusable HTML/JS building blocks for the page templates. Because the static
site has no build step, these are **copy-in snippets**: drop the marked block
(and its `<script>`, where present) into a page/template. All styling lives in
the shared `../styles.css` — no per-component CSS.

Each file is also a **standalone demo** — open it in a browser to see the
component working. The stylesheet link uses `../styles.css` because this folder
is one level below the site root; for the same reason, asset/page paths inside a
component use `../assets/…` and `../page.html`. When you paste a component into a
page at the site root, drop the `../`.

> **Full prototype inventory:** [`prototype-component-map.md`](prototype-component-map.md)
> maps all 79 components in the Next.js prototype (nav, footer, popups, headers,
> heroes, cards, carousels, section blocks, trip-detail, forms, page templates,
> utilities) — everything available to assemble into new page templates. The
> copy-in files below are the static versions of the most-used blocks.

| File | Component | Needs a `<script>`? |
|------|-----------|:---:|
| `trip-carousel.html` | Horizontally-scrollable carousel of trip cards (style badge, save %, pricing, per-day, route, rating, facts, expandable TRU Experience Types). Used on the homepage + blog articles. | yes |
| `blog-card.html` | Story / blog card — read-time pill, category, title, excerpt, author · date, "Read story". Includes a members-only variant. Used on the stories hub, Keep Reading, and author pages. | no |
| `blog-image-slider.html` | Swipeable image gallery inside a blog image box (arrows, dots, 1/N counter). Drop-in replacement for a single blog image; box size unchanged. | yes |
| `blog-video.html` | Click-to-play inline video inside a blog image box (poster + play button, native controls on play). Drop-in replacement for a single blog image; box size unchanged. | yes |
| `auth-modal.html` | Log in / Create account popup (Google · Facebook · Apple + email/password, "Remember me", switchable views). | yes |
| `fomo-toast.html` | Rotating social-proof toast for trip pages (live viewers, added-to-basket w/ nav basket icon, spots-left, saves). Aggregate counts only — no customer names (GDPR). Fixed bottom-left, dismissible for the session. | yes |

### Page-template blocks

Structural blocks for building whole pages (extracted from the live static pages).

| File | Component | Needs a `<script>`? |
|------|-----------|:---:|
| `section-header.html` | Section intro — eyebrow + title + description (3 variants) | no |
| `page-hero.html` | Full-bleed image hero with overlay title block | no |
| `pillar-header.html` | Big pillar header — accent rule + eyebrow + accented title + line-art icon | no |
| `cta-banner.html` | Gradient call-to-action box (heading + body + button) | no |
| `faq-accordion.html` | Collapsible FAQ list (native `<details>`, no JS) | no |
| `reviews-section.html` | Trustpilot rating + swipeable review-card carousel | yes (carousel) |
| `destinations-carousel.html` | Destination-tile carousel (image + name + tagline) | yes (carousel) |
| `departures-list.html` | Upcoming-departures rows (date, duration, status, pricing) | no |

The two carousels reuse the same generic arrow-nav + drag-to-scroll scripts (copy them once per page).

## Trip carousel

Copy the `<div class="rev-carousel" data-arrows> … </div>` block and add/remove
`<article class="tripcard">` items. Copy the three `<script>` blocks
(arrow-nav, experience-type disclosure, drag-to-scroll) — they're generic and
power every `.rev-carousel` / `.carousel` on the site, so you only need them
once per page.

## Blog card

Copy any `<a class="story-card"> … </a>` into a grid. For a members-only card
add the `story-card--locked` class, the `__badge` and `__lock` elements, and
point the `href` at the sign-up page. Omit the `__time` pill to hide read time.

## Blog image slider

Keep the outer `<div class="art-section__media">` (that's the fixed image box);
put `.art-slider` inside and list one `.art-slider__slide` per image. Copy the
slider `<script>` (once per page — it initialises every `[data-slider]`).

## Blog video insert

Keep the outer `.art-section__media` box, add the `art-video` class + the
`data-video` hook, and set the `<video poster>` + `<source src>`. Copy the video
`<script>` (once per page — it wires every `[data-video]`).

## Auth modal

Copy the `<div class="auth-modal" data-auth-modal> … </div>` block **and** its
`<script>` once. Give any trigger a `data-auth-open` attribute
(`"login"` or `"signup"`). Closes on the backdrop, the ✕, or Escape; the two
views switch via their in-modal links.
