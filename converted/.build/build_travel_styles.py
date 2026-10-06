"""
Build a travel style page.

    travel-style-classic.html   mirrors src/app/travel-styles/classic

    python3 converted/.build/build_travel_styles.py [slug ...]   # default: classic
    python3 converted/.build/apply_crumbs.py                     # breadcrumb bar

FLAT NAMES, as everywhere else in converted/ — the prototype's route is
/travel-styles/<slug>, a directory that does not exist here.

IT IS THE COUNTRY PAGE, NOT A NEW PAGE. The prototype's travel-style-page.tsx
says so in its own docstring: hero, breadcrumb, trips carousel, where you'll
stay, upcoming departures, FAQs. So this builder draws it with the country
page's own classes — .country-hero, .tripcard, .stay-card, .dep, .faq-item,
.hub-card — and imports build_country_sections' tripcard() rather than growing
a second renderer that can drift from it.

WHERE THE CONTENT COMES FROM. Nothing is retyped:

    src/components/travel-style-page.tsx   heroImages, styleContent
                                           (tagline, intro, stays, FAQs)
    src/lib/data.ts                        travelStyleConfig (label, blurb)
    converted/all-trips.html               the TRIPS literal — the trip cards,
                                           so they stay byte-identical to the
                                           same tours on Explore and Deals
    src/lib/data.ts                        departures, filtered to the future

TWO THINGS DELIBERATELY *NOT* COPIED FROM thailand.html:

  - No style logo on the stay cards. The prototype passes no `travelStyle` on
    this page's stays on purpose: every card would read CLASSIC under a hero
    that already says it.
  - Image stays are not links. thailand.html gives them a zoom affordance
    pointing at `#stayzoom-*` targets that do not exist anywhere in that file —
    a dead link on every image card. The prototype only opens a lightbox for
    VIDEO stays, so only video stays get one here.
"""

import datetime as dt
import html as H
import os
import re
import sys

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD
from build_country_sections import (
    TRIPS, objects, field, lib, tier, tripcard, ON_REQUEST_DAYS,
    PIN, CHEV_L, CHEV_R,
)

SRC = os.path.join(BASE, "..", "src")
COMPONENT = open(os.path.join(SRC, "components", "travel-style-page.tsx"), encoding="utf-8").read()
DATA = lib("data.ts")

# slug -> the TravelStyle key used in the data
SLUGS = {
    "classic": "classic",
    "backpacker": "backpacker",
    "flashpacker": "flashpacker",
    "multi-country": "multi_country",
    "limited-edition": "limited_edition",
}
STYLE_SLUG = {v: k for k, v in SLUGS.items()}


def esc(s):
    return H.escape(str(s or ""), quote=False).replace("'", "&rsquo;")


