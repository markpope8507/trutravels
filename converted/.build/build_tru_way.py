"""
Build the-tru-way.html — the page the footer calls "How It Works".

    the-tru-way.html   mirrors src/app/the-tru-way

WHERE THE CONTENT COMES FROM. Nothing here is retyped. The five inclusions
(copy, bullets, gallery images and the line-art icon) are parsed straight out
of src/app/the-tru-way/page.tsx, which is where that array lives; the five
experience types and the three TRU promises come from src/lib/data.ts, the
same source the homepage and the trip pages read. So a copy change on either
side lands here on the next run instead of drifting.

THE ROWS. The prototype's <FeatureRow> is a two-column grid with the gallery
spanning both text rows — title above, body and bullets below — flipping sides
on alternate rows. That is `.tw-row` / `.tw-row--alt` in styles.css, and it is
saved as a copy-in block at components/feature-rows.html.

ACCENT COLOURS. Each experience type carries its own hex. The prototype builds
`${accent}0D` / `${accent}33` strings inline; here the row sets four custom
properties (--a and three alphas) so the stylesheet stays plain rgba() like the
rest of the file, and rgba_of() below does the hex maths once.

Run:  python3 converted/.build/build_tru_way.py
      python3 converted/.build/apply_crumbs.py      # adds the breadcrumb bar
"""

import html as H
import json
import os
import re

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD

SRC = os.path.join(BASE, "..", "src")


def esc(s):
    return H.escape(str(s), quote=False)


def src_read(*parts):
    return open(os.path.join(SRC, *parts), encoding="utf-8").read()


# ------------------------------------------------------------------ parsing --

def _end(text, start, open_c, close_c):
    """Index just past the bracket/brace opened at `start`, quotes respected."""
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
        elif c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise ValueError("unbalanced %s from %d" % (open_c, start))


def ts_objects(text, const):
    """Top-level objects of an array literal, brace-matched.

    Same walker as build_deals.py and build_life_moments.py, and for the same
    reason: a regex that looks a fixed distance ahead picks up nested objects.
    Starting at `= [` rather than the first `[` matters — `Trip[]` in a type
    annotation is a bracket pair that closes immediately.
    """
    seg = text[text.index(const):]
    i = seg.index("= [") + 2
    end = _end(seg, i, "[", "]")
    out, depth, quote, j = [], 0, None, i
    start = None
    while j < end:
        c = seg[j]
        if quote:
            if c == "\\":
                j += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            if depth == 0:
                start = j
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                out.append(seg[start:j + 1])
        j += 1
    return out


def field(obj, key):
    """One `key: "string"` at brace depth 1, unescaped by json.

    json.loads rather than stripping the quotes, because these values carry
    \\n (the promise titles wrap on purpose) and \\u escapes.
    """
    depth, quote, i = 0, None, 0
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
            m = re.match(key + r'\s*:\s*("(?:[^"\\]|\\.)*")', obj[i:])
            if m:
                return json.loads(m.group(1))
        i += 1
    return None


def strings(obj, key):
    """The string items of `key: [ "a", "b" ]`."""
    m = re.search(r"\b" + key + r"\s*:\s*\[", obj)
    if not m:
        return []
    seg = obj[m.end() - 1:_end(obj, m.end() - 1, "[", "]")]
    return [json.loads(x) for x in re.findall(r'"(?:[^"\\]|\\.)*"', seg)]


def gallery_images(seg):
    """`{ src: "...", caption: "..." }` pairs out of an images array."""
    return [{"src": json.loads(a), "caption": json.loads(b)}
            for a, b in re.findall(r'src:\s*("(?:[^"\\]|\\.)*"),\s*caption:\s*("(?:[^"\\]|\\.)*")', seg)]


def images_of(obj):
    m = re.search(r"\bimages\s*:\s*\[", obj)
    if not m:
        return []
    return gallery_images(obj[m.end() - 1:_end(obj, m.end() - 1, "[", "]")])


def rgba(hex_colour, alpha):
    h = hex_colour.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return "rgba(%d,%d,%d,%s)" % (r, g, b, alpha)


# --------------------------------------------------------------------- data --

PAGE = src_read("app", "the-tru-way", "page.tsx")
DATA = src_read("lib", "data.ts")

INCLUSIONS = []
for o in ts_objects(PAGE, "const INCLUSIONS"):
    d = re.search(r'\bd="([^"]+)"', o)
    INCLUSIONS.append({
        "eyebrow": field(o, "eyebrow"),
        "title": field(o, "title"),
        "body": field(o, "body"),
        "bullets": strings(o, "bullets"),
        "images": images_of(o),
        "path": d.group(1) if d else "",
    })

