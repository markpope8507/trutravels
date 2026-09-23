"""
Regenerate the data-driven sections of the country page.

  converted/thailand.html  —  trips, video diaries, stories, upcoming departures

WHY THESE FOUR
They are the sections whose content is a query, not prose, and all of them had
drifted from the prototype:

  trips           the old `.trip-card` — a duration-over-title layout with no
                  price column, no per-day figure, no TRU Experience Types
                  drawer. The site replaced it with `.tripcard` everywhere
                  else; only this page still carried the old one, so Thailand's
                  own tours looked nothing like the same tours on Explore.
  video diaries   2 hand-written cards against the prototype's 5
  stories         1 card against 5, and not the same one
  departures      12 Apr / 26 Apr — dates in the PAST, because they were typed
                  in once. The prototype filters to future departures, so the
                  two pages disagreed about what you could book.

BREADCRUMBS BELONG UNDER THE HERO. The page opened with the crumb bar above a
full-bleed hero, using `crumbs--nohero` — the variant for pages that have no
hero at all, whose only job is to clear the fixed navbar. The prototype renders
`<Breadcrumbs>` after the hero section. `place_crumbs()` moves it and drops the
modifier; it is idempotent, so a re-run is a no-op.

AND IT HAD NO SHARED SCRIPTS. thailand.html predates shell.py and carried
exactly one <script> — the saved-stories heart. Every other page gets the six
shared blocks copied out of explore.html, so on this page alone the mega-menu
never opened, the cart drawer never slid out, the footer accordions never
folded and every carousel arrow was a dead button. `ensure_scripts()` copies
them in, same source as everywhere else.

The rest of the page is prose and stays hand-maintained.

DATA COMES FROM THE PROTOTYPE'S LIBS at build time — lib/data.ts for trips,
departures, stories and diaries, lib/availability.ts for the thresholds — so
neither build can drift again without the other moving too.

Run:  python3 converted/.build/build_country_sections.py
"""

import datetime as dt
import json
import os
import re
from urllib.parse import quote

from shell import BASE, SCRIPTS

SRC = os.path.join(BASE, "..", "src")
PAGE = "thailand.html"
COUNTRY = "Thailand"

BLOB = "https://zfxhmfjtkhpuo90l.public.blob.vercel-storage.com"


def lib(name):
    return open(os.path.join(SRC, "lib", name), encoding="utf-8").read()


def objects(seg):
    """Top-level { ... } objects in a TS array literal, string-aware."""
    depth, start, i, quote = 0, None, seg.index("= [") + 3, None
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
                yield seg[start:i + 1]
        elif c == "]" and depth == 0:
            return
        i += 1


def field(obj, key):
    m = re.search(rf'\b{key}:\s*"((?:[^"\\]|\\.)*)"', obj)
    return m.group(1).replace('\\"', '"') if m else None


# ----------------------------------------------------------------- thresholds

def thresholds():
    a = lib("availability.ts")
    return (
        int(re.search(r"ALMOST_FULL_MAX_SPOTS = (\d+)", a).group(1)),
        int(re.search(r"LOW_SPOTS_MAX_SPOTS = (\d+)", a).group(1)),
        int(re.search(r"ON_REQUEST_DAYS = (\d+)", a).group(1)),
    )


ALMOST_FULL, LOW_SPOTS, ON_REQUEST_DAYS = thresholds()


def tier(spots, status):
    """Mirrors getAvailabilityTier()."""
    if status == "full":
        return ("almost-full", "Almost Full")
    if spots is None:
        return ("good", "Good Availability")
    if spots <= ALMOST_FULL:
        return ("almost-full", "Almost Full")
    if spots <= LOW_SPOTS:
        return ("low", "Less than 5 spots remaining")
    return ("good", "Good Availability")


# ---------------------------------------------------------------------- data

