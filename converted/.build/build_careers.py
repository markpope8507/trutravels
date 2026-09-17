"""
Build the careers page and the job-listing component.

  converted/join-the-crew.html          the page
  converted/components/job-listing.html  the board on its own, copy-in

Mirrors trutravels.com/join-the-crew/jobs in the site's own design language.
What changed, and why:

  * The live board is a bare accordion — a title and nothing else until you
    open it. A candidate's first three questions are where, which team and
    what kind of contract, so those are on the closed card as tags, along
    with a one-line hook.
  * The live posting body is one undifferentiated wall of text. Here the
    facts become a rail, "what success looks like" becomes named outcome
    cards (they read as bullets on the live page but each one is really a
    named outcome), and Requirements sits beside Preferred so the
    difference between a must and a nice-to-have is visible.
  * Nothing is hidden behind JS: collapse is native <details>. The script
    only handles the filter chips and deep links, so /join-the-crew.html
    #accounts-payable-assistant opens and scrolls to that role the way the
    live page's anchor does.

Copy lives in jobs_data.py; chrome comes from shell.py; styling is .job-* /
.jobs-* in ../styles.css.

Run:  python3 converted/.build/build_careers.py
"""

import os

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD
from jobs_data import JOBS, APPLY_EMAIL, APPLY_CONTACT, VALUES, EQUAL_OPPS

CHEV_R = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
CHEV_D = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
          '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')
PIN = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 '
       '0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" '
       'd="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>')
TEAM = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 '
        '20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283'
        '.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 '
        '014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>')
# The two core-value icons, exactly as they appear on the Our Values page.
HEART = ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32'
         'C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3'
         ' 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')
PALM = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"'
        ' stroke-linejoin="round" aria-hidden="true"><path d="M12 22V11"/><path d="M12 11 Q 6 6 2 9"/>'
        '<path d="M12 11 Q 18 6 22 9"/><path d="M12 11 Q 9 4 6 3"/><path d="M12 11 Q 15 4 18 3"/>'
        '<path d="M12 11 Q 12 5 12 2"/></svg>')
VALUE_ICONS = {"heart": HEART, "palm": PALM}

CLOCK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
         '<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" '
         'd="M12 7v5l3 2"/></svg>')

# A wide group shot with room on the right for the overlay. Verified to load —
# the obvious-sounding /images/thailand-groupshot.jpg does not exist on the CDN.
HERO_IMG = "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg"
VALUES_IMG = "https://cdn.trutravels.com/thailand/longtail-boat.jpg"


def watermarks(items):
    return "\n".join(
        f'      <img class="ess-wm" style="{style}" src="assets/bg-assets/{name}.svg" '
        f'alt="" aria-hidden="true" />'
        for name, style in items
    )


def ticks(items, plain=False):
    cls = " job__list--plain" if plain else ""
    lis = "\n".join(f"            <li>{i}</li>" for i in items)
    return f'          <ul class="job__list{cls}">\n{lis}\n          </ul>'


def section(heading, inner):
    return (f'        <div class="job__sec">\n'
            f'          <h4 class="job__h">{heading}</h4>\n{inner}\n        </div>')


def value_chip(v):
    """One core value, wearing the mark it wears on the Our Values page."""
    inner = VALUE_ICONS.get(v.get("icon"), "")
    inner += f'<span class="job__value__w">{v["lead"]}</span>'
    inner += f'<span class="job__value__m job__value__m--{v["style"]}">{v["mark"]}</span>'
    if v.get("tail"):
        inner += f'<span class="job__value__w">{v["tail"]}</span>'
    blue = " job__value--blue" if v.get("blue") else ""
    return (f'            <a class="job__value{blue}" href="about-our-values.html">'
            f'{inner}</a>')


