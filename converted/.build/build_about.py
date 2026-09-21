"""
Build the static About section.

Mirrors src/app/about/* into converted/:

    about.html                          the hub
    about-our-story.html                the founder story
    about-our-values.html               mission + core values
    about-our-impact.html               People & Planet Promise
    about-our-community.html            the community, diaries, local legends
    about-our-brand.html                manifesto + brand pillars
    about-our-impact-<cte>.html         one per Community Tourism Enterprise

As with the other generators, nothing already in the build is re-typed:

  · nav / footer / shared scripts come from shell.py
  · the reviews block is lifted verbatim out of index.html
  · the hero, prose column and card styles reuse the .ess-* rules the
    Essentials pages introduced — the layouts are identical, so there is one
    implementation rather than two that can drift
  · CTE copy and the About page list are read straight from src/lib, so the
    prototype stays the single source

Only genuinely new styling lives under .ab-* in ../styles.css.

Run:  python3 converted/.build/build_about.py
"""

import json, os, re

from shell import BASE, block, NAV_OVER, FOOTER, SCRIPTS, HEAD, chunk

SRC = os.path.join(BASE, "..", "src")

# The reviews block, lifted whole so it matches the homepage exactly.
REVIEWS = chunk("index.html", '<section class="reviews" id="reviews">')

CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')


# ------------------------------------------------------------ prototype data --
def ts(name):
    return open(os.path.join(SRC, "lib", name), encoding="utf-8").read()