def country_trips():
    data = lib("data.ts")
    seg = data[data.index("export const trips: Trip[]"):data.index("export const stories: Story[]")]
    out = []
    for obj in objects(seg):
        if field(obj, "destination") != COUNTRY:
            continue
        deps = []
        d = obj.find("departures: [")
        if d != -1:
            block = obj[d:obj.index("],", d)]
            for row in re.finditer(r"\{([^}]*)\}", block):
                r = row.group(1)
                date = re.search(r'date: "([^"]+)"', r)
                if not date:
                    continue
                price = re.search(r"price: (\d+)", r)
                orig = re.search(r"originalPrice: (\d+)", r)
                status = re.search(r'status: "([^"]+)"', r)
                spots = re.search(r"spotsLeft: (\d+)", r)
                deps.append({
                    "date": date.group(1),
                    "price": int(price.group(1)) if price else 0,
                    "originalPrice": int(orig.group(1)) if orig else None,
                    "status": status.group(1) if status else "available",
                    "spotsLeft": int(spots.group(1)) if spots else None,
                })
        out.append({
            "id": field(obj, "id"),
            "title": field(obj, "title"),
            "duration": field(obj, "duration"),
            "start": field(obj, "startLocation"),
            "end": field(obj, "endLocation"),
            "departures": deps,
        })
    return out


def country_stories():
    """The prototype matches on destinations, title or excerpt — same rule."""
    data = lib("data.ts")
    seg = data[data.index("export const stories: Story[]"):data.index("export const storyArticles")]
    out = []
    for obj in objects(seg):
        dests = re.search(r"destinations: \[([^\]]*)\]", obj)
        hay = " ".join(filter(None, [dests.group(1) if dests else "",
                                     field(obj, "title") or "", field(obj, "excerpt") or ""])).lower()
        if COUNTRY.lower() not in hay:
            continue
        rt = re.search(r"readTime: (\d+)", obj)
        out.append({
            "id": field(obj, "id"),
            "title": field(obj, "title"),
            "excerpt": field(obj, "excerpt"),
            "image": field(obj, "image"),
            "author": field(obj, "author") or "TruTravels Team",
            "date": field(obj, "date"),
            "readTime": int(rt.group(1)) if rt else None,
            "category": field(obj, "category") or field(obj, "type") or "Travel Stories",
        })
    return out


def country_diaries():
    data = lib("data.ts")
    seg = data[data.index("export const videoDiaries"):]
    seg = seg[:seg.index("\n];") + 3]
    out = []
    for obj in objects(seg):
        loc = field(obj, "location") or ""
        if COUNTRY.lower() not in loc.lower():
            continue
        clip = re.search(r"video: truClips\.(\w+)\.video", obj)
        out.append({
            "caption": field(obj, "caption"),
            "author": field(obj, "author"),
            "handle": field(obj, "handle"),
            "location": loc,
            "tag": field(obj, "tag") or "Traveller",
            "clip": clip.group(1) if clip else None,
        })
    return out


CLIP_FILES = {
    "traveller": "traveller-diary", "creator": "creator-diary", "influencer": "influencer-diary",
    "bali": "bali-this-is-your-sign", "jess": "jess-uuu-clip", "orty": "orty-welcome-vertical",
}


# ------------------------------------------------------------------ rendering

def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("'", "&rsquo;")


PIN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')


# ---------------------------------------------------------------- trip cards
# all-trips.html carries the canonical trip list as a `var TRIPS` literal and
# the canonical `.tripcard` markup as the JS that renders it. Reading the data
# from there rather than re-deriving it from lib/data.ts keeps this page's cards
# byte-identical to the ones on Explore, Deals and the homepage — which is the
# whole reason the old hand-written `.trip-card` was wrong.
TRIPS = json.loads(re.search(r"var TRIPS = (\[.*?\]);\n", open(os.path.join(BASE, "all-trips.html"), encoding="utf-8").read(), re.S).group(1))

STAR = ('<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88'
        'L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>')
STARS5 = STAR * 5
CAL = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>'
       '<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>')
ACT = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>')
CHEV_D = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')
CHEV_L = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>')
CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')

# Only the one tour has a static detail page so far; the rest land on Explore
# rather than a dead `#`.
TRIP_PAGES = {"thailand-island-hopper": "thailand-island-hopper.html"}


