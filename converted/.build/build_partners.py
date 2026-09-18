"""
Build the three Partners pages and the partner application form component.

  converted/partner-with-us.html              the hub + general enquiry
  converted/affiliates.html                   Tru Affiliates
  converted/host-a-trip.html                  Host A Trip
  converted/components/partner-application-form.html

WHY THREE PAGES AND ONE FORM
The footer has carried five dead Partners links since the footer was built.
The brief names three of them, and the copy for all three is one proposition
split by who is asking: a creator with an audience either sends people to us
(affiliates) or brings them with them (host a trip), and some don't know which
yet. So the hub page carries the choice, and each of the three forms is the
same base — name, email, over 18, socials, previous Tru trip, audience,
why Tru — plus the two or three questions that only matter for that route.

That base is defined ONCE, in `base_fields()`. Don't copy a field into a page;
add it to the page's `extra` list. Three near-identical forms drifting apart is
exactly the failure this repo keeps hitting.

The questions with fixed answers are pills (.ptn-opts), not <select>s — see the
comment above .ptn-opts in ../styles.css.

TESTIMONIALS ARE DELIBERATELY EMPTY
The brief asks for "sliding pics of testimonials" and supplies six real partner
logos, but no quotes. The carousel is built and the six partners are real; each
card carries a visible "awaiting copy" tag instead of invented words under a
real organisation's mark. Drop the quote in and delete the tag.

Logos: converted/assets/partners/*.png — trimmed to their alpha box and
resized to 480px on the long edge from the originals in the shared Drive
folder. Two of the six are solid black, so they sit on white tiles.

Run:  python3 converted/.build/build_partners.py
"""

import os
import struct

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD, block

CONTACT = "partnerships@trutravels.com"

ARROWS = ('        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous">'
          '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>\n'
          '        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next">'
          '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>')

# The arrows + drag-to-scroll script, sliced from explore.html. Pages get it
# inside SCRIPTS; the component page, which has no page chrome, needs its own
# copy — the same one, never a second implementation.
CAROUSEL_JS = block("explore.html", 594, 617)

CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
TICK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')

# A planted flag, drawn across the whole frame. The first version was a small
# pennant tucked into the top-left corner, so next to the homepage's icons —
# which all fill their 24x24 box — it read as a weaker mark rather than a
# quieter one.
ICO_FLAG = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">'
            '<path stroke-linecap="round" stroke-linejoin="round" '
            'd="M4 22V3m0 1.6c5.6-3 10.4 3 16 0v10.4c-5.6 3-10.4-3-16 0"/></svg>')
ICO_LINK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">'
            '<path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 '
            '0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>')
ICO_SPARK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">'
             '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v4m0 10v4M3 12h4m10 0h4'
             'M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8"/></svg>')

# ---------------------------------------------------------- benefit icons --
# Same treatment as the homepage stat icons (.wwd__fact-ico): bare line art at
# stroke-width 1.5 in pink, with nothing behind it. The route cards on
# partner-with-us keep their filled chip — they're a larger, clickable object,
# whereas these sit inside a card that already has its own border, and a chip
# there would be a box in a box.
#
# `group` is lifted from the homepage deliberately: it means the same thing in
# both places. Mirrored by BENEFIT_ICONS in src/components/partner-blocks.tsx —
# edit both or they drift.
BENEFIT_ICONS = {
    # a browser window — your own page / your own URL
    "window": '<rect x="3" y="4" width="18" height="16" rx="2"/>'
              '<path stroke-linecap="round" d="M3 9h18M6.5 6.5h.01M9.5 6.5h.01"/>',
    # chain link — trackable links
    "link": '<path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 '
            '0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    # percent — commission rate
    "percent": '<path stroke-linecap="round" d="m19 5-14 14"/>'
               '<circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
    # rising line — incentives that go up through the year
    "trend": '<path stroke-linecap="round" stroke-linejoin="round" d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
    # stacked images — the asset and template pack
    "assets": '<rect x="3" y="3" width="13" height="13" rx="2"/>'
              '<path stroke-linecap="round" d="M8 21h11a2 2 0 0 0 2-2V8"/>'
              '<circle cx="7.5" cy="7.5" r="1.25"/>'
              '<path stroke-linecap="round" stroke-linejoin="round" d="m3 13 3.5-3.5 2.5 2.5L13 8l3 3"/>',
    # the homepage's "per group" icon — your community, together
    "group": '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-4 '
             '5H2v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1Zm-2-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6-1a2.5 2.5 0 '
             '1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>',
    # paper plane — you're on the trip too
    "plane": '<path stroke-linecap="round" stroke-linejoin="round" d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/>',
    # banknote — commission paid on bookings
    "money": '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'
             '<path stroke-linecap="round" d="M6 12h.01M18 12h.01"/>',
    # rising bars — a rate that scales with how many come
    "bars": '<path stroke-linecap="round" d="M5 20v-5M10 20V9M15 20v-8M20 20V5"/>',
}

