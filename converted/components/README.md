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
| `deal-card.html` | Deal card — trip summary, the next on-sale departure (start / end / save / price + Go), and an expandable list of further dates. Bump the `deal-exp-*` / `dm-N` ids per card so each toggle works alone. | no |
| `blog-card.html` | Story / blog card — read-time pill, category, title, excerpt, author · date, "Read story". Includes a members-only variant. Used on the stories hub, Keep Reading, and author pages. | no |
| `blog-image-slider.html` | Swipeable image gallery inside a blog image box (arrows, dots, 1/N counter). Drop-in replacement for a single blog image; box size unchanged. | yes |
| `blog-image-strip.html` | Multi-up image strip for article bodies — three 4:3 images at a time, arrows sitting outside the track, optional captions. Mirrors the gallery on the live blog articles. Use `blog-image-slider.html` instead for a single framed image. | yes |
| `blog-video.html` | Click-to-play inline video inside a blog image box (poster + play button, native controls on play). Drop-in replacement for a single blog image; box size unchanged. | yes |
| `student-discount-modal.html` | **Student discount modal** — replica of the Student Beans popup on the live essentials page, rebuilt on navy with Tru type and pink accent so it stops reading as a third-party panel. Offer, terms link, three numbered steps, CTA, Powered-by footer. Opens on `:target`, no script. Steps are CSS counters, so reordering renumbers itself. | no |
| `auth-modal.html` | Log in / Create account / **Reset password** popup (Google · Facebook · Apple + email/password, "Remember me", switchable views). The reset view is reached from "Forgot password?" and is a third `data-auth-view`, so it needed no script change. Says *if* that address is registered rather than confirming it — an account-enumeration leak otherwise. | yes |
| `fomo-toast.html` | Rotating social-proof toast for trip pages (live viewers, added-to-basket w/ nav basket icon, spots-left, saves). Aggregate counts only — no customer names (GDPR). Fixed bottom-left, dismissible for the session. | yes |
| `reviews-bar.html` | Flip strip under the hero: 22,000+ reviews / 4.9 / platforms ↔ Fully Protected + ABTA & ATOL. CSS-only. Mobile shortens the protection slide. | no |
| `search-prompt.html` | Homepage search bar (above Pick Your Path) that opens the search overlay. Also wires any `[data-open-search]` control (nav magnifying glass). | yes |

### Forms

Every form on the site. `.field` is the general field system — use it for anything new; the
checkout and account pages keep their own families for the reasons given in `form-fields.html`.

| File | Component | Needs a `<script>`? |
|------|-----------|:---:|
| `upload-dropzone.html` | **Upload dropzone** — drag-and-drop (or browse) photos and videos with live thumbnails, per-file validation shown in place, remove-one, a running total and a required consent checkbox. The zone is a `<label>` wrapping a hidden input, so keyboard and screen readers work; files are held in JS because a `FileList` is read-only. Used by `share-your-photos.html`. | yes |
| `sherpa-visa-checker.html` | **Sherpa visa checker** — the entry-requirements embed from the Visas &amp; Passports page and the Good to Go tab. Handles the two quirks that cost real debugging: the SDK publishes as `window.$sherpa` *after* onload, and a second mount into the same node pins the iframe at height 0. Needs a white surface; the embed has no dark theme. | yes |
| `request-availability-form.html` | **Request availability** — the on-request capture: the departure is close, places go back to the local partner inside the window, so availability is checked before payment. Blue: `is-request` on *both* the note and the submit. Split from `waitlist-form.html` because confusing the two lets a traveller read "we'll confirm in 24 hours" as "you have a place". | yes |
| `password-reset.html` | **Password reset** — the standalone card for `/reset-password`, for people who land on the login page directly and so a reset email's link has somewhere to point. The modal version is a third view of `auth-modal.html`. Wording is the security control: says *if* that address is registered, never confirms it. | yes |
| `form-fields.html` | **Form field kit** — every control with its class and spec: `.field` label/input/select/textarea, `.field-row`, `.form-check`, `.field__hint`, `.field.is-err`, `.form-submit`, `.form-done`. Also tables the five field families and which page each belongs to. Start here. | no |
| `partner-application-form.html` | **Partner application** — the form behind all three Partners pages, in its three variants. One shared base of seven questions (name, email, over 18, socials, travelled before, key audience, why Tru) plus the two to four each route adds. Closed questions are pills (`.ptn-opts`), not `<select>`s; the radio/checkbox is visually hidden so it keeps keyboard focus. Also shows the partner logo wall and the testimonial carousel. | yes |
| `contact-form.html` | Contact Us — name / email / phone / message with a success panel, plus the **Talk To A Human** channel cards (chat · email · call) and the regional phone list. From help &amp; support. | yes |
| `newsletter-signup.html` | Mailing-list capture in two shapes: the **footer strip** (pill input, already on every built page) and a **standalone panel** for a landing page or article foot. Both swap in a confirmation. | yes |
| `waitlist-form.html` | The booking-modal details capture, in both asks: **waitlist** (pink — departure full, queuing for a cancellation) and **on request** (blue — departure close, availability must be checked). Same fields, deliberately different colour and copy. | yes |
| `checkout-details-form.html` | The four checkout form blocks: log-in-to-autofill, collapsible **traveller details** cards (`.co-field` + `.co-req` / `.co-opt`, DOB and dialling-code selects), card payment, and the consent checkboxes. | yes |
| `account-details-form.html` | Account forms: **profile details** rows (`.acct-field`), **travel preference** pills, and the **Good to Go** editor — `.acct-fs` fieldsets of compact `.acct-fld` inputs for a long paperwork form. | yes |

