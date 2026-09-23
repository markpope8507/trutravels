"""
Regenerate the data-driven sections of the country page.

  converted/thailand.html  —  video diaries, stories, upcoming departures

WHY THESE THREE
They are the sections whose content is a query, not prose, and all three had
drifted from the prototype:

  video diaries   2 hand-written cards against the prototype's 5
  stories         1 card against 5, and not the same one
  departures      12 Apr / 26 Apr — dates in the PAST, because they were typed
                  in once. The prototype filters to future departures, so the
                  two pages disagreed about what you could book.

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

from shell import BASE

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
    m = re.search(rf'\b{key}: "((?:[^"\\]|\\.)*)"', obj)
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
        out.append({
            "id": field(obj, "id"),
            "title": field(obj, "title"),
            "excerpt": field(obj, "excerpt"),
            "image": field(obj, "image"),
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


REV_ARROWS_MARK = (
    '        </div>\n'
    '        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>\n'
    '        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>\n'
)

PIN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')


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


def render_stories(stories):
    out = []
    for s in stories[:5]:
        out.append(f'''        <a class="story-card" href="story-{s["id"]}.html">
          <div class="story-card__media">
            <img class="story-card__image" src="{s["image"]}" alt="{esc(s["title"])}" loading="lazy" />
          </div>
          <div class="story-card__body">
            <p class="story-card__category">{esc(s["category"])}</p>
            <h3 class="story-card__title">{esc(s["title"])}</h3>
            <p class="story-card__excerpt">{esc(s["excerpt"])}</p>
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
            <div class="video-card__caption">
              <p class="video-card__caption-text">{esc(v["caption"])}</p>
              <p class="video-card__author">{esc(v["author"])} &middot; {esc(v["handle"])}</p>
            </div>
          </a>
        </article>''')
    return "\n".join(out)


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

    html = replace_body(html, "COMMUNITY VIDEOS", '<div class="carousel carousel--videos">', "</div>\n    </section>",
                        render_diaries(diaries))
    html = html.replace('<div class="stories-grid">',
                        '<div class="rev-carousel" data-arrows><div class="carousel carousel--reads">')
    html = replace_body(html, "BLOG / STORIES", '<div class="carousel carousel--reads">',
                        "</div>\n    </section>", render_stories(stories))
    html = html.replace(REV_ARROWS_MARK, "")   # avoid stacking on a re-run
    html = html.replace("</div>\n    </section>\n\n    <!-- ================= UPCOMING DEPARTURES",
                        REV_ARROWS_MARK + "</div>\n    </section>\n\n    <!-- ================= UPCOMING DEPARTURES")
    # The list was a <ul> of <li> rows originally; the generated rows are
    # <div>s, so the container is normalised first and the script stays
    # re-runnable either way.
    html = html.replace('<ul class="departures-list">', '<div class="departures-list">')
    html = html.replace("</ul>\n    </section>\n\n    <!-- ================= REVIEWS",
                        "</div>\n    </section>\n\n    <!-- ================= REVIEWS")
    html = replace_body(html, "UPCOMING DEPARTURES", '<div class="departures-list">',
                        "</div>\n    </section>", render_departures(trips))

    # the diaries section needs an id for the video modals to close back to
    html = html.replace('<!-- ================= COMMUNITY VIDEOS ================= -->\n    <section class="container section"',
                        '<!-- ================= COMMUNITY VIDEOS ================= -->\n    <section class="container section" id="diaries"')

    # drop any previous diary modals, then append the current set
    html = re.sub(r'\n  <div class="vid-modal" id="diary-\d+">[\s\S]*?\n  </div>(?=\n)', "", html)
    html = html.replace("</body>", render_diary_modals(diaries) + "\n</body>")

    open(p, "w", encoding="utf-8").write(html)
    n_deps = render_departures(trips).count('<div class="dep">')
    print(f"  {PAGE}: {len(diaries)} diaries, {len(stories)} stories, {n_deps} departures")
