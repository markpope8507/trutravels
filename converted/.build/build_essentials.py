"""
Build the static Essentials pages.

Mirrors the three signed-off Essentials routes into converted/:

    travel-insurance.html      src/app/travel-insurance
    visas-and-passports.html   src/app/visas-and-passports
    terms-conditions.html      src/app/terms-conditions

All three share one hero and one prose column, so the hero, the section
heading, the gradient cards and the "Find Your Trip" CTA are written once here
and used three times rather than copy-pasted per page.

As with build_account.py, nothing already present elsewhere in the build is
re-typed:

  · nav / footer / shared scripts are sliced out of explore.html by line range
    (the over-hero nav variant, since these pages open on a full-bleed image)
  · the "You Might Also Like" destinations carousel is lifted verbatim out of
    index.html, so it stays identical to the homepage rather than becoming a
    second implementation
  · the booking conditions text is read straight from src/lib/terms-content.ts,
    so the prototype remains the single source for that copy

Styling lives in ../styles.css under .ess-*.

Run:  python3 converted/.build/build_essentials.py
"""

import html, json, os, re

from shell import BASE, read, lines, block, NAV_OVER, FOOTER, SCRIPTS

SRC = os.path.join(BASE, "..", "src")

# ------------------------------------------------------------------ chrome --
# Transparent nav — every one of these pages opens on a full-bleed hero image.
NAV = NAV_OVER

# "You Might Also Like" — lifted whole so it matches the homepage exactly.
DESTINATIONS = block("index.html", 1204, 1261)

CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
TICK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')
ARROW_UP = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M5 12l7-7 7 7"/></svg>')


