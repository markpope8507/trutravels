"""
Build the six Life Moments pages.

    life-moments-<slug>.html   mirrors src/app/life-moments/<slug>

FLAT NAMES, NOT A FOLDER. Every other converted page is a single file at the
site root, and the nav on 54 pages was already pointing at "/life-moments/gap-year"
— a root-relative path to a directory that does not exist here. Those links are
rewritten to life-moments-gap-year.html by fix_life_moment_links() below.

WHERE THE CONTENT COMES FROM. The page copy is per-page prose that lives in the
page components, not in a lib, so it is held in MOMENTS below — read out of the
rendered prototype pages once and checked back against them (see the audit
harness). Everything else is pulled from the data the rest of the site already
uses: trip cards from all-trips.html's TRIPS literal, diaries and stories from
src/lib/data.ts, and the moment tiles from src/lib/life-moments.ts.

Run:  python3 converted/.build/build_life_moments.py
      python3 converted/.build/apply_crumbs.py      # adds the breadcrumb bar
"""

import html as H
import json
import os
import re

from shell import BASE, read, NAV_OVER, FOOTER, SCRIPTS, HEAD

SRC = os.path.join(BASE, "..", "src")

TRIPS = json.loads(re.search(r"var TRIPS = (\[.*?\]);\n", read("all-trips.html"), re.S).group(1))
TRIPS_BY_ID = {t["id"]: t for t in TRIPS}


def esc(s):
    return H.escape(str(s), quote=False)


def lib(name):
    return open(os.path.join(SRC, "lib", name), encoding="utf-8").read()


def ts_objects(text, const):
    """Top-level objects of an exported array, brace-matched.

    Same shape as build_deals.py's walker, and for the same reason: a regex
    that looks ahead a fixed distance picks up nested objects instead.
    """
    seg = text[text.index(const):]
    i = seg.index("= [") + 2
    depth, start, quote, out = 0, None, None, []
    while i < len(seg):
        c = seg[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            if depth == 0:
                start = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                out.append(seg[start:i + 1])
        elif c == "]" and depth == 0:
            break
        i += 1
    return out


def fields(obj):
    """Scalar key: value pairs at brace depth 1 of one object."""
    out, depth, quote, i = {}, 0, None, 0
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
        elif c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
        elif depth == 1 and (i == 0 or obj[i - 1] in " \n,{"):
            m = re.match(r'([A-Za-z_]\w*):\s*(\d+|"(?:[^"\\]|\\.)*")', obj[i:])
            if m:
                v = m.group(2)
                out[m.group(1)] = int(v) if v.isdigit() else v[1:-1]
                i += m.end()
                continue
        i += 1
    return out


DATA = lib("data.ts")
DIARIES = {f["id"]: f for f in (fields(o) for o in ts_objects(DATA, "export const videoDiaries"))}
STORIES = {f["id"]: f for f in (fields(o) for o in ts_objects(DATA, "export const stories"))}
LIFE = [fields(o) for o in ts_objects(lib("life-moments.ts"), "export const LIFE_MOMENTS")]

BLOB = re.search(r'const BLOB = "([^"]+)"', DATA).group(1)
CLIPS = dict(re.findall(r'\n  (\w+): clip\("([^"]+)"\)',
                        DATA[DATA.index("export const truClips"):DATA.index("export const truClips") + 500]))
CLIP_OF = {}
for o in ts_objects(DATA, "export const videoDiaries"):
    f = fields(o)
    m = re.search(r"video: truClips\.(\w+)\.video", o)
    if f.get("id") and m:
        CLIP_OF[f["id"]] = CLIPS.get(m.group(1))

TAG_CLS = {"Traveller": "traveller", "Influencer": "influencer", "Creator": "creator",
           "Planeterra": "planeterra", "Local Legend": "legend", "Partner": "partner",
           "Community": "community"}

# ------------------------------------------------------------------ icons --
PIN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')
CAL = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>'
       '<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>')
ACT = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>')
STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
STARS5 = STAR * 5
CHEV_D = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')
ARROW_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
           '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
ARROW_L = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
           '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>')
PLAY = '<div class="vdiary__play"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>'

TRIP_PAGES = {"thailand-island-hopper": "thailand-island-hopper.html"}


