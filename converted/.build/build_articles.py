import json, os, re

BASE = "/Users/markpope/Claude Test/trutravels/converted"
SP = "/private/tmp/claude-501/-Users-markpope-Claude-Test-trutravels/6a63a474-8847-434b-b8ad-6a498a49e3e8/scratchpad"
def L(fn): return open(os.path.join(BASE, fn), encoding="utf-8").read().split("\n")
def block(fn, a, b): return "\n".join(L(fn)[a-1:b])

NAV     = block("explore.html", 17, 114)
FOOTER  = block("explore.html", 517, 593)
SCRIPTS = block("explore.html", 594, 839)

stories = json.load(open(SP + "/stories.json"))
articles = json.load(open(SP + "/articles.json"))
authors = json.load(open(SP + "/authors.json"))
tourcards = json.load(open(SP + "/tourcards.json"))

by_id = {s["id"]: s for s in stories}
ARTICLE_IDS = set(articles.keys())

# author name -> slug (via aliases)
name2slug = {}
for a in authors:
    name2slug[a["name"]] = a["slug"]
    for al in a.get("aliases", []):
        name2slug[al] = a["slug"]

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
def fmt(iso):
    y,m,d = iso.split("-"); return "%d %s %s" % (int(d), MONTHS[int(m)-1], y)
