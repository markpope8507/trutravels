"""
Build the homepage/community section components.

  converted/components/video-diaries-carousel.html   the community-stories one
  converted/components/local-legends-carousel.html   the guides one
  converted/components/tru-way.html                  "How We Do Things"
  converted/components/overlay-hero.html             the right-aligned page hero
  converted/components/cross-links.html              "the rest of the story" grid

Both are the same card and carousel; what differs is the head, the watermark,
who is in it, and whether the "Share Yours" CTA card is on the end. They are
separate component files because they are used as separate sections — the
community page carries both, one after the other — and a reader picking a
component off the index shouldn't have to work out which variant they want
from a single file.

Markup is sliced out of the built pages rather than retyped, so the components
can't drift from what actually ships:

  video diaries   converted/index.html            (#hvd-N viewers, CTA card)
  local legends   converted/about-our-community.html (#lvd-N viewers, no CTA)

Each card is an <a href="#id"> pointing at a .vid-modal further down the page,
which opens on :target — so the whole thing works with no JavaScript. The only
script is the shared carousel arrows + drag-to-scroll, which every built page
already carries.

Run:  python3 converted/.build/build_sections.py
"""

import os
import re

from shell import BASE, block

COMP = os.path.join(BASE, "components")


def read(fn):
    return open(os.path.join(BASE, fn), encoding="utf-8").read()


def slice_section(page, opening):
    """The <section …> … </section> that starts with `opening`, verbatim."""
    s = read(page)
    i = s.index(opening)
    return s[i : s.index("</section>", i) + len("</section>")]


def slice_div(page, opening):
    """The <div …> … </div> that starts with `opening`, closed at depth."""
    s = read(page)
    i = s.index(opening)
    depth, j = 0, i
    while True:
        m = re.compile(r"</?div\b").search(s, j)
        depth += 1 if m.group(0) == "<div" else -1
        j = m.end()
        if depth == 0:
            break
    return s[i : s.index(">", j - 1) + 1]


def viewers(page, prefix):
    """The fullscreen .vid-modal viewers the cards link to, in order."""
    s = read(page)
    out = []
    for m in re.finditer(r'<div class="vid-modal" id="%s-\d+">' % prefix, s):
        i = m.start()
        # the modal closes at the matching depth; count divs rather than guess
        depth, j = 0, i
        while True:
            nxt = re.compile(r"</?div\b").search(s, j)
            depth += 1 if nxt.group(0) == "<div" else -1
            j = nxt.end()
            if depth == 0:
                break
        out.append(s[i:j].rstrip() + ">")
    return out


# The component lives in components/, one level deeper than the pages it came
# from, so every root-relative asset and page link needs a ../ prefix.
def reroot(html):
    html = html.replace('src="assets/', 'src="../assets/')
    html = re.sub(r'href="(?!#|https?:|mailto:|\.\./)([a-z0-9-]+\.html)"', r'href="../\1"', html)
    return html


# The shared carousel scripts (arrow nav + drag-to-scroll) every built page has.
CAROUSEL_JS = block("explore.html", 594, 677)

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{title} (component) &mdash; TruTravels</title>
  <meta name="description" content="{desc}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;"><p style="color:#9ca3af;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">{label}</p></div>