# EXPERIENCE_GALLERIES is a Record, not an array, so it is split on its keys.
_gal = PAGE[PAGE.index("const EXPERIENCE_GALLERIES"):]
_gal = _gal[:_end(_gal, _gal.index("{"), "{", "}")]
GALLERIES = {}
for m in re.finditer(r'"?([a-z-]+)"?:\s*\[', _gal):
    GALLERIES[m.group(1)] = gallery_images(_gal[m.end() - 1:_end(_gal, m.end() - 1, "[", "]")])

EXPERIENCES = []
for o in ts_objects(DATA, "export const experienceTypes"):
    EXPERIENCES.append({
        "id": field(o, "id"),
        "name": field(o, "name"),
        "icon": field(o, "icon"),
        "tagline": field(o, "tagline"),
        "description": field(o, "description"),
        "color": field(o, "color"),
        "experiences": strings(o, "experiences"),
    })

PROMISES = [{"eyebrow": field(o, "eyebrow"), "title": field(o, "title"),
             "body": field(o, "body"), "icon": field(o, "icon")}
            for o in ts_objects(DATA, "export const truPromises")]

for name, got in (("inclusions", INCLUSIONS), ("experience types", EXPERIENCES),
                  ("promises", PROMISES)):
    if not got:
        raise SystemExit("build_tru_way: parsed 0 %s — refusing to write a hollow page" % name)

# --------------------------------------------------------------------- bits --

TICK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')
CHEV_L = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>')
CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
SHIELD = ("M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 "
          "5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c"
          "-3.196 0-6.1-1.248-8.25-3.285z")


def icon_svg(path, stroke="1.5"):
    return ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="%s">%s</svg>'
            % (stroke, path if path.startswith("<") else
               '<path stroke-linecap="round" stroke-linejoin="round" d="%s"/>' % path))


# Decorative marks, in the order and at the offsets the prototype floats them.
# Tailwind steps those offsets at two breakpoints; a calc() on vw is the same
# travel without three rules per image.
MARKS = {
    "sun": "right:calc(-4rem - 4vw);top:-2rem;width:clamp(260px,43vw,600px);opacity:0.07",
    "peru-bird": "left:calc(-4rem - 3.4vw);top:33%;width:clamp(220px,34vw,480px);opacity:0.06",
    "bali-flower": "right:calc(-3rem - 3.4vw);bottom:-2.5rem;width:clamp(220px,34vw,480px);opacity:0.06",
    "mask": "left:calc(-4rem - 3.4vw);top:-2rem;width:clamp(260px,40vw,560px);opacity:0.06",
    "ramen": "right:calc(-3rem - 3.4vw);top:50%;width:clamp(200px,31vw,440px);opacity:0.07",
    "lantern": "left:calc(-3rem - 3.4vw);bottom:-2.5rem;width:clamp(220px,33vw,460px);opacity:0.06",
    "good-vibes": "left:calc(-4rem - 3.4vw);top:-2rem;width:clamp(240px,36vw,500px);opacity:0.06",
    "tru-logo": "right:calc(-4rem - 3.4vw);bottom:-2.5rem;width:clamp(220px,31vw,440px);opacity:0.05",
}


def marks(*names):
    return "".join('<img class="ess-wm" style="%s" src="assets/bg-assets/%s.svg" alt="" aria-hidden="true" />'
                   % (MARKS[n], n) for n in names)


def gallery(images, alt, gid):
    """One swipeable 4:3 gallery. Arrows and dots only when there is a second
    slide — a single-image row would otherwise show controls that do nothing."""
    slides = "".join(
        '<div class="tw-gal__slide"><img src="%s" alt="%s &mdash; %s" loading="lazy" />'
        '<span class="tw-gal__grad"></span><p class="tw-gal__cap">%s</p></div>'
        % (im["src"], esc(alt), esc(im["caption"]), esc(im["caption"])) for im in images)
    if len(images) < 2:
        return '<div class="tw-gal"><div class="tw-gal__track">%s</div></div>' % slides
    return ('<div class="tw-gal" data-gal id="%s">'
            '<div class="tw-gal__track" data-gal-track>%s</div>'
            '<button class="tw-gal__arrow tw-gal__arrow--prev" type="button" data-gal-go="prev" '
            'aria-label="Previous image">%s</button>'
            '<button class="tw-gal__arrow tw-gal__arrow--next" type="button" data-gal-go="next" '
            'aria-label="Next image">%s</button>'
            '<div class="tw-gal__dots" data-gal-dots></div></div>'
            % (gid, slides, CHEV_L, CHEV_R))