def esc(s):
    return (str(s).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;"))

def author_href(name):
    slug = name2slug.get(name)
    return ("author-" + slug + ".html") if slug else None

def story_href(s):
    if s.get("memberOnly"): return "signup.html"
    if s["id"] in ARTICLE_IDS: return "story-" + s["id"] + ".html"
    return "stories.html#" + s["id"]

def cta_href(h):
    if not h: return "all-trips.html"
    if "explore" in h: return "explore.html"
    if h.rstrip("/").endswith("stories"): return "stories.html"
    return "all-trips.html"

ICON_BACK = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>'
ICON_SHARE = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>'
ICON_HEART = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>'
ICON_LINK = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>'
ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>'
ICON_MAIL = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>'
ICON_SMS = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>'
# --- full .tripcard renderer (ported from all-trips.html so tours match exactly) ---
PIN = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
CAL = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
ACT = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
CHEV = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>'
STARS5 = STAR * 5

def tripcard(t):
    save = ('<div class="tripcard__save"><span>Save</span><span class="tripcard__save-pct">%d%%</span><span>Off</span></div>' % t["save"]) if t.get("save") else ''
    strike = ('<span class="tripcard__strike">&pound;%d</span>' % t["originalPrice"]) if t.get("originalPrice") else ''
    rating = ('<div class="tripcard__rating"><div class="tripcard__stars">%s</div><span class="num">%s</span><span class="rev">(%s Reviews)</span></div>' % (STARS5, t["rating"], t["reviewCount"])) if t.get("rating") else ''
    route = ('<p class="tripcard__route">%s %s &mdash; %s</p>' % (PIN, esc(t["start"]), esc(t["end"]))) if (t.get("start") and t.get("end")) else ''
    facts = ('<div class="tripcard__facts"><span>%s %s</span>%s%s</div>'
             % (CAL, esc(t["duration"]),
                ('<span>%s %s Places</span>' % (PIN, t["places"])) if t.get("places") else '',
                ('<span>%s %s Activities</span>' % (ACT, t["activities"])) if t.get("activities") else ''))
    exp = ''
    if t.get("expTypes"):
        pills = "".join('<div class="exp-ico"><img src="assets/experience-icons/%s.png" alt="" aria-hidden="true" /><span class="name">%s</span><span class="count">%s</span></div>' % (x["icon"], esc(x["name"]), x["count"]) for x in t["expTypes"])
        cb = 'art-exp-' + t["id"]
        exp = ('<div class="tripcard__exp"><input type="checkbox" id="%s" class="tripcard__exp-cb" /><label class="tripcard__exp-sum" for="%s"><span>TRU Experience Types &middot; <span class="tripcard__exp-count">%s activities</span></span>%s</label><div class="tripcard__exp-wrap"><div class="tripcard__exp-inner"><div class="tripcard__pills">%s</div></div></div></div>'
               % (cb, cb, t["activities"], CHEV, pills))
    return (
      '<article class="tripcard"><a class="tripcard__link" href="%s" aria-label="%s"></a><div class="tripcard__inner">' % (t.get("href") or "#", esc(t["title"]))
      + '<div class="tripcard__media"><img class="tripcard__image" src="%s" alt="%s" /><div class="tripcard__grad"></div><img class="tripcard__badge" src="assets/%s.png" alt="%s travel style" />%s</div>' % (t["image"], esc(t["title"]), t["styleLogo"], esc(t["styleLabel"]), save)
      + '<div class="tripcard__body"><div class="tripcard__titlerow"><h3 class="tripcard__title">%s</h3><div class="tripcard__pricecol"><div class="tripcard__prices">%s<span class="tripcard__price">&pound;%d</span></div><p class="tripcard__perday"><span>&pound;%s</span> per day</p></div></div>' % (esc(t["title"]), strike, t["price"], t["perday"])
      + route + rating + '<p class="tripcard__tagline">%s</p>' % esc(t["tagline"]) + facts + exp + '</div></div></article>'
    )

def keep_card(s):
    locked = bool(s.get("memberOnly"))
    return (
      '<a class="story-card%s" href="%s">' % (' story-card--locked' if locked else '', story_href(s))
      + '<div class="story-card__media"><img class="story-card__image" src="%s" alt="%s" />' % (s["image"], esc(s["title"]))
      + ('<span class="story-card__badge">Exclusive</span>' if locked else '')
      + '<span class="story-card__time">%s min</span></div>' % s["readTime"]
      + '<div class="story-card__body"><p class="story-card__category">%s</p>' % esc(s["category"])
      + '<h3 class="story-card__title">%s</h3>' % esc(s["title"])
      + '<p class="story-card__excerpt">%s</p>' % esc(s["excerpt"])
      + '<div class="story-card__foot"><p class="story-card__meta"><strong>%s</strong> &middot; %s</p>' % (esc(s["author"]), fmt(s["date"]))
      + '<span class="story-card__read">%s &rarr;</span></div></div></a>' % ('Join to read' if locked else 'Read story')
    )

# ---- Component showcase: turn specific section images into a slider / video ----
# (same .art-section__media box, so the box size is unchanged)
PLAY_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
STACK_SVG = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16V6a2 2 0 012-2h10M8 8h10a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z"/></svg>'
NEXT_SVG = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>'

SLIDER_MEDIA = {
    "top-5-places-to-visit-in-thailand": {
        0: [
            ("https://cdn.trutravels.com/images/thailandbottlebeach.jpeg", "Bottle Beach, Koh Phangan"),
            ("https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg", "Koh Nang Yuan viewpoint"),
            ("https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80", "Phi Phi Islands from above"),
            ("https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80", "Longtail boats, Railay"),
        ],
    },
}
VIDEO_MEDIA = {
    "top-5-places-to-visit-in-thailand": {
        1: {
            "src": "https://videos.pexels.com/video-files/1093661/1093661-uhd_2560_1440_30fps.mp4",
            "poster": "https://cdn.trutravels.com/blog/khao-sok-southern-thailand-blog.jpg",
        },
    },
}

def render_slider(slides):
    imgs = "".join('<div class="art-slider__slide"><img src="%s" alt="%s" /></div>' % (u, esc(a)) for (u, a) in slides)
    return (
      '<div class="art-section__media"><div class="art-slider" data-slider>'
      + '<div class="art-slider__track" data-track>%s</div>' % imgs
      + '<span class="art-slider__badge">%s <span data-count>1 / %d</span></span>' % (STACK_SVG, len(slides))
      + '<button class="art-slider__arrow art-slider__arrow--prev" type="button" data-slide="prev" aria-label="Previous image">%s</button>' % ICON_BACK
      + '<button class="art-slider__arrow art-slider__arrow--next" type="button" data-slide="next" aria-label="Next image">%s</button>' % NEXT_SVG
      + '<div class="art-slider__dots" data-dots></div>'
      + '</div></div>'
    )

def render_video(v):
    return (
      '<div class="art-section__media art-video" data-video>'
      + '<video class="art-video__el" preload="metadata" playsinline poster="%s"><source src="%s" type="video/mp4" /></video>' % (v["poster"], v["src"])
      + '<button class="art-video__play" type="button" data-video-play aria-label="Play video"><span>%s</span></button>' % PLAY_SVG
      + '<span class="art-video__badge">Video</span>'
      + '</div>'
    )

def build_article(sid):
    s = by_id[sid]; art = articles[sid]
    ahref = author_href(s["author"])
    author_html = ('<a href="%s" class="art-hero__author">%s</a>' % (ahref, esc(s["author"]))) if ahref else ('<span class="art-hero__author">%s</span>' % esc(s["author"]))

    # intro
    intro = ""
    for i, p in enumerate(art["intro"]):
        cls = "art-intro__lead" if i == 0 else "art-intro__p"
        intro += '<p class="%s">%s</p>' % (cls, esc(p))

    # sections (alternating)
    secs = ""
    for i, sec in enumerate(art["sections"]):
        alt = " art-section--alt" if i % 2 == 1 else ""
        body = "".join('<p>%s</p>' % esc(p) for p in sec["body"])
        kicker = '<p class="art-section__kicker">%s</p>' % esc(sec["kicker"]) if sec.get("kicker") else ''
        img = ''
        slides = SLIDER_MEDIA.get(sid, {}).get(i)
        vid = VIDEO_MEDIA.get(sid, {}).get(i)
        if slides:
            img = render_slider(slides)
        elif vid:
            img = render_video(vid)
        elif sec.get("image"):
            img = '<div class="art-section__media"><img src="%s" alt="%s" /></div>' % (sec["image"], esc(sec.get("imageAlt") or sec["heading"]))
        secs += (
          '<section class="art-section%s">' % alt
          + '<div class="art-section__text">%s<h2 class="art-section__h">%s</h2>%s</div>' % (kicker, esc(sec["heading"]), body)
          + img + '</section>'
        )

    # tours (full .tripcard carousel)
    tours_html = ""
    tids = [t for t in (art.get("tourIds") or []) if t in tourcards]
    if tids:
        cards = "".join(tripcard(tourcards[t]) for t in tids)
        tours_html = (
          '<section class="art-tours"><div class="container">'
          + '<div class="art-tours__eyebrow-row"><span class="art-tours__rule"></span><p class="art-tours__eyebrow">Tick Them Off</p></div>'
          + '<h2 class="art-tours__title">Tours With These <span class="tx-pink">Sites</span> In</h2>'
          + '<p class="art-tours__intro">Every one of these group adventures takes you to spots from this story. Find your crew and go see them for real.</p>'
          + '<div class="rev-carousel" data-arrows><div class="carousel carousel--related">%s</div>' % cards
          + '<button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous">%s</button>' % ICON_BACK
          + '<button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>'
          + '</div></div></section>'
        )

    # cta
    cta_html = ""
    if art.get("cta"):
        c = art["cta"]
        cta_html = (
          '<section class="art-cta"><div class="container"><div class="art-cta__box">'
          + '<h2 class="art-cta__h">%s</h2>' % esc(c["heading"])
          + '<p class="art-cta__p">%s</p>' % esc(c["body"])
          + '<a class="art-cta__btn" href="%s">%s &rarr;</a>' % (cta_href(c.get("href")), esc(c["label"]))
          + '</div></div></section>'
        )

    # keep reading (same type, not self, 3)
    related = [x for x in stories if x["id"] != sid and x["type"] == s["type"]][:3]
    keep_html = ""
    if related:
        keep_html = (
          '<section class="art-keep"><div class="container">'
          + '<p class="st-sub-eyebrow">Keep Reading</p><h2 class="art-keep__title">More Stories</h2>'
          + '<div class="art-keep__grid">%s</div>' % "".join(keep_card(x) for x in related)
          + '</div></section>'
        )

    # share/save actions
    share_pop = (
      '<div class="art-share__pop" data-share-pop hidden>'
      + '<button type="button" class="art-share__opt" data-copy><span class="art-share__ic">%s</span><span data-copy-label>Copy link</span></button>' % ICON_LINK
      + '<a class="art-share__opt" data-wa target="_blank" rel="noopener noreferrer"><span class="art-share__ic">%s</span>WhatsApp</a>' % ICON_WA
      + '<a class="art-share__opt" data-mail><span class="art-share__ic">%s</span>Email</a>' % ICON_MAIL
      + '<a class="art-share__opt" data-sms><span class="art-share__ic">%s</span>SMS</a>' % ICON_SMS
      + '</div>'
    )

    doc = TEMPLATE
    doc = doc.replace("__TITLE__", esc(s["title"]))
    doc = doc.replace("__DESC__", esc(s["excerpt"]))
    doc = doc.replace("__NAV__", NAV)
    doc = doc.replace("__HERO_IMG__", s["image"])
    doc = doc.replace("__CATEGORY__", esc(s["category"]))
    doc = doc.replace("__H1__", esc(s["title"]))
    doc = doc.replace("__AUTHOR__", author_html)
    doc = doc.replace("__DATE__", fmt(s["date"]))
    doc = doc.replace("__READTIME__", str(s["readTime"]))
    doc = doc.replace("__SHARE_POP__", share_pop)
    doc = doc.replace("__INTRO__", intro)
    doc = doc.replace("__SECTIONS__", secs)
    doc = doc.replace("__TOURS__", tours_html)
    doc = doc.replace("__CTA__", cta_html)
    doc = doc.replace("__KEEP__", keep_html)
    doc = doc.replace("__FOOTER__", FOOTER)
    doc = doc.replace("__SCRIPTS__", SCRIPTS)
    doc = doc.replace("__ICON_BACK__", ICON_BACK)
    doc = doc.replace("__ICON_SHARE__", ICON_SHARE)
    doc = doc.replace("__ICON_HEART__", ICON_HEART)
    doc = doc.replace("__STORYID__", sid)
    open(os.path.join(BASE, "story-%s.html" % sid), "w", encoding="utf-8").write(doc)
    return "story-%s.html" % sid

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>__TITLE__ — TruTravels</title>
  <meta name="description" content="__DESC__" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body id="top">
  <div class="read-progress"><span class="read-progress__bar" data-progress></span></div>
__NAV__

  <article class="article">
    <!-- HERO -->
    <section class="art-hero">
      <img class="art-hero__bg" src="__HERO_IMG__" alt="__H1__" />
      <div class="art-hero__grad"></div>
      <div class="container art-hero__inner">
        <a class="art-hero__back" href="stories.html">__ICON_BACK__ All Stories</a>
        <p class="art-hero__category">__CATEGORY__</p>
        <h1 class="art-hero__title">__H1__</h1>
        <div class="art-hero__meta">__AUTHOR__<span class="art-hero__dot">&middot;</span><span>__DATE__</span><span class="art-hero__dot">&middot;</span><span>__READTIME__ min read</span></div>
        <div class="art-actions">
          <div class="art-share">
            <button type="button" class="art-action" data-share-toggle aria-label="Share this story">__ICON_SHARE__</button>
            __SHARE_POP__
          </div>
          <button type="button" class="art-action" data-save aria-label="Save to favourites">__ICON_HEART__</button>
        </div>
      </div>
    </section>

    <!-- INTRO -->
    <section class="art-intro"><div class="art-intro__inner">__INTRO__<div class="art-intro__rule"></div></div></section>

    <!-- SECTIONS -->
    <div class="art-sections"><div class="art-sections__inner">__SECTIONS__</div></div>

__TOURS__
__CTA__
__KEEP__

    <div class="footer-toplink"><div class="container"><a class="btn-top" href="#top"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg> Take Me To The Top</a></div></div>
  </article>

__FOOTER__
__SCRIPTS__
  <script>/* article — reading progress + share + save */
  (function () {
    var bar = document.querySelector('[data-progress]');
    function prog() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', prog, { passive: true });
    window.addEventListener('resize', prog); prog();

    var url = window.location.href;
    var title = document.querySelector('.art-hero__title').textContent;
    var text = encodeURIComponent('Check out this story: ' + title);
    var enc = encodeURIComponent(url);
    var wa = document.querySelector('[data-wa]'); if (wa) wa.href = 'https://wa.me/?text=' + text + '%20' + enc;
    var mail = document.querySelector('[data-mail]'); if (mail) mail.href = 'mailto:?subject=' + text + '&body=' + text + '%20' + enc;
    var sms = document.querySelector('[data-sms]'); if (sms) sms.href = 'sms:?&body=' + text + '%20' + enc;

    var toggle = document.querySelector('[data-share-toggle]');
    var pop = document.querySelector('[data-share-pop]');
    toggle.addEventListener('click', function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; });
    document.addEventListener('click', function (e) { if (!pop.hidden && !pop.contains(e.target) && e.target !== toggle) pop.hidden = true; });
    var copy = document.querySelector('[data-copy]');
    copy.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(url);
      var lab = document.querySelector('[data-copy-label]'); var old = lab.textContent;
      lab.textContent = 'Copied!'; setTimeout(function () { lab.textContent = old; }, 1500);
    });
    pop.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { pop.hidden = true; }); });

    var save = document.querySelector('[data-save]');
    var KEY = 'truSavedStories';
    var id = '__STORYID__';
    function saved() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
    function isSaved() { return saved().indexOf(id) > -1; }
    function paint() { save.classList.toggle('is-saved', isSaved()); }
    save.addEventListener('click', function () {
      var arr = saved(); var i = arr.indexOf(id);
      if (i > -1) arr.splice(i, 1); else arr.push(id);
      try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
      paint();
    });
    paint();

    /* image sliders (gallery inside a section box) */
    document.querySelectorAll('[data-slider]').forEach(function (sl) {
      var track = sl.querySelector('[data-track]');
      var n = track.children.length, idx = 0;
      var dots = sl.querySelector('[data-dots]'), countEl = sl.querySelector('[data-count]');
      for (var d = 0; d < n; d++) { var b = document.createElement('button'); b.type = 'button'; b.className = 'art-slider__dot'; b.setAttribute('data-dot', d); dots.appendChild(b); }
      function go(k) {
        idx = (k + n) % n;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        for (var i = 0; i < dots.children.length; i++) dots.children[i].classList.toggle('is-on', i === idx);
        if (countEl) countEl.textContent = (idx + 1) + ' / ' + n;
      }
      sl.querySelector('[data-slide="prev"]').addEventListener('click', function () { go(idx - 1); });
      sl.querySelector('[data-slide="next"]').addEventListener('click', function () { go(idx + 1); });
      dots.addEventListener('click', function (e) { var t = e.target.closest('[data-dot]'); if (t) go(+t.getAttribute('data-dot')); });
      go(0);
    });

    /* inline videos (click to play in the section box) */
    document.querySelectorAll('[data-video]').forEach(function (v) {
      var el = v.querySelector('video'), play = v.querySelector('[data-video-play]');
      if (play) play.addEventListener('click', function () { el.controls = true; el.play(); v.classList.add('is-playing'); });
    });
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

built = [build_article(k) for k in articles.keys()]
print("built", len(built), "article pages:")
for b in built: print(" -", b)