def trip_href(t):
    return TRIP_PAGES.get(t["id"], "all-trips.html")


def tripcard(t):
    """The same `.tripcard` the rest of the site draws, so these pages don't
    become a second way of showing a trip."""
    save = ('<div class="tripcard__save"><span>Save</span>'
            '<span class="tripcard__save-pct">%d%%</span><span>Off</span></div>' % t["save"]) if t.get("save") else ""
    strike = ('<span class="tripcard__strike">&pound;%d</span>' % t["originalPrice"]) if t.get("originalPrice") else ""
    rating = ('<div class="tripcard__rating"><div class="tripcard__stars">%s</div>'
              '<span class="num">%s</span><span class="rev">(%s Reviews)</span></div>'
              % (STARS5, t["rating"], t["reviewCount"])) if t.get("rating") else ""
    route = ('<p class="tripcard__route">%s %s &mdash; %s</p>'
             % (PIN, esc(t["start"]), esc(t["end"]))) if (t.get("start") and t.get("end")) else ""
    facts = ('<div class="tripcard__facts"><span>%s %s</span>'
             '<span>%s %s Places</span><span>%s %s Activities</span></div>'
             % (CAL, esc(t["duration"]), PIN, t.get("places", 0), ACT, t.get("activities", 0)))
    exp = ""
    if t.get("expTypes"):
        pills = "".join(
            '<div class="exp-ico"><img src="assets/experience-icons/%s.png" alt="" aria-hidden="true" />'
            '<span class="name">%s</span><span class="count">%s</span></div>'
            % (e["icon"], esc(e["name"]), e["count"]) for e in t["expTypes"])
        cb = "lm-exp-%s" % t["id"]
        exp = ('<div class="tripcard__exp"><input type="checkbox" id="%s" class="tripcard__exp-cb" />'
               '<label class="tripcard__exp-sum" for="%s"><span>TRU Experience Types &middot; '
               '<span class="tripcard__exp-count">%s activities</span></span>%s</label>'
               '<div class="tripcard__exp-wrap"><div class="tripcard__exp-inner">'
               '<div class="tripcard__pills">%s</div></div></div></div>'
               % (cb, cb, t.get("activities", 0), CHEV_D, pills))
    href = trip_href(t)
    return ('<article class="tripcard"><a class="tripcard__link" href="%s" aria-label="%s"></a>'
            '<div class="tripcard__inner"><div class="tripcard__media">'
            '<img class="tripcard__image" src="%s" alt="%s" loading="lazy" /><div class="tripcard__grad"></div>'
            '<img class="tripcard__badge" src="assets/%s.png" alt="%s travel style" />%s</div>'
            '<div class="tripcard__body"><div class="tripcard__titlerow">'
            '<h3 class="tripcard__title">%s</h3><div class="tripcard__pricecol">'
            '<div class="tripcard__prices">%s<span class="tripcard__price">&pound;%s</span></div>'
            '<p class="tripcard__perday"><span>&pound;%s</span> per day</p></div></div>'
            '%s%s<p class="tripcard__tagline">%s</p>%s%s</div></div></article>'
            % (href, esc(t["title"]), t["image"], esc(t["title"]), t["styleLogo"], esc(t["styleLabel"]),
               save, esc(t["title"]), strike, t["price"], t.get("perday", 0),
               route, rating, esc(t.get("tagline", "")), facts, exp))


def carousel(inner, outer="rev-carousel", track="carousel carousel--trips carousel--3up"):
    """The site's existing carousel shell — trips use .carousel--trips, diaries
    use .vdia__carousel/.vdiaries, same as every other page that shows them."""
    return ('<div class="%s" data-arrows><div class="%s">%s</div>'
            '<button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous">%s</button>'
            '<button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next">%s</button></div>'
            % (outer, track, inner, ARROW_L, ARROW_R))


