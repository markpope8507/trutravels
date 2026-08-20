import re, os

BASE = "/Users/markpope/Claude Test/trutravels/converted"
COMP = os.path.join(BASE, "components")
def read(fn): return open(os.path.join(BASE, fn), encoding="utf-8").read()
def block(fn, a, b): return "\n".join(read(fn).split("\n")[a-1:b])

def fixpaths(html):
    html = html.replace('src="assets/', 'src="../assets/').replace("src='assets/", "src='../assets/")
    # root-relative page links -> ../page.html  (leave #anchors and http(s) alone)
    html = re.sub(r'href="(?!https?:|#|\.\./|mailto:)([a-z][a-z0-9-]*\.html)"', r'href="../\1"', html)
    return html

CAROUSEL_JS = block("explore.html", 594, 677)  # arrows + exp-disclosure + drag-to-scroll

HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>__TITLE__ (component) — TruTravels</title>
  <meta name="description" content="__DESC__" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
'''
def label(t):
    return ('  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;">'
            '<p style="color:#9ca3af;font-family:\'Montserrat\',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">'
            + t + '</p></div>\n')

def page(title, desc, note, body, script=""):
    return (HEAD.replace("__TITLE__", title).replace("__DESC__", desc)
      + label(title + " &mdash; demo")
      + '\n  <!-- ===================================================================\n'
      + '       ' + note + '\n'
      + '       Requires ../styles.css. -->\n'
      + '  <section style="padding:1.5rem 0 4rem;">\n' + body + '\n  </section>\n'
      + script + '\n</body>\n</html>\n')

BOOK_SVG = '<svg width="140" height="120" viewBox="0 0 140 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="70" y1="24" x2="70" y2="104"/><path d="M70 24 Q 50 18 18 24 L 18 100 Q 50 94 70 100 Z"/><path d="M70 24 Q 90 18 122 24 L 122 100 Q 90 94 70 100 Z"/><line x1="28" y1="40" x2="58" y2="38" opacity="0.6"/><line x1="28" y1="52" x2="58" y2="50" opacity="0.6"/><line x1="82" y1="38" x2="112" y2="40" opacity="0.6"/><line x1="82" y1="50" x2="112" y2="52" opacity="0.6"/><path d="M95 22 L95 56 L102 50 L109 56 L109 22" fill="currentColor" stroke="none" opacity="0.85"/></svg>'

FILES = []  # (filename, title, one-line desc for index)

# 1. section-header (hand-written, 3 variants)
sh_body = '''    <div class="container" style="display:flex;flex-direction:column;gap:3.5rem;">
      <!-- Variant A: eyebrow + heading (green) -->
      <div><p class="eyebrow eyebrow--green">Book Now</p><h2 class="section-heading">Upcoming Departures</h2></div>
      <!-- Variant B: pink eyebrow + title + description -->
      <div><p class="st-sub-eyebrow">Browse</p><h3 class="st-sub-title">Find Your Next Read</h3><p class="st-browse__intro">Search by destination, topic, or where you are in life &mdash; there&rsquo;s a story here for every chapter of the journey.</p></div>
      <!-- Variant C: centered stories-style header -->
      <div style="text-align:center;"><p class="stories-sec__eyebrow">Stories</p><h2 class="stories-sec__title">Stories From <span>The Road</span></h2></div>
    </div>'''
open(os.path.join(COMP, "section-header.html"), "w", encoding="utf-8").write(
    page("Section header", "Standard section intro: eyebrow + title + description.",
         "SECTION HEADER — eyebrow + title (+ description). Three variants; use the eyebrow/heading classes shown.", sh_body))
FILES.append(("section-header.html", "Section intro: eyebrow + title + description (3 variants)"))

# 2. page-hero (country-hero from thailand.html)
hero = fixpaths(block("thailand.html", 33, 55))
open(os.path.join(COMP, "page-hero.html"), "w", encoding="utf-8").write(
    page("Page hero", "Full-bleed image hero with overlay text — for landing / destination pages.",
         "PAGE HERO — full-bleed image + gradient overlay + title block. Swap the image and copy.",
         "    <div style=\"max-width:none;\">" + hero + "</div>"))
FILES.append(("page-hero.html", "Full-bleed image hero with overlay title block"))

# 3. pillar-header (hand-written .pillar)
pillar_body = '''    <section class="pillar" style="padding-top:1rem;">
      <div class="container pillar__inner">
        <div class="pillar__text">
          <div class="pillar__eyebrow-row"><span class="pillar__rule pillar__rule--pink"></span><p class="pillar__eyebrow pillar__eyebrow--pink">Read &middot; Long Form</p></div>
          <h2 class="pillar__title">Stories Worth <span class="tx-pink">Reading</span></h2>
          <p class="pillar__desc">Honest, in-depth pieces from the road. Travellers, guides, and our team &mdash; sharing the moments that stayed with them.</p>
        </div>
        <div class="pillar__icon tx-pink">''' + BOOK_SVG + '''</div>
      </div>
    </section>'''
open(os.path.join(COMP, "pillar-header.html"), "w", encoding="utf-8").write(
    page("Pillar header", "Big pillar header: accent rule + eyebrow + title (last word accented) + description + line-art icon.",
         "PILLAR HEADER — accent rule + eyebrow + title + description + big icon on the right (hidden on mobile).", pillar_body))
FILES.append(("pillar-header.html", "Pillar header: rule + eyebrow + accented title + icon"))

# 4. cta-banner (hand-written .art-cta)
cta_body = '''    <div class="container"><div class="art-cta__box">
      <h2 class="art-cta__h">Ready For The Trip Of A Lifetime?</h2>
      <p class="art-cta__p">From ancient cities to wild islands, our group adventures are built to get you to the world&rsquo;s most unforgettable places &mdash; with a crew of like-minded travellers by your side.</p>
      <a class="art-cta__btn" href="../all-trips.html">Explore Our Trips &rarr;</a>
    </div></div>'''
open(os.path.join(COMP, "cta-banner.html"), "w", encoding="utf-8").write(
    page("CTA banner", "Gradient call-to-action box: heading + body + button.",
         "CTA BANNER — gradient box with heading, body and a button. Point the button at your target page.", cta_body))
FILES.append(("cta-banner.html", "Gradient call-to-action box (heading + body + button)"))

# 5. faq-accordion (native <details>, from thailand-island-hopper.html)
faq = block("thailand-island-hopper.html", 673, 689)
open(os.path.join(COMP, "faq-accordion.html"), "w", encoding="utf-8").write(
    page("FAQ accordion", "Collapsible FAQ list (native <details> — no JS).",
         "FAQ ACCORDION — native <details>/<summary>, no script needed. Add/remove .faq-item entries.",
         "    <div class=\"container\" style=\"max-width:48rem;\">" + re.sub(r'^\s*<section[^>]*>|</section>\s*$', '', faq).strip() + "</div>"))
FILES.append(("faq-accordion.html", "Collapsible FAQ list (native details, no JS)"))

# 6. reviews-section (from thailand-island-hopper.html) — needs carousel JS
reviews = block("thailand-island-hopper.html", 616, 670)
open(os.path.join(COMP, "reviews-section.html"), "w", encoding="utf-8").write(
    page("Reviews section", "Trustpilot rating + swipeable carousel of review cards.",
         "REVIEWS SECTION — Trustpilot header + .rev-carousel of .rev-card items. Copy the carousel arrow + drag scripts (below).",
         "    <div class=\"container\">" + reviews + "</div>\n" + CAROUSEL_JS))
FILES.append(("reviews-section.html", "Trustpilot rating + review-card carousel"))

# 7. destinations-carousel (You Might Also Like, index.html) — needs carousel JS
dest = fixpaths(block("index.html", 1244, 1301))
open(os.path.join(COMP, "destinations-carousel.html"), "w", encoding="utf-8").write(
    page("Destinations carousel", "Swipeable carousel of destination tiles (image + name + tagline).",
         "DESTINATIONS CAROUSEL — .rev-carousel of .country-tile items. Copy the carousel arrow + drag scripts (below).",
         "    " + dest + "\n" + CAROUSEL_JS))
FILES.append(("destinations-carousel.html", "Destination tiles carousel (image + name + tagline)"))

# 8. departures-list (from thailand.html)
dep = fixpaths(block("thailand.html", 677, 820))
open(os.path.join(COMP, "departures-list.html"), "w", encoding="utf-8").write(
    page("Departures list", "Upcoming-departures rows (date, duration, title, status, pricing).",
         "DEPARTURES LIST — .departures-list of .departure-row items. No script needed.",
         "    " + dep))
FILES.append(("departures-list.html", "Upcoming-departures rows (date, status, pricing)"))

# ------- existing components already in the folder (for the index) -------
EXISTING = [
    ("trip-carousel.html", "Trip-card carousel (badge, pricing, route, rating, experience types)"),
    ("blog-card.html", "Story / blog card (+ members-only variant)"),
    ("blog-image-slider.html", "Swipeable image gallery inside a blog image box"),
    ("blog-video.html", "Click-to-play inline video inside a blog image box"),
    ("fomo-toast.html", "Rotating social-proof toast (trip pages)"),
    ("auth-modal.html", "Log in / Create account popup"),
]

# ------- index.html gallery -------
def gallery_card(fn, desc):
    return ('<a class="cx-item" href="' + fn + '"><span class="cx-item__name">' + fn + '</span>'
            '<span class="cx-item__desc">' + desc + '</span>'
            '<span class="cx-item__go">Open demo &rarr;</span></a>')
new_cards = "".join(gallery_card(f, d) for f, d in FILES)
existing_cards = "".join(gallery_card(f, d) for f, d in EXISTING)
INDEX = HEAD.replace("__TITLE__", "Component library").replace("__DESC__", "Static, copy-in TruTravels components for page templates.") + '''
  <div class="cx-wrap">
    <p class="cx-eyebrow">TruTravels &middot; Static components</p>
    <h1 class="cx-title">Component <span>library</span></h1>
    <p class="cx-lead">Copy-in building blocks for page templates. Each links to a standalone demo; drop the marked block (and its script) into a page. Styling lives in <code>../styles.css</code>. See <a href="prototype-component-map.md">prototype-component-map.md</a> for the full pt inventory.</p>

    <h2 class="cx-h2">Page-template blocks</h2>
    <div class="cx-grid">''' + new_cards + '''</div>

    <h2 class="cx-h2">Reusable widgets</h2>
    <div class="cx-grid">''' + existing_cards + '''</div>
  </div>

  <style>
    .cx-wrap { max-width: 72rem; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
    .cx-eyebrow { color: var(--tru-pink); font-family:'Montserrat',sans-serif; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; font-size:0.72rem; margin:0 0 0.75rem; }
    .cx-title { font-family:'Montserrat',sans-serif; font-weight:900; text-transform:uppercase; color:#fff; font-size:clamp(2.5rem,6vw,4rem); line-height:0.95; margin:0 0 1rem; }
    .cx-title span { color: var(--tru-pink); }
    .cx-lead { color:#9ca3af; max-width:42rem; line-height:1.7; margin:0 0 3rem; }
    .cx-lead a { color: var(--tru-pink); }
    .cx-lead code { color:#e5e7eb; background:rgba(255,255,255,0.08); padding:0.1rem 0.35rem; border-radius:4px; }
    .cx-h2 { font-family:'Montserrat',sans-serif; font-weight:800; text-transform:uppercase; color:#fff; letter-spacing:0.02em; font-size:1.1rem; margin:2.5rem 0 1.25rem; }
    .cx-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
    @media (min-width:640px){ .cx-grid { grid-template-columns:repeat(2,1fr); } }
    @media (min-width:1024px){ .cx-grid { grid-template-columns:repeat(3,1fr); } }
    .cx-item { display:flex; flex-direction:column; gap:0.4rem; border:1px solid var(--border-soft); background:rgba(255,255,255,0.04); border-radius:12px; padding:1.25rem; transition:border-color 0.2s, background 0.2s; }
    .cx-item:hover { border-color:rgba(255,63,153,0.4); background:rgba(255,255,255,0.06); }
    .cx-item__name { font-family:'Montserrat',sans-serif; font-weight:800; color:#fff; font-size:0.95rem; }
    .cx-item__desc { color:#9ca3af; font-size:0.85rem; line-height:1.5; flex:1; }
    .cx-item__go { color:var(--tru-pink); font-family:'Montserrat',sans-serif; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:0.7rem; margin-top:0.5rem; }
  </style>
</body>
</html>
'''
open(os.path.join(COMP, "index.html"), "w", encoding="utf-8").write(INDEX)

print("wrote:", ", ".join(f for f, _ in FILES), ", index.html")