# ---------------------------------------------------------------- partners --
# Real partners, from the shared Drive folder. Name and logo only — no quotes
# have been collected, so none are invented here.
PARTNERS = [
    ("gals-who", "Gals Who Travel", "Community &amp; events"),
    ("sea-gals", "Sea Gals", "Surf &amp; ocean community"),
    ("amigas-y-mas", "Amigas Y M&aacute;s Social", "Latina travel social"),
    ("someday-travel-club", "Someday Travel Club", "Solo travel club"),
    ("dwh", "DWH", "Creator collective"),
    ("we-got-you-boo", "We Got You Boo", "Womens travel community"),
]


def png_size(slug):
    """Intrinsic pixel size, read off the PNG header.

    A lazy <img> with `width:auto` has NO intrinsic size until it loads, so the
    tile collapses and the grid reflows when the logo arrives. These attributes
    reserve the box. (Same fix as the value lockups in build_careers.py.)
    """
    path = os.path.join(BASE, "assets", "partners", slug + ".png")
    w, h = struct.unpack(">II", open(path, "rb").read(26)[16:24])
    return w, h


def logo_wall(prefix=""):
    tiles = "\n".join(
        f'          <div class="ptn-logo"><img src="{prefix}assets/partners/{slug}.png" '
        f'alt="{name}" width="{png_size(slug)[0]}" height="{png_size(slug)[1]}" loading="lazy" /></div>'
        for slug, name, _ in PARTNERS
    )
    return f'        <div class="ptn-logos">\n{tiles}\n        </div>'


def quote_cards(prefix=""):
    out = []
    for slug, name, what in PARTNERS:
        w, h = png_size(slug)
        out.append(
            f'''            <article class="ptn-quote">
              <span class="ptn-quote__logo"><img src="{prefix}assets/partners/{slug}.png" alt="{name}" width="{w}" height="{h}" loading="lazy" /></span>
              <span class="ptn-quote__todo">Awaiting copy</span>
              <p class="ptn-quote__body">We&rsquo;ve asked {name} for a few words about working with us. Their quote goes here.</p>
              <p class="ptn-quote__who">{name}<span>{what}</span></p>
            </article>''')
    return "\n".join(out)


# -------------------------------------------------------------- form parts --

def text_field(fid, label, req=False, ph="", kind="text", auto=None, hint=None, tag=None):
    """`tag` overrides the required/optional marker — pass "" inside a fieldset
    that has already said it once, so the row isn't three (optional)s wide."""
    star = tag if tag is not None else (' <span>*</span>' if req else ' <span>(optional)</span>')
    a = f' autocomplete="{auto}"' if auto else ""
    r = " required" if req else ""
    h = f'\n            <p class="field__hint">{hint}</p>' if hint else ""
    return (f'          <div class="field">\n'
            f'            <label for="{fid}">{label}{star}</label>\n'
            f'            <input id="{fid}" name="{fid}" type="{kind}"{r} placeholder="{ph}"{a} />{h}\n'
            f'          </div>')


def area_field(fid, label, req=False, ph="", rows=4, hint=None):
    star = ' <span>*</span>' if req else ' <span>(optional)</span>'
    r = " required" if req else ""
    h = f'\n            <p class="field__hint">{hint}</p>' if hint else ""
    return (f'          <div class="field">\n'
            f'            <label for="{fid}">{label}{star}</label>\n'
            f'            <textarea id="{fid}" name="{fid}" rows="{rows}"{r} placeholder="{ph}"></textarea>{h}\n'
            f'          </div>')


def pill_field(name, legend, options, multi=False, req=False, hint=None, reveal=None):
    """A closed question as a row of pills.

    `options` are (value, label) pairs. `reveal` is the value that, when
    ticked, shows the follow-up field with that id — the only JS this form
    needs beyond submit.
    """
    kind = "checkbox" if multi else "radio"
    star = ' <span>*</span>' if req else (' <span>(select all that apply)</span>' if multi else "")
    items = []
    for i, (val, label) in enumerate(options):
        fid = f"{name}-{val}"
        r = " required" if (req and not multi and i == 0) else ""
        rev = f' data-reveal="{reveal}"' if reveal and val == "other" else ""
        items.append(f'              <label class="ptn-opt"><input type="{kind}" id="{fid}" '
                     f'name="{name}" value="{label}"{r}{rev} /><span>{label}</span></label>')
    h = f'\n            <p class="field__hint">{hint}</p>' if hint else ""
    return (f'          <fieldset class="ptn-q">\n'
            f'            <legend>{legend}{star}</legend>\n'
            f'            <div class="ptn-opts">\n' + "\n".join(items) + "\n            </div>"
            f'{h}\n          </fieldset>')