def job_detail(j):
    """Everything below the fold of a job card."""
    out = []

    facts = "\n".join(
        f'            <div class="job__fact"><dt>{k}</dt><dd>{v}</dd></div>'
        for k, v in j["facts"]
    )
    out.append(f'        <dl class="job__facts">\n{facts}\n        </dl>')

    out.append(section("The Role In A Nutshell", "\n".join(
        f'          <p class="job__p">{p}</p>' for p in j["nutshell"])))

    if j.get("wins"):
        cards = "\n".join(
            f'            <div class="job__win"><p class="job__win__t">{t}</p>'
            f'<p class="job__win__d">{d}</p></div>'
            for t, d in j["wins"]
        )
        out.append(section("What Success Looks Like",
                           f'          <div class="job__wins">\n{cards}\n          </div>'))

    if j.get("responsibilities"):
        intro = f'          <p class="job__p">{j["resp_intro"]}</p>\n' if j.get("resp_intro") else ""
        out.append(section("Key Responsibilities", intro + ticks(j["responsibilities"])))

    if j.get("groups"):
        grps = "\n".join(
            f'          <div class="job__grp">\n            <p class="job__grp-h">{name}</p>\n'
            f'{ticks(items)}\n          </div>'
            for name, items in j["groups"]
        )
        out.append(section("What You&rsquo;ll Be Doing", grps))

    if j.get("suits"):
        intro = f'          <p class="job__p">{j["suits_intro"]}</p>\n' if j.get("suits_intro") else ""
        out.append(section("Who This Role Is Perfect For", intro + ticks(j["suits"])))

    # Requirements beside Preferred — the live page runs them as two more
    # identical bullet lists, which hides which ones actually matter.
    if j.get("musts"):
        nice = ""
        if j.get("nices"):
            nice = (f'            <div>\n'
                    f'              <p class="job__col-h">Nice To Have <span>&mdash; don&rsquo;t let a gap stop you</span></p>\n'
                    f'{ticks(j["nices"], plain=True)}\n            </div>')
        out.append(section("What You&rsquo;ll Need",
                           f'          <div class="job__two">\n'
                           f'            <div>\n'
                           f'              <p class="job__col-h">Essential</p>\n'
                           f'{ticks(j["musts"])}\n            </div>\n{nice}\n          </div>'))

    if j.get("matters"):
        body = "\n".join(f'          <p class="job__p">{p}</p>' for p in j["matters"])
        body += f'\n          <p class="job__quote">{j["matters_quote"]}</p>'
        out.append(section("Why This Role Matters At Tru", body))

    chips = "\n".join(value_chip(v) for v in VALUES)
    out.append(section("Our Values",
                       '          <p class="job__p">Our values shape how we work, lead and grow. If they '
                       'resonate with you, you&rsquo;ll probably feel at home here.</p>\n'
                       f'          <div class="job__values">\n{chips}\n          </div>'))

    out.append(
        f'        <div class="job__apply">\n'
        f'          <h4 class="job__apply-h">Ready To Join <span>The Adventure?</span></h4>\n'
        f'          <p class="job__apply-p">Send your application to {APPLY_CONTACT} at '
        f'<a href="mailto:{APPLY_EMAIL}?subject={j["title"].replace(" ", "%20")}">{APPLY_EMAIL}</a> '
        f'and include your CV plus a short introduction about yourself and what excites you about this '
        f'opportunity.</p>\n'
        f'          <div class="job__apply-acts">\n'
        f'            <a class="nf-btn nf-btn--pink" href="mailto:{APPLY_EMAIL}?subject='
        f'{j["title"].replace(" ", "%20")}">Apply For This Role{CHEV_R}</a>\n'
        f'            <a class="nf-btn nf-btn--ghost" href="#roles">Back To All Roles</a>\n'
        f'          </div>\n'
        f'          <p class="job__fine">We read every application carefully. If you haven&rsquo;t heard '
        f'from us within three weeks, please assume your application hasn&rsquo;t been successful this '
        f'time.</p>\n'
        f'          <p class="job__fine">{EQUAL_OPPS}</p>\n'
        f'        </div>'
    )

    return "\n\n".join(out)


def job_card(j, open_first=False):
    suffix = f'<span>{j["suffix"]}</span>' if j.get("suffix") else ""
    return f'''      <details class="job" id="{j['slug']}" data-job data-dept="{j['department']}" data-loc="{j['location']}"{' open' if open_first else ''}>
        <summary class="job__head">
          <div class="job__top">
            <h3 class="job__t">{j['title']}{suffix}</h3>
            <span class="job__chev" aria-hidden="true">{CHEV_D}</span>
          </div>
          <p class="job__hook">{j['hook']}</p>
          <div class="job__tags">
            <span class="job__tag">{PIN}{j['location']}</span>
            <span class="job__tag">{TEAM}{j['department']}</span>
            <span class="job__tag">{CLOCK}{j['type']}</span>
          </div>
        </summary>
        <div class="job__body">
          <div class="job__rule"></div>
{job_detail(j)}
        </div>
      </details>'''


def chips(attr, label, values):
    """Filter chips with real counts — never offer a filter that returns nothing."""
    counts = {}
    for j in JOBS:
        counts[j[attr]] = counts.get(j[attr], 0) + 1
    out = [f'        <button type="button" class="jobs-chip is-on" data-filter="{attr}" data-value="">'
           f'All {label}<span class="jobs-chip__n">{len(JOBS)}</span></button>']
    for v in sorted(counts):
        out.append(f'        <button type="button" class="jobs-chip" data-filter="{attr}" '
                   f'data-value="{v}">{v}<span class="jobs-chip__n">{counts[v]}</span></button>')
    return "\n".join(out)