def row(idx, gid, images, alt, icon, eyebrow, title, body, bullets,
        accent="#FF3F99", tinted=False, bare=False, h3_cls="", eyebrow_cls=""):
    """One alternating gallery/text row. Even rows put the gallery left."""
    style = ("--a:%s;--a-soft:%s;--a-line:%s;--a-tick:%s"
             % (accent, rgba(accent, "0.13"), rgba(accent, "0.4"), rgba(accent, "0.15")))
    if tinted:
        style += ";background:%s;border-color:%s" % (rgba(accent, "0.05"), rgba(accent, "0.2"))
    cls = "tw-row" + (" tw-row--alt" if idx % 2 else "") + (" tw-row--tint" if tinted else "")
    lis = "".join('<li><span class="tw-row__tick">%s</span>%s</li>' % (TICK, esc(b)) for b in bullets)
    return ('<div class="%s" style="%s">\n'
            '          <div class="tw-row__title">%s<p class="tw-row__eyebrow%s">%s</p>'
            '<h3 class="tw-row__h3%s">%s</h3></div>\n'
            '          <div class="tw-row__gal">%s</div>\n'
            '          <div class="tw-row__body"><p class="tw-row__p">%s</p>'
            '<ul class="tw-row__list">%s</ul></div>\n'
            '        </div>'
            % (cls, style,
               ('<div class="tw-row__icon-bare">%s</div>' if bare else '<div class="tw-row__icon">%s</div>') % icon,
               eyebrow_cls, eyebrow, h3_cls, esc(title),
               gallery(images, alt, gid), esc(body), lis))


# -------------------------------------------------------------------- build --

inclusion_rows = "\n        ".join(
    row(i, "tw-inc-%d" % i, c["images"], c["title"], icon_svg(c["path"]),
        esc(c["eyebrow"]), c["title"], c["body"], c["bullets"])
    for i, c in enumerate(INCLUSIONS))

exp_tiles = "".join(
    '<li class="tw-ico"><img src="assets/experience-icons/%s.png" alt="" aria-hidden="true" '
    'width="546" height="549" /><p>%s</p></li>'
    % (e["id"], esc(e["name"])) for e in EXPERIENCES)

exp_rows = "\n        ".join(
    row(i, "tw-exp-%d" % i, GALLERIES.get(e["id"], []), e["name"],
        '<img src="assets/experience-icons/%s.png" alt="" aria-hidden="true" width="546" height="549" />' % e["id"],
        '<span class="tw-exp-name">%s</span><span class="tw-exp-sub">Experiences</span>' % esc(e["name"]),
        e["tagline"].rstrip("."), e["description"], e["experiences"][:3],
        accent=e["color"], tinted=True, bare=True,
        h3_cls=" tw-row__h3--exp", eyebrow_cls=" tw-row__eyebrow--exp")
    for i, e in enumerate(EXPERIENCES))

promise_cards = "".join(
    '<div class="tw-pcard"><div class="tw-pcard__ico">%s</div>'
    '<p class="tw-pcard__eyebrow">%s</p><h4 class="tw-pcard__t">%s</h4>'
    '<p class="tw-pcard__p">%s</p></div>'
    % (icon_svg(p["icon"], "1.75"), esc(p["eyebrow"]), esc(p["title"]), esc(p["body"]))
    for p in PROMISES)

BODY = """    <section class="ess-hero" id="top">
      <img class="ess-hero__img" src="assets/the-tru-way-hero.jpg" alt="A TruTravels group on a boat trip" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">The Tru Way</p>
          <h1 class="ess-hero__title">Everything<br /><span>Sorted</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;You turn up. We&rsquo;ve sorted the rest.&rdquo;</p>
        </div>
      </div>
    </section>

    <section class="tw-sec tw-sec--first" id="included">%s
      <div class="container">
        <div class="tw-head">
          <p class="ess-eyebrow">What You Get</p>
          <h2 class="ess-h2">Included <span>As Standard</span></h2>
          <p class="tw-intro">Every TruTravels trip includes accommodation, transport, activities, some meals, and a Local Legend who feels more like a mate who happens to know the way. It&rsquo;s all baked in &mdash; no bolt-ons, no surprises.</p>
        </div>
        <div class="tw-rows">
        %s
        </div>
      </div>
    </section>

    <section class="tw-sec tw-sec--next" id="experiences">%s
      <div class="container">
        <div class="tw-head">
          <p class="ess-eyebrow">The Blueprint</p>
          <h2 class="ess-h2">Tru Experience <span>Architecture</span></h2>
          <p class="tw-intro">Every itinerary is intentionally designed around five experience types. Some trips lean harder into one than another &mdash; so you can search and choose by the kind of experiences you actually want to have, not just where you&rsquo;re going.</p>
        </div>
        <ul class="tw-ico-grid">%s</ul>
        <div class="tw-rows">
        %s
        </div>
      </div>
    </section>

    <section class="tw-sec tw-sec--last" id="confidence">%s
      <div class="container">
        <div class="tw-promise">
          <div class="tw-promise__in">
            <div class="tw-promise__head">
              <div class="tw-promise__badge">%s</div>
              <p class="ess-eyebrow">The TRU Promise</p>
              <h3 class="tw-promise__h">Book With <span>Confidence</span></h3>
            </div>
            <div class="tw-promise__grid">%s</div>
          </div>
        </div>
      </div>
    </section>

    <section class="tw-cta">
      <h3 class="tw-cta__h">Ready When You <span>Are</span></h3>
      <a class="tw-cta__btn" href="explore.html">Find Your Trip %s</a>
    </section>""" % (
    marks("sun", "peru-bird", "bali-flower"), inclusion_rows,
    marks("mask", "ramen", "lantern"), exp_tiles, exp_rows,
    marks("good-vibes", "tru-logo"), icon_svg(SHIELD, "1.75"), promise_cards,
    CHEV_R)

