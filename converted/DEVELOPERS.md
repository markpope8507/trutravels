# TruTravels — Static Conversion Guide

How the Next.js prototype is converted into the **static vanilla HTML/CSS** that lives in `converted/`, and the conventions every converted page must follow so the whole site stays consistent as we migrate page by page.

Read this alongside `convert_prompt.md` (the per-page conversion brief). That brief says *what* to produce; this guide says *how to keep it consistent* across many pages.

---

## 1. The mental model

```
Next.js + Tailwind app  ──►  converted/  ──►  developers' codebase
   (design source of         (plain .html +      (consumes the static
    truth / prototype)         styles.css)          files as-is)
```

- The **React app is the design source of truth** — the look, copy, spacing and behaviour are decided there.
- **`converted/` is the deliverable** — hand-written static files that reproduce that design with zero framework, zero build step.
- We convert **one page at a time**, and **every page shares one `styles.css`**.

### Golden rules (from the brief — non-negotiable)
1. No React, Next.js, Tailwind, or framework JS/CSS. No JSX.
2. **No build step.** Every `.html` file must open directly in a browser by double-clicking it.
3. **One shared `styles.css`** for the whole site. No per-page stylesheets.
4. Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`).
5. Meaningful, reusable class names — **never Tailwind utility soup**.
6. **Keep interactions static.** Only use JavaScript when there is no reasonable HTML/CSS equivalent, and even then keep it tiny and vanilla.
7. Match the original design exactly (spacing, colour, type, layout); keep responsive behaviour.

---

## 2. Folder structure

```
converted/
  styles.css                 ← the ONE shared stylesheet (the design system)
  DEVELOPERS.md              ← this file
  thailand.html              ← country page (done)
  thailand-island-hopper.html← tour page
  <page>.html                ← one file per page
  assets/                    ← (optional) local images/fonts if not using a CDN
```

- Fonts load from Google Fonts via `<link>` in each page's `<head>` (Montserrat, Caveat, Source Sans 3).
- Images currently reference the existing CDNs (`cdn.trutravels.com`, Unsplash). Drop local copies into `assets/` only if you need to.

---

## 3. The design system lives in `styles.css`

This is the **one place** shared styling is defined, and the reason the migration scales. When you convert a new page:

> **First reuse. Only then extend.** Check `styles.css` for an existing class before writing new CSS. If a component is genuinely new, add it to `styles.css` (never to the page).

### 3a. Design tokens — `:root`
All colours, radius and layout constants are CSS variables at the top of `styles.css`:

```css
:root {
  --tru-pink: #FF3F99;
  --tru-navy: #09213E;
  --tru-green: #6BD495;
  --tru-blue:  #2172D5;
  --border-soft:  rgba(255,255,255,0.10);
  --surface-soft: rgba(255,255,255,0.05);
  --radius: 10px;
  --max-width: 80rem;
}
```
Use the variables — never hard-code a hex that already has a token.

### 3b. Layout primitives (reuse on every page)
| Class | Purpose |
|---|---|
| `.container` | Centred max-width wrapper with responsive padding |
| `.section` / `.section--bleed-top` | Vertical rhythm between blocks |
| `.eyebrow` (`--pink/--green/--blue/--amber`) | The small uppercase kicker above a heading |
| `.section-heading` | The big Montserrat-Black section title |
| `.btn` (`--primary/--ghost`) | Buttons |

### 3c. Component library (already in `styles.css`)
Reuse these before building anything new: `.site-nav`, `.site-footer`, `.trip-card`, `.country-tile`, `.bucket-card`, `.review-card`, `.story-card`, `.video-card`, `.podcast-row`, `.departure-row`, `.faq-item`, `.carousel`, `.fun-facts`, `.style-pill`, `.tp-star`.

### 3d. Naming convention
Block / element / modifier, hyphen-separated (the existing convention):

```
.trip-card                 (block)
.trip-card__title          (element)
.trip-card__badge          (element)
.btn--primary              (modifier)
```
Component-scoped names, not generic ones (`.trip-card__title`, not `.title`).

---

## 4. Interactivity WITHOUT a framework

This is where a tour page differs from a static country page. Prefer these in order:

### Pattern A — Carousels & image galleries → CSS only
A flex row that scrolls with snap. No JS.
```html
<div class="carousel carousel--trips">
  <article class="trip-card">…</article>
  <article class="trip-card">…</article>