def ts_array(source, const):
    """Pull a TS array literal out and parse it as JSON (quoting the keys)."""
    raw = re.search(rf"{const}[^=]*=\s*(\[.*?\n\];)", source, re.S).group(1)[:-1]
    # whole-line // comments only — anything else would eat the // in https://
    raw = re.sub(r"^\s*//.*$", "", raw, flags=re.M)
    raw = re.sub(r"(\{|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', raw)
    raw = re.sub(r",(\s*[\]}])", r"\1", raw)
    return json.loads(raw)


CTES = ts_array(ts("ctes.ts"), "CTES")
ABOUT_PAGES = ts_array(ts("about-pages.ts"), "ABOUT_PAGES")
DIARIES = ts_array(
    re.sub(r"truClips\.(\w+)\.(video|poster)", r'"\1-\2"', ts("data.ts")), "videoDiaries"
)

# The diary clips and their posters, mirroring `truClips` in src/lib/data.ts.
#
# These used to be Unsplash stills — a scenery photo per diary — because "the
# static build has no video hosting wired up". That stopped being true: the
# clips sit on public blob storage, which a static page can point at as easily
# as the prototype does. The cards were showing a beach where the prototype
# shows the traveller talking to camera, and the viewer opened on a photo, so
# a "video diary" never played anything.
#
# ts_array() rewrites `truClips.X.video` / `.poster` into the tokens
# "X-video" / "X-poster", so the diary data arrives keyed by clip name.
BLOB = "https://zfxhmfjtkhpuo90l.public.blob.vercel-storage.com"
CLIP_FILE = {
    "traveller": "traveller-diary",
    "creator": "creator-diary",
    "influencer": "influencer-diary",
    "bali": "bali-this-is-your-sign",
    "jess": "jess-uuu-clip",
    "orty": "orty-welcome-vertical",   # 9:16 crop; the 16:9 original is the trip hub's
}


def _clip(token):
    """'traveller-poster' -> 'traveller'. Raises on anything unmapped rather
    than quietly falling back to a placeholder — a silent stand-in is how the
    stills survived here unnoticed."""
    name = token.rsplit("-", 1)[0]
    if name not in CLIP_FILE:
        raise KeyError(f"no clip file mapped for {token!r} — add it to CLIP_FILE")
    return CLIP_FILE[name]


def poster(d):
    """A real frame of the clip the card opens, extracted from the clip itself.
    Cards use <img> rather than <video>: Chrome caps how many <video> elements
    load at once and this page has nine, so thumbnails as <video> never got a
    slot and stayed black."""
    return f"{BLOB}/posters/{_clip(d['poster'])}.jpg"


def video(d):
    return f"{BLOB}/{_clip(d['video'])}.mp4"


PAGE_FOR = {p["href"]: p for p in ABOUT_PAGES}


def static_href(route):
    """Prototype route -> the file it became in this build."""
    return {
        "/about": "about.html",
        "/about/our-story": "about-our-story.html",
        "/about/our-values": "about-our-values.html",
        "/about/our-impact": "about-our-impact.html",
        "/about/our-community": "about-our-community.html",
        "/about/our-brand": "about-our-brand.html",
        "/the-tru-way": "index.html",          # not converted yet
        "/explore": "explore.html",
    }.get(route, "index.html")


# ------------------------------------------------------------------- pieces --
def shell_page(title, description, body, page_script=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>{title} &mdash; TruTravels</title>
  <meta name="description" content="{description}" />
</head>
<body>

{NAV_OVER}

  <main class="ab">
{body}
  </main>

{FOOTER}

{SCRIPTS}{page_script}
</body>
</html>
"""


def static_image(src):
    """Map a prototype image path to its static-build equivalent.

    ABOUT_PAGES stores images as they are served by Next, i.e. root-relative
    out of public/. The static build has no /images/ — its assets live under
    assets/ — so a path copied straight through 404s on every page that
    renders the cross-link grid. This is how /images/the-tru-way-hero.jpg
    was broken on six About pages.
    """
    if src.startswith("/images/"):
        return "assets/about/" + src[len("/images/"):]
    return src


def hero(image, alt, eyebrow, title_html, quote_html="", quote_class="ess-hero__quote"):
    quote = f'\n          <p class="{quote_class}">{quote_html}</p>' if quote_html else ""
    return f"""    <section class="ess-hero" id="top">
      <img class="ess-hero__img" src="{image}" alt="{alt}" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">{eyebrow}</p>
          <h1 class="ess-hero__title">{title_html}</h1>
          <div class="ess-hero__rule"></div>{quote}
        </div>
      </div>
    </section>"""


def watermarks(spec):
    return "\n".join(
        f'      <img class="ess-wm" style="{pos}" src="assets/bg-assets/{icon}.svg" alt="" aria-hidden="true" />'
        for icon, pos in spec
    )


def section_head(eyebrow, plain, pink, intro=""):
    out = (f'        <p class="ess-eyebrow">{eyebrow}</p>\n'
           f'        <h2 class="ess-h2">{plain} <span>{pink}</span></h2>')
    if intro:
        out += f'\n        <p class="ess-p ab-lede">{intro}</p>'
    return out


def more_about(current_route):
    """The cross-link grid at the foot of each About page."""
    cards = "\n".join(
        f'''          <a class="ab-xcard" href="{static_href(p["href"])}">
            <img src="{static_image(p["image"])}" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__t">{p["name"]}</span>
              <span class="ab-xcard__d">{p["description"]}</span>
            </span>
          </a>'''
        for p in ABOUT_PAGES if p["href"] != current_route
    )
    return f"""    <section class="ess-body ab-more">
{watermarks([("mask", "left:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
             ("ramen", "right:-3rem;bottom:-2.5rem;width:clamp(200px,26vw,440px);opacity:0.07")])}
      <div class="container">
{section_head("More About Us", "The Rest Of", "The Story")}
        <div class="ab-xgrid">
{cards}
        </div>
      </div>
    </section>"""


WM_SHORT = [("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
            ("bali-flower", "left:-4rem;top:50%;width:clamp(220px,28vw,460px);opacity:0.05")]


def prose(paras):
    return "\n".join(f"        {p}" for p in paras)


# -------------------------------------------------------------- our story --
STORY_WM = [
    ("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
    ("bali-flower", "left:-4rem;top:14%;width:clamp(220px,28vw,460px);opacity:0.06"),
    ("eyes", "right:-3rem;top:32%;width:clamp(200px,26vw,420px);opacity:0.05"),
    ("komodo-dragon", "left:-4rem;top:50%;width:clamp(240px,32vw,520px);opacity:0.05"),
    ("good-vibes", "right:-4rem;top:68%;width:clamp(220px,28vw,460px);opacity:0.06"),
    ("peru-bird", "left:-4rem;top:84%;width:clamp(200px,26vw,440px);opacity:0.05"),
    ("tru-logo", "right:-4rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.04"),
]


def our_story():
    body = f"""{hero("https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1920&q=80",
                     "Two backpackers on a beach at sunset",
                     "Our Story", "How We<br />Started",
                     "&ldquo;No timelines, no awards reels, no polished press kit. Just the honest version of how this whole thing started.&rdquo;")}

    <section class="ess-body">
{watermarks(STORY_WM)}
      <div class="ess-col ab-prose">
{prose([
  '<p class="ab-lead">Back in 2006, I was saving for a house in London.</p>',
  "<p>That was the plan. Work hard. Save money. Follow the path.</p>",
  "<p>And it was all coming together. I&rsquo;d found a house, had an offer agreed and was getting ready to move in.</p>",
  "<p>Then, at the eleventh hour, it fell through.</p>",
  "<p>After all that saving and planning, I was back where I&rsquo;d started. Only now, I wasn&rsquo;t so sure I wanted the same thing anymore.</p>",
  "<p>So instead of finding another house, I booked a one-way ticket to Australia. What I thought would be a few months away became three years. During that time, I discovered something that would change my life forever.</p>",
  "<p>Travel isn&rsquo;t really about the places you visit. It&rsquo;s about the person you become because of them. The confidence you build. The people you meet. The perspectives you gain. The moments that remind you there&rsquo;s a bigger world beyond your comfort zone.</p>",
  "<p>It&rsquo;s also about the connections you make.</p>",
  '<figure class="ab-polaroid"><img src="assets/about/mark-joe-story-2025.png" alt="Mark and Joe on the road, 2007" /></figure>',
  "<p>Whilst travelling, I met a guy called Joe. At the time, neither of us knew how important that friendship would become. Eventually our travels came to an end and we both returned to the UK. Life moved on, careers happened and, like so many friendships made on the road, we lost touch.</p>",
  "<p>Then, a few years later, we randomly met up for a beer.</p>",
  "<p>As travellers often do, we started talking about old stories, old adventures and some of the best years of our lives. And one question kept coming up: Why did travel have such a profound impact on us?</p>",
  "<p>The answer was simple.<br />Travel had changed us.<br />It had given us confidence.<br />Perspective.<br />Friendships.<br />Experiences we&rsquo;d carry with us forever.</p>",
  "<p>And it made us wonder: What if we could create experiences that gave other people that same feeling? That conversation became TruTravels.</p>",
  "<p>Today, we&rsquo;re driven by the same belief that inspired us from the very beginning:</p>",
  '<p class="ab-pull"><span>Travel has the power</span><span>to <em>change lives.</em></span></p>',
  "<p>We&rsquo;ve seen it happen thousands of times. We&rsquo;ve watched strangers become lifelong friends.<br />We&rsquo;ve seen people discover confidence they didn&rsquo;t know they had. We&rsquo;ve seen journeys become turning points.</p>",
  "<p>Because sometimes all it takes is one decision.</p>",
  "<p>A decision to ignore the script.<br />To step outside your comfort zone.<br />To choose possibility over predictability.</p>",
  '<p class="ab-beat">I never got the house.</p>',
  "<p>But by taking a chance on something different, I found friendships, purpose, perspective and experiences that shaped the rest of my life.</p>",
  '<p class="ab-strong">That&rsquo;s what travel gave me.</p>',
  '<p class="ab-closer">And that&rsquo;s what we&rsquo;ve spent the last decade trying to give others.</p>',
  '<p class="ab-sign">Mark x</p>',
])}
      </div>
    </section>

{more_about("/about/our-story")}"""
    return shell_page("Our Story",
                      "How TruTravels started — the honest version, straight from the founders.",
                      body)


# ------------------------------------------------------------- our values --
HEART = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
         '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09'
         'C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')
FEATHER = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
           '<path d="M12 22V11"/><path d="M12 11 Q 6 6 2 9"/><path d="M12 11 Q 18 6 22 9"/>'
           '<path d="M12 11 Q 9 4 6 3"/><path d="M12 11 Q 15 4 18 3"/><path d="M12 11 Q 12 5 12 2"/></svg>')

CORE_VALUES = [
    ('<span class="ab-val__w">We Don&rsquo;t Do</span>'
     '<span class="ab-val__p ab-val__p--wavy">Average</span>',
     "We only do mind-blowingly awesome. We pride ourselves on excellence and go over and above to provide "
     "life-changing experiences for all our customers every time. We are always striving to innovate and "
     "improve our services and our trips so we can provide the best value for our customers."),
    ('<span class="ab-val__w">For The</span>'
     '<span class="ab-val__p ab-val__p--pill">Benefit</span>'
     '<span class="ab-val__w">Of All</span>',
     "We do what we do for the good of our customers, staff, partners and the communities where we work. We "
     "want to make the world a better place &mdash; whether that&rsquo;s by spreading good vibes and making "
     "people happy or by helping development in areas that need it. We believe business should be used as a "
     "force for good."),
    ('<span class="ab-val__w">Create</span>'
     '<span class="ab-val__hand">Opportunity</span>',
     "We believe in providing the opportunity for our customers to have the time of their lives, for our staff "
     "to be the best they can be, and for our partners and communities to use tourism as a chance to improve "
     "their lives. Together we promote equality through social enterprise and responsible travel."),
    ('<span class="ab-val__w">We Are</span>'
     f'<span class="ab-val__p ab-val__ico">{HEART}Family</span>',
     "Our people are what make us so unique. Everyone at Tru is part of the family &mdash; we work, play and "
     "party together. The TruFam is an amazing bunch of individuals who share our passion for spreading good "
     "vibes and changing lives through travel. Everyone who comes on tour with us becomes part of the Tru "
     "Family for life."),
    ('<span class="ab-val__w">Live The</span>'
     f'<span class="ab-val__b ab-val__ico">{FEATHER}Dream</span>',
     "Love what you do and you&rsquo;ll never work a day in your life. Fun is built into everything we do "
     "&mdash; if we&rsquo;re not enjoying ourselves, we can&rsquo;t give our customers the best experience. "
     "We aim to inspire people to live the dream."),
]


def our_values():
    values = "\n".join(
        f'          <div class="ab-val"><h3 class="ab-val__h">{head}</h3>'
        f'<p class="ab-val__d">{copy}</p></div>'
        for head, copy in CORE_VALUES
    )
    body = f"""{hero("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80",
                     "A map, a camera and a passport — the gear of every journey",
                     "Our Values", "What We<br />Stand For",
                     "&ldquo;To make a positive difference.&rdquo;")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col ab-prose">
        <p class="ess-eyebrow">Our Mission</p>
        <h2 class="ab-mission">Change Lives<span>Through Travel</span></h2>
        <p class="ab-lead">Our mission is simple.</p>
        <p>To create life-changing group travel experiences which truly benefit all those involved &mdash; customers, staff, suppliers, partners and local communities.</p>
        <p>To do what we love, and to use our energy and experience to give our customers the best time of their lives.</p>
        <div class="ab-force">
          <p class="ab-force__eyebrow">Business As A Force For Good</p>
          <p class="ab-force__h">To use our business as a force for good.</p>
          <p class="ab-force__d">One that leverages the travel industry&rsquo;s huge potential to alter perspective and to address issues of inequality, ethics, social and environmental responsibility.</p>
        </div>
        <p class="ab-beat--loose">And above all else,</p>
        <p class="ab-pull"><span>To make a</span><span><em>positive difference.</em></span></p>
      </div>
    </section>

    <section class="ess-body ab-sec">
      <div class="container">
{section_head("What We Live By", "Our Core", "Values",
              "Our values are what guide us in our decision-making and how we show up for one another.")}
        <div class="ab-vals">
{values}
        </div>
      </div>
    </section>

{more_about("/about/our-values")}"""
    return shell_page("Our Values",
                      "What we stand for and how we travel — the TruTravels mission.",
                      body)


# -------------------------------------------------------------- our brand --
BRAND_PILLARS = [
    ("Adventure", "Without Limits", "Say yes more.",
     "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
     ["Adventure isn&rsquo;t a destination &mdash; it&rsquo;s a mindset. It&rsquo;s in every spontaneous decision, every &ldquo;why not?&rdquo; moment that reminds you life&rsquo;s meant to be lived.",
      "Whether you&rsquo;re crossing borders or just stepping outside your comfort zone, adventure begins when you stop playing it safe and start saying yes."]),
    ("Good Vibes", "With Global Impact", "Fun with purpose.",
     "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1200&q=80",
     ["We believe the best kind of fun is the kind that does good.",
      "When you travel with us, every good time, laugh, and dance has a positive ripple effect. It&rsquo;s about respecting cultures, supporting local businesses, and leaving every place better than we found it.",
      "Through our People &amp; Planet Promise, we prove that travel can create joy and impact in equal measure. Good vibes aren&rsquo;t just for us &mdash; they&rsquo;re for the world we explore."]),
    ("Stories", "Worth Telling", "Every journey writes a story worth telling.",
     "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
     ["The Tru lifestyle is about stories that stay with you &mdash; the ones that make you laugh, change how you see the world, and connect you to people who feel like family.",
      "It&rsquo;s also about the local people who welcome us in and teach us something new about life, culture, and the planet we share. These moments shape who we are and remind us that the best stories aren&rsquo;t just told &mdash; they&rsquo;re lived."]),
    ("Community", "Through Connection", "Together is our favourite place.",
     "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
     ["Community isn&rsquo;t something we join &mdash; it&rsquo;s something we build through connection. Every conversation, every moment of belonging, adds to something bigger than ourselves.",
      "Our Tru Community lives across countries and time zones, united by our beliefs, our behaviours, and how we show up for one another. It&rsquo;s a community that feels like home, wherever we are."]),
]


def our_brand():
    pillars = "\n".join(
        f'''          <article class="ab-pillar">
            <div class="ab-pillar__media"><img src="{img}" alt="{a} {b}" loading="lazy" /></div>
            <div class="ab-pillar__body">
              <p class="ab-pillar__n">Pillar &middot; 0{i + 1}</p>
              <h3 class="ab-pillar__h"><span>{a}</span><span>{b}</span></h3>
              <p class="ab-pillar__tag">{tag}</p>
              {"".join(f'<p class="ab-pillar__p">{p}</p>' for p in body)}
            </div>
          </article>'''
        for i, (a, b, tag, img, body) in enumerate(BRAND_PILLARS)
    )
    page_body = f"""{hero("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80",
                          "Friends splashing in the sea at sunset — leaving ordinary behind",
                          "Our Brand",
                          'Leave <em>Ordinary</em><br />Behind',
                          "Find Your Extraordinary&hellip;", "ab-hero__hand")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col ab-prose">
        <p class="ab-lead">We weren&rsquo;t made for the <em>ordinary</em>.</p>
        <p>We were made for the moments that take our breath away, for chasing sunsets, not schedules.<br />For finding strangers who become family,<br />and stories that stay with us long after we&rsquo;re home.</p>
        <p class="ab-strong">The world doesn&rsquo;t need more travellers.</p>
        <p>It needs people who care, who show up,<br />connect deeply, and make every journey count.</p>
        <p>Because the best memories aren&rsquo;t made in comfort zones.</p>
        <p class="ab-beat">They&rsquo;re made when you step into the unknown.</p>
        <p class="ab-pull"><span>Leave <em class="ab-light">Ordinary</em></span><span><em>Behind.</em></span></p>
        <p class="ab-hand">and find your Extraordinary&hellip;</p>
      </div>
    </section>

    <section class="ess-body ab-sec">
      <div class="container">
{section_head("Brand Pillars", "What We", "Stand On",
              "Brand pillars are the core principles that define what we stand for. They&rsquo;re the building blocks that support our identity, our purpose, and our promise &mdash; the things that stay consistent no matter how the brand evolves.")}
        <div class="ab-pillars">
{pillars}
        </div>
      </div>
    </section>

{more_about("/about/our-brand")}"""
    return shell_page("Our Brand", "Logo, voice, and the look of TruTravels.", page_body)


# ------------------------------------------------------------- our impact --
PROMISES = [
    ("impact-250000-lives", "01 &mdash; Positively impact 250k lives by 2030",
     "Positively impact 250k lives by 2030",
     "We have calculated this number in two ways. First, the total number of people our brand comes into "
     "contact with by 2030 will mean we will have positively impacted 80,000 customers and staff who travel "
     "or work with us. The second contribution to this number is the number of people who will stand to "
     "benefit from our charitable donations and the community projects we create, which will be 170,000 by 2030."),
    ("generate-millions-for-initiatives", "02 &mdash; Generate £1.25million for people &amp; planet initiatives by 2030",
     "Generate £1.25million for people &amp; planet initiatives by 2030",
     "We have committed to gifting 1% of our yearly revenue to be spent on people and planet initiatives. "
     "Meaning our impact is not reliant on donations post profit, it is directly built into our business model."),
    ("be-climate-positive", "03 &mdash; Be climate positive now", "Be climate positive now",
     "In 2022 we signed the Glasgow Declaration on Climate Action in Tourism and created our own Climate "
     "Action plan to help support the global commitment to halve emissions by 2030 and reach net zero before "
     "2050. In doing so, we now measure and declare our carbon footprint as a business every month and "
     "decarbonise by offsetting all carbon emissions through a variety of projects and tree planting initiatives."),
]

PROGRESS = {"trees": "332,482", "donated": "£320,123", "initiatives": "29",
            "countries": "12", "carbon": "8,903", "miles": "10,000,000"}

CHARITY = [
    ("Charity Water", "We&rsquo;ve funded eight wells in rural Cambodia, bringing clean drinking water to communities that needed it most.",
     "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=800&q=80"),
    ("Bali Street Mums", "A five-year-plus partnership supporting women and children living on the streets in Indonesia.",
     "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80"),
    ("Indigenous Literacy Foundation", "100 books donated to Australian Aboriginal communities &mdash; supporting literacy and storytelling from the ground up.",
     "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80"),
    ("Sungai Watch", "We funded our second trash barrier with this incredible team &mdash; they&rsquo;ve removed 1.6 million kg of non-organic waste from Bali&rsquo;s rivers.",
     "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80"),
    ("Children of Vietnam", "Sponsored 64 scholarships to help break the cycle of poverty for children and young people across the country.",
     "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80"),
]

CTE_CHARACTERISTICS = [
    ("Community-Led", "Managed by local people, often collectively."),
    ("Tourism-Focused", "Offers services to travellers &mdash; experiences, food, accommodation, or transport."),
    ("Income-Generating", "Creates direct financial benefits for the community."),
    ("Social Purpose", "Often supports social or environmental goals, like education, conservation, or women&rsquo;s empowerment."),
]

SEEDLING = ('<svg class="ab-prog__ico" viewBox="0 0 64 64" fill="none" aria-hidden="true">'
            '<path d="M32 60V28" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>'
            '<path d="M32 30C32 18 24 10 10 10c0 14 8 22 22 20Z" fill="currentColor"/>'
            '<path d="M34 26c0-10 7-17 19-17 0 12-7 19-19 17Z" fill="currentColor"/></svg>')
CAR = ('<svg class="ab-prog__ico ab-prog__ico--car" viewBox="0 0 64 40" fill="none" aria-hidden="true">'
       '<path d="M6 26h52v-6c0-3-2-5-5-5h-4l-5-8c-1-2-2-3-4-3H21c-2 0-3 1-4 3l-5 8H9c-2 0-3 2-3 4v7Z" fill="currentColor"/>'
       '<circle cx="18" cy="30" r="6" fill="currentColor"/><circle cx="46" cy="30" r="6" fill="currentColor"/></svg>')
GLOBE = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
         '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"/></svg>')


def cte_card(c):
    return f'''          <a class="ab-cte" href="about-our-impact-{c["slug"]}.html">
            <div class="ab-cte__media">
              <img src="{c["image"]}" alt="{c["imageAlt"]}" loading="lazy" />
              <span class="ab-cte__grad"></span>
              <p class="ab-cte__badge">{c["country"]}<span>Community Tourism</span></p>
            </div>
            <div class="ab-cte__body">
              <h3 class="ab-cte__h">{c["name"]}</h3>
              <p class="ab-cte__d">{c["summary"]}</p>
              <div class="ab-cte__foot"><span>Read their story &rarr;</span></div>
            </div>
          </a>'''


def our_impact():
    promises = "\n".join(
        f'''          <div class="ab-promise{' is-flip' if i % 2 else ''}">
            <div class="ab-promise__badge"><img src="assets/impact/{slug}.png" alt="{alt}" /></div>
            <div class="ab-promise__body"><h3 class="ab-sr">{title}</h3><p>{copy}</p></div>
          </div>'''
        for i, (slug, alt, title, copy) in enumerate(PROMISES)
    )
    chars = "\n".join(
        f'          <div class="ab-char"><p class="ab-char__t">{t}</p><p class="ab-char__d">{d}</p></div>'
        for t, d in CTE_CHARACTERISTICS
    )
    ctes = "\n".join(cte_card(c) for c in CTES)
    charity = "\n".join(
        f'''          <article class="ab-proj">
            <div class="ab-proj__media"><img src="{img}" alt="{name}" loading="lazy" /></div>
            <div class="ab-proj__body"><h3 class="ab-proj__h">{name}</h3><p class="ab-proj__d">{copy}</p></div>
          </article>'''
        for name, copy, img in CHARITY
    )

    body = f"""{hero("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80",
                     "A globe held in hands — our shared responsibility",
                     "Our Impact", "People &amp;<br />Planet Promise",
                     "&ldquo;Always give more than we take.&rdquo;")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col ab-prose">
        <p class="ab-lead">Always give more than we take.</p>
        <p>Our goal since we started has been to always give more than we take. In 2022, we decided to double down on our efforts of doing good and really put our money where our mouth is.</p>
        <p>But instead of just focusing on the climate crisis, we wanted to put equal emphasis on both people and the planet.</p>
        <p class="ab-strong">Here is an overview of the promises we have made and our progress so far.</p>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("komodo-dragon", "left:-4rem;top:8%;width:clamp(240px,32vw,500px);opacity:0.05"),
             ("good-vibes", "right:-4rem;top:48%;width:clamp(220px,28vw,460px);opacity:0.05"),
             ("lantern", "left:-4rem;bottom:-2.5rem;width:clamp(200px,26vw,420px);opacity:0.05")])}
      <div class="container">
{section_head("The Promises", "People &amp; Planet", "Promise",
              "Three measurable promises that shape how we run the business &mdash; not nice-to-haves bolted on afterwards.")}
        <div class="ab-promises">
{promises}
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec ab-progress">
      <div class="container ab-prog">
        <!-- The pink thread that links the figures on the printed version.
             Routed through the gutters between blocks so it crosses no text. -->
        <svg class="ab-prog__thread" viewBox="0 0 1000 760" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="currentColor" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke">
            <path d="M900 152 C 980 168, 978 204, 880 210 C 650 222, 400 174, 200 194 C 120 202, 80 204, 55 220" />
            <path d="M55 448 C 55 502, 150 522, 252 530 C 292 533, 316 530, 336 522" />
            <path d="M900 566 C 976 578, 990 644, 934 692 C 900 722, 862 732, 828 744" />
          </g>
        </svg>
        <div class="ab-prog__head">
          <p class="ess-eyebrow">Progress So Far</p>
          <h2 class="ess-h2">Our Progress<br />So Far<span>&hellip;</span></h2>
        </div>
        <div class="ab-prog__trees">
          <div><p class="ab-prog__n">{PROGRESS["trees"]}</p><p class="ab-prog__l">Trees Planted</p></div>
          {SEEDLING}
        </div>
        <div class="ab-prog__donated">
          <p class="ab-prog__n">{PROGRESS["donated"]}</p>
          <p class="ab-prog__l">Donated to {PROGRESS["initiatives"]} Initiatives</p>
          <span class="ab-prog__pill">{GLOBE}Across <b>{PROGRESS["countries"]}</b> Countries</span>
        </div>
        <div class="ab-prog__carbon">
          <div class="ab-prog__row">
            <div><p class="ab-prog__n ab-prog__n--sm">{PROGRESS["carbon"]} Tonnes</p><p class="ab-prog__l">Of Carbon Offset</p></div>
            {CAR}
          </div>
          <p class="ab-prog__eq">Equivalent to driving over</p>
          <p class="ab-prog__miles">{PROGRESS["miles"]} Miles</p>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("community", "left:-4rem;top:-2.5rem;width:clamp(240px,32vw,480px);opacity:0.05"),
             ("ramen", "right:-3rem;bottom:-2.5rem;width:clamp(200px,26vw,440px);opacity:0.06")])}
      <div class="container">
{section_head("On The Ground", "Community Tourism", "Enterprises",
              "A CTE is a locally owned and operated business or organisation that offers tourism experiences or services &mdash; like homestays, food experiences, guiding, crafts, or cultural performances.")}
        <div class="ab-chars">
{chars}
        </div>
        <div class="ab-ctes">
{ctes}
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("peru-bird", "right:-3rem;top:-2rem;width:clamp(220px,28vw,460px);opacity:0.05"),
             ("eyes", "left:-4rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.05")])}
      <div class="container">
{section_head("Who We Support", "The Projects", "We Back",
              "Where our 1% goes. Long-term partnerships, not one-off PR moments.")}
        <div class="ab-projs">
{charity}
        </div>
      </div>
    </section>