def brace_end(text, start):
    """Index just past the brace opened at `start`, quotes respected."""
    depth, quote, i = 0, None, start
    while i < len(text):
        c = text[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise ValueError("unbalanced brace")


def record_entries(text, decl):
    """`key: { ... }` pairs at depth 1 of a Record literal."""
    seg = text[text.index(decl):]
    # `= {`, not the first `{`: travelStyleConfig's type annotation is
    # `Record<TravelStyle, { label: string; ... }>`, so the first brace in the
    # declaration belongs to the TYPE. Walking from there returns nothing —
    # the same trap `Trip[]` sets for the array walkers.
    seg = seg[seg.index("= {") + 2:]
    end = brace_end(seg, 0)
    out, i = {}, 1
    while i < end - 1:
        m = re.compile(r'\s*"?([A-Za-z_][\w-]*)"?:\s*\{').match(seg, i)
        if m:
            j = brace_end(seg, m.end() - 1)
            out[m.group(1)] = seg[m.end() - 1:j]
            i = j
            continue
        i += 1
    return out


def strings_in(obj, key):
    """String items of `key: [ ... ]`, in order."""
    m = re.search(r"\b" + key + r"\s*:\s*\[", obj)
    if not m:
        return []
    depth, quote, i = 0, None, m.end() - 1
    while i < len(obj):
        c = obj[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                break
        i += 1
    seg = obj[m.end():i]
    return [s.replace('\\"', '"') for s in re.findall(r'"((?:[^"\\]|\\.)*)"', seg)]


def dicts_in(obj, key, fields):
    """`key: [ { ... }, ... ]` as a list of dicts, scalar fields only."""
    m = re.search(r"\b" + key + r"\s*:\s*\[", obj)
    if not m:
        return []
    depth, i = 0, m.end() - 1
    while i < len(obj):
        if obj[i] == "[":
            depth += 1
        elif obj[i] == "]":
            depth -= 1
            if depth == 0:
                break
        i += 1
    out = []
    for raw in re.finditer(r"\{[^{}]*\}", obj[m.end():i]):
        o = raw.group(0)
        out.append({f: field(o, f) for f in fields})
    return out


# --------------------------------------------------------------------- data --

HERO_IMAGES = dict(re.findall(r'(\w+): "(https://[^"]+)"',
                              COMPONENT[COMPONENT.index("const heroImages"):
                                        COMPONENT.index("type StyleContent")]))
CONFIG = record_entries(DATA, "export const travelStyleConfig")
CONTENT = record_entries(COMPONENT, "const styleContent")

for name, got in (("heroImages", HERO_IMAGES), ("travelStyleConfig", CONFIG),
                  ("styleContent", CONTENT)):
    if len(got) != 5:
        raise SystemExit("build_travel_styles: parsed %d %s, expected 5" % (len(got), name))


def tagline(style):
    return field(CONTENT[style], "tagline")


def intro(style):
    """The prose paragraphs. The four non-Classic styles reuse the config
    blurb — `intro: [travelStyleConfig.x.description]` — which is a reference,
    not a literal, so it is resolved rather than parsed."""
    got = strings_in(CONTENT[style], "intro")
    if got:
        return got
    m = re.search(r"intro:\s*\[travelStyleConfig\.(\w+)\.description\]", CONTENT[style])
    return [field(CONFIG[m.group(1)], "description")] if m else []


def style_trips(style):
    return [t for t in TRIPS if t.get("travelStyle") == style]


def departures(style):
    """Every future, bookable departure on this style's trips, soonest first.
    Reads lib/data.ts rather than the TRIPS literal, which carries no dates."""
    ids = {t["id"] for t in style_trips(style)}
    today = dt.date.today()
    seg = DATA[DATA.index("export const trips: Trip[]"):DATA.index("export const stories: Story[]")]
    rows = []
    for obj in objects(seg):
        tid = field(obj, "id")
        if tid not in ids:
            continue
        d = obj.find("departures: [")
        if d == -1:
            continue
        trip = {"id": tid, "title": field(obj, "title"), "duration": field(obj, "duration"),
                "start": field(obj, "startLocation"), "end": field(obj, "endLocation")}
        for row in re.finditer(r"\{([^}]*)\}", obj[d:obj.index("],", d)]):
            r = row.group(1)
            date = re.search(r'date: "([^"]+)"', r)
            if not date:
                continue
            status = re.search(r'status: "([^"]+)"', r)
            status = status.group(1) if status else "available"
            day = dt.date.fromisoformat(date.group(1))
            if status == "full" or day < today:
                continue
            price = re.search(r"price: (\d+)", r)
            orig = re.search(r"originalPrice: (\d+)", r)
            spots = re.search(r"spotsLeft: (\d+)", r)
            rows.append((day, trip, {
                "price": int(price.group(1)) if price else 0,
                "originalPrice": int(orig.group(1)) if orig else None,
                "status": status,
                "spotsLeft": int(spots.group(1)) if spots else None,
            }))
    rows.sort(key=lambda r: (r[0], r[1]["title"]))
    return rows


# ------------------------------------------------------------------ render --

TRIP_PAGES = {"thailand-island-hopper": "thailand-island-hopper.html"}

PLAY = ('<span class="stay-card__play"><span class="stay-card__play-btn">'
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></span>')
CLOSE = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
         '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')
CHEV_DOWN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
             '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')

# The page's floating marks, at the four heights the prototype places them.
MARKS = [("lantern", "left:calc(-4rem - 3.4vw);top:16%;width:clamp(220px,33vw,460px)"),
         ("sun", "right:calc(-4rem - 4vw);top:32%;width:clamp(260px,40vw,560px)"),
         ("bali-flower", "left:calc(-4rem - 3.4vw);top:54%;width:clamp(220px,33vw,460px)"),
         ("good-vibes", "right:calc(-4rem - 3.4vw);top:76%;width:clamp(220px,33vw,460px)")]


def slug_of(stay):
    return re.sub(r"[^a-z0-9]+", "-", stay["title"].lower()).strip("-")


def stay_card(stay, sid):
    """Video stays open a lightbox; image stays are inert, as in the prototype.

    The card video autoplays muted and looping the way the prototype's does —
    a poster with a play button would be a different control for the same
    content.
    """
    body = ('<div class="stay-card__body"><h3 class="stay-card__title">%s</h3>'
            '<p class="stay-card__text">%s</p></div>'
            % (esc(stay["title"]), esc(stay["caption"])))
    if stay["type"] == "video":
        return ('<article class="stay-card">'
                '<a class="stay-card__media" href="#%s" aria-label="Enlarge video: %s">'
                '<video src="%s" poster="%s" autoplay muted loop playsinline preload="metadata"></video>'
                '%s<span class="stay-card__glow"></span></a>%s</article>'
                % (sid, esc(stay["title"]), stay["src"], stay.get("poster") or "", PLAY, body))
    return ('<article class="stay-card">'
            '<div class="stay-card__media"><img src="%s" alt="%s" loading="lazy" />'
            '<span class="stay-card__glow"></span></div>%s</article>'
            % (stay["src"], esc(stay["title"]), body))


def stay_modal(stay, sid):
    return ('  <div class="vid-modal" id="%s">\n'
            '    <a class="vid-modal__backdrop" href="#accommodation" aria-label="Close"></a>\n'
            '    <div class="vid-modal__inner">\n'
            '      <a class="vid-modal__close" href="#accommodation" aria-label="Close">%s</a>\n'
            '      <video controls playsinline preload="none" poster="%s">\n'
            '        <source src="%s" type="video/mp4" />\n'
            '      </video>\n    </div>\n  </div>'
            % (sid, CLOSE, stay.get("poster") or "", stay["src"]))


def departure_row(day, t, d, today):
    tier_id, tier_label = tier(d["spotsLeft"], d["status"])
    on_request = (day - today).days <= ON_REQUEST_DAYS
    label = "On Request" if on_request else tier_label
    dot = "is-request" if on_request else "is-" + tier_id
    cta = "Check Availability" if on_request else "View Trip"
    disc = (round((d["originalPrice"] - d["price"]) / d["originalPrice"] * 100)
            if d["originalPrice"] and d["originalPrice"] > d["price"] else 0)
    save = ('<div class="dep__save"><p class="dep__save-l">Save</p>'
            '<p class="dep__save-n">%d%%</p></div>' % disc) if disc else ""
    strike = ('<span class="dep__was">&pound;%d</span>' % d["originalPrice"]) if disc else ""
    route = (" &middot; %s &mdash; %s" % (esc(t["start"]), esc(t["end"]))) if t["start"] and t["end"] else ""
    return ('        <div class="dep">\n'
            '          <div class="dep__date"><p class="dep__mon">%s</p>'
            '<p class="dep__day">%d</p><p class="dep__yr">%d</p></div>\n'
            '          <div class="dep__rule"></div>\n'
            '          <div class="dep__main"><h3 class="dep__title">%s</h3>'
            '<p class="dep__meta">%s %s%s</p>'
            '<span class="dep__status %s"><span class="dep__dot"></span>%s</span></div>\n'
            '          <div class="dep__right">%s'
            '<div class="dep__price">%s<span class="dep__now">&pound;%d</span></div>'
            '<a class="dep__cta" href="%s">%s &rarr;</a></div>\n'
            '        </div>'
            % (day.strftime("%b").upper(), day.day, day.year, esc(t["title"]),
               PIN, esc(t["duration"]), route, dot, label, save, strike, d["price"],
               TRIP_PAGES.get(t["id"], "all-trips.html"), cta))


def faq(q, a):
    return ('        <details class="faq-item">\n'
            '          <summary class="faq-item__summary"><span>%s</span>%s</summary>\n'
            '          <div class="faq-item__answer"><p>%s</p></div>\n'
            '        </details>' % (esc(q), CHEV_DOWN.replace("<svg", '<svg class="faq-item__chevron"'), esc(a)))


def carousel(cards, dots=False):
    return ('      <div class="rev-carousel" data-arrows>\n'
            '        <div class="carousel carousel--trips carousel--3up"%s>\n%s\n        </div>\n'
            '        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous">%s</button>\n'
            '        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next">%s</button>\n'
            '      </div>' % (" data-dots" if dots else "", cards, CHEV_L, CHEV_R))


def page(slug):
    style = SLUGS[slug]
    cfg, cont = CONFIG[style], CONTENT[style]
    label = field(cfg, "label")
    trips = style_trips(style)
    today = dt.date.today()
    deps = departures(style)
    stays = dicts_in(cont, "accommodation", ("type", "src", "poster", "title", "caption"))
    faqs = dicts_in(cont, "faqs", ("question", "answer"))

    marks = "".join('    <img class="ess-wm" style="%s;opacity:0.05" src="assets/bg-assets/%s.svg" '
                    'alt="" aria-hidden="true" />\n' % (css, f) for f, css in MARKS)

    out = ['    <section class="country-hero">\n'
           '      <img class="country-hero__image" src="%s" alt="" aria-hidden="true" />\n'
           '      <div class="country-hero__overlay"></div>\n'
           '      <div class="container country-hero__inner">\n'
           '        <p class="country-hero__region">Travel Style</p>\n'
           '        <h1 class="country-hero__title">%s</h1>\n'
           '        <p class="country-hero__count">%d trip%s available</p>\n'
           '        <p class="country-hero__tagline">%s</p>\n'
           '        <p class="country-hero__description">%s</p>\n'
           '      </div>\n    </section>'
           % (HERO_IMAGES[style], esc(label), len(trips), "" if len(trips) == 1 else "s",
              esc(tagline(style)), esc(field(cfg, "description")))]

    out.append('    <section class="section tstyle-what" id="the-style">\n'
               '      <p class="eyebrow eyebrow--pink">The Style</p>\n'
               '      <h2 class="tstyle-what__h">What Is <span class="tx-pink">%s?</span></h2>\n'
               '      %s\n    </section>'
               % (esc(label),
                  "\n      ".join("<p>%s</p>" % esc(p) for p in intro(style))))

    if trips:
        out.append('    <section class="container section" id="trips">\n'
                   '      <div class="home-section-head home-section-head--sm">\n'
                   '        <div><p class="eyebrow eyebrow--pink">Explore</p>\n'
                   '        <h2 class="section-heading">%s Trips</h2></div>\n'
                   '        <a class="pill-btn home-section-head__pill-desktop" href="all-trips.html?style=%s">See All Trips%s</a>\n'
                   '      </div>\n%s\n'
                   '      <div class="home-section-head__pill-mobile">\n'
                   '        <a class="pill-btn" href="all-trips.html?style=%s">See All Trips%s</a>\n'
                   '      </div>\n    </section>'
                   % (esc(label), slug, CHEV_R,
                      carousel("\n".join("        " + tripcard(t) for t in trips)),
                      slug, CHEV_R))

    modals = []
    if stays:
        cards = []
        for s in stays:
            sid = "stayvid-%s" % slug_of(s)
            cards.append("        " + stay_card(s, sid))
            if s["type"] == "video":
                modals.append(stay_modal(s, sid))
        out.append('    <section class="container section country-stays" id="accommodation">\n'
                   '      <p class="eyebrow eyebrow--pink">Where You&rsquo;ll Stay</p>\n'
                   '      <h2 class="section-heading">Sleep Somewhere <span class="tx-pink">Special</span></h2>\n'
                   '      <p class="section-lead">No two nights are the same. Here&rsquo;s the kind of '
                   'stays a %s trip calls home.</p>\n%s\n    </section>'
                   % (esc(label), carousel("\n".join(cards), dots=True)))

    if deps:
        rows = "\n".join(departure_row(day, t, d, today) for day, t, d in deps)
        more = ('      <div class="dep-more">\n'
                '        <button class="pill-btn" type="button" data-dep-more>Show More Departures %s</button>\n'
                '      </div>' % CHEV_DOWN) if len(deps) > 6 else ""
        out.append('    <section class="container section" id="departures">\n'
                   '      <p class="eyebrow eyebrow--green">Book Now</p>\n'
                   '      <h2 class="section-heading">Upcoming Departures</h2>\n'
                   '      <div class="departures-list" data-dep-list>\n%s\n      </div>\n%s\n    </section>'
                   % (rows, more))

    if faqs:
        out.append('    <section class="container section" id="faqs">\n'
                   '      <p class="eyebrow eyebrow--pink">Need to Know</p>\n'
                   '      <h2 class="section-heading">%s FAQs</h2>\n'
                   '      <div class="faqs">\n%s\n      </div>\n    </section>'
                   % (esc(label), "\n".join(faq(f["question"], f["answer"]) for f in faqs)))

    others = []
    for other in [s for s in SLUGS.values() if s != style]:
        n = len(style_trips(other))
        oslug = STYLE_SLUG[other]
        # Only the built pages get a link; the rest go to Explore rather than a 404.
        href = ("travel-style-%s.html" % oslug
                if os.path.exists(os.path.join(BASE, "travel-style-%s.html" % oslug))
                else "all-trips.html?style=%s" % oslug)
        others.append('          <a class="hub-card" href="%s">\n'
                      '            <img class="hub-card__img" src="%s" alt="" aria-hidden="true" loading="lazy" />\n'
                      '            <span class="hub-card__grad"></span>\n'
                      '            <span class="hub-card__body">\n'
                      '              <span class="hub-card__t">%s</span>\n'
                      '              <span class="hub-card__d">%d trip%s &mdash; %s</span>\n'
                      '            </span>\n          </a>'
                      % (href, HERO_IMAGES[other], esc(field(CONFIG[other], "label")),
                         n, "" if n == 1 else "s", esc(tagline(other).lower())))
    out.append('    <section class="container section" id="other-styles">\n'
               '      <p class="eyebrow eyebrow--pink">Explore More</p>\n'
               '      <h2 class="section-heading">Other Travel <span class="tx-pink">Styles</span></h2>\n'
               '      <div class="hub-grid">\n%s\n      </div>\n    </section>'
               % "\n".join(others))

    body = "\n\n".join(out)
    dep_js = """  <script>/* Upcoming Departures — six at a time, as the prototype does.
     Rendered in full and trimmed by CSS, so the list is complete for anyone
     without JS rather than six rows with a dead button. */
  (function () {
    var list = document.querySelector('[data-dep-list]');
    var btn = document.querySelector('[data-dep-more]');
    if (!list || !btn) return;
    var rows = list.children, shown = 6;
    function paint() {
      for (var i = 0; i < rows.length; i++) rows[i].hidden = i >= shown;
      btn.parentElement.hidden = shown >= rows.length;
    }
    btn.addEventListener('click', function () { shown += 6; paint(); });
    paint();
  })();
  </script>""" if len(deps) > 6 else ""

    return ('<!DOCTYPE html>\n<html lang="en">\n<head>\n%s\n'
            '  <title>%s Trips &mdash; TruTravels</title>\n'
            '  <meta name="description" content="%s" />\n'
            '</head>\n<body>\n\n%s\n\n  <main class="tstyle">\n%s%s\n  </main>\n\n%s\n%s\n%s\n%s\n</body>\n</html>\n'
            % (HEAD, esc(label), H.escape(field(cfg, "description"), quote=True),
               NAV_OVER, marks, body, FOOTER,
               "\n".join(modals), SCRIPTS, dep_js)), len(trips), len(deps), len(stays), len(faqs)


if __name__ == "__main__":
    slugs = sys.argv[1:] or ["classic"]
    for slug in slugs:
        if slug not in SLUGS:
            raise SystemExit("unknown style %r — one of %s" % (slug, ", ".join(SLUGS)))
        html, n_t, n_d, n_s, n_f = page(slug)
        fn = "travel-style-%s.html" % slug
        open(os.path.join(BASE, fn), "w", encoding="utf-8").write(html)
        print("  wrote %s  (%d lines, %d trips, %d departures, %d stays, %d FAQs)"
              % (fn, html.count("\n") + 1, n_t, n_d, n_s, n_f))
