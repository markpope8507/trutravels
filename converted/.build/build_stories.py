import json, io, os, re

BASE = "/Users/markpope/Claude Test/trutravels/converted"
def lines(fn): return open(os.path.join(BASE, fn), encoding="utf-8").read().split("\n")
def block(fn, a, b): return "\n".join(lines(fn)[a-1:b])  # 1-indexed inclusive
from shell import chunk, run  # marker-based slices; see shell.py

NAV      = block("explore.html", 17, 114)
FOOTER   = block("explore.html", 517, 593)
SCRIPTS  = block("explore.html", 594, 839)   # arrows, exp-disclosure, drag, cart, navbar, footer
VD_SEC   = chunk("index.html", '<section class="vdia" id="video-diaries">')
VD_MODAL = run("index.html", 'class="vid-modal" id="hvd-')

STORIES = json.load(open("/private/tmp/claude-501/-Users-markpope-Claude-Test-trutravels/6a63a474-8847-434b-b8ad-6a498a49e3e8/scratchpad/stories.json"))
STORIES_JSON = json.dumps(STORIES, ensure_ascii=False)

TV_SVG = '''<svg width="140" height="120" viewBox="0 0 140 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="18" width="120" height="78" rx="10"/><rect x="20" y="28" width="100" height="58" rx="4" opacity="0.4"/><path d="M60 47 L60 67 L82 57 Z" fill="currentColor" stroke="none"/><line x1="50" y1="6" x2="62" y2="18"/><line x1="90" y1="6" x2="78" y2="18"/><line x1="48" y1="108" x2="92" y2="108"/><line x1="60" y1="96" x2="56" y2="108"/><line x1="80" y1="96" x2="84" y2="108"/></svg>'''

# Put the TV/video icon on the right of the "Moments From Our Community" heading
# by wrapping the spliced .vdia__head text and appending the icon.
def _vdia_icon(m):
    return ('<div class="container vdia__head vdia__head--icon"><div class="vdia__head-text">'
            + m.group(1) + '</div><div class="vdia__icon tx-pink">' + TV_SVG + '</div></div>')
VD_SEC = re.sub(r'<div class="container vdia__head">(.*?)</div>', _vdia_icon, VD_SEC, count=1, flags=re.S)

BOOK_SVG = '''<svg width="140" height="120" viewBox="0 0 140 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="70" y1="24" x2="70" y2="104"/><path d="M70 24 Q 50 18 18 24 L 18 100 Q 50 94 70 100 Z"/><path d="M70 24 Q 90 18 122 24 L 122 100 Q 90 94 70 100 Z"/><line x1="28" y1="40" x2="58" y2="38" opacity="0.6"/><line x1="28" y1="52" x2="58" y2="50" opacity="0.6"/><line x1="28" y1="64" x2="50" y2="62" opacity="0.6"/><line x1="82" y1="38" x2="112" y2="40" opacity="0.6"/><line x1="82" y1="50" x2="112" y2="52" opacity="0.6"/><line x1="82" y1="62" x2="104" y2="64" opacity="0.6"/><path d="M95 22 L95 56 L102 50 L109 56 L109 22" fill="currentColor" stroke="none" opacity="0.85"/></svg>'''

SEARCH_SVG = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>'
FILTER_SVG = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M6 12h12M10 20h4"/></svg>'
DOWN_SVG   = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'

HTML = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Stories — TruTravels</title>
  <meta name="description" content="Where stories come to life — diaries, guides, and honest tales from the road." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body id="top">
