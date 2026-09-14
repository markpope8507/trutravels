"""
Build the static 404 page.

Mirrors src/app/not-found.tsx into converted/404.html.

Same hero language as the Essentials pages — full-bleed image, right-aligned
overlay — with the status code sitting behind the headline as a watermark, then
a short row of signposts. Nav, footer and shared scripts come from shell.py.

The links point at the converted pages that actually exist; anything not yet
converted is left out rather than shipped as a dead end.

Styling lives in ../styles.css under .nf-*.

Run:  python3 converted/.build/build_404.py
"""

import os

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD

CHEV = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')

# Only pages that exist in the static build — a 404 that links to a 404 is worse
# than no link at all. Add rows here as more pages are converted.
ROUTES = [
    ("All Trips", "all-trips.html", "Every departure, filterable"),
    ("Destinations", "explore.html", "Browse by where you&rsquo;re headed"),
    ("Stories", "stories.html", "Guides, tips and real trips"),
    ("Travel Insurance", "travel-insurance.html", "The cover you need before you go"),
]

# An open landscape with space on the right for the overlay and the 404.
HERO_IMG = "https://cdn.trutravels.com/images/northernthailandviews.jpg"


def page():
    routes = "\n".join(
        f'''          <a class="nf-route" href="{href}">
            <span class="nf-route__txt">
              <span class="nf-route__l">{label}</span>
              <span class="nf-route__n">{note}</span>
            </span>
            <span class="nf-route__go">{CHEV}</span>
          </a>'''
        for label, href, note in ROUTES
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Page Not Found &mdash; TruTravels</title>
  <meta name="description" content="This page has wandered off. Head back to the trips and find your next adventure." />
</head>
<body>

{NAV_OVER}

  <main class="nf">
    <section class="nf-hero">
      <img class="nf-hero__img" src="{HERO_IMG}" alt="" aria-hidden="true" />
      <div class="nf-hero__grad"></div>
      <span class="nf-hero__code" aria-hidden="true">404</span>
      <div class="container nf-hero__inner">
        <div class="nf-hero__text">
          <p class="nf-hero__eyebrow">Error 404 &middot; Off The Map</p>
          <h1 class="nf-hero__title">You&rsquo;ve Gone<br /><span>Off Track</span></h1>
          <div class="nf-hero__rule"></div>
          <p class="nf-hero__quote">&ldquo;Getting lost is half the fun &mdash; though usually we mean somewhere more interesting than this.&rdquo;</p>
          <div class="nf-hero__acts">
            <a class="nf-btn nf-btn--pink" href="explore.html">Explore Trips{CHEV}</a>
            <a class="nf-btn nf-btn--ghost" href="index.html">Take Me Home</a>
          </div>
        </div>
      </div>
    </section>

    <section class="nf-body">
      <img class="nf-wm" style="left:-4rem;top:0;width:clamp(220px,28vw,440px)" src="assets/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" />
      <img class="nf-wm" style="right:-3rem;bottom:0;width:clamp(220px,28vw,440px)" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
      <div class="container nf-col">
        <p class="nf-eyebrow">Try One Of These</p>
        <h2 class="nf-h2">Back On <span>Solid Ground</span></h2>
        <div class="nf-routes">
{routes}
        </div>
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}
</body>
</html>
"""


if __name__ == "__main__":
    out = page()
    open(os.path.join(BASE, "404.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote 404.html  ({len(out.splitlines())} lines)")
