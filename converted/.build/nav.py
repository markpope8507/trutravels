"""
Keep every page's navbar the same one.

  python3 converted/.build/nav.py          # rewrite stale navs
  python3 converted/.build/nav.py --check  # report, change nothing

WHY THIS EXISTS
thailand.html was still carrying the navbar the site had before the mega-menu
landed — a four-link bar reading "Destinations · Trips · Stories · Help" with a
Book Now button, on a page linked from the main nav of every other page. It
had been wrong for months and nothing would have caught it, because the only
signal was looking at the page.

TWO VARIANTS ARE BOTH CORRECT. `site-nav--over` is transparent, for pages
that open on a full-bleed hero; plain `site-nav` is solid, for pages that
don't. shell.py exports both. This reports a page whose header matches
NEITHER — which is what a genuinely stale nav looks like — rather than
flattening every page onto one variant.

REPORTING, NOT REWRITING. A page can legitimately vary its header (the
homepage does), so this names the odd ones out and leaves fixing them to a
human who can tell the difference. `--fix` takes the variant matching the
page's own class, for when the answer is obvious.

CHECKOUT IS SKIPPED. Those three pages carry a deliberately minimal header —
a checkout that offers a Destinations menu is a checkout with an exit.
"""

import os
import sys

from shell import BASE, NAV_OVER, NAV_SOLID, chunk

# A checkout shouldn't offer the way out. See build_account.py / checkout.html.
SKIP = {"checkout.html", "checkout-empty.html", "booking-processing.html"}


def pages():
    return sorted(f for f in os.listdir(BASE) if f.endswith(".html") and f not in SKIP)


def nav_of(f):
    """The page's own <header>, or None when it hasn't got one."""
    html = open(os.path.join(BASE, f), encoding="utf-8").read()
    if "<header" not in html:
        return None
    return chunk(f, "<header", tag="header")


if __name__ == "__main__":
    fix = "--fix" in sys.argv
    ok = odd = none = fixed = 0

    for f in pages():
        current = nav_of(f)
        if current is None:
            print(f"  {f:<46} no header")
            none += 1
            continue
        if current in (NAV_OVER, NAV_SOLID):
            ok += 1
            continue

        odd += 1
        # A transparent nav belongs on a page that opens on a full-bleed hero;
        # go by what the page already claims.
        want = NAV_OVER if "site-nav--over" in current[:120] else NAV_SOLID
        variant = "over" if want is NAV_OVER else "solid"
        note = f"matches neither variant ({len(current)} chars)"
        if fix:
            html = open(os.path.join(BASE, f), encoding="utf-8").read()
            open(os.path.join(BASE, f), "w", encoding="utf-8").write(html.replace(current, want))
            fixed += 1
            print(f"  {f:<46} {note} -> replaced with {variant}")
        else:
            print(f"  {f:<46} {note}")

    print(f"\n  {ok} current, {odd} odd" + (f" ({fixed} fixed)" if fix else "")
          + f", {none} with no header, {len(SKIP)} skipped")