def vdiary(d):
    cls = TAG_CLS.get(d.get("tag", ""), "traveller")
    poster = "%s/posters/%s.jpg" % (BLOB, CLIP_OF.get(d["id"], "traveller-diary"))
    return ('<a class="vdiary" href="#lm-%s"><div class="vdiary__media">'
            '<img src="%s" alt="%s" loading="lazy" /><div class="vdiary__overlay"></div>'
            '<span class="vdiary__tag vdiary__tag--%s">%s</span>'
            '<span class="vdiary__handle">%s</span>%s'
            '<div class="vdiary__caption"><p class="vdiary__text">%s</p></div>'
            '</div></a>'
            % (d["id"], poster, esc(d.get("author", "")), cls, esc(d.get("tag", "")),
               esc(d.get("handle", "")), PLAY, esc(d.get("caption", ""))))


SHARE_TILE = ('<div class="vdiary vdiary--cta"><div>'
              '<div class="vdiary--cta__icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
              '<path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></div>'
              '<p class="vdiary--cta__title">Share Yours</p>'
              '<p class="vdiary--cta__sub">Send us your photos and videos &mdash; yours could be here.</p>'
              '<a class="vdiary--cta__link" href="share-your-photos.html">Upload yours &rarr;</a>'
              '</div></div>')

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]


def story_date(iso):
    y, m, d = iso.split("-")
    return "%d %s %s" % (int(d), MONTHS[int(m) - 1], y)


def storycard(s):
    href = "stories.html#%s" % s["id"]
    return ('<a class="story-card" href="%s"><div class="story-card__media">'
            '<img src="%s" alt="%s" loading="lazy" />'
            '<span class="story-card__time">%s min</span></div>'
            '<div class="story-card__body"><p class="story-card__category">%s</p>'
            '<h3 class="story-card__title">%s</h3>'
            '<p class="story-card__excerpt">%s</p>'
            '<div class="story-card__foot"><p class="story-card__meta"><strong>%s</strong> &middot; %s</p>'
            '<span class="story-card__read">Read story &rarr;</span></div></div></a>'
            % (href, s.get("image", ""), esc(s.get("title", "")), s.get("readTime", ""),
               esc(s.get("category", "")), esc(s.get("title", "")), esc(s.get("excerpt", "")),
               esc(s.get("author", "")), story_date(s.get("date", "2026-01-01"))))


def moment_card(m):
    return ('<a class="ab-xcard" href="life-moments-%s.html">'
            '<img src="%s" alt="" loading="lazy" /><span class="ab-xcard__grad"></span>'
            '<span class="ab-xcard__body"><span class="ab-xcard__t">%s %s</span>'
            '<span class="ab-xcard__d">%s</span></span></a>'
            % (m["slug"], m["image"], m.get("emoji", ""), esc(m["name"]), esc(m["description"])))


def head_block(sec, wide=False):
    """Kicker + two-tone heading + intro — the prototype's section header."""
    pink = ' <span>%s</span>' % esc(sec["h2_pink"]) if sec.get("h2_pink") else ""
    intro = '<p class="lm-intro">%s</p>' % esc(sec["intro"]) if sec.get("intro") else ""
    return ('<div class="lm-head%s"><p class="ess-eyebrow">%s</p>'
            '<h2 class="ess-h2">%s%s</h2>%s</div>'
            % (" lm-head--wide" if wide else "", esc(sec["kicker"]), esc(sec["h2_plain"]), pink, intro))