def tripcard(t):
    """The `.tripcard` from all-trips.html, rendered server-side."""
    save = ('<div class="tripcard__save"><span>Save</span>'
            '<span class="tripcard__save-pct">%d%%</span><span>Off</span></div>' % t["save"]) if t.get("save") else ""
    strike = ('<span class="tripcard__strike">&pound;%d</span>' % t["originalPrice"]) if t.get("originalPrice") else ""
    rating = ('<div class="tripcard__rating"><div class="tripcard__stars">%s</div>'
              '<span class="num">%s</span><span class="rev">(%s Reviews)</span></div>'
              % (STARS5, t["rating"], t["reviewCount"])) if t.get("rating") else ""
    route = ('<p class="tripcard__route">%s %s &mdash; %s</p>'
             % (PIN, esc(t["start"]), esc(t["end"]))) if (t.get("start") and t.get("end")) else ""
    facts = ('<div class="tripcard__facts"><span>%s %s</span>%s%s</div>'
             % (CAL, esc(t["duration"]),
                ('<span>%s %s Places</span>' % (PIN, t["places"])) if t.get("places") else "",
                ('<span>%s %s Activities</span>' % (ACT, t["activities"])) if t.get("activities") else ""))
    exp = ""
    if t.get("expTypes"):
        pills = "".join(
            '<div class="exp-ico"><img src="assets/experience-icons/%s.png" alt="" aria-hidden="true" />'
            '<span class="name">%s</span><span class="count">%s</span></div>'
            % (x["icon"], esc(x["name"]), x["count"]) for x in t["expTypes"])
        # Prefixed so the checkbox ids can't collide with another carousel's.
        cb = "ct-exp-" + t["id"]
        exp = ('<div class="tripcard__exp"><input type="checkbox" id="%s" class="tripcard__exp-cb" />'
               '<label class="tripcard__exp-sum" for="%s"><span>TRU Experience Types &middot; '
               '<span class="tripcard__exp-count">%s activities</span></span>%s</label>'
               '<div class="tripcard__exp-wrap"><div class="tripcard__exp-inner">'
               '<div class="tripcard__pills">%s</div></div></div></div>' % (cb, cb, t["activities"], CHEV_D, pills))
    href = TRIP_PAGES.get(t["id"], "all-trips.html")
    return (
        '<article class="tripcard"><a class="tripcard__link" href="%s" aria-label="%s"></a>'
        '<div class="tripcard__inner">' % (href, esc(t["title"]))
        + '<div class="tripcard__media"><img class="tripcard__image" src="%s" alt="%s" />'
          '<div class="tripcard__grad"></div>'
          '<img class="tripcard__badge" src="assets/%s.png" alt="%s travel style" />%s</div>'
          % (t["image"], esc(t["title"]), t["styleLogo"], esc(t["styleLabel"]), save)
        + '<div class="tripcard__body"><div class="tripcard__titlerow"><h3 class="tripcard__title">%s</h3>'
          '<div class="tripcard__pricecol"><div class="tripcard__prices">%s'
          '<span class="tripcard__price">&pound;%d</span></div>'
          '<p class="tripcard__perday"><span>&pound;%s</span> per day</p></div></div>'
          % (esc(t["title"]), strike, t["price"], t["perday"])
        + route + rating
        + '<p class="tripcard__tagline">%s</p>' % esc(t["tagline"])
        + facts + exp + "</div></div></article>"
    )


def render_trips():
    cards = [tripcard(t) for t in TRIPS if t.get("destination") == COUNTRY]
    return "\n".join("        " + c for c in cards), len(cards)


TRIPS_SECTION = """    <section class="container section" id="trips">
      <div class="home-section-head home-section-head--sm">
        <div>
          <p class="eyebrow eyebrow--pink">Explore</p>
          <h2 class="section-heading">{country} Trips</h2>
        </div>
        <a class="pill-btn home-section-head__pill-desktop" href="all-trips.html?country={q}">See All Trips{chev}</a>
      </div>

      <div class="rev-carousel" data-arrows>
        <div class="carousel carousel--trips">
{cards}
        </div>
        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous">{left}</button>
        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next">{right}</button>
      </div>

      <div class="home-section-head__pill-mobile">
        <a class="pill-btn" href="all-trips.html?country={q}">See All Trips{chev}</a>
      </div>
    </section>"""


def replace_trips(html):
    """Swap the whole trips <section> — header row included, since the prototype
    pairs the heading with a See All Trips pill the static page never had."""
    a = html.index('    <section class="container section" id="trips">')
    b = html.index("</section>", a) + len("</section>")
    cards, n = render_trips()
    return html[:a] + TRIPS_SECTION.format(
        country=COUNTRY, q=quote(COUNTRY), cards=cards,
        chev=CHEV_R, left=CHEV_L, right=CHEV_R) + html[b:], n