def shell(title, description, body, page_script=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{title} &mdash; TruTravels</title>
  <meta name="description" content="{description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

{NAV}

  <main class="ess">
{body}
  </main>

{FOOTER}

{SCRIPTS}{page_script}
</body>
</html>
"""


# ------------------------------------------------------------ page pieces --
def hero(image, alt, eyebrow, line1, line2, quote):
    """The right-aligned overlay hero all three Essentials pages share."""
    return f"""    <section class="ess-hero" id="top">
      <img class="ess-hero__img" src="{image}" alt="{alt}" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">{eyebrow}</p>
          <h1 class="ess-hero__title">{line1}<br /><span>{line2}</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>
    </section>"""


def watermarks(spec):
    """Line-art watermarks behind the prose column, positioned per page."""
    return "\n".join(
        f'      <img class="ess-wm" style="{pos}" src="assets/bg-assets/{icon}.svg" alt="" aria-hidden="true" />'
        for icon, pos in spec
    )


def heading(eyebrow, plain, pink):
    return (f'        <p class="ess-eyebrow">{eyebrow}</p>\n'
            f'        <h2 class="ess-h2">{plain} <span>{pink}</span></h2>')


def cta_card(heading_plain, heading_pink, copy):
    return f"""      <div class="ess-card ess-card--cta">
        <h3 class="ess-cta__h">{heading_plain} <span>{heading_pink}</span></h3>
        <p class="ess-cta__p">{copy}</p>
        <a class="ess-btn" href="explore.html">Find Your Trip{CHEV_R}</a>
      </div>"""


# ------------------------------------------------------- travel insurance --
QUOTE_URL = "https://www.anrdoezrs.net/click-101301337-15403748"

COVER = [
    "Emergency medical care &amp; repatriation",
    "150+ adventure activities &mdash; trekking, diving, surfing and more",
    "Lost, stolen or damaged gear",
    "Trip cancellation &amp; curtailment",
    "24/7 emergency assistance",
    "Cover for the full length of your trip",
]

WM_SHORT = [
    ("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
    ("mask", "left:-4rem;top:50%;width:clamp(220px,28vw,460px);opacity:0.06"),
    ("ramen", "right:-3rem;bottom:-2.5rem;width:clamp(220px,28vw,460px);opacity:0.06"),
]


def travel_insurance():
    cover = "\n".join(
        f'          <li class="ess-check"><span class="ess-check__box">{TICK}</span>{item}</li>'
        for item in COVER
    )
    body = f"""{hero("https://cdn.trutravels.com/indonesia-images/surfing-lesson-bali.jpg",
                     "Adventure activity on a TruTravels trip",
                     "Essentials &middot; The Serious Stuff",
                     "Travel", "Insurance",
                     "Cover you can count on &mdash; wherever the road takes you.")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col">

        <div class="ess-sec">
{heading("Non-Negotiable", "Don&rsquo;t Skip", "The Cover")}
          <p class="ess-p">Travel insurance is compulsory on every Tru trip &mdash; and for good reason. It&rsquo;s the one thing you hope you never need, and the one thing you&rsquo;ll be seriously glad you have if you do. Whatever you go for, make sure it covers your whole trip and doesn&rsquo;t leave you paying out of pocket before you can claim. Cheapest isn&rsquo;t always best.</p>
        </div>

        <div class="ess-sec">
{heading("The Checklist", "What Good Cover", "Looks Like")}
          <ul class="ess-checks">
{cover}
          </ul>
        </div>

        <div class="ess-card">
          <p class="ess-eyebrow">Our Partner</p>
          <span class="ess-partner"><img src="assets/partners/world-nomads-logo.png" alt="World Nomads" /></span>
          <p class="ess-p ess-p--sm">We&rsquo;ve teamed up with World Nomads, who cover more than 150 adventure activities plus emergency medical, lost luggage, trip cancellation and more. Buy before you go or top up while you&rsquo;re travelling, and claim online from anywhere in the world.</p>
          <a class="ess-btn" href="{QUOTE_URL}" target="_blank" rel="noopener noreferrer">Get A Quote Here{CHEV_R}</a>
          <p class="ess-fine">We receive a fee when you get a quote from World Nomads using this link. We don&rsquo;t represent World Nomads, and this isn&rsquo;t a recommendation to buy travel insurance &mdash; just a good place to start.</p>
        </div>

        <div class="ess-sec">
{heading("Health &amp; Jabs", "Vaccinations", "&amp; Health")}
          <p class="ess-p">Some destinations recommend specific vaccinations. Check your own country&rsquo;s official travel-health guidance, or pop into a travel clinic well before you fly &mdash; they&rsquo;ll give you the most up-to-date advice for wherever you&rsquo;re headed.</p>
        </div>

{cta_card("Sorted? Now The", "Fun Part",
          "Cover in hand &mdash; all that&rsquo;s left is picking the adventure. Browse the trips and find the one calling your name.")}

      </div>
    </section>

{DESTINATIONS}"""
    return shell(
        "Travel Insurance",
        "Travel insurance is compulsory on every Tru trip. Cover for adventure activities, "
        "emergency medical, lost luggage and trip cancellation — wherever you're headed.",
        body,
    )


# ------------------------------------------------------ visas & passports --
SHERPA_SRC = "https://sdk.joinsherpa.io/widget.js?appId=spA4MzM1Mz&02072026B"

SHERPA_SCRIPT = f"""
  <script>/* Sherpa visa-requirements widget — same appId as the live site.
     Two quirks, matching src/components/sherpa-visa-widget.tsx:
       · the SDK publishes itself as window.$sherpa, not window.sherpa, and
         does so a beat after onload — hence the short poll
       · mounting into the same node twice leaves its iframe stuck at height 0 */
  (function () {{
    var tries = 0;
    function mount() {{
      var host = document.getElementById('sherpa-trip-element');
      if (!host || host.childElementCount > 0) return;   /* already mounted */
      var sherpa = window.$sherpa;
      if (sherpa && sherpa.V2) {{
        try {{ sherpa.V2.createElement('trip').mount('#sherpa-trip-element'); }}
        catch (e) {{ /* the widget reports its own errors */ }}
      }} else if (tries++ < 25) {{
        setTimeout(mount, 200);
      }}
    }}
    var s = document.createElement('script');
    s.src = '{SHERPA_SRC}';
    s.async = true;
    s.onload = mount;
    document.body.appendChild(s);
  }})();
  </script>"""


def visas_and_passports():
    body = f"""{hero("https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg",
                     "Travellers exploring on a TruTravels trip",
                     "Essentials &middot; The Essential Info",
                     "Visas &amp;", "Passports",
                     "Sort the paperwork, then go get lost.")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col">

        <div class="ess-sec">
{heading("The Essential Info", "Passports &amp;", "Visas")}
          <p class="ess-p">You must carry a valid passport and have obtained all the appropriate visas, permits and certificates for every country you&rsquo;ll visit on your trip. Visa rules change regularly, so always double-check your own government&rsquo;s official information before you travel &mdash; we keep this as up to date as we can, but we can&rsquo;t guarantee it&rsquo;s 100% accurate for every nationality.</p>
        </div>

        <div class="ess-sec">
{heading("Check Before You Go", "Visa", "Checker")}
          <p class="ess-p">Review entry requirements and restrictions using the tool below, powered by Sherpa. Make sure you check the rules for both directions of travel.</p>
          <div class="ess-sherpa"><div id="sherpa-trip-element"></div></div>
          <p class="ess-fine">The Sherpa visa portal isn&rsquo;t associated with TruTravels and is for information purposes only &mdash; we recommend applying for any visa through official government channels.</p>
        </div>

{cta_card("Paperwork", "Sorted?",
          "With the admin out of the way, all that&rsquo;s left is picking the adventure. Browse the trips and find the one calling your name.")}

      </div>
    </section>

{DESTINATIONS}"""
    return shell(
        "Visas &amp; Passports",
        "Everything you need to know about visas and passports before your trip. "
        "Check entry requirements with our Sherpa-powered visa checker.",
        body,
        SHERPA_SCRIPT,
    )


# ----------------------------------------------------- booking conditions --
def terms_blocks():
    """Read the copy straight from the prototype so there is one source for it."""
    src = open(os.path.join(SRC, "lib", "terms-content.ts"), encoding="utf-8").read()
    raw = re.search(r"TERMS_BLOCKS: TermsBlock\[\] = (\[.*?\n\]);", src, re.S).group(1)
    return json.loads(raw)


WM_TERMS = [
    ("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.05"),
    ("lantern", "left:-4rem;top:12%;width:clamp(200px,26vw,420px);opacity:0.05"),
    ("mask", "left:-4rem;top:25%;width:clamp(220px,28vw,460px);opacity:0.05"),
    ("eyes", "right:-3rem;top:36%;width:clamp(200px,26vw,420px);opacity:0.05"),
    ("ramen", "right:-3rem;top:50%;width:clamp(220px,28vw,460px);opacity:0.05"),
    ("komodo-dragon", "left:-4rem;top:56%;width:clamp(240px,32vw,520px);opacity:0.05"),
    ("good-vibes", "right:-4rem;top:68%;width:clamp(220px,28vw,460px);opacity:0.05"),
    ("bali-flower", "left:-4rem;top:75%;width:clamp(220px,28vw,460px);opacity:0.05"),
    ("peru-bird", "left:-4rem;top:88%;width:clamp(200px,26vw,440px);opacity:0.05"),
    ("community", "right:-3rem;top:92%;width:clamp(220px,28vw,460px);opacity:0.05"),
    ("tru-logo", "right:-4rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.04"),
]


def terms_conditions():
    prose = "\n".join(
        f'        <h2 class="ess-terms__h">{html.escape(b["text"])}</h2>'
        if b["type"] == "h" else
        f'        <p class="ess-terms__p">{html.escape(b["text"])}</p>'
        for b in terms_blocks()
    )
    body = f"""{hero("https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg",
                     "TruTravels adventure",
                     "Essentials &middot; The Nitty Gritty",
                     "Terms &amp;", "Conditions",
                     "The important bit &mdash; please give it a read before you book.")}

    <section class="ess-body ess-body--terms">
{watermarks(WM_TERMS)}
      <div class="ess-col">
{prose}

        <div class="ess-terms__foot">
          <a class="ess-toplink" href="#top">{ARROW_UP}Take Me To The Top</a>
        </div>
      </div>
    </section>"""
    return shell(
        "Terms &amp; Conditions",
        "TruTravels booking terms and conditions — the nitty gritty information you need before you book.",
        body,
    )


# ------------------------------------------------------------------ write --
PAGES = {
    "travel-insurance.html": travel_insurance,
    "visas-and-passports.html": visas_and_passports,
    "terms-conditions.html": terms_conditions,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        out = fn()
        open(os.path.join(BASE, name), "w", encoding="utf-8").write(out)
        print(f"  wrote {name}  ({len(out.splitlines())} lines)")
