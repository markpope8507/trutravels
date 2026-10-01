"""
Build the static Deals page and the deal-card component.

    deals.html                    mirrors src/app/deals
    components/deal-card.html     the card on its own, for copying in

The card data comes from two places that already exist, rather than a third
hand-maintained copy: the trip fields are lifted from all-trips.html's TRIPS
(the canonical static trip data), and the departure lists are read out of
src/lib/data.ts, since the static build had no departures of its own.

Deal selection mirrors DealCard/getUpcomingDepartures: future departures that
are either flagged "discount" or priced under their originalPrice, soonest
first. The headline roundel shows the deepest discount across all of them,
which is not necessarily the next one.

Styling lives in ../styles.css under .deal-*.

Run:  python3 converted/.build/build_deals.py
"""

import html, json, os, re
from datetime import date, timedelta

from shell import BASE, read, block, NAV_OVER, FOOTER, SCRIPTS, HEAD

SRC = os.path.join(BASE, "..", "src")

TRIPS = json.loads(re.search(r"var TRIPS = (\[.*?\]);\n", read("all-trips.html"), re.S).group(1))
TRIPS_BY_ID = {t["id"]: t for t in TRIPS}


MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def bracket_end(s, i):
    """Index just past the bracket or brace that opens at `s[i]`.

    WHY NOT ANCHOR ON THE NEXT KEY. departures_by_trip() used to end the
    departures array by matching `departures: [...] , itinerary`. Most trips
    do list itinerary next, but thailand-island-hopper lists depositPrice, so
    the lazy `[.*?]` ran past the real `]` to a later one and the whole trip
    was dropped on a JSONDecodeError — which is why the static page had no
    Thailand Island Hopper while the prototype did. Matching the bracket is
    the only ending that holds whatever follows it.
    """
    open_c = s[i]
    close_c = {"[": "]", "{": "}"}[open_c]
    depth, quote = 0, None
    while i < len(s):
        c = s[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == open_c:
            depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise SystemExit(f"build_deals: unbalanced {open_c!r} in lib/data.ts")


def trip_objects():
    """Each top-level object in the prototype's `trips` array, brace-matched.

    WHY NOT A REGEX. This used to scan for every `id: "..."` in the array and
    look 6000 characters ahead for a `departures:` block. Trips carry nested
    ids — experience types, itinerary days, bucket-list items — so most of
    those matches weren't trips at all, and the look-ahead kept running into
    the NEXT trip's departures. 26 trips came back holding other trips'
    sale dates; the prototype has 7 with departures. The deals page was
    advertising dates that don't exist.
    """
    s = open(os.path.join(SRC, "lib", "data.ts"), encoding="utf-8").read()
    seg = s[s.index("export const trips: Trip[] = ["):]
    # Start on the array's own "[", not the one in the `Trip[]` annotation.
    # That one is closed by the very next character, so the walk below hit
    # `]` at depth 0 on its second step and returned an empty list — which
    # generated a deals page with no cards and an empty sidebar.
    depth, start, i, quote = 0, None, seg.index("= [") + 2, None
    out = []
    while i < len(seg):
        c = seg[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            if depth == 0:
                start = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                out.append(seg[start:i + 1])
        elif c == "]" and depth == 0:
            break
        i += 1
    if not out:
        raise SystemExit("build_deals: parsed no trips out of lib/data.ts")
    return out


def trip_fields(obj):
    """One trip's own scalar fields — depth 1 only.

    Depth matters: a trip's itinerary days, experience types and departures
    all carry their own `id` and `price`, and a plain search would return
    whichever came first in the text rather than the trip's own.
    """
    out = {}
    depth, quote, i = 0, None, 0
    while i < len(obj):
        c = obj[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
        elif depth == 1 and (i == 0 or obj[i - 1] in " \n,{"):
            m = re.match(r'([A-Za-z_]\w*):\s*(\d+|"(?:[^"\\]|\\.)*")', obj[i:])
            if m:
                v = m.group(2)
                out[m.group(1)] = int(v) if v.isdigit() else v[1:-1]
                i += m.end()
                continue
        i += 1
    return out


def trips_from_data():
    """trip id -> {"fields", "departures"}, straight off the prototype's data.

    Region has to come from here. all-trips.html's TRIPS literal still
    carried the names the site used before the groups were redrawn, so
    reading region from there put retired names in the deals filter. The
    display fields stay on the literal (see the module docstring) — only the
    things the literal gets wrong or doesn't have are read from lib/data.ts.
    """
    out = {}
    for obj in trip_objects():
        f = trip_fields(obj)
        tid = f.get("id")
        if not tid:
            continue
        deps, k = [], obj.find("departures:")
        if k > -1:
            b = obj.index("[", k)
            raw = obj[b:bracket_end(obj, b)]
            raw = re.sub(r"(\{|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', raw)
            raw = re.sub(r",(\s*[\]}])", r"\1", raw)
            deps = json.loads(raw)
        out[tid] = {"fields": f, "departures": deps}
    return out


DATA = trips_from_data()
DEPARTURES = {k: v["departures"] for k, v in DATA.items()}


def fmt(d: date):
    return f"{d.day:02d} {MONTHS[d.month - 1]} {d.year}"


def deal_departures(trip_id, days):
    """Future departures that are actually on sale, soonest first."""
    today = date.today()
    out = []
    for d in DEPARTURES.get(trip_id, []):
        start = date.fromisoformat(d["date"])
        if d.get("status") == "full" or start < today:
            continue
        orig = d.get("originalPrice")
        if not (d.get("status") == "discount" or (orig and orig > d["price"])):
            continue
        out.append({
            "start": start,
            "end": start + timedelta(days=max(days, 1) - 1),
            "price": d["price"],
            "originalPrice": orig,
            "save": round((orig - d["price"]) / orig * 100) if orig and orig > d["price"] else 0,
        })
    return sorted(out, key=lambda d: d["start"])


# ------------------------------------------------------------------ icons --
PIN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')
CAL = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>'
       '<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>')
ACT = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>')
STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
CHEV_D = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')
HEART = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
         '<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>')



def departure_row(d, href, first=False):
    save = f'{d["save"]}%' if d["save"] else "&nbsp;"
    return f'''          <div class="deal-dep">
            <div class="deal-dep__cols">
              <div class="deal-dep__c deal-dep__c--date"><p class="deal-dep__k">Start</p><p class="deal-dep__v">{fmt(d["start"])}</p></div>
              <div class="deal-dep__c deal-dep__c--date"><p class="deal-dep__k">End</p><p class="deal-dep__v">{fmt(d["end"])}</p></div>
              <div class="deal-dep__c deal-dep__c--save"><p class="deal-dep__k deal-dep__k--save">Save</p><p class="deal-dep__v deal-dep__v--save">{save}</p></div>
              <div class="deal-dep__c deal-dep__c--price"><p class="deal-dep__k">Price</p><p class="deal-dep__v">&pound;{d["price"]}</p></div>
            </div>
            <a class="deal-go" href="{href}">Go &rarr;</a>
          </div>'''


def deal_card(trip, deps, idx, region):
    """One deal card. `idx` keys the more-dates checkbox so it toggles alone."""
    best = max(deps, key=lambda d: d["save"])
    nxt = deps[0]
    more = deps[1:]
    days = trip.get("days") or 1
    per_day = round(best["price"] / max(days, 1))
    href = f'{trip["id"]}.html' if os.path.exists(os.path.join(BASE, f'{trip["id"]}.html')) else "explore.html"

    roundel = ""
    if best["save"] > 0:
        roundel = f'''<span class="deal-roundel"><span class="deal-roundel__up">Up to</span><span class="deal-roundel__pc">{best["save"]}%</span><span class="deal-roundel__off">Off</span></span>'''

    was = (f'<span class="deal-price__was">&pound;{best["originalPrice"]}</span>'
           if best.get("originalPrice") and best["originalPrice"] != best["price"] else "")

    stars = "".join(f'<span class="deal-star">{STAR}</span>' for _ in range(5))
    rating = ""
    if trip.get("rating"):
        rating = (f'<div class="deal-rating">{stars}'
                  f'<span class="deal-rating__v">{trip["rating"]}</span>'
                  f'<span class="deal-rating__n">({trip["reviewCount"]} Reviews)</span></div>')

    facts = [f'<span class="deal-fact">{CAL}{trip["duration"]}</span>']
    if trip.get("places"):
        facts.append(f'<span class="deal-fact">{PIN}{trip["places"]} {"Place" if trip["places"] == 1 else "Places"}</span>')
    if trip.get("activities"):
        facts.append(f'<span class="deal-fact">{ACT}{trip["activities"]} {"Activity" if trip["activities"] == 1 else "Activities"}</span>')

    # Same markup the trip cards use, so the two stay one implementation.
    exp = ""
    if trip.get("expTypes"):
        pills = "".join(
            f'<div class="exp-ico"><img src="assets/experience-icons/{e["icon"]}.png" alt="" aria-hidden="true" />'
            f'<span class="name">{e["name"]}</span><span class="count">{e["count"]}</span></div>'
            for e in trip["expTypes"]
        )
        cb = f"deal-exp-{trip['id']}"
        exp = (f'<div class="tripcard__exp"><input type="checkbox" id="{cb}" class="tripcard__exp-cb" />'
               f'<label class="tripcard__exp-sum" for="{cb}"><span>TRU Experience Types &middot; '
               f'<span class="tripcard__exp-count">{trip.get("activities", 0)} activities</span></span>{CHEV_D}</label>'
               f'<div class="tripcard__exp-wrap"><div class="tripcard__exp-inner">'
               f'<div class="tripcard__pills">{pills}</div></div></div></div>')

    more_block = ""
    if more:
        rows = "\n".join(departure_row(d, href) for d in more)
        more_block = f'''
      <div class="deal-more">
        <input class="deal-more__cb" id="dm-{idx}" type="checkbox" />
        <label class="deal-more__open" for="dm-{idx}">More Dates <span>&middot; {len(more)} on sale</span>{CHEV_D}</label>
        <div class="deal-more__inner">
          <div class="deal-more__rows">
{rows}
            <label class="deal-more__close" for="dm-{idx}">Hide Dates{CHEV_D}</label>
          </div>
        </div>
      </div>'''

    return f'''      <article class="deal" data-region="{html.escape(region)}" data-days="{days}" data-price="{trip.get("price") or 0}" data-rating="{trip.get("rating") or 0}" data-discount="{trip.get("save") or 0}" data-next="{nxt["start"].isoformat()}">
        <div class="deal__top">
          <div class="deal__media">
            <a class="deal__imglink" href="{href}">
              <img src="{trip["image"]}" alt="{trip["title"]}" loading="lazy" />
              <span class="deal__scrim"></span>
              <img class="deal__style" src="assets/{trip["styleLogo"]}.png" alt="{trip["styleLabel"]}" />
              {roundel}
            </a>
            <button class="deal__save" type="button" data-fav="{trip["id"]}" aria-label="Save {trip["title"]}">{HEART}</button>
          </div>

          <div class="deal__body">
            <div class="deal__head">
              <a class="deal__titlelink" href="{href}"><h3 class="deal__title">{trip["title"]}</h3></a>
              <div class="deal__price">
                <span class="deal-price__row">{was}<span class="deal-price__now">&pound;{best["price"]}</span></span>
                <p class="deal-price__perday"><span>&pound;{per_day}</span> per day</p>
              </div>
            </div>
            <p class="deal__route">{PIN}{trip["start"]} &mdash; {trip["end"]}</p>
            {rating}
            <p class="deal__tagline">{trip["tagline"]}</p>
            <div class="deal__facts">{"".join(facts)}</div>
            {exp}
          </div>
        </div>

        <div class="deal-deps">
          <p class="deal-deps__eyebrow">Departures</p>
          <p class="deal-deps__h">On Sale</p>
{departure_row(nxt, href, first=True)}
        </div>{more_block}
      </article>'''


def deals():
    """Rendered cards plus the metadata the sidebar needs to build its filters."""
    rows = []
    for trip in TRIPS:
        fields = DATA.get(trip["id"], {}).get("fields", {})
        # The same gate as deals-browser.tsx: a trip-level originalPrice AND
        # at least one departure actually on sale. Every qualifying trip has
        # an originalPrice today, so this changes nothing now — it is here so
        # the two implementations can't drift apart quietly.
        if not fields.get("originalPrice"):
            continue
        deps = deal_departures(trip["id"], trip.get("days") or 1)
        if not deps:
            continue
        rows.append((trip, deps, fields.get("region", "")))

    # Emit in the default sort order ("Earliest Departure"), so the page isn't
    # written in one order and then reshuffled by the filter script on load.
    rows.sort(key=lambda r: r[1][0]["start"])

    cards, meta = [], []
    for n, (trip, deps, region) in enumerate(rows, 1):
        cards.append(deal_card(trip, deps, n, region))
        meta.append({"region": region, "days": trip.get("days") or 1})
    return cards, meta


# --------------------------------------------------------------- the page --
# The five groups the live nav uses, in the prototype's order. Mirrors REGIONS
# in src/components/deals-browser.tsx, which mirrors `regions` in lib/data.
# Deliberately fixed rather than derived: two of them (Africa & Middle East,
# Oceania) have no deals and show the empty state, exactly as the prototype
# does. Deriving the list instead hid controls the prototype shows.
REGIONS = ["Asia", "Central & South America", "Europe", "Africa & Middle East", "Oceania"]

PRICE_MIN, PRICE_MAX = 300, 2500
PAGE_SIZE = 6


def region_counts(cards_meta):
    """Deals per region — for the build log, not the page."""
    counts = {}
    for m in cards_meta:
        counts[m["region"]] = counts.get(m["region"], 0) + 1
    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))


