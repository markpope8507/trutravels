"""
Build the three section hubs.

  converted/destinations.html
  converted/essentials.html
  converted/about.html
  converted/partners.html

Mirrors /destinations, /essentials, /about and /partners in the prototype. All
four are the same page: hero, breadcrumb, a grid of photo cards, nothing else.
The prototype learned that the hard way — Essentials briefly had icon cards
and About carried a retelling of its own children — so don't reintroduce a
variation here. (In the prototype the shared markup now lives in
components/section-hub.tsx.)

DATA COMES FROM THE PROTOTYPE'S OWN LIBS, read at build time rather than
retyped, so the two builds cannot disagree about what a section contains.

A CARD WITH NOWHERE TO GO IS A <div>, NOT AN <a>.
This build has far fewer pages than the prototype: one country page
(thailand.html) out of 23, and no support page at all. Those cards still
appear — they say what the section holds — but they are not links, and
`.hub-card--flat` makes that visible rather than leaving a tile that looks
clickable and isn't.

Run:  python3 converted/.build/build_hubs.py
"""

import json
import os
import re

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD
from crumbs import bar, top

SRC = os.path.join(BASE, "..", "src")


def ts(name):
    return open(os.path.join(SRC, "lib", name), encoding="utf-8").read()


def ts_array(source, const):
    """Pull a TS array literal out and parse it as JSON (quoting the keys)."""
    raw = re.search(rf"{const}[^=]*=\s*(\[.*?\n\];)", source, re.S).group(1)[:-1]
    raw = re.sub(r"^\s*//.*$", "", raw, flags=re.M)
    raw = re.sub(r"(\{|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', raw)
    raw = re.sub(r",(\s*[\]}])", r"\1", raw)
    return json.loads(raw)


DESTINATIONS = ts_array(ts("destinations.ts"), "destinations")
ESSENTIALS = ts_array(ts("essentials.ts"), "essentialsNav")
ABOUT_PAGES = ts_array(ts("about-pages.ts"), "ABOUT_PAGES")
PARTNER_PAGES = ts_array(ts("partner-pages.ts"), "PARTNER_PAGES")

# Prototype route -> the file it became here. Anything not listed has no page
# in this build, and its card is rendered flat.
STATIC = {
    "/about/our-story": "about-our-story.html",
    "/about/our-values": "about-our-values.html",
    "/about/our-impact": "about-our-impact.html",
    "/about/our-community": "about-our-community.html",
    "/about/our-brand": "about-our-brand.html",
    "/travel-insurance": "travel-insurance.html",
    "/visas-and-passports": "visas-and-passports.html",
    "/terms-conditions": "terms-conditions.html",
    "/destinations/asia/thailand": "thailand.html",
    "/partner-with-us": "partner-with-us.html",
    "/affiliates": "affiliates.html",
    "/host-a-trip": "host-a-trip.html",
    "/agent-registration": "agent-registration.html",
}


def href_for(route):
    # An absolute URL is already where it's going — Agents Login leaves the
    # site, so it isn't in STATIC and shouldn't be looked up there.
    if route.startswith("http"):
        return route
    return STATIC.get(route)


EXT_BADGE = '''
            <span class="hub-card__ext"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5"/></svg>External</span>'''


def card(name, desc, image, href, external=False):
    """One hub card. Identical markup whether it links or not, so the two read
    as the same object — only the tag and the flat modifier differ."""
    tag, attrs, extra = ("a", f' href="{href}"', "") if href else ("div", "", " hub-card--flat")
    if external:
        attrs += ' target="_blank" rel="noopener noreferrer"'
    return f'''          <{tag} class="hub-card{extra}"{attrs}>
            <img class="hub-card__img" src="{image}" alt="" aria-hidden="true" loading="lazy" />
            <span class="hub-card__grad"></span>{EXT_BADGE if external else ""}
            <span class="hub-card__body">
              <span class="hub-card__t">{name}</span>
              <span class="hub-card__d">{desc}</span>
            </span>
          </{tag}>'''


def page(title, desc, eyebrow, h1, quote, hero, crumbs, body, wms):
    marks = "\n".join(
        f'      <img class="ess-wm" style="{style}" src="assets/bg-assets/{n}.svg" alt="" aria-hidden="true" />'
        for n, style in wms
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>{title}</title>
  <meta name="description" content="{desc}" />
</head>
<body>

{NAV_OVER}

  <main class="ab">
    <section class="ess-hero">
      <img class="ess-hero__img" src="{hero}" alt="" aria-hidden="true" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">{eyebrow}</p>
          <h1 class="ess-hero__title">{h1}</h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">{quote}</p>
        </div>
      </div>
    </section>

{bar(crumbs)}

    <section class="ess-body">
{marks}
      <div class="container">
{body}
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}
</body>
</html>
"""


# ------------------------------------------------------------ destinations --

def destinations_page():
    blocks = []
    for region in DESTINATIONS:
        cards = "\n".join(
            card(c["name"], c["nickname"], c["image"],
                 href_for(c.get("href", "")))
            for c in region["countries"]
        )
        n = len(region["countries"])
        blocks.append(f'''        <div class="hub-region">
          <div class="hub-region__head">
            <h2 class="hub-region__t">{region["region"]}</h2>
            <p class="hub-region__n">{n} {"country" if n == 1 else "countries"}</p>
          </div>
          <div class="hub-grid">
{cards}
          </div>
        </div>''')
    return page(
        "Destinations &mdash; Small Group Tours In 35+ Countries | TruTravels",
        "Every country TruTravels runs small group adventures in, by continent.",
        "Where We Go", "Destin<wbr />ations",
        "&ldquo;23 countries across five continents, and a Local Legend in every one.&rdquo;",
        "https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg",
        top("Destinations"),
        "\n\n".join(blocks),
        [("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
         ("peru-bird", "left:-4rem;top:33%;width:clamp(220px,28vw,460px);opacity:0.05")],
    )


# -------------------------------------------------------------- essentials --

def essentials_page():
    cards = "\n".join(
        card(e["name"], e["description"], e["image"], href_for(e["href"]))
        for e in ESSENTIALS
    )
    return page(
        "Essentials &mdash; Insurance, Visas, Booking Conditions &amp; Support | TruTravels",
        "The practical side of travelling with TruTravels.",
        "Before You Go", "Essentials",
        "&ldquo;The boring bits, in one place, so they stay boring.&rdquo;",
        "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg",
        top("Essentials"),
        f'        <div class="hub-grid">\n{cards}\n        </div>',
        [("lantern", "right:-4rem;top:-2rem;width:clamp(260px,32vw,520px);opacity:0.06"),
         ("good-vibes", "left:-4rem;bottom:0;width:clamp(220px,28vw,460px);opacity:0.05")],
    )


# ------------------------------------------------------------------- about --

def about_page():
    # The Tru Way is filtered out, exactly as the nav's About menu does.
    pages = [p for p in ABOUT_PAGES if p["href"] != "/the-tru-way"]
    cards = "\n".join(
        card(p["name"], p["description"], p["image"], href_for(p["href"]))
        for p in pages
    )
    return page(
        "About Us &mdash; Who TruTravels Are | TruTravels",
        "How TruTravels started, what we stand for, and the community around us.",
        "About TruTravels", "About Us",
        "&ldquo;We started this because we wanted to do something we enjoy, with people we love.&rdquo;",
        "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg",
        top("About Us"),
        f'        <div class="hub-grid">\n{cards}\n        </div>',
        [("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
         ("bali-flower", "left:-4rem;top:50%;width:clamp(220px,28vw,460px);opacity:0.05")],
    )


# ---------------------------------------------------------------- partners --

def partners_page():
    cards = "\n".join(
        card(p["name"], p["description"], p["image"], href_for(p["href"]),
             external=bool(p.get("external")))
        for p in PARTNER_PAGES
    )
    return page(
        "Partners &mdash; Host A Trip, Affiliates &amp; Travel Agents | TruTravels",
        "Every way to work with TruTravels — host a trip, join the affiliates programme, or register a booking as an agent.",
        "Work With Tru", "Partners",
        "&ldquo;Bring us your community, your audience or your clients &mdash; we&rsquo;ll bring the trip.&rdquo;",
        "https://cdn.trutravels.com/africa/morocco-images/morocco-uncovered-day-3-road-trip-viewpoint.jpg",
        top("Partners"),
        f'        <div class="hub-grid">\n{cards}\n        </div>',
        [("good-vibes", "right:-4rem;top:-2rem;width:clamp(260px,32vw,520px);opacity:0.06"),
         ("sun", "left:-4rem;bottom:0;width:clamp(220px,28vw,460px);opacity:0.05")],
    )


if __name__ == "__main__":
    for fn, fx in (("destinations.html", destinations_page),
                   ("essentials.html", essentials_page),
                   ("about.html", about_page),
                   ("partners.html", partners_page)):
        out = fx()
        open(os.path.join(BASE, fn), "w", encoding="utf-8").write(out)
        flat = out.count("hub-card--flat")
        print(f"  wrote {fn:<22} ({len(out.splitlines())} lines, {flat} cards with no page yet)")
