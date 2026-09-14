"""
Shared page chrome for the static generators.

The nav, footer and shared scripts live in explore.html and are sliced out of
it by line range. Those ranges are fragile — inserting or deleting a line
inside one silently shifts every generated page — so they are defined once
here rather than copied into each build script.

    from shell import NAV_OVER, NAV_SOLID, FOOTER, SCRIPTS, block

NAV_OVER is the transparent variant for pages that open on a full-bleed hero
image; NAV_SOLID is for pages that start on flat background.
"""

import os

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, "..")


def read(fn):
    return open(os.path.join(BASE, fn), encoding="utf-8").read()


def lines(fn):
    return read(fn).split("\n")


def block(fn, a, b):
    """Lines a..b of a built page, 1-indexed and inclusive."""
    return "\n".join(lines(fn)[a - 1 : b])


# --- the slices. Update these together if explore.html is restructured. ------
NAV_OVER = block("explore.html", 17, 114)
NAV_SOLID = NAV_OVER.replace(
    '<header class="site-nav site-nav--over" data-nav>', '<header class="site-nav" data-nav>'
)
FOOTER = block("explore.html", 517, 593)
SCRIPTS = block("explore.html", 594, 839)

HEAD = """  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />"""
