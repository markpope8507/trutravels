"""
Breadcrumb trails for the static build.

Mirrors src/lib/breadcrumbs.ts and src/components/breadcrumbs.tsx. If you
change a trail there, change it here — the two builds should never disagree
about where a page lives.

THE RULES
 1. Every trail starts at Home.
 2. Every trail ends at the current page, which is never a link.
 3. A crumb with no href renders as plain text, not a dead link. Some
    ancestors have no page in this build yet; a crumb that goes nowhere is
    honest, one that quietly points somewhere else is not.

STRUCTURE comes from the MAIN NAV, falling back to the FOOTER for pages the
nav doesn't carry — so a breadcrumb and the menus never disagree. Deals is top
level because the nav says so, even though the footer files it under Explore.
Partners, Careers, Share Your Photos and The Tru Way aren't in the nav at all,
so they follow their footer column.

    from crumbs import bar, about, essentials, section, top, ABOUT
    bar(about("Our Story"))
"""

# (name, href) — href None means "no page, render as text"
HOME = ("Home", "index.html")

# Second level.
DESTINATIONS = ("Destinations", "destinations.html")
ESSENTIALS = ("Essentials", "essentials.html")
LIFE_MOMENTS = ("Life Moments", None)
PARTNERS = ("Partners", "partners.html")

ABOUT = ("About Us", "about.html")
EXPLORE = ("Explore", "explore.html")
STORIES = ("Stories", "stories.html")
ACCOUNT = ("My Account", "my-account.html")

CHEV = "/"


def bar(crumbs, nohero=False):
    """The breadcrumb bar. `crumbs` is a list of (name, href|None); the last
    one is the current page and is always rendered as text."""
    out = []
    last = len(crumbs) - 1
    for i, (name, href) in enumerate(crumbs):
        sep = f'<span class="crumbs__sep" aria-hidden="true">{CHEV}</span>' if i else ""
        if i == last:
            body = f'<span class="current" aria-current="page">{name}</span>'
        elif href:
            body = f'<a href="{href}">{name}</a>'
        else:
            body = f'<span class="plain">{name}</span>'
        out.append(f"          <li>{sep}{body}</li>")
    items = "\n".join(out)
    cls = "crumbs crumbs--nohero" if nohero else "crumbs"
    return f'''    <nav class="{cls}" aria-label="Breadcrumb">
      <div class="container crumbs__inner">
        <ol class="crumbs__list">
{items}
        </ol>
      </div>
    </nav>'''


def top(page):
    """Home / <page>"""
    return [HOME, (page, None)]


def section(sec, page):
    """Home / <section> / <page>"""
    return [HOME, sec, (page, None)]


def about(page):
    return section(ABOUT, page)


def essentials(page):
    return section(ESSENTIALS, page)


def trip(region, country, country_href, title):
    """Home / Destinations / Asia / Thailand / <trip>"""
    return [HOME, DESTINATIONS, (region, None), (country, country_href), (title, None)]
