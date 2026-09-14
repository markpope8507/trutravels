"""
Build the static account-area pages.

Mirrors src/app/my-account/* into converted/:

    my-account.html            dashboard
    my-account-saved.html      saved trips + recommendations
    my-account-profile.html    profile form
    my-account-bookings.html   bookings + manage panel + add-ons

Nothing here is re-typed by hand that already exists elsewhere in the build:

  · nav / footer / shared carousel scripts are sliced out of explore.html by
    line range, the same way build_stories.py and build_authors.py do it
  · the trip-card and story-card renderers are lifted verbatim out of
    all-trips.html and stories.html, so the cards are identical to the rest
    of the site rather than a second implementation that can drift
  · trip and story data come from those same pages

The demo has no auth, so these render as a signed-in visitor. Saved trips and
saved reads read the localStorage keys the rest of the static build already
writes ("trutravels-favourites" / "trutravels-saved-stories"), so the hearts on
trip cards and story cards genuinely feed these pages.

Styling lives in ../styles.css under .acct-*.

Run:  python3 converted/.build/build_account.py
"""

import json, os, re

from shell import HERE, BASE, read, lines, block, NAV_SOLID, FOOTER, SCRIPTS

# ------------------------------------------------------------------ chrome --
# Solid nav — these pages have no hero image behind it.
NAV = NAV_SOLID

# ------------------------------------------------------- data + renderers --
ALL_TRIPS = json.loads(re.search(r"var TRIPS = (\[.*?\]);\n", read("all-trips.html"), re.S).group(1))
ALL_STORIES = json.loads(re.search(r"var STORIES = (\[.*?\]);\n", read("stories.html"), re.S).group(1))

def card_renderers():
    """Lift the canonical card renderers rather than writing a second copy."""
    at, st = lines("all-trips.html"), lines("stories.html")
    months = next(l for l in st if l.strip().startswith("var MONTHS"))
    return "\n".join([
        months,
        "    var MEMBER_CONTENT_ENABLED = false;   /* phase 2, matches lib/data.ts */",
        block("all-trips.html", 603, 610),   # PIN / STAR / CAL / STARS5 / esc
        block("all-trips.html", 612, 625),   # tripcard()
        block("stories.html", 878, 878),     # ARTICLE_IDS
        block("stories.html", 911, 911),     # fmtDate
        block("stories.html", 938, 944),     # hrefFor + LOCK
        block("stories.html", 946, 965),     # cardHTML()
    ])

def data_script():
    return (
        "  <script>\n"
        "    var ALL_TRIPS = " + json.dumps(ALL_TRIPS, ensure_ascii=False) + ";\n"
        "    var ALL_STORIES = " + json.dumps(ALL_STORIES, ensure_ascii=False) + ";\n"
        "    var TRIPS_BY_ID = {}; ALL_TRIPS.forEach(function (t) { TRIPS_BY_ID[t.id] = t; });\n"
        "    var STORIES_BY_ID = {}; ALL_STORIES.forEach(function (s) { STORIES_BY_ID[s.id] = s; });\n"
        + card_renderers() + "\n"
        "    function read(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }\n"
        "  </script>\n"
    )

# --------------------------------------------------------------- page shell --
STICKERS = [
    ("sun", "top:2%;right:3%", "clamp(160px,18vw,300px)", -8, 0.07),
    ("bali-flower", "top:12%;left:2%", "clamp(140px,15vw,260px)", 10, 0.06),
    ("komodo-dragon", "top:26%;right:6%", "clamp(170px,20vw,340px)", -6, 0.055),
    ("peru-bird", "top:38%;left:5%", "clamp(130px,14vw,240px)", -12, 0.06),
    ("good-vibes", "top:50%;right:4%", "clamp(150px,17vw,300px)", 8, 0.06),
    ("lantern", "top:62%;left:3%", "clamp(120px,12vw,220px)", 6, 0.05),
    ("mask", "top:74%;right:8%", "clamp(150px,16vw,280px)", 10, 0.05),
    ("eyes", "top:84%;left:6%", "clamp(140px,15vw,250px)", -8, 0.05),
    ("ramen", "bottom:2%;right:5%", "clamp(150px,16vw,280px)", -10, 0.05),
    # a few mid-page so the middle of wide screens isn't empty
    ("tru-logo", "top:20%;left:44%", "clamp(110px,11vw,190px)", -10, 0.04),
    ("brazil", "top:56%;left:48%", "clamp(120px,12vw,210px)", 6, 0.04),
    ("community", "top:90%;left:40%", "clamp(130px,13vw,230px)", 8, 0.04),
]