def sidebar(cards_meta):
    count = len(cards_meta)
    days = [m["days"] for m in cards_meta] or [0]
    lo, hi = min(days), max(days)

    sorts = "\n".join(
        f'              <option value="{v}">{l}</option>'
        for v, l in [
            ("earliest", "Earliest Departure"),
            ("latest", "Latest Departure"),
            ("price-high", "Price: High to Low"),
            ("price-low", "Price: Low to High"),
            ("highest-rated", "Highest Rated"),
            ("highest-discount", "Saving Amount: High to Low"),
        ]
    )
    regions = "\n".join(
        f'          <label class="deal-opt deal-opt--check">'
        f'<input type="checkbox" name="deal-region" value="{html.escape(r, quote=True)}" />'
        f'<span>{html.escape(r)}</span></label>'
        for r in REGIONS
    )
    return f'''      <aside class="deal-side">
        <div class="deal-side__top">
          <p class="deal-side__h">Filter Results</p>
          <button class="deal-side__clear" type="button" data-deal-reset data-deal-reset-auto hidden>Clear</button>
        </div>
        <p class="deal-side__count">Found <b data-deal-count>{count}</b> <span data-deal-noun>results</span></p>

        <div class="deal-side__grp">
          <p class="deal-side__label">Sort By</p>
          <div class="deal-select">
            <select data-deal-sort aria-label="Sort deals">
{sorts}
            </select>{CHEV_D}
          </div>
        </div>

        <div class="deal-side__grp">
          <div class="deal-range">
            <div class="deal-range__head">
              <span class="deal-side__label" style="margin:0">Your Budget</span>
              <span class="deal-range__val" data-deal-budget-out>up to &pound;{PRICE_MAX}+</span>
            </div>
            <input type="range" min="{PRICE_MIN}" max="{PRICE_MAX}" step="50" value="{PRICE_MAX}" data-deal-budget aria-label="Maximum price" />
            <div class="deal-range__scale"><span>&pound;{PRICE_MIN}</span><span>&pound;{PRICE_MAX}+</span></div>
          </div>
        </div>

        <div class="deal-side__grp">
          <div class="deal-range__head">
            <span class="deal-side__label" style="margin:0">Length</span>
            <span class="deal-range__val" data-deal-len-out>{lo} &ndash; {hi} days</span>
          </div>
          <div class="rs" data-rs data-rs-min="{lo}" data-rs-max="{hi}">
            <div class="rs__track"><div class="rs__fill" data-rs-fill></div></div>
            <input class="rs__in" type="range" min="{lo}" max="{hi}" step="1" value="{lo}" data-rs-lo aria-label="Minimum trip length" />
            <input class="rs__in" type="range" min="{lo}" max="{hi}" step="1" value="{hi}" data-rs-hi aria-label="Maximum trip length" />
          </div>
        </div>

        <div class="deal-side__grp">
          <p class="deal-side__label">Region</p>
{regions}
        </div>

        <button class="deal-clear" type="button" data-deal-reset data-deal-reset-auto hidden>Clear Filters (<span data-deal-active>0</span>)</button>
      </aside>'''