Log in / create account is not here — it's `auth-modal.html` under Widgets.

### Page-template blocks

Structural blocks for building whole pages (extracted from the live static pages).

| File | Component | Needs a `<script>`? |
|------|-----------|:---:|
| `text-blocks.html` | **Text micro-layouts** — the reading column, the section head, and every body-copy block (lead, beat, pull-quote, closer, handwriting, sign-off, fine print, polaroid) with its class and type spec. The kit for building page content. | no |
| `job-listing.html` | **Open-roles board** — filterable job cards showing location, team and contract before you open one, expanding to a typed job description (facts rail, named outcomes, tick lists, Essential beside Nice To Have, apply panel). Collapse is native `<details>`; the script only does filters and `#slug` deep links. Built by `.build/build_careers.py` alongside `join-the-crew.html`. | yes |
| `video-diaries-carousel.html` | **Video-diary carousel** — the community-stories gallery from the homepage. Tap-to-play cards (traveller / creator / Planeterra / partner / community tags) with fullscreen `:target` viewers and a "Share Yours" CTA tile. No JS for the gallery itself. | yes (carousel) |
| `local-legends-carousel.html` | **Local Legends carousel** — the same card and carousel cast entirely from guides, with its own head and no CTA tile. Sits straight after the video diaries on the community page. Carries the lightbox viewer (scrim + prev/next), not the stories-style one. | yes (carousel) |
| `tru-way.html` | **How We Do Things** — the Tru Way four-up icon grid: find your people, logistics locked in, Local Legends, fully protected. Plain `<div>`, 1 / 2 / 4 columns, no script. | no |
| `media-text-rows.html` | **Alternating image/text rows** — the article body layout. `.art-section` is text left / image right; `--alt` flips it with grid `order` (markup stays text-first, so reading order survives). Stacks below 1024px. The media box also takes the image slider or inline video. | no |
| `overlay-hero.html` | **Overlay hero** — the right-aligned page opener used on every About and Essentials page, the 404 and careers. Photo, left-to-right navy gradient, and eyebrow / title / rule / quote pushed right. Needs a picture with space on its right-hand side. | no |
| `cross-links.html` | **Cross-links** — the closing grid that sends the reader on instead of dead-ending. Whole-tile links, 5:3, gradient so white text is safe over any photo. Always filtered so a page never links to itself. | no |
| `section-header.html` | Section intro — eyebrow + title + description (3 variants) | no |
| `page-hero.html` | Full-bleed image hero with overlay title block | no |
| `pillar-header.html` | Big pillar header — accent rule + eyebrow + accented title + line-art icon | no |
| `cta-banner.html` | Gradient call-to-action box (heading + body + button) | no |
| `faq-accordion.html` | Collapsible FAQ list (native `<details>`, no JS) | no |
| `reviews-section.html` | Trustpilot rating + swipeable review-card carousel (demo also includes the reviews-bar copy-in above it) | yes (carousel) |
| `destinations-carousel.html` | Destination-tile carousel (image + name + tagline) | yes (carousel) |
| `drops-carousel.html` | **The Drop** — limited-release carousel (tag badge, date, title, subtitle, spots left, "Get access"). **Phase 2:** lifted off the homepage and parked here until the drops programme launches. | yes (carousel) |
| `departures-list.html` | Upcoming-departures rows (date, duration, status, pricing) | no |
| `reviews-bar.html` | Hero social-proof / protection flip strip (also listed under widgets) | no |
| `search-prompt.html` | Homepage search bar + overlay (also listed under widgets) | yes |

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

## Reviews bar

Copy the `<section class="reviews-bar"> … </section>` under a hero (it replaced
the homepage ticker). No script — the flip is CSS. Drop `../` from asset paths
when pasting into a page at the site root. Edit the two `__slide` inners to
change the reviews totals or protection copy.

## Search prompt

Copy the `.search-prompt` button onto a page (homepage: above Pick Your Path)
**and** the `.search-overlay` block plus its `<script>` once. Give any extra
trigger (nav magnifying glass) a `data-open-search` attribute. Closes on the
backdrop, the ✕, or Escape. Drop `../` from result hrefs when pasting into a
page at the site root.