AUDIENCE = [("a1", "18&ndash;24"), ("a2", "25&ndash;30"), ("a3", "31&ndash;35"), ("a4", "36&ndash;40")]
YES_NO = [("yes", "Yes"), ("no", "No")]


def base_fields(p):
    """The seven questions every route asks. `p` prefixes the ids so three
    forms can sit on one page (the component page) without colliding."""
    return [
        f'          <div class="field-row">\n'
        f'{text_field(p + "name", "Your Name", req=True, ph="First and last", auto="name")}\n'
        f'{text_field(p + "email", "Email", req=True, ph="you@email.com", kind="email", auto="email")}\n'
        f'          </div>',

        pill_field(p + "over18", "Are you over 18?", YES_NO, req=True,
                   hint="Every TruTravels trip is 18+, so we can only work with partners who are too."),

        f'          <fieldset class="ptn-q">\n'
        f'            <legend>Socials <span>&mdash; wherever your community lives, all optional</span></legend>\n'
        f'            <div class="field-row field-row--3">\n'
        f'{text_field(p + "instagram", "Instagram", ph="@handle", tag="")}\n'
        f'{text_field(p + "tiktok", "TikTok", ph="@handle", tag="")}\n'
        f'{text_field(p + "youtube", "YouTube", ph="@channel", tag="")}\n'
        f'            </div>\n          </fieldset>',

        pill_field(p + "travelled", "Have you travelled with TruTravels before?", YES_NO,
                   hint="Not a requirement &mdash; it just tells us how much of the pitch you already know."),

        pill_field(p + "audience", "Who is your key audience?", AUDIENCE, multi=True),

        area_field(p + "why", "Why do you want to work with Tru?", req=True, rows=4,
                   ph="What is it about how we travel that fits what you&rsquo;ve built?"),
    ]


FOLLOWERS = lambda p: text_field(  # noqa: E731
    p + "reach", "Followers and engagement", req=True,
    ph="e.g. 42k on Instagram, ~6% engagement",
    hint="Rough numbers are fine. We care far more about how engaged your community is than how big it is.")


def form(fid, heading, sub, extra, submit, done_t, done_s, p=""):
    """One application form. `extra` are the route-specific questions, already
    rendered, appended after the shared base."""
    fields = "\n".join(base_fields(p) + extra)
    return f'''      <div class="ptn-form" data-ptn id="{fid}">
        <h3 class="ptn-form__h">{heading}</h3>
        <p class="ptn-form__s">{sub}</p>
        <form data-ptn-form novalidate>
{fields}
          <button type="submit" class="form-submit form-submit--auto">{submit}{CHEV_R}</button>
        </form>
        <div class="form-done" data-ptn-done hidden>
          <span class="form-done__ico">{TICK}</span>
          <h3 class="form-done__t">{done_t}</h3>
          <p class="form-done__s">{done_s}</p>
        </div>
      </div>'''


PTN_SCRIPT = """  <script>
  /* Partner application form. Two jobs: reveal the "please specify" field when
     Other is ticked, and swap the form for the success panel on submit.
     Copy once per page — it wires every [data-ptn] on it. */
  (function () {
    document.querySelectorAll('[data-reveal]').forEach(function (input) {
      var target = document.getElementById(input.dataset.reveal);
      if (!target) return;
      var group = document.getElementsByName(input.name);
      /* A hidden required field blocks checkValidity() with a control the
         user can't see, so `required` rides the reveal rather than sitting
         in the markup — the label's * is only true while it's showing. */
      function sync() {
        target.hidden = !input.checked;
        target.querySelectorAll('input, textarea, select').forEach(function (el) {
          if (input.checked) el.setAttribute('required', '');
          else el.removeAttribute('required');
        });
      }
      [].forEach.call(group, function (i) { i.addEventListener('change', sync); });
      sync();
    });

    document.querySelectorAll('[data-ptn]').forEach(function (wrap) {
      var form = wrap.querySelector('[data-ptn-form]');
      var done = wrap.querySelector('[data-ptn-done]');
      if (!form || !done) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        form.hidden = true;
        done.hidden = false;
        wrap.scrollIntoView({ block: 'center' });
      });
    });
  })();
  </script>"""


