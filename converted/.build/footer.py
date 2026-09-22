"""
The footer's link columns, and the job of getting them onto every page.

  python3 converted/.build/footer.py          # rewrite every page's footer
  python3 converted/.build/footer.py --check  # report, change nothing

WHY THIS EXISTS
The footer is copied into all 50 static pages. Every previous change to it —
wiring the dead links, adding Share Your Photos — was 50 hand edits, and the
pages drifted: several were a revision behind. COLUMNS below is now the one
definition, this script renders it into explore.html (which shell.py chunks
for every future page) and then copies that whole <footer> over the rest.

Mirrors FOOTER_COLUMNS in src/components/footer.tsx. Change one, change both.

THE COLUMN HEADING IS A LINK to that section's hub. Partners isn't in the main
nav, so before /partners existed the hub had no way in from here at all.

A "#" href means this build genuinely has no such page yet. It renders as a
dead link on purpose — the prototype has the page, this mirror doesn't, and
pointing it at something else would be worse than pointing it nowhere.
"""

import os
import re
import sys

from shell import BASE, chunk

AGENT_PORTAL_URL = "https://sherpa.gtravelcommunity.com/login/"

# (title, hub href, [(name, href) or (name, href, "external")])
COLUMNS = [
    ("Explore", "explore.html", [
        ("All Trips", "all-trips.html"),
        ("Travel Styles", "#"),
        ("Life Moments", "#"),
        ("How It Works", "#"),
        ("Deals", "deals.html"),
        ("Stories", "stories.html"),
        ("VIP Club", "#"),
        ("My Account", "my-account.html"),
    ]),
    ("About", "about.html", [
        ("Our Story", "about-our-story.html"),
        ("Our Values", "about-our-values.html"),
        ("Our Impact", "about-our-impact.html"),
        ("Our Community", "about-our-community.html"),
        ("Our Brand", "about-our-brand.html"),
        ("Contact Us", "#"),
        ("Careers", "join-the-crew.html"),
    ]),
    ("Essentials", "essentials.html", [
        ("Help &amp; Support", "#"),
        ("Travel Insurance", "travel-insurance.html"),
        ("Visa &amp; Passport", "visas-and-passports.html"),
        ("Package Travel Regulations", "terms-conditions.html"),
        ("Book With Confidence", "#"),
        ("Share Your Photos", "share-your-photos.html"),
    ]),
    # Mirrors src/lib/partner-pages.ts, the list /partners renders too.
    ("Partners", "partners.html", [
        ("Partner With Us", "partner-with-us.html"),
        ("Tru Affiliates", "affiliates.html"),
        ("Host A Trip", "host-a-trip.html"),
        ("Agent Registration", "agent-registration.html"),
        ("Agents Login", AGENT_PORTAL_URL, "external"),
    ]),
]

CHEV = ('<svg class="footer__chev" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')

# The arrow that says a link leaves the site, before the click rather than after.
OUT = ('<svg class="footer__out" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5"/></svg>')


def link(item):
    name, href = item[0], item[1]
    if len(item) > 2 and item[2] == "external":
        return f'<li><a href="{href}" target="_blank" rel="noopener noreferrer">{name}{OUT}</a></li>'
    return f'<li><a href="{href}">{name}</a></li>'


def items(links):
    return "".join(link(i) for i in links)


def grid():
    cols = "".join(
        f'<div class="footer__col"><h4 class="footer__col-h"><a href="{hub}">{title}</a></h4>'
        f'<ul class="footer__col-list">{items(links)}</ul></div>'
        for title, hub, links in COLUMNS
    )
    return f'<div class="footer__cols-grid">{cols}</div>'


def accordions():
    accs = "".join(
        f'<div class="footer__acc"><button class="footer__acc-btn" data-facc>{title}{CHEV}</button>'
        f'<div class="footer__acc-body" hidden><ul class="footer__col-list">'
        f'<li><a href="{hub}">All {title}</a></li>{items(links)}</ul></div></div>'
        for title, hub, links in COLUMNS
    )
    return f'<div class="footer__accordions">{accs}</div>'


def _swap(html, marker, new):
    """Replace one balanced <div class="marker"> … </div> region."""
    i = html.index(f'<div class="{marker}">')
    depth, j = 0, i
    while True:
        m = re.compile(r"</?div\b").search(html, j)
        depth += 1 if m.group(0) == "<div" else -1
        j = m.end()
        if depth == 0:
            j = html.index(">", j) + 1
            break
    return html[:i] + new + html[j:]


def canonical(write=True):
    """explore.html's footer, rebuilt from COLUMNS. shell.py chunks this one,
    so every page built from now on inherits it. --check must not touch it,
    hence `write`."""
    p = os.path.join(BASE, "explore.html")
    html = open(p, encoding="utf-8").read()
    html = _swap(html, "footer__cols-grid", grid())
    html = _swap(html, "footer__accordions", accordions())
    if not write:
        # chunk() keeps the tag's leading indentation, so this must too or
        # --check reports every page as stale against a string that differs
        # only in two spaces.
        i = html.index("<footer")
        return _balanced_footer(html, html.rindex("\n", 0, i) + 1)
    open(p, "w", encoding="utf-8").write(html)
    return chunk("explore.html", "<footer", tag="footer")


def _balanced_footer(html, i):
    depth, j = 0, i
    while True:
        m = re.compile(r"</?footer\b").search(html, j)
        depth += 1 if m.group(0) == "<footer" else -1
        j = m.end()
        if depth == 0:
            return html[i:html.index(">", j) + 1]


def pages():
    return sorted(f for f in os.listdir(BASE) if f.endswith(".html"))


if __name__ == "__main__":
    check = "--check" in sys.argv
    good = canonical(write=not check)
    same = changed = none = 0
    for f in pages():
        p = os.path.join(BASE, f)
        html = open(p, encoding="utf-8").read()
        if "<footer" not in html:
            print(f"  {f:<46} no footer")
            none += 1
            continue
        old = chunk(f, "<footer", tag="footer")
        if old == good:
            same += 1
            continue
        changed += 1
        print(f"  {f:<46} {'would update' if check else 'updated'}")
        if not check:
            open(p, "w", encoding="utf-8").write(html.replace(old, good))
    print(f"\n  {changed} updated, {same} already current, {none} with no footer")
