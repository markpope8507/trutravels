"""
Put the breadcrumb bar on every static page.

WHY THIS IS A POST-BUILD STEP AND NOT TEN BUILDER EDITS
Ten builders write these pages, several pages are hand-maintained, and the
mapping between the two is not reliably discoverable — grepping for a filename
finds builders that merely mention it. Editing all of them would mean ten
chances to get it wrong and no single place to read the answer. This runs after
whatever else ran, is idempotent, and holds every trail in one list.

    python3 converted/.build/apply_crumbs.py

Re-run it after any builder. A page that already carries a bar is skipped, so
running it twice does nothing.

Trails mirror src/lib/breadcrumbs.ts — structure from the MAIN NAV, falling
back to the FOOTER for pages the nav doesn't carry. Keep the two in step.
"""

import os
import re
import sys

from shell import BASE
from crumbs import (
    bar, top, section, about, essentials, trip,
    ABOUT, ACCOUNT, EXPLORE, STORIES, PARTNERS, DESTINATIONS,
)

IMPACT = ("Our Impact", "about-our-impact.html")

# Pages with no trail, and why:
#   index          it IS home
#   404            not a place in the hierarchy
#   login/signup/reset-password   auth, no parent to climb to
#   checkout*/booking-processing  a flow; a breadcrumb invites you to leave it
SKIP = {
    "index.html", "404.html", "login.html", "signup.html", "reset-password.html",
    "checkout.html", "checkout-empty.html", "booking-processing.html",
}

TRAILS = {
    "about.html": top("About Us"),
    "about-our-story.html": about("Our Story"),
    "about-our-values.html": about("Our Values"),
    "about-our-impact.html": about("Our Impact"),
    "about-our-community.html": about("Our Community"),
    "about-our-brand.html": about("Our Brand"),
    "about-our-impact-bang-lamphu-community.html": [("Home", "index.html"), ABOUT, IMPACT, ("Bang Lamphu Community", None)],
    "about-our-impact-horses-of-gili.html": [("Home", "index.html"), ABOUT, IMPACT, ("Horses Of Gili", None)],
    "about-our-impact-the-art-house-marrakech.html": [("Home", "index.html"), ABOUT, IMPACT, ("The Art House Marrakech", None)],
    "join-the-crew.html": about("Careers"),

    "deals.html": top("Deals"),
    # These bake their own bar in (build_hubs.py, build_email_signup.py) —
    # listed so the missing-trail check doesn't flag them.
    "email-sign-up.html": top("Email Sign Up"),
    "partners.html": top("Partners"),
    "agent-registration.html": section(PARTNERS, "Agent Registration"),
    "destinations.html": top("Destinations"),
    "essentials.html": top("Essentials"),
    "explore.html": top("Explore"),
    "all-trips.html": section(EXPLORE, "All Trips"),
    "stories.html": top("Stories"),

    "thailand.html": [("Home", "index.html"), DESTINATIONS, ("Asia", None), ("Thailand", None)],
    "thailand-island-hopper.html": trip("Asia", "Thailand", "thailand.html", "Thailand Island Hopper"),
    # The pre-launch template — the same tour, before it goes on sale, so the
    # same trail. Built by build_prelaunch.py from the page above.
    "tour-coming-soon.html": trip("Asia", "Thailand", "thailand.html", "Thailand Island Hopper"),

    "travel-insurance.html": essentials("Travel Insurance"),
    "visas-and-passports.html": essentials("Visa &amp; Passports"),
    "terms-conditions.html": essentials("Booking Conditions"),
    "share-your-photos.html": essentials("Share Your Photos"),
    "student-discount.html": essentials("Student Discount"),

    "partner-with-us.html": section(PARTNERS, "Partner With Us"),
    "affiliates.html": section(PARTNERS, "Tru Affiliates"),
    "host-a-trip.html": section(PARTNERS, "Host A Trip"),

    "my-account.html": section(ACCOUNT, "Dashboard"),
    "my-account-bookings.html": section(ACCOUNT, "My Bookings"),
    "my-account-profile.html": section(ACCOUNT, "My Profile"),
    "my-account-saved.html": section(ACCOUNT, "Saved Trips"),
}