# ------------------------------------------------------------- page pieces --

def watermarks(items):
    return "\n".join(
        f'      <img class="ess-wm" style="{style}" src="assets/bg-assets/{name}.svg" '
        f'alt="" aria-hidden="true" />'
        for name, style in items
    )


def wins(items):
    cards = "\n".join(
        f'          <div class="job__win">\n'
        f'            <span class="ptn-win__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" '
        f'stroke="currentColor" stroke-width="1.5">{BENEFIT_ICONS[ico]}</svg></span>\n'
        f'            <p class="job__win__t">{t}</p>\n'
        f'            <p class="job__win__d">{d}</p>\n'
        f'          </div>' for t, d, ico in items)
    return f'        <div class="job__wins ptn-wins" style="margin-top:2rem">\n{cards}\n        </div>' 


def steps(items):
    cards = "\n".join(
        f'          <div class="ptn-step"><p class="ptn-step__t">{t}</p>'
        f'<p class="ptn-step__d">{d}</p></div>' for t, d in items)
    return f'        <div class="ptn-steps">\n{cards}\n        </div>'


def xcard(href, img, title, desc):
    return f'''          <a class="ab-xcard" href="{href}">
            <img src="{img}" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__t">{title}</span>
              <span class="ab-xcard__d">{desc}</span>
            </span>
          </a>'''


def cross(cards):
    return f'''    <section class="ess-body ab-more">
{watermarks([("tru-logo", "left:-4rem;bottom:-2rem;width:clamp(240px,30vw,500px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">Keep Looking</p>
        <h2 class="ess-h2">The Other <span>Ways In</span></h2>
        <div class="ab-xgrid" style="margin-top:2rem">
{cards}
        </div>
      </div>
    </section>'''