__NAV__

  <!-- ================= HERO ================= -->
  <section class="st-hero">
    <img class="st-hero__bg" src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80" alt="Travellers chasing horizons" />
    <div class="st-hero__grad"></div>
    <div class="container st-hero__inner">
      <div class="st-hero__text">
        <p class="st-hero__eyebrow">Stories</p>
        <h1 class="st-hero__title">Where Stories<br />Come To Life</h1>
        <div class="st-hero__rule"></div>
        <p class="st-hero__quote">&ldquo;Every journey writes a story worth telling. The connections with local people, the shared laughs, the unexpected moments &mdash; stories that shape who you are.&rdquo;</p>
      </div>
    </div>
  </section>

  <!-- ================= WATCH — video diaries (moved up; no pillar header) ================= -->
__VD_SEC__

  <!-- ================= READ pillar ================= -->
  <section class="pillar" id="read">
    <div class="container pillar__inner">
      <div class="pillar__text">
        <div class="pillar__eyebrow-row"><span class="pillar__rule pillar__rule--pink"></span><p class="pillar__eyebrow pillar__eyebrow--pink">Read &middot; Long Form</p></div>
        <h2 class="pillar__title">Stories Worth <span class="tx-pink">Reading</span></h2>
        <p class="pillar__desc">Honest, in-depth pieces from the road. Travellers, guides, and our team &mdash; sharing the moments that stayed with them.</p>
      </div>
      <div class="pillar__icon tx-pink">__BOOK__</div>
    </div>
  </section>

  <!-- ================= FEATURED ================= -->
  <section class="st-featured">
    <img class="st-bg st-bg--fl" src="assets/bg-assets/peru-bird.svg" alt="" aria-hidden="true" />
    <div class="container">
      <p class="st-sub-eyebrow">Featured</p>
      <h3 class="st-sub-title">The Latest Story</h3>
      <div data-featured></div>
    </div>
  </section>

  <!-- ================= BROWSE ================= -->
  <section class="st-browse">
    <img class="st-bg st-bg--br" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
    <img class="st-bg st-bg--bl" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
    <div class="container">
      <div class="st-browse__head">
        <p class="st-sub-eyebrow">Browse</p>
        <h3 class="st-sub-title">Find Your Next Read</h3>
        <p class="st-browse__intro">Search by destination, topic, or where you are in life. There&rsquo;s a story here for every chapter of the journey.</p>
      </div>

      <div class="st-browse__grid">
        <aside class="st-side">
          <div class="st-side__panel">
            <div class="st-side__head">
              <p class="st-side__title">Filters</p>
              <button class="st-side__clear" data-clear hidden type="button">Clear</button>
            </div>
            <p class="st-side__count"><strong data-side-count>0</strong> <span data-side-count-label>stories</span></p>
            <div data-filter-panel></div>
          </div>
        </aside>

        <div class="st-results">
          <!-- mobile: search + filters (in flow) -->
          <div class="st-bar" id="stories-bar">
            <div class="st-search st-search--pill">
              ''' + SEARCH_SVG + '''
              <input type="text" data-search placeholder="Search stories&hellip;" />
              <div class="st-sugg" data-sugg hidden></div>
            </div>
            <button class="st-filter-btn" data-open-drawer type="button">''' + FILTER_SVG + ''' Filters <span class="st-filter-btn__count" data-mobile-filter-count hidden>0</span></button>
          </div>

          <!-- desktop: search -->
          <div class="st-search st-search--desktop">
            ''' + SEARCH_SVG + '''
            <input type="text" data-search placeholder="Search stories, guides, destinations&hellip;" />
            <div class="st-sugg" data-sugg hidden></div>
          </div>

          <p class="st-count">Showing <span data-showing>0</span> of <span data-total>0</span> <span data-total-label>stories</span><button class="st-count__clear" data-clear-all hidden type="button">Clear all</button></p>

          <div class="st-grid" data-grid></div>

          <div class="st-loadmore" data-loadmore hidden>
            <button class="pill-btn" data-more type="button">Show More Stories ''' + DOWN_SVG + '''</button>
          </div>

          <div class="st-empty" data-empty hidden>
            <p>No stories match those filters yet.</p>
            <button class="st-empty__reset" data-clear-all type="button">Reset filters</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- mobile filter drawer -->
  <div class="st-drawer" data-drawer hidden>
    <div class="st-drawer__backdrop" data-close-drawer></div>
    <div class="st-drawer__panel">
      <div class="st-drawer__head">
        <h2 class="st-drawer__title">Filters</h2>
        <button class="st-drawer__x" data-close-drawer type="button" aria-label="Close"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <div class="st-drawer__body" data-filter-panel></div>
      <div class="st-drawer__foot">
        <button class="st-drawer__apply" data-close-drawer type="button">Show <span data-drawer-count>0</span> Stories</button>
      </div>
    </div>
  </div>

  <!-- sticky mobile bar -->
  <div class="st-sticky" data-sticky>
    <div class="container st-sticky__inner">
      <div class="st-search st-search--pill">
        ''' + SEARCH_SVG + '''
        <input type="text" data-search placeholder="Search stories&hellip;" />
      </div>
      <button class="st-filter-btn" data-open-drawer type="button">''' + FILTER_SVG + ''' Filters <span class="st-filter-btn__count" data-mobile-filter-count hidden>0</span></button>
    </div>
  </div>