JOBS_SCRIPT = """  <script>
  /* Jobs board. The accordion itself is native <details> and needs none of
     this — the script only adds the filter chips and the deep links that the
     live site's #anchor URLs rely on. */
  (function () {
    var jobs = [].slice.call(document.querySelectorAll('[data-job]'));
    if (!jobs.length) return;
    var empty = document.querySelector('[data-jobs-empty]');
    var active = { dept: '', loc: '' };

    function apply() {
      var shown = 0;
      jobs.forEach(function (j) {
        var ok = (!active.dept || j.dataset.dept === active.dept)
              && (!active.loc || j.dataset.loc === active.loc);
        j.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }

    document.querySelectorAll('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.dataset.filter === 'department' ? 'dept' : 'loc';
        active[key] = chip.dataset.value;
        document.querySelectorAll('[data-filter="' + chip.dataset.filter + '"]')
          .forEach(function (c) { c.classList.toggle('is-on', c === chip); });
        apply();
      });
    });

    /* Deep link: #slug opens that role and scrolls to it. Also keeps the URL
       in step as roles are opened, so a link can be copied from the address
       bar — which is what the live site's anchors are for. */
    function openFromHash() {
      var id = location.hash.replace(/^#_?/, '');
      if (!id) return;
      var job = document.getElementById(id);
      if (!job || !job.matches('[data-job]')) return;
      job.open = true;
      job.scrollIntoView({ block: 'start' });
    }
    /* Align the card head on toggle. Without this the panel expands above the
       reader's position and they land at the end of what they just opened —
       `overflow-anchor: none` in the CSS stops the browser compensating, and
       this puts the start of the role where they can see it. */
    var reduce = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    jobs.forEach(function (j) {
      j.addEventListener('toggle', function () {
        if (j.open && history.replaceState) history.replaceState(null, '', '#' + j.id);
        j.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  })();
  </script>"""


def page():
    cards = "\n".join(job_card(j) for j in JOBS)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Join The Crew &mdash; Careers At TruTravels</title>
  <meta name="description" content="Open roles at TruTravels — finance, operations and on-tour experience, across Bali, the Philippines and Thailand." />
</head>
<body>