</div>
```
```css
.carousel { display:flex; gap:1rem; overflow-x:auto; scroll-snap-type:x mandatory; }
.carousel > * { flex:0 0 auto; scroll-snap-align:start; }
```

### Pattern B — Accordions (itinerary days, FAQs) → native `<details>`
No JS. Fully accessible. This is how `thailand.html` does FAQs.
```html
<details class="faq-item">
  <summary class="faq-item__summary">Day 1 — Welcome to Thailand!</summary>
  <div class="faq-item__answer">…day content, images, meals…</div>
</details>
```

### Pattern C — Tabs / filters (experience types) → radio inputs + `:checked`
Pure CSS tabs. Radios share a `name`; labels are the tab buttons; `:checked ~` reveals the matching panel.
```html
<input type="radio" name="exp" id="exp-all" checked hidden>
<input type="radio" name="exp" id="exp-local" hidden>
<label for="exp-all"  class="exp-tab">All</label>
<label for="exp-local" class="exp-tab">Local Lens</label>
<div class="exp-panel" data-exp="all">…</div>
<div class="exp-panel" data-exp="local">…</div>
```
```css
.exp-panel { display:none; }
#exp-all:checked  ~ .exp-panel[data-exp="all"]   { display:block; }
#exp-local:checked ~ .exp-panel[data-exp="local"]{ display:block; }
```

### Pattern D — Modals & lightboxes (Check Dates, video, map) → `:target`
Anchor-based, pure CSS. A link opens the modal; a backdrop link closes it.
```html
<a href="#dates" class="btn btn--primary">Check Dates</a>
<div id="dates" class="modal">
  <a href="#" class="modal__backdrop" aria-label="Close"></a>
  <div class="modal__panel">…dates / waitlist form…</div>
</div>
```
```css
.modal { display:none; }
.modal:target { display:flex; }
```

### When "absolutely basic" JS is justified
If a behaviour has no clean static equivalent (e.g. locking background scroll while a modal is open, or a form success message), add a **small inline `<script>` at the end of the page** using plain DOM APIs — no libraries, no modules. Keep it to a few lines and **list it in the page's delivery notes** as an approximation.

> Rule of thumb: reach for A→B→C→D before any JS. Most of the site needs none.

---

## 5. Shared nav & footer (no build step)

Because there's no build step, the `<header class="site-nav">` and `<footer class="site-footer">` markup is **copied into each page**. That's intentional and acceptable per the brief.

- When the nav or footer changes, update it in **every** page file (they're identical blocks — a find/replace across `converted/*.html`).
- If that ever becomes painful, the *only* framework-free shortcut is a tiny `include.js` that `fetch`es a `_nav.html` partial — but that adds a JS dependency and breaks `file://` double-click opening, so we avoid it unless asked.

---

## 6. How to convert a page (checklist)

1. Open the live React page as the reference for exact spacing/colour/copy.
2. Create `converted/<page>.html` with the standard `<head>` (fonts + `<link rel="stylesheet" href="styles.css">`).
3. Copy in the shared **nav** and **footer** blocks.
4. Build the body with **semantic HTML** and **existing component classes**. Reuse first.
5. For any new component, add its CSS to `styles.css` (grouped, commented) — not to the page.
6. Reproduce interactions with Patterns A–D. Only add basic JS as a last resort.
7. Hard-code the page's real content/data (there's no data layer — copy values from the React `data.ts`).
8. Test by **double-clicking the file** — it must render fully offline-of-framework.
9. In your delivery notes, list: the page converted, its path, and anything approximated (esp. JS-driven UI).

---

## 7. Do / Don't

**Do**
- Reuse `styles.css` components; grow it deliberately.
- Use `<details>`, `scroll-snap`, `:target`, radio-tabs for interactivity.
- Keep class names meaningful and component-scoped.
- Match the design 1:1.

**Don't**
- ❌ Run `next export` / ship React-hydrated Tailwind HTML — that's not maintainable vanilla.
- ❌ Add a per-page `<style>` block or a second stylesheet.
- ❌ Pull in Tailwind, Bootstrap, jQuery, Swiper, or any library.
- ❌ Introduce a build step or framework to "save time" — it breaks the core requirement.

---

## 8. Migration roadmap

Convert in this rough order so shared components get established early and later pages fly:

1. **Country page** — `thailand.html` ✅ (established nav, footer, cards, carousel, FAQ patterns)
2. **Tour page** — `thailand-island-hopper.html` (adds: sticky booking bar, experience tabs, itinerary accordion + galleries, Check Dates/waitlist modal, map lightbox)
3. Regional / destinations landing
4. Stories + article template
5. Essentials (FAQs, insurance, visas, terms, support)
6. Homepage last (most bespoke)

Each conversion **extends the same `styles.css`**. By page 3–4 most components already exist, so new pages are mostly markup.

---

*Questions on a specific component? Check `styles.css` first — the class is probably already there.*
