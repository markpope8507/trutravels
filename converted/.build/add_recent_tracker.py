"""
Record a trip view, so explore.html's "Pick Up Where You Left Off" has data.

    python3 converted/.build/add_recent_tracker.py

THE RAIL WAS NEVER BROKEN — IT WAS NEVER FED. explore.html already ships the
markup, the CSS and the hydration script for Recently Viewed, and it reads
localStorage['trutravels-recent']. Nothing in converted/ ever wrote that key,
so the rail stayed `hidden` on every visit and read as missing from the design.

This is the other half: the static twin of src/components/track-trip-view.tsx.
It puts `data-trip-id` on each trip detail page and injects the four lines that
push that id onto the front of the list, de-duplicated and capped at six —
the same shape the Next app writes, so a traveller moving between the two sees
one history rather than two.

THE SCRIPT IS SLICED FROM components/recently-viewed.html, between its tracker
markers, so the demo in the library and the thing on the trip pages are the
same bytes.

ONE ENTRY PER TRIP PAGE. converted/ has a single built trip page today; a page
the backend generates needs the same attribute and script, or the key set
server-side. Add it to TRIP_PAGES when another one is built.

Idempotent — a page that already carries the tracker is skipped.
"""

import os

from shell import BASE

COMPONENT = os.path.join(BASE, "components", "recently-viewed.html")
MARK_A = "<!-- THE TRACKER — THIS IS THE PIECE THAT IS MISSING                     -->"
MARK_B = "<!-- COPY TO HERE                                                        -->"

# page -> the trip id it should record. The ids are `trips[].id` in data.ts and
# the TRIPS literal, which is what the rail looks up.
TRIP_PAGES = {
    "thailand-island-hopper.html": "thailand-island-hopper",
}


def tracker():
    src = open(COMPONENT, encoding="utf-8").read()
    a = src.index(MARK_A) + len(MARK_A)
    blk = src[a:src.index(MARK_B, a)].strip("\n")
    if "trutravels-recent" not in blk or "<script>" not in blk:
        raise SystemExit("add_recent_tracker: sliced block is not the tracker")
    return "\n" + blk + "\n"


def main():
    blk = tracker()
    added = skipped = 0
    for fn, trip_id in sorted(TRIP_PAGES.items()):
        p = os.path.join(BASE, fn)
        if not os.path.exists(p):
            print("  %-40s missing, skipped" % fn)
            continue
        html = open(p, encoding="utf-8").read()
        before = html

        if "data-trip-id" not in html:
            if "<body>" not in html:
                print("  %-40s no plain <body>, left alone" % fn)
                continue
            html = html.replace("<body>", '<body data-trip-id="%s">' % trip_id, 1)

        if "trutravels-recent" in html:
            skipped += 1
        else:
            html = html.replace("</body>", blk + "</body>", 1)
            added += 1

        if html != before:
            open(p, "w", encoding="utf-8").write(html)

    print("  tracker on %d trip page(s), %d already had it" % (added, skipped))


if __name__ == "__main__":
    main()