# The last two blocks in explore.html's tail are that page's own (its section
# pill bar and recently-viewed rail); the six before them are the shared set
# every page needs. Sliced by name so the boundary can't rot the way a line
# range does.
SHARED_SCRIPTS = SCRIPTS[:SCRIPTS.index("<script>/* explore &mdash;")].rstrip() if "<script>/* explore &mdash;" in SCRIPTS else SCRIPTS[:SCRIPTS.index("<script>/* explore \u2014")].rstrip()


def ensure_scripts(html):
    """Re-sync the shared script blocks from explore.html.

    Replaced wholesale rather than inserted-if-missing, so a fix to the shared
    behaviour reaches this page on the next run instead of only new pages."""
    own = html.index("<script>/* Save-a-read heart")   # the page's own
    head = html[:own]
    a = head.find("<script>")
    if a == -1:                                        # never had them
        return head + SHARED_SCRIPTS + "\n" + html[own:]
    return head[:a] + SHARED_SCRIPTS + "\n" + html[own:]


def place_crumbs(html):
    """Move the breadcrumb bar from above the hero to below it.

    `crumbs--nohero` pads the bar down past the fixed navbar, and is only right
    on a page with no hero. This page has one, so the bar belongs under it and
    the modifier comes off with the move."""
    a = html.index('<nav class="crumbs')
    b = html.index("</nav>", a) + len("</nav>\n")
    bar = html[a:b].replace(" crumbs--nohero", "")
    rest = html[:a].rstrip() + "\n\n" + html[b:].lstrip()
    # Land it right after the hero's closing tag.
    end = rest.index("</section>", rest.index('<section class="country-hero"')) + len("</section>\n")
    return rest[:end] + "\n    " + bar + "\n" + rest[end:]


def render_departures(trips):
    today = dt.date.today()
    rows = []
    for t in trips:
        for d in t["departures"]:
            date = dt.date.fromisoformat(d["date"])
            if d["status"] == "full" or date < today:
                continue
            rows.append((date, t, d))
    rows.sort(key=lambda r: r[0])

    out = []
    for date, t, d in rows[:8]:
        tier_id, tier_label = tier(d["spotsLeft"], d["status"])
        # Too close to departure to sell instantly — mirrors getDepartureMode().
        on_request = (date - today).days <= ON_REQUEST_DAYS
        label = "On Request" if on_request else tier_label
        dot = "is-request" if on_request else f"is-{tier_id}"
        cta = "Check Availability" if on_request else "View Trip"
        disc = (round((d["originalPrice"] - d["price"]) / d["originalPrice"] * 100)
                if d["originalPrice"] and d["originalPrice"] > d["price"] else 0)
        save = (f'<div class="dep__save"><p class="dep__save-l">Save</p>'
                f'<p class="dep__save-n">{disc}%</p></div>') if disc else ""
        strike = (f'<span class="dep__was">&pound;{d["originalPrice"]}</span>'
                  if d["originalPrice"] and d["originalPrice"] > d["price"] else "")
        route = f' &middot; {esc(t["start"])} &mdash; {esc(t["end"])}' if t["start"] and t["end"] else ""
        href = "thailand-island-hopper.html" if t["id"] == "thailand-island-hopper" else "all-trips.html"
        out.append(f'''        <div class="dep">
          <div class="dep__date">
            <p class="dep__mon">{date.strftime("%b").upper()}</p>
            <p class="dep__day">{date.day}</p>
            <p class="dep__yr">{date.year}</p>
          </div>
          <div class="dep__rule"></div>
          <div class="dep__main">
            <h3 class="dep__title">{esc(t["title"])}</h3>
            <p class="dep__meta">{PIN} {esc(t["duration"])}{route}</p>
            <span class="dep__status {dot}"><span class="dep__dot"></span>{label}</span>
          </div>
          <div class="dep__right">
            {save}
            <div class="dep__price">{strike}<span class="dep__now">&pound;{d["price"]}</span></div>
            <a class="dep__cta" href="{href}">{cta} &rarr;</a>
          </div>
        </div>''')
    return "\n".join(out)


def story_date(iso):
    """5 Jun 2026. Split rather than parsed — `new Date(iso)`-style parsing is
    what put every departure a day early last time."""
    if not iso:
        return ""
    y, m, d = iso.split("-")
    return "%d %s %s" % (int(d), MONTHS[int(m) - 1], y)


MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def render_stories(stories):
    """The full .story-card, as stories.html and the article pages render it.
    This page's copy had the image, category and title and stopped there — no
    read-time badge, no excerpt, no byline, no "Read story" link."""
    out = []
    for s in stories[:5]:
        time = ('<span class="story-card__time">%s min</span>' % s["readTime"]) if s.get("readTime") else ""
        out.append(f'''        <a class="story-card" href="story-{s["id"]}.html">
          <div class="story-card__media">
            <img class="story-card__image" src="{s["image"]}" alt="{esc(s["title"])}" loading="lazy" />{time}
          </div>
          <div class="story-card__body">
            <p class="story-card__category">{esc(s["category"])}</p>
            <h3 class="story-card__title">{esc(s["title"])}</h3>
            <p class="story-card__excerpt">{esc(s["excerpt"] or "")}</p>
            <div class="story-card__foot">
              <p class="story-card__meta"><strong>{esc(s["author"])}</strong> &middot; {story_date(s["date"])}</p>
              <span class="story-card__read">Read story &rarr;</span>
            </div>
          </div>
        </a>''')
    return "\n".join(out)


def render_diaries(diaries):
    out = []
    for i, v in enumerate(diaries):
        f = CLIP_FILES.get(v["clip"] or "", "traveller-diary")
        poster = f"{BLOB}/posters/{f}.jpg"
        tag_cls = v["tag"].lower().replace(" ", "-")
        out.append(f'''        <article class="video-card">
          <a class="video-card__hit" href="#diary-{i}" aria-label="Play {esc(v["author"])}&rsquo;s clip">
            <img class="video-card__media" src="{poster}" alt="{esc(v["author"])} in {esc(v["location"])}" loading="lazy" />
            <div class="video-card__overlay"></div>
            <span class="video-card__tag video-card__tag--{tag_cls}">{esc(v["tag"])}</span>
            <div class="video-card__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
            <span class="video-card__handle">{esc(v["handle"])}</span>
            <div class="video-card__caption">
              <p class="video-card__caption-text">{esc(v["caption"])}</p>
            </div>
          </a>
        </article>''')
    out.append(DIARY_CTA)
    return "\n".join(out)


# The prototype ends the diaries row with a dashed card asking for yours. It's
# the only route into /share-your-photos from this page.
DIARY_CTA = '''        <article class="video-card video-card--cta">
          <div class="video-card__cta-inner">
            <div class="video-card__cta-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></div>
            <h3>Share Yours</h3>
            <p>Send us your photos and videos &mdash; yours could be here.</p>
            <a href="share-your-photos.html">Upload yours &rarr;</a>
          </div>
        </article>'''


# Every carousel on this page gets the same pair, written once per section and
# guarded. The stories row used to strip-and-re-add its arrows on each run with
# a blanket replace — and that string matched the trips and stays rows too, so
# their arrows were silently eaten every time this script ran.
ARROWS = (
    '        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>\n'
    '        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>\n'
)


TOURS_RE = re.compile(r'<div class="act-card__tours">.*?\n                </div>', re.S)


def rebuild_activity_tours(html):
    """Turn each activity card's tour list into the prototype's disclosure.

    The static card listed all five tour names open, with nothing but a name per
    row; the prototype collapses them behind a "Featured on N trips" summary and
    gives each row the trip's length and lead-in price. Titles are read back out
    of whatever shape the block is currently in, so this is idempotent."""
    by_title = {t["title"]: t for t in TRIPS}
    n = [0]

    def one(m):
        titles = re.findall(r"<a [^>]*>(?:\s*<span class=\"t\">)?([^<]+)", m.group(0))
        titles = [t.strip() for t in titles if t.strip()]
        rows = []
        for title in titles:
            t = by_title.get(title)
            href = TRIP_PAGES.get(t["id"], "all-trips.html") if t else "all-trips.html"
            meta = ('<span class="m"><span class="d">%s</span> from <span class="p">&pound;%s</span></span>'
                    % (t["duration"], f'{t["price"]:,}')) if t else ""
            rows.append('                      <li><a href="%s"><span class="t">%s</span>%s</a></li>'
                        % (href, esc(title), meta))
        cb = "act-tours-%d" % n[0]
        n[0] += 1
        return (
            '<div class="act-card__tours">\n'
            '                  <input type="checkbox" id="%s" class="act-card__tours-cb" />\n' % cb
            + '                  <label class="act-card__tours-sum" for="%s"><span>Featured on '
              '<span class="act-card__tours-count">%d %s</span></span>%s</label>\n'
              % (cb, len(titles), "trip" if len(titles) == 1 else "trips", CHEV_D)
            + '                  <div class="act-card__tours-wrap"><div class="act-card__tours-inner">\n'
              '                    <ul class="act-card__tours-list">\n'
            + "\n".join(rows)
            + '\n                    </ul>\n'
              '                  </div></div>\n'
              '                </div>'
        )

    return TOURS_RE.sub(one, html)


