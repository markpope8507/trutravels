"""
Build the student discount page and its modal component.

  converted/student-discount.html                     the page
  converted/components/student-discount-modal.html    the modal on its own

Replica of the Student Beans popup on trutravels.com/essentials, rebuilt in
the new design.

WHAT THE ORIGINAL IS
An 800x720 iframe served by studentbeans.com/beansid-connect/embedded — a white
card with a photo on the left and, on the right, "10% Student Discount", a terms
link, a three-step "How to get your code" explainer with numbered discs, a blue
"Sign up / Log in" button, "2 mins to verify", and a Powered by Student Beans
footer with a help-centre link.

WHAT CHANGED
The layout and the copy are kept, because that flow is the product and Student
Beans owns the verification. What changes is that it stops looking like a
third-party panel dropped onto the site: navy card, Tru type, pink accent, the
photo bled into the panel rather than sitting in its own white box.

The real integration would still hand off to the Student Beans iframe at the
"Sign Up / Log In" step — that button is where it goes.

Opens on :target, like the video-diary viewers, so the modal needs no script.

Run:  python3 converted/.build/build_student.py
"""

import os

from shell import BASE, NAV_SOLID, FOOTER, SCRIPTS, HEAD

COMP = os.path.join(BASE, "components")

OFFER = "10%"
# A group shot, matching the original popup's use of a people-first photo
# rather than a landscape. Verified to load — several plausible-sounding CDN
# paths (e.g. /vietnam/hoi-an-basket-boats.jpg) 302 to nothing.
HERO_IMG = "https://cdn.trutravels.com/greece/greece-island-hopper-026.jpg"

STEPS = [
    "Create a free Student Beans account.",
    "Verify your student status in 2 minutes.",
    "Reveal your code and enter it at checkout.",
]

CHEV = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
CLOCK = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
         '<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" '
         'd="M12 7v5l3 2"/></svg>')
QUESTION = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" '
            'd="M9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4"/><path stroke-linecap="round" d="M12 17h.01"/></svg>')
X = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
     '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>')


def modal(img, close_href, prefix=""):
    steps = "\n".join(
        f"            <li class=\"sbd__step\"><span>{s}</span></li>" for s in STEPS)
    return f"""  <div class="sbd" id="student-discount">
    <a class="sbd__scrim" href="{close_href}" aria-label="Close"></a>
    <div class="sbd__card" role="dialog" aria-modal="true" aria-label="{OFFER} student discount">
      <a class="sbd__x" href="{close_href}" aria-label="Close">{X}</a>

      <div class="sbd__media">
        <img src="{img}" alt="" aria-hidden="true" />
      </div>

      <div class="sbd__body">
        <p class="sbd__eyebrow">Students &amp; Apprentices</p>
        <h2 class="sbd__title">{OFFER} <span>Student Discount</span></h2>
        <a class="sbd__terms" href="{prefix}terms-conditions.html">See discount terms &amp; conditions</a>
        <div class="sbd__rule"></div>

        <h3 class="sbd__h">How To Get Your Code</h3>
        <ol class="sbd__steps">
{steps}
        </ol>

        <!-- In the real integration this is the hand-off to the Student Beans
             iframe — everything above is ours, verification is theirs. -->
        <a class="sbd__cta" href="https://www.studentbeans.com/en-gb/uk/beansid-connect/embedded/trutravels" target="_blank" rel="noopener">Sign Up / Log In{CHEV}</a>
        <p class="sbd__timing">{CLOCK} About 2 minutes to verify</p>

        <div class="sbd__foot">
          <span class="sbd__by">Powered by <b>Student Beans</b></span>
          <a class="sbd__help" href="{prefix}travel-insurance.html">{QUESTION}Need help? <u>Visit our help centre</u></a>
        </div>
      </div>
    </div>
  </div>"""


NOTE = """  <!-- ===================================================================
       STUDENT DISCOUNT MODAL — replica of the Student Beans popup on
       trutravels.com/essentials, in the new design.

       THE ORIGINAL is an 800x720 iframe served by studentbeans.com: white
       card, photo left, and on the right the offer, a terms link, a
       three-step "How to get your code" explainer with numbered discs, a
       blue Sign up / Log in button, "2 mins to verify", and a Powered by
       Student Beans footer.

       The layout and copy are kept — that flow is the product, and Student
       Beans owns the verification. What changes is that it stops looking
       like a third-party panel dropped onto the site: navy card, Tru type,
       pink accent, and the photo bled into the panel with a gradient so the
       two halves read as one card rather than two boxes.

       OPENS ON :target — no script. The trigger is any link to
       `#student-discount`; the scrim and the ✕ link back out. Give the
       close links a real target (`#top`, or the section the trigger sits
       in) rather than `#`, which jumps to the top of the page.

       THE NUMBERS ARE CSS COUNTERS, not typed into the markup, so
       reordering or adding a step renumbers itself. The connector line is
       drawn on `:not(:last-child)`, so it stops at the last disc instead of
       trailing off under it.

       THE HAND-OFF is the Sign Up / Log In button: everything above it is
       ours, verification is Student Beans'. Point it at the real
       beansid-connect URL for the account.

       Requires ../styles.css (.sbd-*). No script.
       =================================================================== -->"""


