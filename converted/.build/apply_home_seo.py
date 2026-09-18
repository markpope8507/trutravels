"""
Apply the approved SEO heading structure to the real homepage.

  converted/index.html   edited in place

This is the one-shot that promotes converted/draft-homepage-seo.html into the
live static homepage. The reasoning is in the commit and in the comment it
leaves in index.html; the short version:

  * index.html had THREE <h1>s, all of them rotating hero slides, so the page's
    most important heading was a promotion that changes with the campaign.
  * Nothing in the outline said what the company sells.

Every step asserts before it edits, and the script refuses to run twice — it
rewrites index.html in place, so a second pass would otherwise stack a second
statement block on the page.

Run:  python3 converted/.build/apply_home_seo.py
"""

import os
import re

from shell import BASE

INDEX = os.path.join(BASE, "index.html")

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

ICONS = {
    "group": '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>',
    "age": '<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>',
    "trips": '<path stroke-linecap="round" stroke-linejoin="round" d="m9 4-6 2.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Zm0 0v13m6-10v13"/>',
}

FACTS = [
    ("10&ndash;20", "", "Per group", "group"),
    ("18&ndash;45", "", "Age range", "age"),
    ("35", "+", "Countries", "globe"),
    ("65", "+", "Trips", "trips"),
]


def statement_block():
    facts = "\n".join(
        f'''            <div class="wwd__fact">
              <span class="wwd__fact-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">{ICONS[icon]}</svg></span>
              <p class="wwd__fact-n">{n}{suffix}</p>
              <p class="wwd__fact-l">{label}</p>
            </div>'''
        for n, suffix, label, icon in FACTS
    )
    body = "\n".join(f"            <p>{p}</p>" for p in BODY)
    return f'''    <!-- ================================================================
         WHAT WE DO — the page's one <h1>.

         Added for SEO and for language models. Before this, the homepage had
         three <h1>s and all three were hero carousel slides ("Leave Ordinary
         Behind", "Thailand Summer Sale", "Rio Carnival 2027"), so the most
         important heading on the page was a promotion that rotates with the
         campaign, and no heading anywhere named the product.

         The hero titles are <p class="home-hero__title"> now — same class, so
         nothing moved visually. DON'T promote them back to <h1>: one per page,
         and this is it.

         Placement follows every comparable operator — Intrepid, G Adventures,
         Intro Travel and Topdeck all put a plain statement of the category
         directly below the hero.
         ================================================================ -->
    <section class="wwd">
      <!-- The logo smile. Wider than a square mark, so it sits lower and runs
           larger, otherwise it reads as a stripe across the corner. -->
      <img class="ess-wm" style="right:-5rem;top:8%;width:clamp(280px,34vw,580px);opacity:0.05" src="assets/bg-assets/tru-logo.svg" alt="" aria-hidden="true" />
      <div class="container">
        <div class="wwd__grid">
          <div>
            <p class="wwd__eyebrow">Small Group Adventure Travel</p>
            <h1 class="wwd__h1">{H1_TOP}<span>{H1_REST}</span></h1>
          </div>
          <div class="wwd__body">
{body}
          </div>

          <!-- Third grid child, not nested in the heading column. Desktop places
               it back under the h1; mobile is one column so it falls last, under
               the body copy. -->
          <div class="wwd__facts">
{facts}
          </div>
        </div>
      </div>
    </section>
'''


def apply(src):
    # --- refuse to run twice -------------------------------------------------
    if 'class="wwd"' in src:
        raise SystemExit("index.html already carries the statement block — nothing to do.")

    # 1. hero slide headings -> <p>. Same class, so nothing moves.
    n = len(re.findall(r'<h1 class="home-hero__title">', src))
    assert n == 3, f"expected 3 hero h1s, found {n}"
    src = src.replace('<h1 class="home-hero__title">', '<p class="home-hero__title">')
    src = re.sub(r'(<p class="home-hero__title">(?:(?!</h1>).)*?)</h1>', r"\1</p>", src, flags=re.S)

    # 2. the statement block, directly below the hero + reviews bar
    anchor = '<section class="home-exp">'
    assert anchor in src, "home-exp section not found"
    src = src.replace(anchor, statement_block() + "\n    " + anchor, 1)

    # 3. plain-language supporting lines under three brand-voice headings. The
    #    brand line stays the headline; the descriptive half goes underneath.
    pairs = [
        ('<p class="dpath__sub">however you want to search&hellip;</p>',
         '<p class="dpath__sub">Search small group trips by destination, travel style or the '
         'moment you&rsquo;re in.</p>'),
        ('<p class="tru-exp__intro">Every TruTravels trip is built around five intentional '
         'experience types.',
         '<p class="tru-exp__intro">Every TruTravels small group adventure is built around five '
         'intentional experience types.'),
        ('<h2 class="tru-way__title">How We Do <span class="text-grad">Things</span></h2>',
         '<h2 class="tru-way__title">How We Do <span class="text-grad">Things</span></h2>'
         '<p class="wwd__sub" style="max-width:34rem;margin-bottom:2rem">What every TruTravels '
         'small group tour includes, and who you&rsquo;ll travel with.</p>'),
    ]
    missed = [old for old, _ in pairs if old not in src]
    assert not missed, f"heading pair(s) no longer match: {missed}"
    for old, new in pairs:
        src = src.replace(old, new, 1)

    # 4. title and description name the category — they're the first thing read
    src = re.sub(r"<title>.*?</title>",
                 "<title>TruTravels — Small Group Adventure Tours For 18–40 Somethings</title>",
                 src, count=1)
    src = re.sub(r'<meta name="description" content="[^"]*"',
                 '<meta name="description" content="Unforgettable small group adventures for 18 to '
                 '40-somethings across Asia, Europe and Latin America. Travel solo, leave with a crew '
                 '— led by Local Legends who live there."',
                 src, count=1)
    return src


if __name__ == "__main__":
    src = open(INDEX, encoding="utf-8").read()
    out = apply(src)
    open(INDEX, "w", encoding="utf-8").write(out)
    block = "yes" if 'class="wwd"' in out else "NO"
    print("  index.html updated — h1s: %d, statement block: %s"
          % (len(re.findall(r"<h1", out)), block))