def wrap_stories(html):
    """Put the stories row in a rev-carousel with arrows, once."""
    a = html.index('<section class="container section" id="stories">')
    if "rev-arrow" in html[a:html.index("</section>", a)]:
        return html
    html = html.replace('<div class="stories-grid">',
                        '<div class="rev-carousel" data-arrows><div class="carousel carousel--reads">')
    b = html.index("      </div>\n    </section>", html.index('<div class="carousel carousel--reads">'))
    return html[:b] + "        </div>\n" + ARROWS + html[b:]


def country_stays():
    """title -> travelStyle, from the same accommodation array the prototype reads."""
    data = lib("data.ts")
    seg = data[data.index('id: "%s"' % COUNTRY.lower()):]
    seg = seg[seg.index("accommodation: ["):]
    seg = seg[:seg.index("\n    ],")]
    out = {}
    for obj in re.finditer(r"\{([^}]*)\}", seg):
        o = obj.group(1)
        t = re.search(r'title: "([^"]+)"', o)
        st = re.search(r'travelStyle: "([^"]+)"', o)
        if t and st:
            out[t.group(1)] = st.group(1)
    return out


def mark_stay_cards(html):
    """Put the travel-style logo back on each stay card.

    The prototype's stay card carries a pink corner glow and the oversized
    travel-style logo — Classic, Backpacker, Flashpacker — which is the only
    thing distinguishing one 4:3 photo from the next. The static card had the
    photo and nothing else."""
    styles = country_stays()
    if not styles:
        return html

    def one(m):
        media, title = m.group(0), m.group("title")
        style = styles.get(title.replace("&rsquo;", "\u2019"))
        if not style or "stay-card__style" in media:
            return media
        mark = ('<span class="stay-card__glow"></span>'
                '<img class="stay-card__style" src="assets/%s-logo.png" alt="%s travel style" />' % (style, style.title()))
        return media.replace("</a>", mark + "</a>")

    # each card's <a class="stay-card__media"> ... </a>, with the title that
    # follows it so the right logo lands on the right card
    return re.sub(
        r'<a class="stay-card__media".*?</a>\s*<div class="stay-card__body"><h3 class="stay-card__title">(?P<title>[^<]+)</h3>',
        one, html, flags=re.S)


def wrap_stays(html):
    """Close the stays rev-carousel and give it its arrows.

    The Where You'll Stay section opened a `.rev-carousel` and never closed it,
    so the wrapper swallowed the rest of the page and the arrows it was there to
    position were never written at all."""
    a = html.index('id="accommodation"')
    b = html.index("</section>", a)
    if "rev-arrow" in html[a:b]:
        return html
    old = "        </article>\n      </div>\n    "
    assert html[b - len(old):b] == old, "stays section doesn't end the way it did"
    new = "        </article>\n        </div>\n" + ARROWS + "      </div>\n    "
    return html[:b - len(old)] + new + html[b:]


def wrap_diaries(html):
    """Put the diaries row in a rev-carousel with arrows, once."""
    if '<div class="rev-carousel" data-arrows>\n        <div class="carousel carousel--videos">' in html:
        return html
    html = html.replace('      <div class="carousel carousel--videos">',
                        '      <div class="rev-carousel" data-arrows>\n        <div class="carousel carousel--videos">')
    i = html.index('<div class="carousel carousel--videos">')
    end = html.index("      </div>\n    </section>", i)
    return html[:end] + "        </div>\n" + ARROWS + html[end:]