def component():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Student discount modal (component) &mdash; TruTravels</title>
  <meta name="description" content="Student Beans discount popup, rebuilt in the Tru design — opens on :target, no script." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body id="top">
  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;"><p style="color:#9ca3af;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">Student discount modal &mdash; demo (open it below)</p></div>

{NOTE}
  <section class="ess-body">
    <div class="ess-col">
      <p class="ess-eyebrow">Trigger</p>
      <h2 class="ess-h2">Any Link To <span>#student-discount</span></h2>
      <p class="ess-p ab-lede" style="margin-bottom:1.5rem">The modal below is closed until the hash matches. Drop the trigger anywhere &mdash; a card, a nav item, a button.</p>
      <a class="nf-btn nf-btn--pink" href="#student-discount">Get {OFFER} Student Discount{CHEV}</a>
    </div>
  </section>

{modal(HERO_IMG, "#top", prefix="../")}
</body>
</html>
"""


def page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Student Discount &mdash; TruTravels</title>
  <meta name="description" content="{OFFER} off every TruTravels trip for students and apprentices, verified through Student Beans." />
</head>
<body id="top">

{NAV_SOLID}

  <main class="ab">
    <section class="ess-body" style="padding-top:2.5rem">
      <img class="ess-wm" style="right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
      <img class="ess-wm" style="left:-4rem;top:45%;width:clamp(220px,28vw,460px);opacity:0.05" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
      <div class="ess-col">
        <p class="ess-eyebrow">Students &amp; Apprentices</p>
        <h1 class="ess-h2">{OFFER} Off, Because <span>Term Time Is Expensive</span></h1>
        <p class="ess-p ab-lede">Every TruTravels trip, {OFFER} off, verified in about two minutes through Student Beans. No code hunting, no expiry you missed, no "selected trips only".</p>
        <div style="margin-top:2rem">
          <a class="nf-btn nf-btn--pink" href="#student-discount">Get My {OFFER} Code{CHEV}</a>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
      <img class="ess-wm" style="left:-4rem;top:-2rem;width:clamp(240px,30vw,500px);opacity:0.05" src="assets/bg-assets/mask.svg" alt="" aria-hidden="true" />
      <img class="ess-wm" style="right:-3rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.05" src="assets/bg-assets/peru-bird.svg" alt="" aria-hidden="true" />
      <div class="container">
        <p class="ess-eyebrow">How It Works</p>
        <h2 class="ess-h2">Three Steps, <span>Two Minutes</span></h2>
        <div class="job__wins" style="margin-top:2rem">
          <div class="job__win"><p class="job__win__t">01 &middot; Make An Account</p><p class="job__win__d">A free Student Beans account. If you already have one, log in and skip to step three.</p></div>
          <div class="job__win"><p class="job__win__t">02 &middot; Verify You&rsquo;re A Student</p><p class="job__win__d">Student Beans checks your status &mdash; usually through your university email or a student ID. About two minutes.</p></div>
          <div class="job__win"><p class="job__win__t">03 &middot; Use Your Code</p><p class="job__win__d">Your code appears straight away. Enter it at checkout on any trip.</p></div>
          <div class="job__win"><p class="job__win__t">Apprentices Too</p><p class="job__win__d">Not just university students &mdash; apprentices and college students verify the same way.</p></div>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec">
      <img class="ess-wm" style="right:-4rem;top:0;width:clamp(240px,30vw,500px);opacity:0.06" src="assets/bg-assets/bali-flower.svg" alt="" aria-hidden="true" />
      <div class="ess-col">
        <p class="ess-eyebrow">The Fine Print</p>
        <h2 class="ess-h2">What The {OFFER} <span>Applies To</span></h2>
        <div class="ab-prose ab-prose--base" style="margin-top:1.5rem;max-width:46rem">
          <p>The discount comes off the trip price on any TruTravels departure. It doesn&rsquo;t stack with another promotional code &mdash; if a trip is already discounted, you get whichever is larger, so you&rsquo;re never worse off for having a code.</p>
          <p>Verification is handled by Student Beans, not by us. We never see your student documents &mdash; they confirm your status and issue the code.</p>
          <p>Codes are single-use and tied to your Student Beans account. Full <a href="terms-conditions.html" style="color:var(--tru-pink)">terms and conditions</a>.</p>
        </div>
        <div style="margin-top:2rem">
          <a class="nf-btn nf-btn--pink" href="#student-discount">Get My {OFFER} Code{CHEV}</a>
        </div>
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}

{modal(HERO_IMG, "#top")}
</body>
</html>
"""


if __name__ == "__main__":
    out = page()
    open(os.path.join(BASE, "student-discount.html"), "w", encoding="utf-8").write(out)
    print("  wrote student-discount.html                   (%d lines)" % len(out.splitlines()))

    out = component()
    open(os.path.join(COMP, "student-discount-modal.html"), "w", encoding="utf-8").write(out)
    print("  wrote components/student-discount-modal.html  (%d lines)" % len(out.splitlines()))