{NAV_OVER}

  <main class="ab">
    <section class="ess-hero">
      <img class="ess-hero__img" src="{HERO_IMG}" alt="" aria-hidden="true" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">Careers At Tru</p>
          <h1 class="ess-hero__title">Join The <span style="color:var(--tru-pink)">Crew</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;We started TruTravels because we wanted to do something we enjoy, with people we love. That hasn&rsquo;t changed.&rdquo;</p>
        </div>
      </div>
    </section>

    <section class="ess-body">
{watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
             ("good-vibes", "left:-4rem;top:40%;width:clamp(220px,28vw,460px);opacity:0.05")])}
      <div class="ess-col ab-prose">
        <p class="ab-lead">We only hire people we&rsquo;d happily spend <em>fourteen days on a minibus with</em>.</p>
        <p>We started TruTravels because we wanted to do something we enjoy and work with people we love. So we&rsquo;ve tried our best over the years to make Tru a fun place to work, and to only hire cool, energetic, good-humoured and awesome people.</p>
        <p>As a result, the Tru family is made up of some of the most amazing people on the planet, who love working with each other and love what they do.</p>
        <p>We have operations in countries all over the world. If you want to live somewhere brilliant <em class="ab-light">and</em> work for a fast-growing company, you have a passion for travel, and you can bring something to the table &mdash; have a look at what&rsquo;s open below.</p>
        <p class="ab-closer">You don&rsquo;t need to tick every box.</p>
      </div>
    </section>

    <section class="ess-body ab-sec" id="roles">
{watermarks([("mask", "left:-4rem;top:-2rem;width:clamp(240px,30vw,500px);opacity:0.05"),
             ("peru-bird", "right:-3rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">Open Roles</p>
        <h2 class="ess-h2">What We&rsquo;re <span>Hiring For</span></h2>
        <p class="ess-p ab-lede">{len(JOBS)} roles open right now. Everything you need to decide whether it&rsquo;s worth your time is on the card &mdash; open one for the full brief.</p>

        <div style="margin-top:2.5rem">
          <div class="jobs-bar">
            <p class="jobs-bar__l">Team</p>
{chips("department", "Teams", None)}
          </div>
          <div class="jobs-bar">
            <p class="jobs-bar__l">Where</p>
{chips("location", "Locations", None)}
          </div>

          <div class="jobs">
{cards}
          </div>
          <p class="jobs-empty" data-jobs-empty hidden>No roles match that combination right now. Clear a filter, or send us a speculative application at <a href="mailto:{APPLY_EMAIL}" style="color:var(--tru-pink)">{APPLY_EMAIL}</a> &mdash; we keep good people on file.</p>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
{watermarks([("bali-flower", "right:-4rem;top:0;width:clamp(240px,30vw,500px);opacity:0.06")])}
      <div class="ess-col">
        <p class="ess-eyebrow">Nothing Quite Right?</p>
        <h2 class="ess-h2">Tell Us What <span>You&rsquo;d Do Here</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:1.5rem">We&rsquo;d rather hear from someone brilliant with no matching vacancy than miss them entirely. Send a CV and a short note about what you&rsquo;d want to build, and we&rsquo;ll keep it on file.</p>
        <a class="nf-btn nf-btn--pink" href="mailto:{APPLY_EMAIL}?subject=Speculative%20application">Send A Speculative Application{CHEV_R}</a>
      </div>
    </section>

    <section class="ess-body ab-more">
{watermarks([("tru-logo", "left:-4rem;bottom:-2rem;width:clamp(240px,30vw,500px);opacity:0.05")])}
      <div class="container">
        <p class="ess-eyebrow">Before You Apply</p>
        <h2 class="ess-h2">Get To Know <span>Us First</span></h2>
        <div class="ab-xgrid" style="margin-top:2rem">
          <a class="ab-xcard" href="about-our-story.html">
            <img src="assets/about/mark-joe-story-2025.png" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__t">Our Story</span>
              <span class="ab-xcard__d">How a house purchase falling through turned into this</span>
            </span>
          </a>
          <a class="ab-xcard" href="about-our-values.html">
            <img src="{VALUES_IMG}" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__t">Our Values</span>
              <span class="ab-xcard__d">The four things we actually hire and promote against</span>
            </span>
          </a>
          <a class="ab-xcard" href="about-our-impact.html">
            <img src="https://cdn.trutravels.com/images/peru-rainbow4.jpg" alt="" loading="lazy" />
            <span class="ab-xcard__grad"></span>
            <span class="ab-xcard__body">
              <span class="ab-xcard__t">Our Impact</span>
              <span class="ab-xcard__d">The People &amp; Planet Promise, and how we&rsquo;re tracking</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}

{JOBS_SCRIPT}
</body>
</html>
"""


# ------------------------------------------------------------ component ----
COMPONENT_NOTE = """  <!-- ===================================================================
       JOB LISTING — the open-roles board.

       Copy the <div class="jobs"> block (and one <details class="job"> per
       role) into a careers page, plus the filter bars above it if the board
       is long enough to need them, and the script at the foot of this file.

       WHY IT IS SHAPED THIS WAY
       The board this replaces showed a job title and nothing else until you
       clicked. A candidate's first three questions are where is it, which
       team, and what kind of contract — so those sit on the closed card as
       tags, with a one-line hook. Opening a role should confirm a decision,
       not start one.

       The detail is typed rather than run as one block of prose:
         .job__facts   the Location / Department / Reports to rail
         .job__wins    named outcomes — "what success looks like"
         .job__list    tick list for responsibilities and requirements
         .job__grp     a sub-heading inside a section
         .job__two     Essential beside Nice To Have, so the difference
                       between a must and a preference is visible
         .job__quote   the one line worth pulling out
         .job__apply   the CTA panel, repeated at the foot of every role

       NO SCRIPT NEEDED to open and close — that is native <details>. The
       script only powers the filter chips and the deep links, so
       /join-the-crew.html#accounts-payable-assistant opens that role.

       Requires ../styles.css (.jobs-*, .job-*, .nf-btn).
       =================================================================== -->"""


def component():
    cards = "\n".join(job_card(j).replace("about-our-values.html", "../about-our-values.html")
                      for j in JOBS)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Job listing (component) &mdash; TruTravels</title>
  <meta name="description" content="Open-roles board — filterable job cards that expand to a full, typed job description." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;"><p style="color:#9ca3af;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">Job listing &mdash; demo (filter the chips, open a role)</p></div>

{COMPONENT_NOTE}
  <section class="ess-body">
    <div class="container">
      <p class="ess-eyebrow">Open Roles</p>
      <h2 class="ess-h2">What We&rsquo;re <span>Hiring For</span></h2>

      <div style="margin-top:2rem">
        <div class="jobs-bar">
          <p class="jobs-bar__l">Team</p>
{chips("department", "Teams", None)}
        </div>
        <div class="jobs-bar">
          <p class="jobs-bar__l">Where</p>
{chips("location", "Locations", None)}
        </div>

        <div class="jobs">
{cards}
        </div>
        <p class="jobs-empty" data-jobs-empty hidden>No roles match that combination right now.</p>
      </div>
    </div>
  </section>

{JOBS_SCRIPT}
</body>
</html>
"""


if __name__ == "__main__":
    out = page()
    open(os.path.join(BASE, "join-the-crew.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote join-the-crew.html          ({len(out.splitlines())} lines)")

    out = component()
    open(os.path.join(BASE, "components", "job-listing.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote components/job-listing.html ({len(out.splitlines())} lines)")
