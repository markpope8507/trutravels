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

import json, os, re
from datetime import date, timedelta

from shell import BASE, read, block, NAV_OVER, FOOTER, SCRIPTS, HEAD

SRC = os.path.join(BASE, "..", "src")

TRIPS = json.loads(re.search(r"var TRIPS = (\[.*?\]);\n", read("all-trips.html"), re.S).group(1))
TRIPS_BY_ID = {t["id"]: t for t in TRIPS}

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def departures_by_trip():
    """Pull each trip's departures out of the prototype's data file."""
    s = open(os.path.join(SRC, "lib", "data.ts"), encoding="utf-8").read()
    start = s.index("export const trips: Trip[] = [")
    body = s[start: s.index("\n];", start)]
    out = {}
    for m in re.finditer(r'id:\s*"([^"]+)"', body):
        seg = body[m.end(): m.end() + 6000]
        dm = re.search(r"departures:\s*(\[.*?\])\s*,\s*itinerary", seg, re.S)
        if not dm:
            continue
        raw = re.sub(r"(\{|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', dm.group(1))
        raw = re.sub(r",(\s*[\]}])", r"\1", raw)
        try:
            out[m.group(1)] = json.loads(raw)
        except json.JSONDecodeError:
            pass
    return out


DEPARTURES = departures_by_trip()


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


def deal_card(trip, deps, idx):
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

    return f'''      <article class="deal" data-region="{trip.get("region","")}" data-days="{days}" data-price="{best["price"]}" data-save="{best["save"]}">
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
    cards, n = [], 0
    for trip in TRIPS:
        deps = deal_departures(trip["id"], trip.get("days") or 1)
        if not deps:
            continue
        n += 1
        cards.append(deal_card(trip, deps, n))
    return cards


# --------------------------------------------------------------- the page --
REGIONS = ["Asia", "South Asia", "Central & South America", "Africa & Middle East", "Europe", "Oceania"]
LENGTHS = [("any", "Any length"), ("u1", "Under 1 week"), ("1-2", "1&ndash;2 weeks"),
           ("2-4", "2&ndash;4 weeks"), ("4+", "4 weeks+")]


def sidebar(count):
    lengths = "\n".join(
        f'          <label class="deal-opt"><input type="radio" name="deal-len" value="{v}"{" checked" if v == "any" else ""} /><span>{label}</span></label>'
        for v, label in LENGTHS
    )
    regions = "\n".join(
        f'          <label class="deal-opt deal-opt--check"><input type="checkbox" name="deal-region" value="{r}" /><span>{r}</span></label>'
        for r in REGIONS
    )
    return f'''      <aside class="deal-side">
        <p class="deal-side__h">Filter Results</p>
        <p class="deal-side__count">Found <b data-deal-count>{count}</b> results</p>

        <div class="deal-side__grp">
          <p class="deal-side__label">Sort by</p>
          <div class="deal-select">
            <select data-deal-sort aria-label="Sort deals">
              <option value="soonest">Earliest Departure</option>
              <option value="save">Biggest Saving</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>{CHEV_D}
          </div>
        </div>

        <div class="deal-side__grp">
          <p class="deal-side__label">Length</p>
{lengths}
        </div>

        <div class="deal-side__grp">
          <p class="deal-side__label">Region</p>
{regions}
        </div>

        <button class="deal-reset" type="button" data-deal-reset>Reset filters</button>
      </aside>'''


FILTER_JS = """
  <script>/* Deals filtering + sorting. No framework — the cards carry their own
     region / length / price in data attributes and are shown or hidden in place. */
  (function () {
    var list = document.querySelector('[data-deal-list]');
    if (!list) return;
    var cards = [].slice.call(list.querySelectorAll('.deal'));
    var countEl = document.querySelector('[data-deal-count]');
    var empty = document.querySelector('[data-deal-empty]');

    function lengthOk(days, band) {
      if (band === 'any') return true;
      if (band === 'u1') return days < 7;
      if (band === '1-2') return days >= 7 && days < 14;
      if (band === '2-4') return days >= 14 && days < 28;
      return days >= 28;
    }

    function apply() {
      var band = (document.querySelector('input[name="deal-len"]:checked') || {}).value || 'any';
      var regions = [].slice.call(document.querySelectorAll('input[name="deal-region"]:checked')).map(function (i) { return i.value; });
      var shown = 0;
      cards.forEach(function (c) {
        var ok = lengthOk(+c.dataset.days, band) &&
                 (regions.length === 0 || regions.indexOf(c.dataset.region) > -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (countEl) countEl.textContent = shown;
      if (empty) empty.hidden = shown > 0;
    }

    function sort() {
      var how = (document.querySelector('[data-deal-sort]') || {}).value || 'soonest';
      var order = cards.slice();
      if (how === 'low') order.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
      else if (how === 'high') order.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
      else if (how === 'save') order.sort(function (a, b) { return b.dataset.save - a.dataset.save; });
      order.forEach(function (c) { list.appendChild(c); });
    }

    document.addEventListener('change', function (e) {
      if (e.target.closest('[data-deal-sort]')) { sort(); return; }
      if (e.target.name === 'deal-len' || e.target.name === 'deal-region') apply();
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-deal-reset]')) return;
      document.querySelectorAll('input[name="deal-region"]').forEach(function (i) { i.checked = false; });
      var any = document.querySelector('input[name="deal-len"][value="any"]');
      if (any) any.checked = true;
      apply();
    });
  })();
  </script>"""


def deals_page():
    cards = deals()
    body = f"""    <section class="ess-hero" id="top">
      <img class="ess-hero__img" src="assets/deals-hero.jpg" alt="TruTravels deals &mdash; pack and go" />
      <div class="ess-hero__grad"></div>
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
      <div class="container deal-layout">
{sidebar(len(cards))}
        <div class="deal-list" data-deal-list>
{chr(10).join(cards)}
        </div>
        <p class="deal-empty" data-deal-empty hidden>No deals match those filters.</p>
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
    cards = deals()[:2]
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
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
    print(f"  wrote deals.html  ({len(out.splitlines())} lines, {len(deals())} deals)")
    out = component()
    open(os.path.join(BASE, "components", "deal-card.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote components/deal-card.html  ({len(out.splitlines())} lines)")
