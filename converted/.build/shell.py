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
    """Lines a..b of a built page, 1-indexed and inclusive.

    FRAGILE. Prefer chunk()/run() below. Every line-range slice into
    index.html silently went stale when the SEO statement block was inserted
    above them — each one began and ended mid-element, and the pages built
    from them carried the wrong markup until someone happened to look.
    """
    return "\n".join(lines(fn)[a - 1 : b])


def _balanced(ls, i, tag):
    """Index of the line closing the element opened on line `i`."""
    depth = 0
    for k in range(i, len(ls)):
        depth += ls[k].count("<" + tag) - ls[k].count("</" + tag + ">")
        if depth == 0:
            return k
    raise ValueError(f"unbalanced <{tag}> from line {i + 1}")


def chunk(fn, marker, tag="section"):
    """The whole element whose opening line contains `marker`, found by reading
    the file rather than by line number — so inserting anything above it can't
    shift what comes back."""
    ls = lines(fn)
    i = next((k for k, l in enumerate(ls) if marker in l), None)
    if i is None:
        raise ValueError(f"{marker!r} not found in {fn}")
    return "\n".join(ls[i : _balanced(ls, i, tag) + 1])


def run(fn, marker, tag="div"):
    """Every sibling element whose opening line contains `marker`, from the
    first to the close of the last — the fullscreen diary viewers, which are a
    run of peers rather than one wrapper."""
    ls = lines(fn)
    hits = [k for k, l in enumerate(ls) if marker in l]
    if not hits:
        raise ValueError(f"{marker!r} not found in {fn}")
    return "\n".join(ls[hits[0] : _balanced(ls, hits[-1], tag) + 1])


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