__FOOTER__
__VD_MODAL__
__SCRIPTS__
  <script>/* ===================== STORIES hub — data + browse ===================== */
  (function () {
    var STORIES = __STORIES_JSON__;
    var ARTICLE_IDS = new Set(["top-unesco-world-heritage-sites","is-it-safe-to-visit-south-korea","top-5-places-to-visit-in-thailand","top-5-things-to-do-in-indonesia","best-places-to-travel-in-august","top-6-places-to-visit-in-morocco"]);
    /* Member-gated content is phase 2 — while this is false, memberOnly is ignored:
       no locks, no "Exclusive" badges, no signup redirects, and the Member
       Exclusive facet drops out of the filters. Mirrors MEMBER_CONTENT_ENABLED
       in src/lib/data.ts. */
    var MEMBER_CONTENT_ENABLED = false;
    var TOPIC_OPTIONS = [
      { id: "story", label: "Stories" }, { id: "guide", label: "Guides" },
      { id: "tips", label: "Tips" },
      { id: "Adventure", label: "Adventure" }, { id: "Food & Culture", label: "Food & Culture" },
      { id: "Solo Travel", label: "Solo Travel" }, { id: "Wellness", label: "Wellness" },
      { id: "Sustainability", label: "Sustainability" }, { id: "Nightlife", label: "Nightlife" },
      { id: "Budget Tips", label: "Budget Tips" }, { id: "Local Stories", label: "Local Stories" },
    ];
    var STORY_REGIONS = [
      { region: "Asia", countries: ["Thailand","Indonesia","Vietnam","Philippines","Cambodia","Sri Lanka","India","Japan","China","South Korea"] },
      { region: "Central & South America", countries: ["Mexico","Costa Rica","Colombia","Peru","Brazil","Belize","Guatemala"] },
      { region: "Europe", countries: ["Greece","Italy","Albania"] },
      { region: "Africa & Middle East", countries: ["Morocco","Jordan"] },
      { region: "Oceania", countries: ["New Zealand"] },
    ];
    var ALL_COUNTRIES = STORY_REGIONS.reduce(function (a, r) { return a.concat(r.countries); }, []);
    var MOMENT_EMOJI = {"Looking To Challenge Myself": "🏔️", "Solo Soul Searcher": "🧭", "Just Left Uni": "🎓", "Work Break Recharge": "🔋", "Turning 30": "🎂", "Gap Year": "🌍"};
    var LIFE_MOMENTS = ["Looking To Challenge Myself","Solo Soul Searcher","Just Left Uni","Work Break Recharge","Turning 30","Gap Year"];
    var PAGE = 6;

    var state = {
      query: "", visible: PAGE,
      tags: new Set(), countries: new Set(), moments: new Set(),
      openSections: new Set(["topics"]), openRegions: new Set(),
    };

    var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function fmtDate(iso) { var d = new Date(iso); return d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + " " + d.getUTCFullYear(); }
    function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function countryCount(c) { return STORIES.filter(function (s) { return s.destinations.indexOf(c) > -1; }).length; }

    /* Newest first. The Sort By control was removed from the filters; ordering is fixed. */
    function sorted() {
      return STORIES.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    }
    function filteredRest() {
      var rest = sorted().slice(1);
      return rest.filter(function (s) {
        if (state.tags.size && !(state.tags.has(s.type) || s.topics.some(function (t) { return state.tags.has(t); }))) return false;
        if (state.countries.size && !s.destinations.some(function (d) { return state.countries.has(d); })) return false;
        if (state.moments.size && !s.lifeMoments.some(function (m) { return state.moments.has(m); })) return false;
        /* Same matcher the search dropdown uses, so grid and suggestions agree. */
        if (!storyMatchesQuery(s, state.query)) return false;
        return true;
      });
    }
    function storyMatchesQuery(s, query) {
      var toks = suggTokens(query);
      if (!toks.length) return true;
      return suggHits([s.title, s.excerpt, s.category].concat(s.topics, s.destinations, s.lifeMoments).join(" "), toks);
    }
    function activeCount() { return state.tags.size + state.countries.size + state.moments.size; }
    function hasActive() { return activeCount() > 0 || state.query.trim().length > 0; }

    function hrefFor(s) {
      if (MEMBER_CONTENT_ENABLED && s.memberOnly) return "signup.html";
      if (ARTICLE_IDS.has(s.id)) return "story-" + s.id + ".html";
      return "stories.html#" + s.id;
    }

    var LOCK = '<div class="story-card__lock"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span>Members Only</span></div>';

    function cardHTML(s) {
      var locked = MEMBER_CONTENT_ENABLED && !!s.memberOnly;
      return '<a class="story-card' + (locked ? ' story-card--locked' : '') + '" id="' + s.id + '" href="' + hrefFor(s) + '">'
        + '<div class="story-card__media">'
        +   '<img class="story-card__image" src="' + s.image + '" alt="' + esc(s.title) + '" />'
        +   (MEMBER_CONTENT_ENABLED && s.memberOnly ? '<span class="story-card__badge">Exclusive</span>' : '')
        +   (locked ? LOCK : '')
        +   '<span class="story-card__time">' + s.readTime + ' min</span>'
        + '</div>'
        + '<div class="story-card__body">'
        +   '<p class="story-card__category">' + esc(s.category) + '</p>'
        +   '<h3 class="story-card__title">' + esc(s.title) + '</h3>'
        +   '<p class="story-card__excerpt">' + esc(s.excerpt) + '</p>'
        +   '<div class="story-card__foot">'
        +     '<p class="story-card__meta"><strong>' + esc(s.author) + '</strong> &middot; ' + fmtDate(s.date) + '</p>'
        +     '<span class="story-card__read">' + (locked ? 'Join to read' : 'Read story') + ' &rarr;</span>'
        +   '</div>'
        + '</div>'
        + '</a>';
    }

    function featuredHTML(s) {
      var locked = MEMBER_CONTENT_ENABLED && !!s.memberOnly;
      return '<a class="fstory__card" href="' + hrefFor(s) + '">'
        + '<div class="fstory__media">'
        +   '<img class="fstory__img' + (locked ? ' is-blur' : '') + '" src="' + s.image + '" alt="' + esc(s.title) + '" />'
        +   '<div class="fstory__grad"></div>'
        +   (MEMBER_CONTENT_ENABLED && s.memberOnly ? '<span class="story-card__badge">Exclusive</span>' : '')
        +   (locked ? LOCK : '')
        + '</div>'
        + '<div class="fstory__body">'
        +   '<p class="fstory__eyebrow">' + esc(s.category) + ' &middot; ' + s.readTime + ' min read</p>'
        +   '<h3 class="fstory__title">' + esc(s.title) + '</h3>'
        +   '<p class="fstory__excerpt">' + esc(s.excerpt) + '</p>'
        +   '<div class="fstory__foot">'
        +     '<p class="fstory__meta"><strong>' + esc(s.author) + '</strong> &middot; ' + fmtDate(s.date) + '</p>'
        +     '<span class="fstory__read">' + (locked ? 'Join to read' : 'Read story') + ' &rarr;</span>'
        +   '</div>'
        + '</div>'
        + '</a>';
    }

    function chev(open) { return '<svg class="fp-chev' + (open ? ' is-open' : '') + '" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'; }

    function fpSection(key, title, count, inner) {
      var open = state.openSections.has(key);
      return '<div class="fp-section"><button type="button" class="fp-section-btn" data-section="' + key + '">'
        + '<span class="fp-section-title">' + title + (count ? ' <span class="fp-badge">' + count + '</span>' : '') + '</span>' + chev(open)
        + '</button>' + (open ? '<div class="fp-section-body">' + inner + '</div>' : '') + '</div>';
    }

    function filterPanelHTML() {
      var h = '';
      h += fpSection("topics", "Topics", state.tags.size, TOPIC_OPTIONS.map(function (o) {
        var ck = state.tags.has(o.id);
        return '<label class="fp-row' + (ck ? ' is-on' : '') + '"><input type="checkbox" data-tag="' + esc(o.id) + '"' + (ck ? ' checked' : '') + ' /><span>' + o.label + '</span></label>';
      }).join(""));

      var dest = STORY_REGIONS.map(function (r) {
        var vis = r.countries.filter(function (c) { return countryCount(c) > 0; });
        if (!vis.length) return "";
        var ropen = state.openRegions.has(r.region);
        var rc = vis.filter(function (c) { return state.countries.has(c); }).length;
        return '<div class="fp-region"><button type="button" class="fp-region-btn" data-region="' + esc(r.region) + '">'
          + '<span class="fp-region-name">' + r.region + (rc ? ' <span class="fp-badge">' + rc + '</span>' : '') + '</span>' + chev(ropen) + '</button>'
          + (ropen ? '<div class="fp-region-list">' + vis.map(function (c) {
              var ck = state.countries.has(c);
              return '<label class="fp-row' + (ck ? ' is-on' : '') + '"><input type="checkbox" data-country="' + esc(c) + '"' + (ck ? ' checked' : '') + ' /><span class="fp-row__c">' + c + '</span><span class="fp-row__n">' + countryCount(c) + '</span></label>';
            }).join("") + '</div>' : '') + '</div>';
      }).join("");
      h += fpSection("destination", "Destination", state.countries.size, dest);

      h += fpSection("moment", "Life Moments", state.moments.size, LIFE_MOMENTS.map(function (m) {
        var ck = state.moments.has(m);
        return '<label class="fp-row' + (ck ? ' is-on' : '') + '"><input type="checkbox" data-moment="' + esc(m) + '"' + (ck ? ' checked' : '') + ' /><span>' + m + '</span></label>';
      }).join(""));

      if (activeCount() > 0) {
        h += '<div class="fp-divider"></div><button type="button" class="fp-clear" data-clear-filters>Clear Filters (' + activeCount() + ')</button>';
      }
      return h;
    }

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    function renderPanels() {
      $$('[data-filter-panel]').forEach(function (el) { el.innerHTML = filterPanelHTML(); });
    }

    function renderResults() {
      var feat = sorted()[0];
      var fEl = $('[data-featured]');
      if (feat && fEl && fEl.getAttribute('data-rendered') !== feat.id) {
        fEl.innerHTML = featuredHTML(feat);
        fEl.setAttribute('data-rendered', feat.id);
      }
      var list = filteredRest();
      var total = list.length;
      var shown = Math.min(state.visible, total);

      var grid = $('[data-grid]');
      grid.innerHTML = list.slice(0, state.visible).map(cardHTML).join("");

      $('[data-showing]').textContent = shown;
      $$('[data-total]').forEach(function (e) { e.textContent = total; });
      $$('[data-total-label]').forEach(function (e) { e.textContent = total === 1 ? "story" : "stories"; });
      $('[data-side-count]').textContent = total;
      $('[data-side-count-label]').textContent = total === 1 ? "story" : "stories";
      $$('[data-drawer-count]').forEach(function (e) { e.textContent = total; });

      $('[data-loadmore]').hidden = state.visible >= total;
      $('[data-empty]').hidden = total !== 0;
      grid.hidden = total === 0;

      var showClear = hasActive();
      $$('[data-clear-all]').forEach(function (e) { e.hidden = !showClear; });
      $$('[data-clear]').forEach(function (e) { e.hidden = activeCount() === 0; });
      $$('[data-mobile-filter-count]').forEach(function (e) {
        var n = activeCount(); e.hidden = n === 0; e.textContent = n;
      });
    }

    function renderAll() { renderPanels(); renderResults(); }

    function clearAll() {
      state.tags.clear(); state.countries.clear(); state.moments.clear(); state.query = "";
      state.visible = PAGE;
      $$('[data-search]').forEach(function (i) { i.value = ""; });
      renderAll();
    }
    function toggleSet(set, val) { if (set.has(val)) set.delete(val); else set.add(val); }


    /* ----- Search typeahead: recommendations as you type, like the homepage bar.
       Story suggestions open the article; a topic/destination/life-moment
       suggestion ticks that filter instead. The grid still filters live. ----- */
    var SUGG_STOP = { the:1, a:1, an:1, "in":1, on:1, to:1, of:1, "for":1, and:1, is:1, it:1, my:1, i:1 };
    function suggTokens(q) {
      return String(q).toLowerCase().split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1 && !SUGG_STOP[t]; });
    }
    function suggHits(hay, toks) {
      var h = String(hay).toLowerCase();
      return toks.every(function (t) { return h.indexOf(t) > -1; });
    }
    function suggestionsFor(q) {
      var toks = suggTokens(q);
      if (!toks.length) return { facets: [], stories: sorted().slice(0, 4), empty: true };
      var st = STORIES.filter(function (s) {
        return suggHits([s.title, s.excerpt, s.category].concat(s.topics, s.destinations, s.lifeMoments).join(" "), toks);
      }).slice(0, 5);
      var facets = [];
      TOPIC_OPTIONS.forEach(function (o) { if (suggHits(o.label, toks)) facets.push({ kind: "tag", value: o.id, label: o.label }); });
      ALL_COUNTRIES.forEach(function (c) { if (suggHits(c, toks)) facets.push({ kind: "country", value: c, label: c }); });
      LIFE_MOMENTS.forEach(function (m) { if (suggHits(m, toks)) facets.push({ kind: "moment", value: m, label: m }); });
      return { facets: facets.slice(0, 5), stories: st, empty: false };
    }
    var FACET_ICON = { tag: "\uD83C\uDFF7\uFE0F", country: "\uD83D\uDCCD", moment: "\u2728" };
    var FACET_KIND = { tag: "Topic", country: "Destination", moment: "Life moment" };
    function suggHTML(q) {
      var r = suggestionsFor(q), h = "";
      if (!r.facets.length && !r.stories.length) {
        return '<p class="st-sugg__none">No stories match &ldquo;' + esc(q) + '&rdquo;. Try a destination, a topic, or a life moment.</p>';
      }
      if (r.facets.length) {
        h += '<p class="st-sugg__h">Filter by</p>';
        r.facets.forEach(function (f) {
          h += '<button type="button" class="st-sugg__row" data-sugg-facet="' + f.kind + '" data-sugg-value="' + esc(f.value) + '">'
            + '<span class="st-sugg__ico">' + (f.kind === "moment" ? (MOMENT_EMOJI[f.value] || FACET_ICON.moment) : FACET_ICON[f.kind]) + '</span>'
            + '<span class="st-sugg__label">' + esc(f.label) + '</span>'
            + '<span class="st-sugg__kind">' + FACET_KIND[f.kind] + '</span></button>';
        });
      }
      if (r.stories.length) {
        h += '<p class="st-sugg__h">' + (r.empty ? "Latest stories" : "Stories") + '</p>';
        r.stories.forEach(function (s) {
          h += '<a class="st-sugg__row" href="' + hrefFor(s) + '">'
            + '<img class="st-sugg__thumb" src="' + esc(s.image) + '" alt="" />'
            + '<span class="st-sugg__text"><span class="st-sugg__title">' + esc(s.title) + '</span>'
            + '<span class="st-sugg__meta">' + esc(s.category) + ' &middot; ' + s.readTime + ' min read</span></span></a>';
        });
      }
      return h;
    }
    function openSugg(q) {
      $$('[data-sugg]').forEach(function (el) {
        if (!el.closest('.st-search').querySelector('[data-search]').offsetParent) return;
        el.innerHTML = suggHTML(q);
        el.hidden = false;
        el.closest('.st-search').classList.add('is-open');
      });
    }
    function closeSugg() {
      $$('[data-sugg]').forEach(function (el) { el.hidden = true; el.closest('.st-search').classList.remove('is-open'); });
    }
    document.addEventListener('focusin', function (e) { if (e.target.matches('[data-search]')) openSugg(e.target.value); });
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('.st-search')) closeSugg(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSugg(); });
    document.addEventListener('click', function (e) {
      var f = e.target.closest('[data-sugg-facet]');
      if (!f) return;
      var kind = f.getAttribute('data-sugg-facet'), val = f.getAttribute('data-sugg-value');
      if (kind === 'tag') { toggleSet(state.tags, val); state.openSections.add('topics'); }
      if (kind === 'country') { toggleSet(state.countries, val); state.openSections.add('destination'); }
      if (kind === 'moment') { toggleSet(state.moments, val); state.openSections.add('moment'); }
      state.query = ""; state.visible = PAGE;
      $$('[data-search]').forEach(function (i) { i.value = ""; });
      closeSugg();
      renderAll();
    });

    // ----- events (delegated on document) -----
    document.addEventListener('input', function (e) {
      var t = e.target;
      if (t.matches('[data-search]')) {
        state.query = t.value; state.visible = PAGE;
        $$('[data-search]').forEach(function (i) { if (i !== t) i.value = t.value; });
        openSugg(t.value);
        renderResults();
      }
    });
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (t.matches('[data-tag]'))    { toggleSet(state.tags, t.getAttribute('data-tag')); state.visible = PAGE; renderAll(); return; }
      if (t.matches('[data-country]')){ toggleSet(state.countries, t.getAttribute('data-country')); state.visible = PAGE; renderAll(); return; }
      if (t.matches('[data-moment]')) { toggleSet(state.moments, t.getAttribute('data-moment')); state.visible = PAGE; renderAll(); return; }
    });
    document.addEventListener('click', function (e) {
      var sec = e.target.closest('[data-section]');
      if (sec) { toggleSet(state.openSections, sec.getAttribute('data-section')); renderPanels(); return; }
      var reg = e.target.closest('[data-region]');
      if (reg) { toggleSet(state.openRegions, reg.getAttribute('data-region')); renderPanels(); return; }
      if (e.target.closest('[data-clear-filters]') || e.target.closest('[data-clear]') || e.target.closest('[data-clear-all]')) { clearAll(); return; }
      if (e.target.closest('[data-more]')) { state.visible += PAGE; renderResults(); return; }
      if (e.target.closest('[data-open-drawer]')) { openDrawer(); return; }
      if (e.target.closest('[data-close-drawer]')) { closeDrawer(); return; }
    });

    // ----- mobile drawer -----
    var drawer = $('[data-drawer]');
    function openDrawer() { drawer.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(function () { drawer.classList.add('is-open'); }); }
    function closeDrawer() { drawer.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(function () { drawer.hidden = true; }, 300); }

    // ----- sticky mobile bar (slide in once #stories-bar scrolls past) -----
    var sticky = $('[data-sticky]'), bar = document.getElementById('stories-bar');
    function onScroll() {
      if (!bar) return;
      var past = bar.getBoundingClientRect().bottom < 0;
      sticky.classList.toggle('is-visible', past);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    renderAll();
    onScroll();
  })();
  </script>