FILTER_JS = """
  <script>/* Deals filtering, sorting and paging. No framework — each card
     carries its region / length / price / rating / discount / next departure
     in data attributes and is shown or hidden in place. Mirrors
     src/components/deals-browser.tsx: same filters, same six sorts, same
     page size, same clamping on the two-handle length slider. */
  (function () {
    var list = document.querySelector('[data-deal-list]');
    if (!list) return;

    var PAGE_SIZE = 6;
    var cards = [].slice.call(list.querySelectorAll('.deal'));
    var countEl = document.querySelector('[data-deal-count]');
    var nounEl = document.querySelector('[data-deal-noun]');
    var empty = document.querySelector('[data-deal-empty]');
    var activeEl = document.querySelector('[data-deal-active]');
    var resets = [].slice.call(document.querySelectorAll('[data-deal-reset-auto]'));

    var budget = document.querySelector('[data-deal-budget]');
    var budgetOut = document.querySelector('[data-deal-budget-out]');
    var PRICE_MAX = budget ? +budget.max : 2500;

    var rs = document.querySelector('[data-rs]');
    var rsLo = rs && rs.querySelector('[data-rs-lo]');
    var rsHi = rs && rs.querySelector('[data-rs-hi]');
    var rsFill = rs && rs.querySelector('[data-rs-fill]');
    var lenOut = document.querySelector('[data-deal-len-out]');
    var DAY_MIN = rs ? +rs.dataset.rsMin : 0;
    var DAY_MAX = rs ? +rs.dataset.rsMax : 0;

    var shown = PAGE_SIZE;   /* how many of the matching cards are visible */

    function dayRange() {
      if (!rs) return [DAY_MIN, DAY_MAX];
      return [Math.min(+rsLo.value, +rsHi.value), Math.max(+rsLo.value, +rsHi.value)];
    }

    /* The handles can touch but never cross. Once both sit at the top of the
       range the max thumb covers the min one, so the min input is raised to
       stay draggable — the same fix range-slider.tsx makes. */
    function paintSlider() {
      if (!rs) return;
      var r = dayRange(), span = (DAY_MAX - DAY_MIN) || 1;
      rsFill.style.left = ((r[0] - DAY_MIN) / span * 100) + '%';
      rsFill.style.right = ((DAY_MAX - r[1]) / span * 100) + '%';
      rsLo.style.zIndex = +rsLo.value >= DAY_MAX ? 4 : 3;
      rsLo.setAttribute('aria-valuetext', r[0] + ' days');
      rsHi.setAttribute('aria-valuetext', r[1] + ' days');
      if (lenOut) lenOut.innerHTML = r[0] === r[1] ? (r[0] + ' days') : (r[0] + ' &ndash; ' + r[1] + ' days');
    }

    function activeCount() {
      var r = dayRange();
      var n = document.querySelectorAll('input[name="deal-region"]:checked').length;
      if (r[0] !== DAY_MIN || r[1] !== DAY_MAX) n++;
      if (budget && +budget.value !== PRICE_MAX) n++;
      return n;
    }

    function matches() {
      var r = dayRange();
      var touched = r[0] !== DAY_MIN || r[1] !== DAY_MAX;
      var cap = budget ? +budget.value : PRICE_MAX;
      var regions = [].slice.call(document.querySelectorAll('input[name="deal-region"]:checked'))
        .map(function (i) { return i.value; });
      return cards.filter(function (c) {
        var d = +c.dataset.days;
        return (regions.length === 0 || regions.indexOf(c.dataset.region) > -1) &&
               (!touched || (d >= r[0] && d <= r[1])) &&
               (cap >= PRICE_MAX || +c.dataset.price <= cap);
      });
    }

    function apply() {
      var ok = matches();
      cards.forEach(function (c) { c.hidden = true; });
      ok.slice(0, shown).forEach(function (c) { c.hidden = false; });

      if (countEl) countEl.textContent = ok.length;
      if (nounEl) nounEl.textContent = ok.length === 1 ? 'result' : 'results';
      if (empty) empty.hidden = ok.length > 0;

      var n = activeCount();
      if (activeEl) activeEl.textContent = n;
      resets.forEach(function (b) { b.hidden = n === 0; });

      var more = document.querySelector('[data-deal-more]');
      if (more) {
        more.hidden = shown >= ok.length;
        var at = document.querySelector('[data-deal-showing]');
        if (at) at.textContent = 'Showing ' + Math.min(shown, ok.length) + ' of ' + ok.length;
      }
      if (budgetOut) budgetOut.innerHTML = 'up to &pound;' + (budget ? budget.value : '') + (budget && +budget.value >= PRICE_MAX ? '+' : '');
      paintSlider();
    }

    function sort() {
      var how = (document.querySelector('[data-deal-sort]') || {}).value || 'earliest';
      var order = cards.slice();
      if (how === 'price-low') order.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      else if (how === 'price-high') order.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      else if (how === 'highest-rated') order.sort(function (a, b) { return b.dataset.rating - a.dataset.rating; });
      else if (how === 'highest-discount') order.sort(function (a, b) { return b.dataset.discount - a.dataset.discount; });
      else if (how === 'latest') order.sort(function (a, b) { return b.dataset.next.localeCompare(a.dataset.next); });
      else order.sort(function (a, b) { return a.dataset.next.localeCompare(b.dataset.next); });
      order.forEach(function (c) { list.appendChild(c); });
      cards = order;
    }

    document.addEventListener('change', function (e) {
      if (e.target.closest('[data-deal-sort]')) { sort(); apply(); return; }
      if (e.target.name === 'deal-region') apply();
    });

    /* live while dragging, not just on release */
    document.addEventListener('input', function (e) {
      if (!e.target.closest('[data-rs]') && !e.target.closest('[data-deal-budget]')) return;
      if (rs && e.target === rsLo && +rsLo.value > +rsHi.value) rsLo.value = rsHi.value;
      if (rs && e.target === rsHi && +rsHi.value < +rsLo.value) rsHi.value = rsLo.value;
      apply();
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-deal-more]')) {
        shown += PAGE_SIZE;
        apply();
        return;
      }
      if (!e.target.closest('[data-deal-reset]')) return;
      document.querySelectorAll('input[name="deal-region"]').forEach(function (i) { i.checked = false; });
      if (budget) budget.value = PRICE_MAX;
      if (rs) { rsLo.value = DAY_MIN; rsHi.value = DAY_MAX; }
      apply();
    });

    sort();
    apply();
  })();
  </script>"""