{more_about("/about/our-impact")}"""
    return shell_page("Our Impact",
                      "Our People &amp; Planet Promise — the commitments we've made, the progress so far, and the projects we support.",
                      body)


# ---------------------------------------------------------- CTE sub-pages --
def cte_page(c):
    impact = ""
    if c.get("impact"):
        cells = "\n".join(
            f'          <div class="ab-stat"><p class="ab-stat__v">{s["value"]}</p>'
            f'<p class="ab-stat__l">{s["label"]}</p></div>'
            for s in c["impact"]
        )
        impact = f'''
    <section class="ess-body ab-ctestats">
      <div class="container">
        <div class="ab-stats">
{cells}
        </div>
      </div>
    </section>'''

    # `.art-section` — the same alternating row the story pages use. This used
    # to emit a near-identical `.ab-alt` family: same grid, same 4:3 media, same
    # flip-by-order, differing only in class names and a slightly smaller type
    # scale. Two implementations of one layout, so the CTE pages now use the
    # story-page one and the .ab-alt rules are gone.
    sections = "\n".join(
        f'''          <section class="art-section{' art-section--alt' if i % 2 else ''}">
            <div class="art-section__text">
              {'<p class="art-section__kicker">' + s["kicker"] + "</p>" if s.get("kicker") else ""}
              <h2 class="art-section__h">{s["heading"]}</h2>
              {"".join(f"<p>{p}</p>" for p in s["body"])}
            </div>
            {'<div class="art-section__media"><img src="' + s["image"] + '" alt="' + s.get("imageAlt", s["heading"]) + '" loading="lazy" /></div>' if s.get("image") else ""}
          </section>'''
        for i, s in enumerate(c["sections"])
    )

    others = "\n".join(
        f'''          <a class="ab-xcard" href="about-our-impact-{o["slug"]}.html">
            <img src="{o["image"]}" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__k">{o["country"]}</span>
              <span class="ab-xcard__t">{o["name"]}</span>
              <span class="ab-xcard__d">{o["summary"]}</span>
            </span>
          </a>'''
        for o in CTES if o["slug"] != c["slug"]
    )

    body = f"""    <section class="ab-chero" id="top">
      <img class="ab-chero__img" src="{c["image"]}" alt="{c["imageAlt"]}" />
      <div class="ab-chero__grad"></div>
      <div class="container ab-chero__inner">
        <a class="ab-chero__back" href="about-our-impact.html">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Our Impact
        </a>
        <p class="ab-chero__eyebrow">Community Tourism Enterprise &middot; {c["country"]}</p>
        <h1 class="ab-chero__title">{c["name"]}</h1>
        <p class="ab-chero__meta"><b>{c["country"]}</b></p>
      </div>
    </section>

    <section class="ess-body ab-cintro">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,520px);opacity:0.05")])}
      <div class="ess-col">
        {"".join(f'<p class="ab-cintro__p">{p}</p>' for p in c["intro"])}
        <div class="ess-hero__rule ab-cintro__rule"></div>
      </div>
    </section>
{impact}

    <section class="ess-body ab-sec">
{watermarks([("bali-flower", "left:-4rem;top:25%;width:clamp(220px,28vw,440px);opacity:0.05"),
             ("lantern", "right:-4rem;bottom:20%;width:clamp(220px,28vw,440px);opacity:0.05")])}
      <div class="art-sections__inner">
{sections}
      </div>
    </section>

    <section class="ess-body ab-sec">
      <div class="container">
        <div class="ess-card ess-card--cta">
          <h3 class="ess-cta__h">Visit <span>{c["name"]}</span></h3>
          <p class="ess-cta__p">This experience is built into our {c["country"]} trips. Find the route that takes you there.</p>
          <a class="ess-btn" href="explore.html">Explore Trips{CHEV_R}</a>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
      <div class="container">
{section_head("More Enterprises", "Others We", "Work With")}
        <div class="ab-xgrid ab-xgrid--2">
{others}
        </div>
      </div>
    </section>"""
    return shell_page(c["name"], c["summary"], body)


# ----------------------------------------------------------- our community --
TAG_CLASS = {
    "Traveller": "traveller", "Creator": "creator", "Influencer": "creator",
    "Planeterra": "planeterra", "Local Legend": "legend", "Partner": "partner",
    "Community": "community",
}
PLAY = ('<div class="vdiary__play"><span><svg viewBox="0 0 24 24" fill="currentColor">'
        '<path d="M8 5v14l11-7z"/></svg></span></div>')


def diary_card(d, vid):
    tag = TAG_CLASS.get(d["tag"], "traveller")
    return f'''        <a class="vdiary" href="#{vid}">
          <div class="vdiary__media">
            <img src="{poster(d)}" alt="{d["author"]}" loading="lazy" />
            <div class="vdiary__overlay"></div>
            <span class="vdiary__tag vdiary__tag--{tag}">{d["tag"]}</span>
            <span class="vdiary__handle">{d["handle"]}</span>
            {PLAY}
            <div class="vdiary__caption">
              <p class="vdiary__text">{d["caption"]}</p>
            </div>
          </div>
        </a>'''


CHEV_L = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>')
CHEV_R = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
X_ICON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')
MUTE_ICON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
             '<path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828'
             '-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 '
             '12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>')


def initials(name):
    parts = [w for w in name.split() if w[:1].isalpha()]
    return (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper()


def progress_bars(i, n):
    """N-of-total position, not decoration: every diary before this one is
    full, this one sits mid-play, the rest are empty."""
    return "".join(
        '<span class="vid-modal__bar"><i style="width:%s%%"></i></span>'
        % (100 if k < i else 45 if k == i else 0)
        for k in range(n)
    )


def diary_viewers(diaries, prefix, close="#top"):
    """:target viewers, chained prev/next — the same no-JS pattern the homepage
    uses, and now literally the same markup.

    There used to be two of these: this file emitted a lightbox (scrim, figure,
    caption under the frame) while index.html / stories.html / the trip pages
    carried a stories-style viewer (position bars, author block, a peek at the
    next diary). Both answered to `.vid-modal`, so styles.css had to carry two
    sets of rules that could drift apart.

    The stories-style one survives — it says more (who, where, how far through,
    what's next) — with the one thing the lightbox did better folded in: a
    full-bleed scrim so clicking anywhere outside the frame closes it.
    """
    out = []
    n = len(diaries)
    for i, d in enumerate(diaries):
        vid = f"{prefix}-{i + 1}"
        prev = f"{prefix}-{(i - 1) % n + 1}"
        nxt_i = (i + 1) % n
        nxt = f"{prefix}-{nxt_i + 1}"
        up = diaries[nxt_i]
        tag = TAG_CLASS.get(d["tag"], "traveller")
        up_tag = TAG_CLASS.get(up["tag"], "traveller")
        out.append(f"""    <div class="vid-modal" id="{vid}">
      <a class="vid-modal__scrim" href="{close}" aria-label="Close"></a>
      <div class="vid-modal__controls">
        <a class="vid-modal__btn" href="{close}" aria-label="Close">{X_ICON}</a>
        <span class="vid-modal__btn" aria-hidden="true">{MUTE_ICON}</span>
      </div>
      <div class="vid-modal__stage">
        <div class="vid-modal__main">
          <video src="{video(d)}" poster="{poster(d)}" controls playsinline preload="none"></video>
          <div class="vid-modal__grad"></div>
          <div class="vid-modal__bars">{progress_bars(i, n)}</div>
          <div class="vid-modal__meta">
            <span class="vdiary__tag vdiary__tag--{tag}">{d["tag"]}</span>
            <span class="vdiary__handle" style="position:static">{d["handle"]}</span>
          </div>
          <a class="vid-modal__chev vid-modal__chev--prev" href="#{prev}" aria-label="Previous">{CHEV_L}</a><a class="vid-modal__chev" href="#{nxt}" aria-label="Next">{CHEV_R}</a>
          <div class="vid-modal__caption">
            <p class="vdiary__text">{d["caption"]}</p>
            <div class="vdiary__author">
              <span class="vdiary__avatar vdiary__tag--{tag}" style="width:2.25rem;height:2.25rem">{initials(d["author"])}</span>
              <div>
                <p class="vdiary__name">{d["author"]}</p>
                <p class="vdiary__loc">{d["location"]}</p>
              </div>
            </div>
          </div>
        </div>
        <a class="vid-modal__peek" href="#{nxt}">
          <img src="{poster(up)}" alt="{up["author"]}" />
          <div class="vid-modal__peek-grad"></div>
          <div class="vid-modal__peek-info">
            <span class="vdiary__tag vdiary__tag--{up_tag}" style="position:static;font-size:8px;padding:0.125rem 0.5rem">{up["tag"]}</span>
            <p class="vdiary__name">{up["author"]}</p>
          </div>
        </a>
      </div>
    </div>""")
    return "\n".join(out)


def diary_carousel(diaries, prefix):
    cards = "\n".join(diary_card(d, f"{prefix}-{i + 1}") for i, d in enumerate(diaries))
    return f'''      <div class="container">
        <div class="rev-carousel vdia__carousel" data-arrows>
          <div class="vdiaries">
{cards}
          </div>
          <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
          <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </div>'''


def our_community():
    community = [d for d in DIARIES if d["tag"] != "Local Legend"]
    legends = [d for d in DIARIES if d["tag"] == "Local Legend"]

    body = f"""{hero("https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg",
                     "A TruTravels group together on the road",
                     "Our Community", 'The People<br /><span>Who Make It</span>',
                     "&ldquo;Bound by how we show up &mdash; for each other, and for the places we visit.&rdquo;")}

    <section class="ess-body">
{watermarks(WM_SHORT)}
      <div class="ess-col ab-prose">
        <p class="ab-lead">A bunch of fun loving legends with <em>a passion for travel.</em></p>
        <p>That&rsquo;s the community. Travellers, creators and Local Legends &mdash; and a shared habit of doing good while we&rsquo;re at it.</p>
        <p>What holds it together isn&rsquo;t a destination or a price point. It&rsquo;s a set of beliefs and a way of showing up &mdash; for each other, and for the communities we visit.</p>
        <p>Leave a place better than you found it. Make sure nobody sits on the edge of the group. Follow the people who actually live there, not a script. And say yes to the detour, because the best bits are never on the itinerary.</p>
        <p class="ab-strong">Here&rsquo;s who they are, and what they stand for.</p>
      </div>
    </section>

    <section class="vdia">
      <img class="vdia__goodvibes" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
      <div class="container vdia__head">
        <p class="vdia__eyebrow">Video Diaries</p>
        <h2 class="vdia__title">Stories From Our <span>Community</span></h2>
        <p class="vdia__intro">Real stories from real people. Tap to play &mdash; raw, unfiltered moments from travellers, creators and partners on the road.</p>
      </div>
{diary_carousel(community, "cvd")}
    </section>

    <section class="vdia ab-legends">
      <img class="vdia__goodvibes ab-legends__wm" src="assets/bg-assets/peru-bird.svg" alt="" aria-hidden="true" />
      <div class="container vdia__head">
        <p class="vdia__eyebrow">Led By Locals</p>
        <h2 class="vdia__title">Meet Your <span>Local Legends</span></h2>
        <p class="vdia__intro">The people who actually run your trip. Born where they guide, and they&rsquo;ll take you to the bits that never make the itinerary.</p>
      </div>
{diary_carousel(legends, "lvd")}
    </section>

{REVIEWS}

{more_about("/about/our-community")}

    <!-- Video diary viewers (:target, no JS) -->
{diary_viewers(community, "cvd")}
{diary_viewers(legends, "lvd")}"""
    return shell_page("Our Community",
                      "The travellers, creators and Local Legends who make TruTravels what it is.",
                      body)


# --------------------------------------------------------------- the hub --
HUB_STATS = [("50,000+", "Travellers"), ("25+", "Destinations"),
             ("200+", "Trips Per Year"), ("4.9/5", "Average Rating")]


def about_hub():
    stats = "\n".join(
        f'            <div class="ab-hstat"><p class="ab-hstat__v">{v}</p><p class="ab-hstat__l">{l}</p></div>'
        for v, l in HUB_STATS
    )
    pillars = "\n".join(
        f'''          <article class="ab-pillar">
            <div class="ab-pillar__media"><img src="{img}" alt="{a} {b}" loading="lazy" /></div>
            <div class="ab-pillar__body">
              <h3 class="ab-pillar__h"><span>{a}</span><span>{b}</span></h3>
              <p class="ab-pillar__tag">{tag}</p>
            </div>
          </article>'''
        for a, b, tag, img, _ in BRAND_PILLARS
    )

    body = f"""    <section class="ab-hub-hero" id="top">
      <img class="ab-hub-hero__img" src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&q=80" alt="Travellers on a beach" />
      <div class="ab-hub-hero__grad"></div>
      <div class="ab-hub-hero__text">
        <p class="ess-hero__eyebrow">About TruTravels</p>
        <h1 class="ab-hub-hero__title">We Help People Leave<br />Ordinary Behind</h1>
      </div>
    </section>

    <section class="ess-body">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,520px);opacity:0.06"),
             ("bali-flower", "left:-4rem;top:33%;width:clamp(220px,28vw,440px);opacity:0.05"),
             ("eyes", "right:-4rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.05")])}
      <div class="ess-col ab-prose ab-prose--base">
        <h2 class="ab-hub-h">Our Story</h2>
        <p class="ab-lead">Back in 2006, I was saving for a house in London.</p>
        <p>That was the plan. Work hard. Save money. Follow the path.</p>
        <p>And it was all coming together. I&rsquo;d found a house, had an offer agreed and was getting ready to move in.</p>
        <p>Then, at the eleventh hour, it fell through.</p>
        <p>After all that saving and planning, I was back where I&rsquo;d started. Only now, I wasn&rsquo;t so sure I wanted the same thing anymore.</p>
        <p>So instead of finding another house, I booked a one-way ticket to Australia. What I thought would be a few months away became three years.</p>
        <div class="ab-hub-cta">
          <a class="ess-btn" href="about-our-story.html">Read The Full Story{CHEV_R}</a>
          <p class="ab-hub-cta__by">Mark &middot; Co-founder</p>
        </div>
        <div class="ab-hstats">
{stats}
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("komodo-dragon", "left:-4rem;top:6%;width:clamp(240px,32vw,500px);opacity:0.05"),
             ("good-vibes", "right:-4rem;bottom:-2.5rem;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="container">
{section_head("We Believe", "We Weren&rsquo;t Made", "For Ordinary",
              "Four pillars define everything we do &mdash; from the trips we design to the community we build.")}
        <div class="ab-pillars ab-pillars--compact">
{pillars}
        </div>
      </div>
    </section>

{more_about("/about")}"""
    return shell_page("About", "We're on a mission to help 18-35s leave ordinary behind.", body)


# ------------------------------------------------------------------ write --
PAGES = {
    "about.html": about_hub,
    "about-our-story.html": our_story,
    "about-our-values.html": our_values,
    "about-our-impact.html": our_impact,
    "about-our-community.html": our_community,
    "about-our-brand.html": our_brand,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        out = fn()
        open(os.path.join(BASE, name), "w", encoding="utf-8").write(out)
        print(f"  wrote {name}  ({len(out.splitlines())} lines)")
    for c in CTES:
        name = f"about-our-impact-{c['slug']}.html"
        out = cte_page(c)
        open(os.path.join(BASE, name), "w", encoding="utf-8").write(out)
        print(f"  wrote {name}  ({len(out.splitlines())} lines)")