def shell(title, desc, hero_img, eyebrow, h1_a, h1_b, quote, body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>{title}</title>
  <meta name="description" content="{desc}" />
</head>
<body>

{NAV_OVER}

  <main class="ab">
    <section class="ess-hero">
      <img class="ess-hero__img" src="{hero_img}" alt="" aria-hidden="true" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">{eyebrow}</p>
          <h1 class="ess-hero__title">{h1_a} <span>{h1_b}</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">{quote}</p>
        </div>
      </div>
    </section>

{body}
  </main>

{FOOTER}

{SCRIPTS}

{PTN_SCRIPT}
</body>
</html>
"""


# ================================================================== pages ====

HERO_HUB = "https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg"
HERO_AFF = "https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg"
HERO_HOST = "https://cdn.trutravels.com/morocco-images/morocco-uncovered-marrakech-jardin-group-picture.jpg"


def partner_with_us():
    interest = pill_field(
        "interest", "I&rsquo;m interested in", [
            ("host", "Hosting a trip"),
            ("aff", "Affiliates programme"),
            ("other", "Something else"),
        ], multi=True, reveal="interest-other-detail")
    other = (f'          <div class="field ptn-reveal" id="interest-other-detail" hidden>\n'
             f'            <label for="interest-detail">Tell us about it <span>*</span></label>\n'
             f'            <textarea id="interest-detail" name="interest-detail" rows="3" '
             f'placeholder="A collaboration, an event, a campaign &mdash; whatever you had in mind."></textarea>\n'
             f'          </div>')

    body = f'''    <section class="ess-body">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
             ("good-vibes", "left:-4rem;top:46%;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col ab-prose">
        <p class="ab-lead">Do you have a community that <em>loves to travel?</em></p>
        <p>Have you ever thought about travelling together? Whether you want to host your own group trip, be part of our tailor-made Tru Affiliates programme, or have a totally unique partnership idea, we&rsquo;d love to hear from you.</p>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("community", "left:-4rem;top:-1rem;width:clamp(240px,30vw,500px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">Three Ways In</p>
        <h2 class="ess-h2">Pick The One That <span>Sounds Like You</span></h2>
        <p class="ess-p ab-lede">Not sure which? Say so on the form below and we&rsquo;ll work it out together &mdash; plenty of partners start in one and end up in both.</p>
        <div class="ptn-routes">
          <a class="ptn-route" href="host-a-trip.html">
            <span class="ptn-route__ico">{ICO_FLAG}</span>
            <p class="ptn-route__t">Host A Trip</p>
            <p class="ptn-route__d">You bring your community, we handle the planning, the guides, the logistics and the safety. You get your own page on this site and commission on every booking.</p>
            <span class="ptn-route__go">Host A Trip{CHEV_R}</span>
          </a>
          <a class="ptn-route" href="affiliates.html">
            <span class="ptn-route__ico">{ICO_LINK}</span>
            <p class="ptn-route__t">Tru Affiliates</p>
            <p class="ptn-route__d">Your own bespoke URL and trackable links, a minimum 5% commission, incentives through the year, and the assets and templates to post with.</p>
            <span class="ptn-route__go">See The Programme{CHEV_R}</span>
          </a>
          <div class="ptn-route">
            <span class="ptn-route__ico">{ICO_SPARK}</span>
            <p class="ptn-route__t">Something Else</p>
            <p class="ptn-route__d">A campaign, an event, a collaboration nobody has done yet. If it doesn&rsquo;t fit either box above, it probably belongs here. Tell us what you had in mind.</p>
            <span class="ptn-route__go">Use The Form Below{CHEV_R}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec" id="apply">
{watermarks([("lantern", "right:-3rem;top:0;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col">
        <p class="ess-eyebrow">Get In Touch</p>
        <h2 class="ess-h2">Tell Us About <span>Your Community</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:2rem">A real person reads every one of these. If there&rsquo;s something here, we&rsquo;ll come back to you within a few days.</p>
{form("apply-form",
      "Partner <span>Application</span>",
      "Seven questions and a couple of follow-ups. Nothing here commits you to anything.",
      [interest, other],
      "Send My Application",
      "Thanks &mdash; <span>We&rsquo;re On It</span>",
      "Your application is with the partnerships team. We read every one properly, so give us a few days &mdash; and if you think of something you left out, "
      f'<a href="mailto:{CONTACT}" style="color:var(--tru-pink)">email us</a>.')}
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("eyes", "left:-3rem;bottom:-2rem;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">In Good Company</p>
        <h2 class="ess-h2">Communities We&rsquo;ve <span>Travelled With</span></h2>
        <p class="ess-p ab-lede">Groups, clubs and creators who have already brought their people out with us.</p>
{logo_wall()}
      </div>
    </section>

{cross(chr(10).join([
    xcard("host-a-trip.html", HERO_HOST, "Host A Trip",
          "Bring your community somewhere brilliant &mdash; we do the logistics"),
    xcard("affiliates.html", HERO_AFF, "Tru Affiliates",
          "Trackable links, 5% minimum commission, assets you can actually post"),
    xcard("join-the-crew.html", "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg",
          "Join The Crew", "Not a partner &mdash; want a job? Open roles are here"),
]))}
'''
    return shell(
        "Partner With Us &mdash; TruTravels",
        "Host your own group trip, join the Tru Affiliates programme, or bring us a partnership idea "
        "nobody has tried yet. Tell us about your community.",
        HERO_HUB, "Partners", "Partner", "With Us",
        "&ldquo;Do you have a community that loves to travel? Have you ever thought about travelling together?&rdquo;",
        body)


def affiliates():
    extra = [
        FOLLOWERS(""),
        area_field("fit", "Why is the affiliate programme a perfect fit for you?", req=True, rows=4,
                   ph="How do you usually talk about travel with your community, and where would the links live?"),
    ]
    body = f'''    <section class="ess-body">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
             ("brazil", "left:-4rem;top:48%;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col ab-prose">
        <p class="ab-lead">Build brand awareness and brand loyalty <em>with the people who already trust you.</em></p>
        <p>Tru Affiliates is our own internal affiliates system, built around personalised trackable links. Your community books through you, we can see exactly which bookings came from where, and you get paid on every one of them.</p>
        <p>No third-party network taking a cut, no waiting to find out whether a booking counted. Your link, your numbers, your commission.</p>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("good-vibes", "left:-4rem;top:-1rem;width:clamp(240px,30vw,500px);opacity:0.05")])}
      <div class="ess-col">
        <p class="ess-eyebrow">The Deal</p>
        <h2 class="ess-h2">What You&rsquo;ll <span>Receive</span></h2>
{wins([
    ("Your Own Bespoke URL", "A TruTravels landing page that is yours, so you can send people somewhere that already speaks to your community rather than a generic homepage.", "window"),
    ("Trackable Links", "Personalised links across every trip, so every booking is attributed to you automatically. No codes to remember, nothing to claim after the fact.", "link"),
    ("Minimum 5% Commission", "Five per cent is the floor, not the target. It goes up with volume and it goes up with the incentives below.", "percent"),
    ("Commission Incentives", "Boosted rates run through the year, tied to launches, seasons and specific trips. You&rsquo;ll know about them before they go public.", "trend"),
    ("Bespoke Assets &amp; Templates", "Imagery, trip information and post templates made for your platforms, so posting about a trip takes minutes rather than an afternoon.", "assets"),
])}
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("ramen", "right:-3rem;top:0;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">How It Works</p>
        <h2 class="ess-h2">From Application <span>To Commission</span></h2>
{steps([
    ("Apply", "Fill in the form below. We want to understand your community more than your follower count."),
    ("Get Set Up", "We build your bespoke URL and your trackable links, and send over the asset pack."),
    ("Post", "Share the trips that suit your people. Everything booked through your links is attributed to you."),
    ("Get Paid", "Commission on every completed booking, at minimum 5%, plus whatever incentives are running."),
])}
      </div>
    </section>

    <section class="ess-body ab-sec" id="apply">
{watermarks([("lantern", "left:-3rem;top:0;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col">
        <p class="ess-eyebrow">Join The Programme</p>
        <h2 class="ess-h2">Apply To <span>Tru Affiliates</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:2rem">There&rsquo;s no minimum following. We&rsquo;d rather work with 3,000 people who actually listen to you than 300,000 who scroll past.</p>
{form("apply-form",
      "Affiliate <span>Application</span>",
      "Nine questions. Rough numbers are fine &mdash; we&rsquo;re reading for fit, not for a spreadsheet.",
      extra,
      "Apply To The Programme",
      "Application <span>Received</span>",
      "We&rsquo;ll come back to you within a few days with next steps. If you want to add anything in the meantime, "
      f'<a href="mailto:{CONTACT}" style="color:var(--tru-pink)">email the partnerships team</a>.')}
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("eyes", "right:-3rem;bottom:-2rem;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">Testimonials</p>
        <h2 class="ess-h2">Insight From Partners <span>We&rsquo;ve Worked With</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:2rem">Communities, clubs and creators who have already run this with us.</p>
        <div class="rev-carousel" data-arrows>
          <div class="carousel carousel--quotes">
{quote_cards()}
          </div>
{ARROWS}
        </div>
      </div>
    </section>

{cross(chr(10).join([
    xcard("partner-with-us.html", HERO_HUB, "Partner With Us",
          "Not sure which route fits? Start here"),
    xcard("host-a-trip.html", HERO_HOST, "Host A Trip",
          "Bring your community with you instead of sending them"),
    xcard("about-our-community.html", "https://cdn.trutravels.com/thailand/full-moon-party.jpg",
          "Our Community", "The people you&rsquo;d be sending somewhere"),
]))}
'''
    return shell(
        "Tru Affiliates &mdash; TruTravels Affiliate Programme",
        "Your own bespoke URL, trackable links and a minimum 5% commission. Tru Affiliates is our "
        "internal affiliate programme for creators and communities who travel.",
        HERO_AFF, "Tru Affiliates", "Tru", "Affiliates",
        "&ldquo;Your link, your numbers, your commission &mdash; with no third-party network in the middle.&rdquo;",
        body)


def host_a_trip():
    extra = [
        FOLLOWERS(""),
        area_field("why-host", "Why do you want to host a trip?", req=True, rows=4,
                   ph="What would this trip mean for you and for the people who&rsquo;d come on it?"),
        text_field("dream", "Do you have a dream destination?", ph="Somewhere specific, or a rough region",
                   hint="We run trips in 35+ countries, so there&rsquo;s a good chance we&rsquo;re already there."),
        area_field("community", "Do you have a pre-existing in-person or virtual community?", req=True, rows=3,
                   ph="A Discord, a run club, a group chat, a following, a class you teach &mdash; anything counts."),
    ]
    body = f'''    <section class="ess-body">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
             ("komodo-dragon", "left:-4rem;top:48%;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col ab-prose">
        <p class="ab-lead">Are you looking to transform your virtual community into <em>an in-person connection?</em></p>
        <p>Why not host a once-in-a-lifetime trip!</p>
        <p>We handle the logistics stuff &mdash; planning, customer communication, local guides and safety &mdash; while you focus on building hype for your trip and bringing your community together.</p>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("mask", "left:-4rem;top:-1rem;width:clamp(240px,30vw,500px);opacity:0.05")])}
      <div class="ess-col">
        <p class="ess-eyebrow">The Deal</p>
        <h2 class="ess-h2">What You&rsquo;ll <span>Receive</span></h2>
{wins([
    ("Your Community, In Person", "The chance to turn a comment section into a group of people who&rsquo;ve watched the same sunrise. That&rsquo;s the whole point of it.", "group"),
    ("You Travel Too", "You&rsquo;re on the trip, not running it. Your Local Legend handles the days; you get to actually be there with your people.", "plane"),
    ("A Bespoke Website Page", "Your own page on this site, built around your trip and your audience, that you can send people straight to.", "window"),
    ("Commission On Bookings", "You earn on every place sold on your trip &mdash; paid on completed bookings, with nothing to chase.", "money"),
    ("A Scalable Structure", "The more of your community comes, the higher the rate goes. A full departure pays considerably better than a half-full one.", "bars"),
])}
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("peru-bird", "right:-3rem;top:0;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">How It Works</p>
        <h2 class="ess-h2">What Actually <span>Happens Next</span></h2>
{steps([
    ("Tell Us The Idea", "Who your community is, roughly how many might come, and where you&rsquo;ve always wanted to take them."),
    ("We Build It", "We shape the itinerary, price it, assign a Local Legend and set the dates with you. You approve it before anything goes live."),
    ("You Build The Hype", "Your page goes up and you do what you already do &mdash; talk to your people. We supply the assets."),
    ("You Go", "We run the trip on the ground. You&rsquo;re on it as a traveller, not a tour manager."),
])}
      </div>
    </section>

    <section class="ess-body ab-sec" id="apply">
{watermarks([("lantern", "left:-3rem;top:0;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col">
        <p class="ess-eyebrow">Start The Conversation</p>
        <h2 class="ess-h2">Pitch Us <span>Your Trip</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:2rem">You don&rsquo;t need a finished plan, a date or a destination. A community and an idea is enough to start.</p>
{form("apply-form",
      "Host A Trip <span>Application</span>",
      "Ten questions. The last four are the ones we&rsquo;ll actually want to talk about.",
      extra,
      "Pitch My Trip",
      "Pitch <span>Received</span>",
      "Someone from the partnerships team will be in touch within a few days to talk it through. Anything to add in the meantime? "
      f'<a href="mailto:{CONTACT}" style="color:var(--tru-pink)">Email us</a>.')}
      </div>
    </section>

{cross(chr(10).join([
    xcard("partner-with-us.html", HERO_HUB, "Partner With Us",
          "Not sure which route fits? Start here"),
    xcard("affiliates.html", HERO_AFF, "Tru Affiliates",
          "Send your community rather than travel with them"),
    xcard("about-our-story.html", "https://cdn.trutravels.com/thailand/longtail-boat.jpg",
          "Our Story", "Who you&rsquo;d be handing your community to"),
]))}
'''
    return shell(
        "Host A Trip &mdash; TruTravels",
        "Turn your online community into an in-person one. You bring the people and the hype; we handle "
        "planning, guides, communication and safety &mdash; and you travel too.",
        HERO_HOST, "Host A Trip", "Host", "A Trip",
        "&ldquo;We handle the logistics. You focus on building hype and bringing your community together.&rdquo;",
        body)


# ============================================================== component ====

COMPONENT_NOTE = """  <!-- ===================================================================
       PARTNER APPLICATION FORM — partner-with-us.html, affiliates.html and
       host-a-trip.html.

       ONE FORM, THREE ROUTES
       All three Partners pages ask the same seven questions:

         name / email  ·  over 18?  ·  socials  ·  travelled with us before?
         ·  key audience  ·  why Tru?

       and then two to four more that only make sense for that route:

         PARTNER WITH US   I'm interested in (multi) + "tell us about it",
                           revealed only when "Something else" is ticked.
         AFFILIATES        followers and engagement; why the programme fits.
         HOST A TRIP       followers and engagement; why host; dream
                           destination; existing community.

       Build it from the base outwards. If a question belongs on all three,
       it goes in the shared block — three near-identical forms that drift
       apart is the failure this codebase keeps repeating.

       CLOSED QUESTIONS ARE PILLS, NOT SELECTS
       A <select> hides its options behind a tap, and on a form that is
       otherwise open text that's exactly the wrong trade: these four
       questions are the quick ones. The radio/checkbox inside each pill is
       visually hidden, not display:none, so it keeps keyboard focus and
       :focus-visible draws the ring on the label.

       Text inputs are the shared `.field` system (see form-fields.html);
       the button is `.form-submit` and the success panel `.form-done`.

       Requires ../styles.css and the script at the foot of this file.
       =================================================================== -->"""


def component():
    interest = pill_field(
        "c-interest", "I&rsquo;m interested in", [
            ("host", "Hosting a trip"),
            ("aff", "Affiliates programme"),
            ("other", "Something else"),
        ], multi=True, reveal="c-interest-other-detail")
    other = (f'          <div class="field ptn-reveal" id="c-interest-other-detail" hidden>\n'
             f'            <label for="c-interest-detail">Tell us about it <span>*</span></label>\n'
             f'            <textarea id="c-interest-detail" name="c-interest-detail" rows="3" '
             f'placeholder="A collaboration, an event, a campaign &mdash; whatever you had in mind."></textarea>\n'
             f'          </div>')

    hub = form("c-hub", "Partner <span>With Us</span>",
               "The hub variant &mdash; the base plus the routing question. Tick &ldquo;Something else&rdquo; to see the reveal.",
               [interest, other], "Send My Application",
               "Thanks &mdash; <span>We&rsquo;re On It</span>",
               "Your application is with the partnerships team.", p="c1-")

    aff = form("c-aff", "Tru <span>Affiliates</span>",
               "The affiliates variant &mdash; the base plus reach and fit.",
               [FOLLOWERS("c2-"),
                area_field("c2-fit", "Why is the affiliate programme a perfect fit for you?", req=True, rows=3,
                           ph="How do you usually talk about travel with your community?")],
               "Apply To The Programme", "Application <span>Received</span>",
               "We&rsquo;ll come back to you within a few days.", p="c2-")

    host = form("c-host", "Host <span>A Trip</span>",
                "The host variant &mdash; the base plus reach, motivation, destination and community.",
                [FOLLOWERS("c3-"),
                 area_field("c3-why-host", "Why do you want to host a trip?", req=True, rows=3,
                            ph="What would this trip mean for the people who&rsquo;d come on it?"),
                 text_field("c3-dream", "Do you have a dream destination?", ph="Somewhere specific, or a region"),
                 area_field("c3-community", "Do you have a pre-existing in-person or virtual community?",
                            req=True, rows=3,
                            ph="A Discord, a run club, a group chat, a class you teach &mdash; anything counts.")],
                "Pitch My Trip", "Pitch <span>Received</span>",
                "Someone will be in touch within a few days.", p="c3-")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Partner application form (component) &mdash; TruTravels</title>
  <meta name="description" content="The partner application — one shared base of seven questions, plus the two to four that differ per route." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;"><p style="color:#9ca3af;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">Partner application form &mdash; demo (all three variants; submit one)</p></div>

{COMPONENT_NOTE}
  <section class="ess-body">
    <div class="ess-col">
      <p class="ess-eyebrow">Variant 1 of 3</p>
      <h2 class="ess-h2">Partner <span>With Us</span></h2>
      <div style="margin-top:1.5rem">
{hub}
      </div>

      <p class="ess-eyebrow" style="margin-top:4rem">Variant 2 of 3</p>
      <h2 class="ess-h2">Tru <span>Affiliates</span></h2>
      <div style="margin-top:1.5rem">
{aff}
      </div>

      <p class="ess-eyebrow" style="margin-top:4rem">Variant 3 of 3</p>
      <h2 class="ess-h2">Host <span>A Trip</span></h2>
      <div style="margin-top:1.5rem">
{host}
      </div>

      <p class="ess-eyebrow" style="margin-top:4rem">Supporting Blocks</p>
      <h2 class="ess-h2">Partner <span>Logo Wall</span></h2>
      <p class="ess-p">Every mark is a different colour and two of the six are solid black, so none of them can sit straight on the navy &mdash; white tiles are the only treatment that works for all six without altering anyone&rsquo;s logo.</p>
{logo_wall("../")}

      <h2 class="ess-h2" style="margin-top:3rem">Testimonial <span>Carousel</span></h2>
      <p class="ess-p">The partners are real; the quotes have not been collected yet, so each card carries an &ldquo;awaiting copy&rdquo; tag rather than invented words under a real organisation&rsquo;s mark. Delete <code>.ptn-quote__todo</code> and drop the quote into <code>.ptn-quote__body</code> when the copy lands.</p>
      <div class="rev-carousel" data-arrows style="margin-top:1.5rem">
        <div class="carousel carousel--quotes">
{quote_cards("../")}
        </div>
{ARROWS}
      </div>
    </div>
  </section>

{CAROUSEL_JS}

{PTN_SCRIPT}
</body>
</html>
"""


if __name__ == "__main__":
    for fn, fx in (("partner-with-us.html", partner_with_us),
                   ("affiliates.html", affiliates),
                   ("host-a-trip.html", host_a_trip)):
        out = fx()
        open(os.path.join(BASE, fn), "w", encoding="utf-8").write(out)
        print(f"  wrote {fn:<26} ({len(out.splitlines())} lines)")

    out = component()
    open(os.path.join(BASE, "components", "partner-application-form.html"), "w",
         encoding="utf-8").write(out)
    print(f"  wrote components/partner-application-form.html ({len(out.splitlines())} lines)")