def deals_page():
    cards, meta = deals()
    # A silent empty page is how the parser bugs above went unnoticed: the
    # script "succeeded" and published a deals page with nothing on it.
    # Fail instead, the way build_prelaunch.py does for a missing onSale.
    if not cards:
        raise SystemExit(
            "build_deals: no deals qualified — check lib/data.ts departures "
            "parsing before publishing an empty page"
        )
    body = f"""    <section class="ess-hero" id="top">
      <img class="ess-hero__img" src="assets/deals-hero.jpg" alt="TruTravels deals &mdash; pack and go" />
      <div class="ess-hero__grad ess-hero__grad--light"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">Deals</p>
          <h1 class="ess-hero__title">Best Prices<br />On The Road</h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;Sale departures, last-minute discounts, biggest savings &mdash; gone when they&rsquo;re gone.&rdquo;</p>
        </div>
      </div>
    </section>

    <section class="deal-sec" id="deals">
      <img class="deal-sec__mark deal-sec__mark--l" src="assets/bg-assets/lantern.svg" alt="" aria-hidden="true" />
      <img class="deal-sec__mark deal-sec__mark--r" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
      <div class="container deal-layout">
{sidebar(meta)}
        <div class="deal-col">
          <div class="deal-list" data-deal-list>
{chr(10).join(cards)}
          </div>
          <div class="deal-page" data-deal-more hidden>
            <button class="pill-btn" type="button">Show More Deals{CHEV_D}</button>
            <p class="deal-page__n" data-deal-showing></p>
          </div>
          <div class="deal-empty" data-deal-empty hidden>
            <p class="deal-empty__p">No deals match those filters.</p>
            <button class="deal-empty__reset" type="button" data-deal-reset>Reset filters</button>
          </div>
        </div>
      </div>
    </section>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Deals &mdash; TruTravels</title>
  <meta name="description" content="Sale departures, last-minute discounts, and trips with the biggest savings on right now. Gone when they're gone." />
</head>
<body>

{NAV_OVER}

  <main class="deals">
{body}
  </main>

{FOOTER}

{SCRIPTS}{FILTER_JS}
</body>
</html>
"""


