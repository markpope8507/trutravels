"""
Put the cookie banner and preference centre on every static page.

    python3 converted/.build/add_cookie_banner.py

WHY THIS IS A POST-BUILD STEP, like apply_crumbs.py. The banner has to be on
every page — a consent bar that only appears on the homepage is not consent —
and the pages are written by a dozen different builders plus a few that are
hand-maintained. One pass over the directory is the only place the answer
lives once.

ONE DEFINITION. The markup and the script are sliced out of
components/cookie-banner.html, between its COPY FROM/TO markers, so the demo
in the component library and the thing on the live pages are the same bytes.
Edit the component, re-run this.

IT ALSO REWIRES THE FOOTER. "Cookie Preferences" sat in the footer's legal bar
as `<a href="#">` on all 60-odd pages, because there was nothing to point at.
It becomes a button carrying `data-cookie-open`, which is what the script
listens for. explore.html is rewritten too — shell.py slices FOOTER out of it,
so missing that one would hand the dead link straight back on the next build.

IDEMPOTENT. A page that already carries the block is skipped, and the footer
swap only matches the old markup, so running it twice does nothing.
"""

import os
import re
import sys

from shell import BASE

COMPONENT = os.path.join(BASE, "components", "cookie-banner.html")
MARK_A = "<!-- COPY FROM HERE                                                     -->"
MARK_B = "<!-- COPY TO HERE                                                        -->"

OLD_LINK = '<a href="#">Cookie Preferences</a>'
NEW_LINK = '<button type="button" class="ck-prefs" data-cookie-open>Cookie Preferences</button>'

# Pages with no footer and nothing to consent to. The 404 keeps it: someone can
# land there first.
SKIP = {"components"}


def block():
    """The banner markup and script, as the component defines them."""
    src = open(COMPONENT, encoding="utf-8").read()
    a = src.index(MARK_A) + len(MARK_A)
    b = src.index(MARK_B)
    out = src[a:b].strip("\n")
    # The component sits one level down, so its links carry ../ — the pages
    # this is injected into are all at the site root.
    out = out.replace('href="../', 'href="')
    if "data-cookie-bar" not in out or "<script>" not in out:
        raise SystemExit("add_cookie_banner: sliced block is missing the bar or the script")
    return "\n" + out + "\n"


def main():
    blk = block()
    added = relinked = skipped = 0
    for fn in sorted(os.listdir(BASE)):
        if not fn.endswith(".html"):
            continue
        p = os.path.join(BASE, fn)
        html = open(p, encoding="utf-8").read()
        before = html

        if OLD_LINK in html:
            html = html.replace(OLD_LINK, NEW_LINK)
            relinked += 1

        if "data-cookie-bar" in html:
            skipped += 1
        elif "</body>" in html:
            html = html.replace("</body>", blk + "</body>", 1)
            added += 1
        else:
            print("  %-46s no </body>, left alone" % fn)

        if html != before:
            open(p, "w", encoding="utf-8").write(html)

    print("  banner added to %d pages, %d already had it" % (added, skipped))
    print("  footer link rewired on %d pages" % relinked)
    if added == 0 and relinked == 0:
        print("  (nothing to do)")


if __name__ == "__main__":
    main()