def render_diary_modals(diaries):
    out = []
    for i, v in enumerate(diaries):
        f = CLIP_FILES.get(v["clip"] or "", "traveller-diary")
        out.append(f'''  <div class="vid-modal" id="diary-{i}">
    <a class="vid-modal__backdrop" href="#diaries" aria-label="Close"></a>
    <div class="vid-modal__inner">
      <a class="vid-modal__close" href="#diaries" aria-label="Close"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></a>
      <video controls playsinline preload="none" poster="{BLOB}/posters/{f}.jpg"><source src="{BLOB}/{f}.mp4" type="video/mp4" /></video>
    </div>
  </div>''')
    return "\n".join(out)



def drop_experience_explainer(html):
    """The static Things To Do carried a "5 Experience Types · 1 Intentional
    Journey" explainer and a six-tab filter row that the prototype's country
    page doesn't have — it goes straight from the lead into the cards. That
    block is why the section stood 1005px against the prototype's 719."""
    a = html.find('<p class="exp__intro-eyebrow">')
    if a == -1:
        return html  # already gone
    start = html.rfind("\n", 0, a) + 1
    end = html.index("</div>", html.index('<div class="exp__tabs">', a)) + len("</div>\n")
    return html[:start] + html[end:]


# -------------------------------------------------------------------- rewrite

def replace_body(html, banner, inner_open, inner_close, body):
    """Swap the contents of one container inside a banner-marked section."""
    i = html.index(f"<!-- ================= {banner} ")
    a = html.index(inner_open, i) + len(inner_open)
    b = html.index(inner_close, a)
    return html[:a] + "\n" + body + "\n      " + html[b:]


if __name__ == "__main__":
    trips = country_trips()
    stories = country_stories()
    diaries = country_diaries()

    p = os.path.join(BASE, PAGE)
    html = open(p, encoding="utf-8").read()

    html = drop_experience_explainer(html)
    html = ensure_scripts(html)
    html = place_crumbs(html)

    html = rebuild_activity_tours(html)
    html = mark_stay_cards(html)
    html = wrap_stays(html)
    html = wrap_diaries(html)
    # Closed on the arrow row, not on "</div>\n    </section>" — that now matches
    # the rev-carousel wrapper's own close, and swallowed the arrows on every
    # re-run (they were added at the end of one run and eaten at the start of
    # the next).
    html = replace_body(html, "COMMUNITY VIDEOS", '<div class="carousel carousel--videos">',
                        '</div>\n        <button class="rev-arrow', render_diaries(diaries))
    html = wrap_stories(html)
    html = replace_body(html, "BLOG / STORIES", '<div class="carousel carousel--reads">',
                        '</div>\n        <button class="rev-arrow', render_stories(stories))
    # The list was a <ul> of <li> rows originally; the generated rows are
    # <div>s, so the container is normalised first and the script stays
    # re-runnable either way.
    html = html.replace('<ul class="departures-list">', '<div class="departures-list">')
    html = html.replace("</ul>\n    </section>\n\n    <!-- ================= REVIEWS",
                        "</div>\n    </section>\n\n    <!-- ================= REVIEWS")
    html = replace_body(html, "UPCOMING DEPARTURES", '<div class="departures-list">',
                        "</div>\n    </section>", render_departures(trips))

    html, n_trips = replace_trips(html)

    # The diaries section needs an id for the video modals to close back to.
    # Guarded: the search string still matches once the id is there, so an
    # unguarded replace stamped a fresh id="diaries" on every single run — the
    # page had picked up six of them.
    if 'id="diaries"' not in html:
        html = html.replace('<!-- ================= COMMUNITY VIDEOS ================= -->\n    <section class="container section"',
                            '<!-- ================= COMMUNITY VIDEOS ================= -->\n    <section class="container section" id="diaries"')

    # drop any previous diary modals, then append the current set
    html = re.sub(r'\n  <div class="vid-modal" id="diary-\d+">[\s\S]*?\n  </div>(?=\n)', "", html)
    html = html.replace("</body>", render_diary_modals(diaries) + "\n</body>")

    open(p, "w", encoding="utf-8").write(html)
    n_deps = render_departures(trips).count('<div class="dep">')
    print(f"  {PAGE}: {n_trips} trips, {len(diaries)} diaries, {len(stories)} stories, {n_deps} departures")