# ---------------------------------------------------------- the component --
def component():
    cards = deals()[0][:2]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Deal card (component) &mdash; TruTravels</title>
  <meta name="description" content="The deal card used on the deals page: trip summary, next on-sale departure, and an expandable list of further dates." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;"><p style="color:#9ca3af;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">Deal card component &mdash; demo (with and without further dates)</p></div>

  <!-- ===================================================================
       DEAL CARD COMPONENT — copy an <article class="deal"> into a
       .deal-list (or any column). Requires styles.css (.deal-*, .tripcard__exp-*).

       Structure:
         .deal__top      image + trip summary, side by side from 640px
         .deal-deps      the next on-sale departure, full width
         .deal-more      optional — further dates behind a checkbox toggle

       Every checkbox id must be unique on the page: the experience-types
       disclosure uses dx-N and the more-dates toggle dm-N. Bump N per card.

       Drop .deal-more entirely if the trip has only one date on sale, and
       drop .deal-roundel if there is no headline discount to show.
       =================================================================== -->
  <section style="padding:2rem 0 4rem;">
    <div class="container">
      <div class="deal-list">
{chr(10).join(cards).replace('href="', 'href="../').replace('src="assets/', 'src="../assets/')}
      </div>
    </div>
  </section>
</body>
</html>
"""


if __name__ == "__main__":
    out = deals_page()
    open(os.path.join(BASE, "deals.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote deals.html  ({len(out.splitlines())} lines, {len(deals()[0])} deals)")
    print("  regions: " + ", ".join(f"{r} {n}" for r, n in region_counts(deals()[1])))
    out = component()
    open(os.path.join(BASE, "components", "deal-card.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote components/deal-card.html  ({len(out.splitlines())} lines)")
