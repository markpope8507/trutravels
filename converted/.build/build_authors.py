import json, os

BASE = "/Users/markpope/Claude Test/trutravels/converted"
SP = "/private/tmp/claude-501/-Users-markpope-Claude-Test-trutravels/6a63a474-8847-434b-b8ad-6a498a49e3e8/scratchpad"
def L(fn): return open(os.path.join(BASE, fn), encoding="utf-8").read().split("\n")
def block(fn, a, b): return "\n".join(L(fn)[a-1:b])

# solid nav (no --over overlay; author page has no hero image)
NAV = block("explore.html", 17, 114).replace('<header class="site-nav site-nav--over" data-nav>', '<header class="site-nav" data-nav>', 1)
FOOTER  = block("explore.html", 517, 593)
SCRIPTS = block("explore.html", 594, 839)

stories = json.load(open(SP + "/stories.json"))
authors = json.load(open(SP + "/authors.json"))
articles = json.load(open(SP + "/articles.json"))
ARTICLE_IDS = set(articles.keys())

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
def story_href(s):
    if s.get("memberOnly"): return "signup.html"
    if s["id"] in ARTICLE_IDS: return "story-" + s["id"] + ".html"
    return "stories.html#" + s["id"]

BACK = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>'
GLOBE = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M3.5 12h17M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18"/></svg>'
IG = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.75a1 1 0 100 2 1 1 0 000-2z"/></svg>'
LI = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 17V10.5H6.17V17h2.17zM7.25 9.31a1.26 1.26 0 100-2.52 1.26 1.26 0 000 2.52zM18 17v-3.57c0-1.9-.41-3.36-2.63-3.36-1.07 0-1.79.59-2.08 1.14h-.03V10.5h-2.08V17h2.17v-3.21c0-.85.16-1.67 1.21-1.67 1.04 0 1.05.97 1.05 1.73V17H18z"/></svg>'
TT = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>'

def social(href, label, icon):
    return '<a class="author-social" href="%s" target="_blank" rel="noopener noreferrer" aria-label="%s">%s</a>' % (href, esc(label), icon)

def acard(s):
    return (
      '<a class="acard" href="%s">' % story_href(s)
      + '<div class="acard__media"><img src="%s" alt="%s" /></div>' % (s["image"], esc(s["title"]))
      + '<div class="acard__body"><p class="acard__eyebrow">%s &middot; %s min read</p>' % (esc(s["category"]), s["readTime"])
      + '<h3 class="acard__title">%s</h3>' % esc(s["title"])
      + '<p class="acard__excerpt">%s</p>' % esc(s["excerpt"])
      + '<p class="acard__date">%s</p></div></a>' % fmt(s["date"])
    )

def build_author(a):
    authored = [s for s in stories if name2slug.get(s["author"]) == a["slug"]]
    first = a["name"].split(" ")[0]
    soc = a.get("socials") or {}
    socials = ""
    if soc.get("website"): socials += social(soc["website"], a["name"] + "'s blog", GLOBE)
    if soc.get("instagram"): socials += social(soc["instagram"], a["name"] + " on Instagram", IG)
    if soc.get("linkedin"): socials += social(soc["linkedin"], a["name"] + " on LinkedIn", LI)
    if soc.get("tiktok"): socials += social(soc["tiktok"], a["name"] + " on TikTok", TT)
    socials_html = ('<div class="author-socials">%s</div>' % socials) if socials else ""

    if authored:
        cards = "".join(acard(s) for s in authored)
        words = (
          '<h2 class="author-words__h">Words by <span class="tx-pink">%s</span>' % esc(first)
          + '<span class="author-words__count">%d %s</span></h2>' % (len(authored), "story" if len(authored) == 1 else "stories")
          + '<div class="author-words__grid">%s</div>' % cards
        )
    else:
        words = '<p class="author-words__empty">Check back soon for stories from %s.</p>' % esc(a["name"])

    doc = TEMPLATE
    doc = doc.replace("__NAME__", esc(a["name"]))
    doc = doc.replace("__BIO__", esc(a["bio"]))
    doc = doc.replace("__NAV__", NAV)
    doc = doc.replace("__BACK__", BACK)
    doc = doc.replace("__AVATAR__", a["image"])
    doc = doc.replace("__ROLE__", esc(a["role"]))
    doc = doc.replace("__H1__", esc(a["name"]))
    doc = doc.replace("__BIOTEXT__", esc(a["bio"]))
    doc = doc.replace("__SOCIALS__", socials_html)
    doc = doc.replace("__WORDS__", words)
    doc = doc.replace("__FOOTER__", FOOTER)
    doc = doc.replace("__SCRIPTS__", SCRIPTS)
    open(os.path.join(BASE, "author-%s.html" % a["slug"]), "w", encoding="utf-8").write(doc)
    return "author-%s.html" % a["slug"], len(authored)

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>__NAME__ — TruTravels</title>
  <meta name="description" content="__BIO__" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body id="top">
__NAV__

  <div class="author-page">
    <!-- HERO -->
    <section class="author-hero">
      <img class="author-hero__wm" src="assets/bg-assets/tru-logo.svg" alt="" aria-hidden="true" />
      <div class="container author-hero__inner">
        <a class="author-hero__back" href="stories.html">__BACK__ All Stories</a>
        <div class="author-hero__row">
          <img class="author-avatar" src="__AVATAR__" alt="__H1__" />
          <div class="author-hero__text">
            <p class="author-role">__ROLE__</p>
            <h1 class="author-name">__H1__</h1>
            <p class="author-bio">__BIOTEXT__</p>
            __SOCIALS__
          </div>
        </div>
      </div>
    </section>

    <!-- WORDS BY -->
    <section class="author-words"><div class="container">
      <div class="author-words__divider"></div>
      __WORDS__
    </div></section>

    <div class="footer-toplink"><div class="container"><a class="btn-top" href="#top"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg> Take Me To The Top</a></div></div>
  </div>

__FOOTER__
__SCRIPTS__
</body>
</html>
'''

built = [build_author(a) for a in authors]
print("built", len(built), "author pages:")
for name, n in built: print(" - %s (%d stories)" % (name, n))