"""


def page(title, desc, label, note, section, modals):
    return (
        HEAD.format(title=title, desc=desc, label=label)
        + note
        + "\n"
        + section
        + "\n\n  <!-- The fullscreen viewers the cards link to. One per card, opened by\n"
        "       :target — no script. Keep the ids in step with the card hrefs. -->\n"
        + "\n".join(modals)
        + "\n\n"
        + CAROUSEL_JS
        + "\n</body>\n</html>\n"
    )


SHARED_NOTE = """  <!-- ===================================================================
       {name}

       {intro}

       HOW IT WORKS
       Each card is an <a href="#{prefix}-N"> pointing at a .vid-modal further
       down the page. The modal opens on :target and closes via a link back out
       — so the gallery needs NO JavaScript at all. The only script is the
       shared carousel arrows + drag-to-scroll, already on every built page;
       don't copy it twice.

       Copy the <section class="{cls}"> block AND the matching .vid-modal
       blocks, and keep their ids in step — a card whose href has no modal
       silently does nothing.

       VIEWER STYLE: {viewer}
       Heads up — the site currently ships TWO viewers under the same
       .vid-modal class, and both are styled in styles.css:
         stories-style  __controls / __btn / __bars / __main / __meta
                        index.html, stories.html, trip pages
         lightbox       __scrim / __inner / __chev (prev/next)
                        about-our-community.html
       Each component carries the viewer its source page uses, so the pair
       always matches. Don't mix a card set from one with viewers from the
       other. Worth collapsing to one, but that changes behaviour on live
       pages, so it hasn't been done here.

       CARD TAGS pick the pill colour and label:
         --traveller  --creator  --legend  --planeterra  --partner  --community

       {extra}

       Requires ../styles.css (.vdia*, .vdiary*, .vid-modal*, .rev-carousel).
       =================================================================== -->"""


def build_video_diaries():
    section = reroot(slice_section("index.html", '<section class="vdia" id="video-diaries">'))
    modals = [reroot(m) for m in viewers("index.html", "hvd")]
    note = SHARED_NOTE.format(
        name="VIDEO DIARIES CAROUSEL — the community-stories gallery.",
        intro=(
            "Used on the homepage, the stories hub and trip pages. Mixed cast —\n"
            "       travellers, creators, Planeterra projects, partners, the crew."
        ),
        prefix="hvd",
        cls="vdia",
        viewer="stories-style — progress bars, no prev/next.",
        extra=(
            'The last tile is the "Share Yours" CTA (.vdiary--cta), not a video.\n'
            "       Drop it if the section isn't asking for submissions.\n\n"
            "       For the guides-only variant with its own head and no CTA card,\n"
            "       use local-legends-carousel.html instead."
        ),
    )
    out = page(
        "Video diaries carousel",
        "Community video-diary gallery — tap-to-play cards with fullscreen :target viewers.",
        "Video diaries carousel &mdash; demo (tap a card to open the viewer)",
        note,
        section,
        modals,
    )
    open(os.path.join(COMP, "video-diaries-carousel.html"), "w", encoding="utf-8").write(out)
    return len(re.findall(r'<a class="vdiary"', section)), len(modals)


def build_local_legends():
    section = reroot(
        slice_section("about-our-community.html", '<section class="vdia ab-legends">')
    )
    modals = [reroot(m) for m in viewers("about-our-community.html", "lvd")]
    note = SHARED_NOTE.format(
        name="LOCAL LEGENDS CAROUSEL — the guides gallery.",
        intro=(
            "The same card and carousel as video-diaries-carousel.html, cast\n"
            "       entirely from Local Legends: every card carries the --legend tag,\n"
            "       and the head introduces the people who run the trip rather than\n"
            "       the people on it."
        ),
        prefix="lvd",
        cls="vdia ab-legends",
        viewer="lightbox — scrim, prev/next chevrons, caption under the frame.",
        extra=(
            "No CTA tile — this is a roster, not a call for submissions.\n"
            "       `.ab-legends` only tightens the top padding and knocks the\n"
            "       watermark back, so the two can sit one after the other without\n"
            "       the join showing. The community page does exactly that."
        ),
    )
    out = page(
        "Local Legends carousel",
        "Meet Your Local Legends — the guides gallery, tap-to-play cards with fullscreen viewers.",
        "Local Legends carousel &mdash; demo (tap a card to open the viewer)",
        note,
        section,
        modals,
    )
    open(os.path.join(COMP, "local-legends-carousel.html"), "w", encoding="utf-8").write(out)
    return len(re.findall(r'<a class="vdiary"', section)), len(modals)



TRU_WAY_NOTE = """  <!-- ===================================================================
       HOW WE DO THINGS — the four reasons a Tru trip works.

       An icon / heading / paragraph grid, not a carousel: four fixed
       points, no scroll, no script. On the homepage it sits at the foot of
       the Tru Experience section, after the experience-type carousel — the
       carousel says what you'll do, this says how the trip is run.

       It is a plain <div class="container tru-way">, so it drops into any
       section without one. Add or remove a grid cell freely; the grid is
       1 / 2 / 4 columns as the viewport allows, so three or six work too.

       Each cell is: .tru-way__ico-row (a 24x24 stroked SVG + an h3), then
       a .tru-way__p. Keep the icons stroked and 1.5 weight — filled icons
       read much heavier at this size and break the row.

       Requires ../styles.css (.tru-way*). No script.
       =================================================================== -->"""


def build_tru_way():
    block_html = reroot(slice_div("index.html", '<div class="container tru-way">'))
    out = (
        HEAD.format(
            title="How we do things",
            desc="The Tru Way — four-up icon grid explaining how a TruTravels trip is run.",
            label="How we do things &mdash; demo",
        )
        + TRU_WAY_NOTE
        + '\n  <section style="padding:3rem 0 5rem;">\n'
        + block_html
        + "\n  </section>\n</body>\n</html>\n"
    )
    open(os.path.join(COMP, "tru-way.html"), "w", encoding="utf-8").write(out)
    return len(re.findall(r'<h3 class="tru-way__h3">', block_html))


OVERLAY_HERO_NOTE = """  <!-- ===================================================================
       OVERLAY HERO — the right-aligned page hero.

       The opener on every About and Essentials page, the 404 and the
       careers page — ten pages. Full-bleed photo, a left-to-right navy
       gradient, and the text block pushed to the RIGHT and right-aligned,
       which is what makes it read as a Tru page rather than a stock hero.

       Order inside .ess-hero__text is fixed and worth keeping:
         eyebrow -> title -> rule -> quote
       The rule is a 4rem pink hairline with `margin-left: auto`; it only
       sits under the title because the block is right-aligned, so don't
       centre the text and expect it to survive.

       THE PICTURE NEEDS SPACE ON THE RIGHT. The gradient is only 40-95%
       opaque, so a subject on the right-hand side fights the words. Pick a
       landscape with its interest on the left.

       <br /> in the title is deliberate — these are two-line display
       headings and the break is art-directed, not a wrap. `<span>` turns a
       line pink.

       Add `id="top"` if the page has a "back to top" link, as the About
       pages do.

       Requires ../styles.css (.ess-hero*). No script.
       =================================================================== -->"""


def build_overlay_hero():
    hero = reroot(slice_section("about-our-community.html", '<section class="ess-hero" id="top">'))
    out = (
        HEAD.format(
            title="Overlay hero",
            desc="The right-aligned page hero used across About, Essentials, 404 and careers.",
            label="Overlay hero &mdash; demo",
        )
        + OVERLAY_HERO_NOTE
        + "\n"
        + hero
        + "\n</body>\n</html>\n"
    )
    open(os.path.join(COMP, "overlay-hero.html"), "w", encoding="utf-8").write(out)
    return hero.count("ess-hero__")


CROSS_LINKS_NOTE = """  <!-- ===================================================================
       CROSS-LINKS — "the rest of the story" grid.

       The closing block on every About page, and on the careers page. Image
       cards that send the reader on rather than letting the page dead-end.
       Ten pages use it. The About pages show every sibling page (five on the
       demo below); the careers page hand-picks three.

       A card is a single <a> wrapping image + gradient + body, so the whole
       tile is the hit area — not just the title. Keep it that way.

       5:3 tiles, image `object-cover` so any crop works, scaling 105% on
       hover with the title going pink. The gradient is what makes white
       text safe over an unknown photo — never drop it.

       LEAVE OUT THE PAGE YOU ARE ON. On the real pages the list is filtered
       against the current route, so a page never links to itself. In the
       prototype that's `otherAboutPages(currentHref)` in lib/about-pages.ts;
       in the static build the generator filters the same list.

       Three across at 1024px, two at 640, one below. Three or six cards
       fill the rows exactly; four or five leave a gap on the last row, which
       is fine — they stay left-aligned rather than centring.

       Requires ../styles.css (.ab-more, .ab-xgrid, .ab-xcard*, .ess-*).
       No script.
       =================================================================== -->"""


def build_cross_links():
    block_html = reroot(
        slice_section("about-our-community.html", '<section class="ess-body ab-more">')
    )
    out = (
        HEAD.format(
            title="Cross-links",
            desc="Closing 'more to read' grid — three image cards sending the reader on.",
            label="Cross-links &mdash; demo",
        )
        + CROSS_LINKS_NOTE
        + "\n"
        + block_html
        + "\n</body>\n</html>\n"
    )
    open(os.path.join(COMP, "cross-links.html"), "w", encoding="utf-8").write(out)
    return len(re.findall(r'<a class="ab-xcard"', block_html))

if __name__ == "__main__":
    c, m = build_video_diaries()
    print(f"  wrote components/video-diaries-carousel.html  ({c} cards, {m} viewers)")
    c, m = build_local_legends()
    print(f"  wrote components/local-legends-carousel.html  ({c} cards, {m} viewers)")
    n = build_tru_way()
    print(f"  wrote components/tru-way.html                 ({n} grid cells)")
    n = build_overlay_hero()
    print(f"  wrote components/overlay-hero.html            ({n} hero parts)")
    n = build_cross_links()
    print(f"  wrote components/cross-links.html             ({n} cards)")
