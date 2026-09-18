"""
Build the SEO homepage draft.

  converted/draft-homepage-seo.html

A copy of the homepage with the heading structure fixed, for review before the
change goes into the prototype and the static build. Nothing here touches
index.html.

THE PROBLEM
The homepage has THREE <h1>s, and all three are hero carousel slides:

    h1  Leave Ordinary Behind
    h1  Thailand Summer Sale
    h1  Rio Carnival 2027

So the page's most important heading is a promotion that rotates and changes
with the campaign, and no heading anywhere says what the company sells. The
h2s that follow are all brand voice — "Find Your Extraordinary", "Pick Your
Path", "The Tru Experience", "How We Do Things" — evocative, but a search
engine or a language model reading that outline learns nothing about small
group adventure tours for 18-40s.

WHAT THIS DRAFT CHANGES
1. The three hero h1s become <p>, styled identically. They are promos; they
   were never the page's heading. Zero visual change.
2. One <h1> is added in a new block under the hero, carrying the category in
   plain words: "Unforgettable Small Group Adventures".
3. That block pairs it with the descriptive paragraph, Intro Travel style —
   statement left, prose right — plus four facts worth quoting.
4. Two brand-voice h2s gain a plain-language second line, so they keep the
   voice AND say what the section is. The visible brand line stays first.

Every comparable operator puts this exact block directly after the hero:
Intrepid ("Real and remarkable small group trips worldwide"), G Adventures
("Small group adventures that bring the world closer"), Intro Travel ("Real
experiences. Real connections. Real travel." beside the explainer) and Topdeck
("Small group trips created with you in mind").

Run:  python3 converted/.build/build_draft_seo.py
"""

import os
import re

from shell import BASE

# Copy supplied by Mark. The phrase that does the work for search and for a
# language model is "small group adventures for 18 to 40-somethings" — it names
# the product and the audience in one line, which is what no heading did before.
H1_TOP = "Unforgettable"
H1_REST = "Small Group Adventures"

BODY = [
    "You deserve more from your travels. Start your journey solo, and leave with unforgettable "
    "memories, incredible new connections, a full camera roll and a brand new version of yourself.",
    "<strong>TruTravels&rsquo; small group adventures for 18 to 40-somethings</strong> are built to remind "
    "you what it is to feel inspired, connected and completely alive. Let your Local Legend show you "
    "the version of the place most travellers miss.",
    "Travel with TruTravels and <strong>Leave Ordinary Behind.</strong>",
]

# Four facts, each in a different brand colour so the row carries some life.
# Reviews came out — that number already has its own section further down the
# page, and repeating it here spent a slot without adding anything.
FACTS = [
    ("10&ndash;20", "", "Travellers per group, never more", "pink"),
    ("18&ndash;45", "", "The age range our trips are built for", "green"),
    ("35", "+", "Countries across the globe", "blue"),
    ("65", "+", "Trips to choose from", "pink"),
]

CHEV = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')

DRAFT_BAR = (
    '  <div class="draft-bar">'
    '<span>Draft &mdash; homepage heading structure for SEO. Not live.</span>'
    '<a href="index.html">See the current homepage</a>'
    '</div>\n'
)


def what_we_do():
    facts = "\n".join(
        f'''            <div class="wwd__fact wwd__fact--{tone}">
              <p class="wwd__fact-n">{n}<span>{suffix}</span></p>
              <p class="wwd__fact-l">{label}</p>
            </div>'''
        for n, suffix, label, tone in FACTS
    )
    body = "\n".join(f"            <p>{p}</p>" for p in BODY)
    return f'''
    <section class="wwd">
      <img class="ess-wm" style="right:-4rem;top:-2rem;width:clamp(240px,30vw,500px);opacity:0.05" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
      <div class="container">
        <div class="wwd__grid">
          <div>
            <p class="wwd__eyebrow">Small Group Adventure Travel</p>
            <!-- The page's ONE h1. Names the product and, in the body beside
                 it, the audience — the two things the old outline never said. -->
            <h1 class="wwd__h1">{H1_TOP}<span>{H1_REST}</span></h1>
          </div>
          <div class="wwd__body">
{body}
            <div class="wwd__acts">
              <a class="nf-btn nf-btn--pink" href="all-trips.html">Browse All Trips{CHEV}</a>
              <a class="nf-btn nf-btn--ghost" href="about-our-story.html">How We Started</a>
            </div>
          </div>
        </div>

        <div class="wwd__facts">
{facts}
        </div>
      </div>
    </section>
'''