GAL_JS = """  <script>/* The Tru Way galleries — one translateX track per row, dots built from
     the slide count. Scoped to [data-gal] so every row runs independently and
     a row with a single image (no [data-gal]) simply has no controls. */
  (function () {
    document.querySelectorAll('[data-gal]').forEach(function (g) {
      var track = g.querySelector('[data-gal-track]');
      var dots = g.querySelector('[data-gal-dots]');
      var n = track.children.length, i = 0;
      for (var k = 0; k < n; k++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tw-gal__dot';
        b.setAttribute('data-gal-dot', k);
        b.setAttribute('aria-label', 'Image ' + (k + 1) + ' of ' + n);
        dots.appendChild(b);
      }
      function go(x) {
        i = (x + n) % n;
        track.style.transform = 'translateX(-' + (i * 100) + '%)';
        for (var k = 0; k < n; k++) {
          dots.children[k].classList.toggle('is-on', k === i);
          track.children[k].setAttribute('aria-hidden', k === i ? 'false' : 'true');
        }
      }
      g.querySelector('[data-gal-go="prev"]').addEventListener('click', function () { go(i - 1); });
      g.querySelector('[data-gal-go="next"]').addEventListener('click', function () { go(i + 1); });
      dots.addEventListener('click', function (e) {
        var t = e.target.closest('[data-gal-dot]');
        if (t) go(+t.getAttribute('data-gal-dot'));
      });
      go(0);
    });
  })();
  </script>"""

OUT = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n%s\n'
       '  <title>The Tru Way &mdash; TruTravels</title>\n'
       '  <meta name="description" content="Everything sorted so you don’t have to. Every '
       'TruTravels trip includes accommodation, transport, activities, some meals and a Local '
       'Legend — plus ABTA &amp; ATOL protection." />\n'
       '</head>\n<body>\n\n%s\n\n  <main class="tw">\n%s\n  </main>\n\n%s\n%s\n%s\n</body>\n</html>\n'
       % (HEAD, NAV_OVER, BODY, FOOTER, SCRIPTS, GAL_JS))


def relink_how_it_works():
    """Point the footer's "How It Works" at the page that now exists.

    footer.py carries it as "#" because there was nothing to link to; every
    built page already holds a copy of that markup, so both are rewritten —
    the source so the next build is right, the pages so this one is.
    """
    n = 0
    fp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "footer.py")
    s = open(fp, encoding="utf-8").read()
    if '("How It Works", "#")' in s:
        open(fp, "w", encoding="utf-8").write(s.replace('("How It Works", "#")',
                                                        '("How It Works", "the-tru-way.html")'))
        print("  footer.py now links How It Works")
    for fn in sorted(os.listdir(BASE)):
        if not fn.endswith(".html"):
            continue
        p = os.path.join(BASE, fn)
        s = open(p, encoding="utf-8").read()
        t = s.replace('<a href="#">How It Works</a>', '<a href="the-tru-way.html">How It Works</a>')
        if t != s:
            open(p, "w", encoding="utf-8").write(t)
            n += 1
    print("  relinked How It Works on %d pages" % n)


if __name__ == "__main__":
    open(os.path.join(BASE, "the-tru-way.html"), "w", encoding="utf-8").write(OUT)
    print("  wrote the-tru-way.html  (%d lines, %d inclusions, %d experience types, %d promises)"
          % (OUT.count("\n") + 1, len(INCLUSIONS), len(EXPERIENCES), len(PROMISES)))
    relink_how_it_works()