def page(m, c):
    """One Life Moment page."""
    s_trips, s_vids, s_stories, s_other, s_cta = c["sections"]

    trips = [TRIPS_BY_ID[i] for i in c["tripIds"] if i in TRIPS_BY_ID]
    vids = [DIARIES[i] for i in c["videoIds"] if i in DIARIES]
    stories = [STORIES[i] for i in c["storyIds"] if i in STORIES]
    others = [x for x in LIFE if x["slug"] != m["slug"]]

    trips_sec = ('    <section class="section lm-sec" id="trips">\n'
                 '      <div class="container">\n%s\n'
                 '        <div class="home-section-head home-section-head--sm"><div>'
                 '<p class="eyebrow eyebrow--pink">%s</p>'
                 '<h2 class="section-heading">%s</h2></div></div>\n        %s\n'
                 '      </div>\n    </section>'
                 % (head_block(s_trips), esc(c["tripsEyebrow"]), esc(c["tripsHeading"]),
                    carousel("".join(tripcard(t) for t in trips))))

    vids_sec = ('    <section class="section lm-sec lm-sec--tint" id="diaries">\n'
                '      <div class="container">\n%s\n        %s\n      </div>\n    </section>'
                % (head_block(s_vids),
                   carousel("".join(vdiary(d) for d in vids) + SHARE_TILE,
                             "rev-carousel vdia__carousel", "vdiaries")))

    stories_sec = ""
    if stories:
        stories_sec = ('\n\n    <section class="section lm-sec" id="stories">\n'
                       '      <div class="container">\n%s\n'
                       '        <div class="st-grid lm-stories">%s</div>\n      </div>\n    </section>'
                       % (head_block(s_stories), "".join(storycard(x) for x in stories)))

    other_sec = ('    <section class="section lm-sec" id="other-moments">\n'
                 '      <div class="container">\n%s\n'
                 '        <div class="ab-xgrid">%s</div>\n      </div>\n    </section>'
                 % (head_block(s_other), "".join(moment_card(x) for x in others)))

    cta_sec = ('    <section class="section lm-cta">\n      <div class="container lm-cta__inner">\n'
               '        <p class="ess-eyebrow">%s</p>\n'
               '        <h2 class="ess-h2">%s <span>%s</span></h2>\n'
               '        <p class="lm-intro">%s</p>\n'
               '        <a class="lm-cta__btn" href="all-trips.html">%s</a>\n'
               '      </div>\n    </section>'
               % (esc(s_cta["kicker"]), esc(s_cta["h2_plain"]), esc(s_cta["h2_pink"]),
                  esc(s_cta["intro"]), esc(c.get("ctaLabel", "Browse All Trips"))))

    body = ('    <section class="ess-hero" id="top">\n'
            '      <img class="ess-hero__img" src="%s" alt="%s" />\n'
            '      <div class="ess-hero__grad ess-hero__grad--light"></div>\n'
            '      <div class="container ess-hero__inner">\n        <div class="ess-hero__text">\n'
            '          <p class="ess-hero__eyebrow">Life Moments</p>\n'
            '          <h1 class="ess-hero__title">%s</h1>\n'
            '          <div class="ess-hero__rule"></div>\n'
            '          <p class="ess-hero__quote">%s</p>\n'
            '        </div>\n      </div>\n    </section>\n\n'
            '%s\n\n%s%s\n\n%s\n\n%s'
            % (c["heroImg"], esc(c["heroAlt"]), c["h1"], esc(c["quote"]),
               trips_sec, vids_sec, stories_sec, other_sec, cta_sec))

    return ('<!DOCTYPE html>\n<html lang="en">\n<head>\n%s\n'
            '  <title>%s</title>\n'
            '  <meta name="description" content="%s" />\n</head>\n<body>\n\n%s\n\n'
            '  <main class="lm">\n%s\n  </main>\n\n%s\n%s\n</body>\n</html>\n'
            % (HEAD, esc(c["title"]), esc(c["desc"]), NAV_OVER, body, FOOTER, SCRIPTS))


def fix_life_moment_links():
    """Point the nav at the files that now exist.

    The mega-menu on 54 pages linked to "/life-moments/gap-year" — root-relative,
    and to a path this site has no page for. Every one was a 404.
    """
    changed = 0
    for fn in sorted(os.listdir(BASE)):
        if not fn.endswith(".html"):
            continue
        p = os.path.join(BASE, fn)
        s = open(p, encoding="utf-8").read()
        new = re.sub(r'href="/life-moments/([a-z0-9-]+)"', r'href="life-moments-\1.html"', s)
        if new != s:
            open(p, "w", encoding="utf-8").write(new)
            changed += 1
    return changed


if __name__ == "__main__":
    content = json.load(open(os.path.join(os.path.dirname(__file__), "life_moments.json"), encoding="utf-8"))
    by_slug = {m["slug"]: m for m in LIFE}
    for slug, c in content.items():
        out = page(by_slug[slug], c)
        open(os.path.join(BASE, "life-moments-%s.html" % slug), "w", encoding="utf-8").write(out)
        print("  wrote life-moments-%s.html  (%d lines)" % (slug, len(out.splitlines())))
    print("  relinked the nav on %d pages" % fix_life_moment_links())