def build():
    src = open(os.path.join(BASE, "index.html"), encoding="utf-8").read()

    # 1. Demote the three hero slide headings to <p>. Same class, so the styling
    #    is untouched — this is a semantics change, not a visual one.
    before = len(re.findall(r'<h1 class="home-hero__title">', src))
    src = src.replace('<h1 class="home-hero__title">', '<p class="home-hero__title">')
    src = re.sub(r'(<p class="home-hero__title">(?:(?!</h1>).)*?)</h1>', r'\1</p>', src, flags=re.S)

    # 2. Insert the statement block after the reviews bar, which is where every
    #    comparable operator puts it — first thing below the hero.
    anchor = '<section class="home-exp">'
    assert anchor in src, "home-exp section not found"
    src = src.replace(anchor, what_we_do().strip("\n") + "\n\n    " + anchor, 1)

    # 3. Give two brand-voice h2s a plain-language second line. The brand line
    #    stays first and stays the visible headline; the descriptive half is
    #    what a crawler or a model actually reads.
    # These three h2s are the brand voice: "Pick Your Path", "The Tru
    # Experience", "How We Do Things". All evocative, none of them saying what
    # the section is about. The brand line STAYS as the headline — what changes
    # is the supporting line under it, which is where the plain words go.
    pairs = [
        # existing sub-line is "however you want to search…", which says nothing
        ('<p class="dpath__sub">however you want to search&hellip;</p>',
         '<p class="dpath__sub">Search small group trips by destination, travel style or the '
         'moment you&rsquo;re in.</p>'),
        # this intro is good but never names the product
        ('<p class="tru-exp__intro">Every TruTravels trip is built around five intentional '
         'experience types.',
         '<p class="tru-exp__intro">Every TruTravels small group adventure is built around five '
         'intentional experience types.'),
        # this one has no supporting line at all
        ('<h2 class="tru-way__title">How We Do <span class="text-grad">Things</span></h2>',
         '<h2 class="tru-way__title">How We Do <span class="text-grad">Things</span></h2>'
         '<p class="wwd__sub" style="max-width:34rem;margin-bottom:2rem">What every TruTravels '
         'small group tour includes, and who you&rsquo;ll travel with.</p>'),
    ]
    missed = [old for old, _ in pairs if old not in src]
    assert not missed, "heading pair(s) no longer match: %s" % missed
    for old, new in pairs:
        src = src.replace(old, new, 1)

    # 4. Title and description carry the category too — they are the first thing
    #    a crawler reads, and the old ones were brand-only.
    src = re.sub(r"<title>.*?</title>",
                 "<title>TruTravels — Small Group Adventure Tours For 18–40 Somethings</title>",
                 src, count=1)
    src = re.sub(r'<meta name="description" content="[^"]*"',
                 '<meta name="description" content="Unforgettable small group adventures for 18 to '
                 '40-somethings across Asia, Europe and Latin America. Travel solo, leave with a crew '
                 '— led by Local Legends who live there."',
                 src, count=1)

    # draft banner, so a shared link can't be mistaken for the live page
    src = src.replace("<body>", "<body>\n" + DRAFT_BAR, 1)

    out = os.path.join(BASE, "draft-homepage-seo.html")
    open(out, "w", encoding="utf-8").write(src)
    return before, len(re.findall(r"<h1", src))


if __name__ == "__main__":
    was, now = build()
    print(f"  wrote draft-homepage-seo.html  (hero h1s demoted: {was} -> 0, page h1s now: {now})")