<script>/* Save-a-read heart on every .story-card — mirrors SaveStoryButton.
   Injected rather than written into each card's markup so it reaches the
   JS-rendered grids too (a MutationObserver re-runs it after a re-render).
   Shares the "trutravels-saved-stories" key with the prototype's dashboard. */
(function () {
  var KEY = 'trutravels-saved-stories';
  var OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>';
  var FILL = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>';
  function ids() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function idFor(card) {
    var h = card.getAttribute('href') || '';
    var m = h.match(/story-([a-z0-9-]+)\.html/);
    if (m) return m[1];
    m = h.match(/#([a-z0-9-]+)$/);
    return m ? m[1] : null;
  }
  function paint(el, saved) {
    el.innerHTML = saved ? FILL : OUT;
    el.classList.toggle('is-saved', saved);
    el.setAttribute('aria-label', saved ? 'Remove from saved reads' : 'Save this read');
    el.setAttribute('aria-pressed', saved ? 'true' : 'false');
  }
  function enhance() {
    document.querySelectorAll('.story-card').forEach(function (card) {
      var media = card.querySelector('.story-card__media');
      if (!media || media.querySelector('.story-card__save')) return;
      var id = idFor(card);
      if (!id) return;
      var btn = document.createElement('span');
      btn.className = 'story-card__save';
      btn.setAttribute('role', 'button');
      btn.tabIndex = 0;
      paint(btn, ids().indexOf(id) > -1);
      function toggle(e) {
        e.preventDefault(); e.stopPropagation();   /* don't follow the card's link */
        var list = ids(), i = list.indexOf(id);
        if (i > -1) list.splice(i, 1); else list.push(id);
        localStorage.setItem(KEY, JSON.stringify(list));
        paint(btn, i === -1);
      }
      btn.addEventListener('click', toggle);
      btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') toggle(e); });
      media.appendChild(btn);
    });
  }
  enhance();
  /* browse grids re-render on filter/search, so pick up new cards as they appear */
  var pending = null;
  new MutationObserver(function () {
    if (pending) return;
    /* setTimeout, not requestAnimationFrame — rAF is throttled to a standstill
       in a background tab, which would leave re-rendered cards without hearts. */
    pending = setTimeout(function () { pending = null; enhance(); }, 0);
  }).observe(document.body, { childList: true, subtree: true });
})();
</script>
</body>
</html>
'''

HTML = (HTML
  .replace("__NAV__", NAV)
  .replace("__VD_SEC__", VD_SEC)
  .replace("__VD_MODAL__", VD_MODAL)
  .replace("__FOOTER__", FOOTER)
  .replace("__SCRIPTS__", SCRIPTS)
  .replace("__TV__", TV_SVG)
  .replace("__BOOK__", BOOK_SVG)
  .replace("__STORIES_JSON__", STORIES_JSON))

open(os.path.join(BASE, "stories.html"), "w", encoding="utf-8").write(HTML)
print("wrote stories.html:", HTML.count(chr(10)) + 1, "lines")