# Stories and author pages are named by their own <title>, rather than 15 more
# lines that would need editing every time one is written or renamed.
def _derive(pages):
    for f, html in pages:
        if f.startswith("story-"):
            TRAILS[f] = section(STORIES, title_of(html))
        elif f.startswith("author-"):
            TRAILS[f] = section(STORIES, title_of(html))

# Every hero this site opens on. The bar goes directly below whichever one the
# page uses; a page with none gets the --nohero variant, which pads past the
# floating nav.
HEROES = ("ess-hero", "art-hero", "exp-hero", "author-hero", "ab-chero", "deals-hero", "acct-hero")


def title_of(html):
    """The page's own name, with the site suffix off. Titles use a literal
    em-dash here and the &mdash; entity elsewhere — strip both, or the crumb
    reads "Sophie Chen — TruTravels"."""
    m = re.search(r"<title>(.*?)</title>", html, re.S)
    if not m:
        return "?"
    t = m.group(1)
    for suffix in (" &mdash; TruTravels", " \u2014 TruTravels", " | TruTravels"):
        t = t.replace(suffix, "")
    return t.strip()


def balanced_close(lines, i, tag="section"):
    d = 0
    for k in range(i, len(lines)):
        d += lines[k].count("<" + tag) - lines[k].count("</" + tag + ">")
        if d == 0:
            return k
    raise ValueError(f"unbalanced <{tag}> from line {i + 1}")


def hero_end(lines):
    """Line index of the </section> closing the page's hero, or None."""
    for i, l in enumerate(lines):
        if "<section" in l and any(f'"{h}' in l or f" {h}" in l for h in HEROES):
            return balanced_close(lines, i)
    return None


def insert(path, crumbs, force=False):
    html = open(path, encoding="utf-8").read()
    existing = re.search(r'[ \t]*<nav class="crumbs[^"]*" aria-label="Breadcrumb">[\s\S]*?</nav>', html)
    if existing:
        if not force:
            return "already has one"
        # Rebuild in place, keeping whichever variant it had. Needed whenever a
        # trail changes — a section gaining a page, say — since every bar is
        # baked into the HTML rather than rendered at request time.
        nohero = "crumbs--nohero" in existing.group(0)
        new = bar(crumbs, nohero=nohero)
        if new.strip() == existing.group(0).strip():
            return "unchanged"
        open(path, "w", encoding="utf-8").write(html[: existing.start()] + new + html[existing.end():])
        return "rebuilt"

    # The trip page carries the old bespoke .breadcrumb bar — replace it, don't
    # end up with two.
    old = re.search(r'[ \t]*<!-- =+ BREADCRUMB =+ -->\n[ \t]*<nav class="breadcrumb"[\s\S]*?</nav>\n', html)
    if old:
        html = html[: old.start()] + bar(crumbs) + "\n" + html[old.end():]
        open(path, "w", encoding="utf-8").write(html)
        return "replaced the old bespoke bar"

    lines = html.split("\n")
    end = hero_end(lines)
    if end is not None:
        lines.insert(end + 1, bar(crumbs))
        where = "after the hero"
    else:
        anchor = next((i for i, l in enumerate(lines) if "<main" in l), None)
        if anchor is None:
            anchor = next(i for i, l in enumerate(lines) if "</header>" in l)
        lines.insert(anchor + 1, bar(crumbs, nohero=True))
        where = "no hero, padded past the nav"
    open(path, "w", encoding="utf-8").write("\n".join(lines))
    return where


if __name__ == "__main__":
    # --force rebuilds bars that are already there, for when a trail changes.
    force = "--force" in sys.argv
    pages = sorted(f for f in os.listdir(BASE) if f.endswith(".html"))
    _derive([(f, open(os.path.join(BASE, f), encoding="utf-8").read()) for f in pages])
    missing = [f for f in pages if f not in TRAILS and f not in SKIP]
    done = 0
    for f in pages:
        if f in SKIP:
            continue
        if f not in TRAILS:
            continue
        print(f"  {f:<46} {insert(os.path.join(BASE, f), TRAILS[f], force)}")
        done += 1
    print(f"\n  {done} pages, {len(SKIP)} deliberately skipped")
    if missing:
        print(f"\n  NO TRAIL DEFINED for {len(missing)}:")
        for f in missing:
            print(f"    {f:<46} {title_of(open(os.path.join(BASE, f), encoding='utf-8').read())}")
        sys.exit(1)