def sticker_layer():
    imgs = "".join(
        f'\n    <img src="assets/bg-assets/{icon}.svg" alt="" style="{pos};width:{w};transform:rotate({rot}deg);opacity:{op}" />'
        for icon, pos, w, rot, op in STICKERS
    )
    return f'  <!-- Full-width watermark layer (mirrors PageStickers) -->\n  <div class="acct-stickers" aria-hidden="true">{imgs}\n  </div>'

def shell(title, description, body, page_script=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>{title} &mdash; TruTravels</title>
  <meta name="description" content="{description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

{NAV}

  <main class="acct">
{sticker_layer()}
{body}
  </main>

{FOOTER}

{SCRIPTS}
{data_script()}{page_script}
</body>
</html>
"""

# ------------------------------------------------------------ shared pieces --
CHEV_R = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>'

def section_head(eyebrow, title, href=None, link_label="View all"):
    """Mirrors <SectionHeading>: eyebrow + Montserrat Black caps + pill button."""
    pill = f'<a class="pill-btn acct-sec__cta" href="{href}">{link_label}{CHEV_R}</a>' if href else ""
    return ('<div class="acct-sec__head"><div>'
            f'<p class="acct-sec__eyebrow">{eyebrow}</p>'
            f'<h2 class="acct-sec__title">{title}</h2></div>{pill}</div>')

def carousel(track_attr, kind="trips", wrap_attr=""):
    return (f'<div class="rev-carousel" data-arrows {wrap_attr}>'
            f'<div class="carousel carousel--{kind}" {track_attr}></div>'
            '<button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>'
            '<button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>'
            '</div>')

BACK = ('<a class="acct-back" href="my-account.html">'
        '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>Dashboard</a>')

def page_head(eyebrow, title, sub=""):
    sub_html = f'<p class="acct-head__sub">{sub}</p>' if sub else ""
    return (f'{BACK}<div class="acct-head"><p class="acct-head__eyebrow">{eyebrow}</p>'
            f'<h1 class="acct-head__title">{title}</h1>{sub_html}</div>')

def empty(msg, href, cta, attr):
    return (f'<div class="acct-empty" {attr}><p>{msg}</p>'
            f'<a href="{href}">{cta}</a></div>')

# ------------------------------------------------------------------ pages ----
VIP_BENEFITS = [
    ("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "10% off full-priced tours"),
    ("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Priority support"),
    ("M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", "Early access to sales"),
    ("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", "Exclusive member events"),
]

def dashboard():
    benefits = "".join(
        '<div class="acct-vip__benefit">'
        f'<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="{d}"/></svg>'
        f"<p>{label}</p></div>" for d, label in VIP_BENEFITS)

    body = f"""    <div class="container acct__inner">

      <div class="acct-welcome">
        <a class="acct-welcome__avatar" href="my-account-profile.html" aria-label="Edit your profile"><span>AT</span></a>
        <div class="acct-welcome__text">
          <h1 class="acct-welcome__h">Hey, Alex</h1>
          <p class="acct-welcome__sub">Joined Tru Community in 2025</p>
        </div>
      </div>

      <div class="acct-status">
        <div class="acct-card acct-vip">
          <p class="acct-card__h">VIP Status</p>
          <div class="acct-vip__tier">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Game-Changer (30+ days)</span>
          </div>
          <p class="acct-vip__copy">You&rsquo;ve travelled 42 days with us so far! Only 8 more days until you reach <strong>Icon</strong> status and unlock 10% off all full-priced tours.</p>
          <div class="acct-vip__bar-wrap">
            <div class="acct-vip__ticks acct-vip__ticks--top"><span style="left:25%">Game-Changer</span><span style="left:50%">Icon</span><span style="left:75%">Legend</span><span class="is-end">MVP</span></div>
            <!-- 4 equal segments (0-30, 30-50, 50-100, 100-365). 42 days = 25% + 25%*(12/20) = 40% -->
            <div class="acct-vip__bar"><div class="acct-vip__fill" style="width:40%"></div><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i></div>
            <div class="acct-vip__ticks acct-vip__ticks--bot"><span class="is-start">0</span><span style="left:25%">30</span><span style="left:50%">50</span><span style="left:75%">100</span><span class="is-end">365 days</span></div>
          </div>
          <div class="acct-vip__foot">
            <p class="acct-vip__days"><strong>42</strong> Days travelled</p>
            <button class="acct-vip__toggle" type="button" data-vip-toggle aria-expanded="false">View My Benefits
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
          <div class="acct-vip__benefits" data-vip-benefits hidden>
            <div class="acct-vip__grid">{benefits}</div>
          </div>
        </div>

        <div class="acct-card acct-credit">
          <p class="acct-card__h">Travel Credit</p>
          <div class="acct-credit__body">
            <p class="acct-credit__amt">&pound;50</p>
            <div><p class="acct-credit__label">Available credit</p><p class="acct-credit__exp">Expires 31 Dec 2026</p></div>
          </div>
        </div>
      </div>

      <div class="acct-tiles">
        <a class="acct-tile" href="my-account-bookings.html">
          <div class="acct-tile__top"><span class="acct-tile__ico"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></span><span class="acct-tile__pill">{len(BOOKINGS)}</span></div>
          <p class="acct-tile__label">My Bookings</p></a>
        <a class="acct-tile" href="my-account-profile.html">
          <div class="acct-tile__top"><span class="acct-tile__ico"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></span><span class="acct-tile__pill">Edit</span></div>
          <p class="acct-tile__label">My Profile</p></a>
      </div>

      <section class="acct-sec">
        {section_head("Your Shortlist", "Saved Trips", "my-account-saved.html", "Manage saved")}
        {carousel("data-saved-trips", "trips", "data-saved-trips-wrap hidden")}
        {empty("You haven&rsquo;t saved any trips yet.", "explore.html", "Explore trips", "data-saved-trips-empty")}
      </section>

      <section class="acct-sec">
        {section_head("For You", "Recommended Trips", "explore.html")}
        {carousel("data-recommended", "trips")}
      </section>

      <section class="acct-sec">
        {section_head("Picked For You", "Suggested Reads", "stories.html", "Browse stories")}
        {carousel("data-suggested-reads", "reads")}
      </section>

      <section class="acct-sec">
        {section_head("Your Reads", "Saved Reads", "stories.html", "Browse stories")}
        {carousel("data-saved-reads", "reads", "data-saved-reads-wrap hidden")}
        {empty("You haven&rsquo;t saved any reads yet.", "stories.html", "Explore stories", "data-saved-reads-empty")}
      </section>

    </div>"""

    js = """  <script>/* Dashboard — VIP benefits toggle; rows driven by the save stores */
  (function () {
    var vipBtn = document.querySelector('[data-vip-toggle]');
    var vipPanel = document.querySelector('[data-vip-benefits]');
    if (vipBtn && vipPanel) {
      vipBtn.addEventListener('click', function () {
        var open = vipPanel.hidden;
        vipPanel.hidden = !open;
        vipBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        vipBtn.classList.toggle('is-open', open);
      });
    }

    function fill(sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; }
    function show(sel, on) { var el = document.querySelector(sel); if (el) el.hidden = !on; }

    function render() {
      var savedTripIds = read('trutravels-favourites');
      var savedTrips = savedTripIds.map(function (id) { return TRIPS_BY_ID[id]; }).filter(Boolean);
      fill('[data-saved-trips]', savedTrips.map(tripcard).join(''));
      show('[data-saved-trips-wrap]', savedTrips.length > 0);
      show('[data-saved-trips-empty]', savedTrips.length === 0);

      /* Don't recommend what's already on the shortlist right above it. */
      fill('[data-recommended]', ALL_TRIPS
        .filter(function (t) { return savedTripIds.indexOf(t.id) === -1; })
        .slice(0, 8).map(tripcard).join(''));

      var savedReadIds = read('trutravels-saved-stories');
      var savedReads = savedReadIds.map(function (id) { return STORIES_BY_ID[id]; }).filter(Boolean);
      fill('[data-saved-reads]', savedReads.map(cardHTML).join(''));
      show('[data-saved-reads-wrap]', savedReads.length > 0);
      show('[data-saved-reads-empty]', savedReads.length === 0);

      /* Likewise — a suggestion you've already saved is just noise. */
      fill('[data-suggested-reads]', ALL_STORIES
        .filter(function (s) { return savedReadIds.indexOf(s.id) === -1; })
        .slice(0, 8).map(cardHTML).join(''));
    }
    render();
    window.addEventListener('trutravels-favourites-change', render);
    window.addEventListener('trutravels-saved-stories-change', render);
    window.addEventListener('storage', render);
  })();
  </script>
"""
    return shell("My Account", "Your TruTravels account — bookings, saved trips and profile.", body, js)


def saved_page():
    body = f"""    <div class="container acct__inner">
      {page_head("Your Collection", "Saved Trips", "Trips you&rsquo;ve hearted. Tap the heart again on any card to remove one.")}
      <div class="acct-grid" data-saved-grid hidden></div>
      <div class="acct-empty acct-empty--lg" data-saved-empty>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
        <p class="acct-empty__h">No saved trips yet</p>
        <p class="acct-empty__p">Browse our trips and tap the heart icon to save the ones that catch your eye.</p>
        <a class="pill-btn" href="explore.html">Explore trips{CHEV_R}</a>
      </div>
      <section class="acct-sec">
        {section_head("Because You Saved These", "You Might Also Like", "explore.html")}
        {carousel("data-recommended", "trips")}
      </section>
    </div>"""

    js = """  <script>/* Saved trips grid + recommendations from the favourites store */
  (function () {
    function render() {
      var ids = read('trutravels-favourites');
      var saved = ids.map(function (id) { return TRIPS_BY_ID[id]; }).filter(Boolean);
      var grid = document.querySelector('[data-saved-grid]');
      var empty = document.querySelector('[data-saved-empty]');
      if (grid) { grid.innerHTML = saved.map(tripcard).join(''); grid.hidden = saved.length === 0; }
      if (empty) empty.hidden = saved.length > 0;

      /* Recommend from the regions and styles already on the shortlist. */
      var regions = {}, styles = {};
      saved.forEach(function (t) { regions[t.region] = 1; styles[t.travelStyle] = 1; });
      var pool = ALL_TRIPS.filter(function (t) { return ids.indexOf(t.id) === -1; });
      var matched = pool.filter(function (t) { return regions[t.region] || styles[t.travelStyle]; });
      var track = document.querySelector('[data-recommended]');
      if (track) track.innerHTML = (matched.length ? matched : pool).slice(0, 8).map(tripcard).join('');
    }
    render();
    window.addEventListener('trutravels-favourites-change', render);
    window.addEventListener('storage', render);
  })();
  </script>
"""
    return shell("Saved Trips", "Trips you've saved to your TruTravels account.", body, js)


def profile_page():
    prefs = "".join(f'<button class="acct-pref" type="button" data-pref>{p}</button>'
                    for p in ["Adventure", "Beaches", "Culture", "Nightlife", "Wellness", "Food"])
    body = f"""    <div class="container acct__inner acct__inner--narrow">
      {page_head("Your Account", "My Profile")}

      <div class="acct-card acct-profile__id">
        <div class="acct-profile__avatar"><span>AT</span></div>
        <div>
          <h2 class="acct-profile__name">Alex Traveller</h2>
          <p class="acct-profile__meta">alex@example.com</p>
          <p class="acct-profile__meta">Joined Tru Community in 2025</p>
        </div>
      </div>

      <form class="acct-card" onsubmit="return false">
        <p class="acct-card__h">Details</p>
        <div class="acct-field"><label for="acct-name">Full Name</label><input id="acct-name" type="text" value="Alex Traveller" /></div>
        <div class="acct-field"><label for="acct-email">Email</label><input id="acct-email" type="email" value="alex@example.com" /></div>
        <div class="acct-field"><label for="acct-phone">Contact Number</label><input id="acct-phone" type="tel" value="+44 7700 900000" /></div>
      </form>

      <div class="acct-card">
        <p class="acct-card__h">Travel Preferences</p>
        <p class="acct-note">Tell us what you&rsquo;re into and we&rsquo;ll tailor what we show you.</p>
        <div class="acct-prefs">{prefs}</div>
      </div>

      <div class="acct-card">
        <p class="acct-card__h">Your Stats</p>
        <div class="acct-stats">
          <div><p class="acct-stats__n">0</p><p class="acct-stats__l">Trips Taken</p></div>
          <div><p class="acct-stats__n" data-saved-count>0</p><p class="acct-stats__l">Saved Trips</p></div>
          <div><p class="acct-stats__n">1</p><p class="acct-stats__l">Countries</p></div>
        </div>
      </div>

      <button class="acct-save" type="button">Save Changes</button>
    </div>"""

    js = """  <script>/* Profile — preference chips + live saved-trips count */
  (function () {
    document.querySelectorAll('[data-pref]').forEach(function (b) {
      b.addEventListener('click', function () { b.classList.toggle('is-on'); });
    });
    function count() {
      var el = document.querySelector('[data-saved-count]');
      if (el) el.textContent = read('trutravels-favourites').length;
    }
    count();
    window.addEventListener('trutravels-favourites-change', count);
    window.addEventListener('storage', count);
  })();
  </script>
"""
    return shell("My Profile", "Manage your TruTravels profile and preferences.", body, js)


# ---------------------------------------------------------------- bookings --
# Mirrors mockBookings in src/components/booking-history.tsx — same five
# bookings, same statuses, same money. Departure dates are held as offsets from
# today (`departsIn`) so the demo never goes stale; the cancelled booking keeps
# its literal narrative dates instead, since its story is fixed in the past.
BOOKINGS = [
    {"id": "b1", "ref": "TRU-2026-04871", "title": "Thailand Island Hopper",
     "image": "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg",
     "duration": "14 Days", "start": "Bangkok", "end": "Phuket",
     "departsIn": 24, "lasts": 13, "bookedIn": -95,
     "status": "upcoming", "price": 1727, "deposit": 300, "paid": 1727, "balance": 0, "balanceDue": "",
     "travellers": 2, "passengers": ["Alex Traveller", "Sarah Traveller"],
     "emails": ["alex@trutravels.com", "sarah@trutravels.com"],
     "leader": "Tommy",
     "goodToGo": {"flightDetails": True, "travelInsurance": True, "dietaryRequirements": True,
                  "emergencyContact": True, "passportDetails": True, "visaCheck": True},
     "extras": {"prenight": True, "arrival": True},
     "flight": {"airline": "Thai Airways", "flightNo": "TG917",
                "departs": "London Heathrow (LHR) Sat 11 Apr at 21:30",
                "arrives": "Bangkok Suvarnabhumi (BKK) Sun 12 Apr at 15:30"},
     "insurance": {"provider": "World Nomads", "type": "Explorer Plan", "policyNo": "TRV-2026-88421"},
     "promo": {"code": "BLACKFRIDAY", "discount": 150, "originalPrice": 1877}},

    {"id": "b2", "ref": "TRU-2026-05912", "title": "Vietnam Explorer",
     "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
     "duration": "13 Days", "start": "Ho Chi Minh City", "end": "Hanoi",
     "departsIn": 118, "lasts": 12, "bookedIn": -40,
     "status": "upcoming", "price": 875, "deposit": 875, "paid": 875, "balance": 0, "balanceDue": "",
     "travellers": 1, "passengers": ["Alex Traveller"], "emails": ["alex@trutravels.com"],
     "leader": "TBC",
     "goodToGo": {"flightDetails": False, "travelInsurance": False, "dietaryRequirements": False,
                  "emergencyContact": False, "passportDetails": False, "visaCheck": False},
     "extras": {}},

    {"id": "b3", "ref": "TRU-2026-07341", "title": "Costa Rica Adventure",
     "image": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
     "duration": "10 Days", "start": "San Jos\u00e9", "end": "Santa Teresa",
     "departsIn": 180, "lasts": 9, "bookedIn": -12,
     "status": "upcoming", "price": 945, "deposit": 150, "paid": 150, "balance": 795, "balanceDueIn": 120,
     "travellers": 2, "passengers": ["Alex Traveller", "Sarah Traveller"],
     "emails": ["alex@trutravels.com", "sarah@trutravels.com"],
     "leader": "TBC",
     "goodToGo": {"flightDetails": False, "travelInsurance": False, "dietaryRequirements": False,
                  "emergencyContact": False, "passportDetails": False, "visaCheck": False},
     "extras": {}},

    {"id": "b4", "ref": "TRU-2025-03214", "title": "Bali Experience",
     "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
     "duration": "10 Days", "start": "Canggu", "end": "Gili Trawangan",
     "departsIn": -364, "lasts": 9, "bookedIn": -500,
     "status": "completed", "price": 487, "deposit": 487, "paid": 487, "balance": 0, "balanceDue": "",
     "travellers": 2, "passengers": ["Alex Traveller", "Sarah Traveller"],
     "emails": ["alex@trutravels.com", "sarah@trutravels.com"],
     "leader": "Milin", "goodToGo": None, "extras": {},
     "feedbackCompleted": False, "reviewLeft": False},

    {"id": "b5", "ref": "TRU-2026-06183", "title": "Jordan Explorer",
     "image": "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&q=80",
     "duration": "8 Days", "start": "Amman", "end": "Aqaba",
     "departsOn": "2026-06-20", "endsOn": "2026-06-27",
     "status": "cancelled", "price": 695, "deposit": 200, "paid": 695, "balance": 0, "balanceDue": "",
     "travellers": 1, "passengers": ["Alex Traveller"], "emails": ["alex@trutravels.com"],
     "leader": "TBC", "goodToGo": None, "extras": {},
     "cancellation": {"dateBooked": "3 Jan 2026", "dateCancelled": "18 Mar 2026",
                      "reason": "Change of personal circumstances", "refundAmount": 495,
                      "nonRefundableDeposit": 200, "refundStatus": "Refunded",
                      "refundDate": "25 Mar 2026"}},
]

# Mirrors ROOM_TYPES / ADDONS in src/lib/addons.ts. Keep in step with that file.
ROOM_TYPES = [
    {"id": "twin", "name": "Twin share", "price": 45, "sleeps": 1, "rate": "pp / night", "note": "A bed in a shared twin room"},
    {"id": "double", "name": "Double", "price": 90, "sleeps": 2, "rate": "/ night", "note": "One double bed for two", "min2": True},
    {"id": "single", "name": "Single", "price": 75, "sleeps": 1, "rate": "/ night", "note": "A room to yourself"},
    {"id": "dorm", "name": "Dorm bed", "price": 25, "sleeps": 1, "rate": "pp / night", "note": "A bed in a shared dorm"},
]
ADDONS = [
    {"id": "prenight", "cat": "Accommodation", "name": "Pre-Night Hotel", "price": 45, "hotel": True, "on": "start"},
    {"id": "postnight", "cat": "Accommodation", "name": "Post-Night Hotel", "price": 45, "hotel": True, "on": "end"},
    {"id": "arrival", "cat": "Transfers", "name": "Arrival Transfer", "price": 60, "hotel": False, "on": "start",
     "info": "If you are arriving before your tour start date you can still be picked up from {start} Airport, however you will need to book a pre-night(s) accommodation with us so we have somewhere to take you. If you are arriving on your tour start date, please skip this."},
    {"id": "departure", "cat": "Transfers", "name": "Departure Transfer", "price": 60, "hotel": False, "on": "end",
     "info": "If you are leaving after your tour end date you can still be transferred to {end} Airport, however you will need to book a post-night(s) accommodation with us. If you are leaving on your tour end date, please skip this."},
]
ROOM_UPGRADE = 450

def bookings_page():
    body = f"""    <div class="container acct__inner">
      {page_head("Your Account", "My Bookings", "Everything you&rsquo;ve booked with us &mdash; and everything you can still add.")}
      <div class="acct-bookings" data-bookings></div>
    </div>
    <!-- video-review modal renders here -->
    <div data-video-root></div>"""

    data = ("  <script>\n"
            "    var BOOKINGS = " + json.dumps(BOOKINGS, ensure_ascii=False) + ";\n"
            "    var ROOM_TYPES = " + json.dumps(ROOM_TYPES, ensure_ascii=False) + ";\n"
            "    var ADDONS = " + json.dumps(ADDONS, ensure_ascii=False) + ";\n"
            f"    var ROOM_UPGRADE = {ROOM_UPGRADE};\n"
            "  </script>\n")
    js = open(os.path.join(HERE, "account_bookings.js"), encoding="utf-8").read()
    return shell("My Bookings", "Your TruTravels bookings, trip details and optional extras.",
                 body, data + js)


# ------------------------------------------------------------------- write --
PAGES = {
    "my-account.html": dashboard,
    "my-account-saved.html": saved_page,
    "my-account-profile.html": profile_page,
    "my-account-bookings.html": bookings_page,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        out = os.path.join(BASE, name)
        open(out, "w", encoding="utf-8").write(fn())
        print(f"  wrote {name}  ({len(open(out, encoding='utf-8').read().splitlines())} lines)")
