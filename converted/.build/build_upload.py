"""
Build the photo/video upload page.

  converted/share-your-photos.html

Mirrors trutravels.com/trutravels-tour-photo-uploads. The live page takes your
name and email and then emails you a Dropbox link — two steps, a wait, and a
context switch before anyone has uploaded anything. Here the drop zone IS the
page: you pick files first and give details alongside, so the thing you came to
do is the thing on screen.

The form itself lives in components/upload-dropzone.html and is lifted out of
it here, so the page and the component can't drift. Everything else — the photo
strip, the prize pitch, the shot list, the small print — is this file.

Run:  python3 converted/.build/build_upload.py
"""

import os
import re

from shell import BASE, NAV_SOLID, FOOTER, SCRIPTS, HEAD

COMP = os.path.join(BASE, "components")

# Real traveller shots from the CDN, standing in for the three on the live page.
STRIP = [
    ("https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg",
     "The group in the sea, Thailand"),
    ("https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg",
     "Koh Nang Yuan viewpoint"),
    ("https://cdn.trutravels.com/images/peru-rainbow4.jpg",
     "Rainbow Mountain, Peru"),
]

SHOTS = [
    ("Faces, Not Just Views",
     "A sunset is a sunset. A sunset with your group in it is the trip."),
    ("The Unposed Ones",
     "Mid-laugh on the boat beats everyone lined up and squinting."),
    ("Straight Off The Phone",
     "Don&rsquo;t filter or crop &mdash; we&rsquo;d rather have the original file."),
    ("Landscape And Portrait",
     "Both get used, in different places. Send whatever you have."),
]


def watermarks(items):
    return "\n".join(
        '      <img class="ess-wm" style="%s" src="assets/bg-assets/%s.svg" '
        'alt="" aria-hidden="true" />' % (style, name)
        for name, style in items
    )


def lift_component():
    """The form block and its script, taken out of the component file.

    Keeping one copy means a fix to the dropzone lands on the page too. The
    component sits in components/, so its ../ asset paths are un-rooted here.
    """
    src = open(os.path.join(COMP, "upload-dropzone.html"), encoding="utf-8").read()

    start = src.index('      <div data-upl>')
    end = src.index('\n    </div>\n  </section>', start)
    form = src[start:end]
    form = form.replace('src="../', 'src="').replace('href="../', 'href="')

    s = src.index("  <script>/* Upload dropzone.")
    script = src[s:src.index("</script>", s) + len("</script>")]
    return form, script


def page():
    form, script = lift_component()

    strip = "\n".join(
        '          <img src="%s" alt="%s" loading="lazy" />' % (u, a) for u, a in STRIP)
    shots = "\n".join(
        '            <div class="job__win"><p class="job__win__t">%s</p>'
        '<p class="job__win__d">%s</p></div>' % (t, d) for t, d in SHOTS)

    return """<!DOCTYPE html>
<html lang="en">
<head>
%(head)s
  <title>Share Your Photos &mdash; TruTravels</title>
  <meta name="description" content="Upload your best photos and videos from tour — and go into the draw for £250 travel credit." />
</head>
<body>

%(nav)s

  <main class="ab">
    <section class="ess-body" style="padding-top:2rem">
%(wm1)s
      <div class="container" style="max-width:66rem">
        <div class="upl-strip">
%(strip)s
        </div>
        <div style="margin-top:2.5rem">
          <p class="ess-eyebrow">TruTraveller Photo Uploads</p>
          <h1 class="ess-h2">Upload Your Best <span>Photos From Tour</span></h1>
          <p class="ess-p ab-lede">Got some amazing photos from your last Tru trip? We want to see them. Your selfies, your group pics, your 10/10 content &mdash; the stuff that shows people what travelling with Tru is actually like.</p>
        </div>
      </div>
    </section>

    <section class="ess-body ab-sec" id="upload" style="padding-top:2.5rem">
%(wm2)s
      <div class="container" style="max-width:66rem">
%(form)s
      </div>
    </section>

    <section class="ess-body ab-sec">
%(wm3)s
      <div class="container" style="max-width:66rem">
        <p class="ess-eyebrow">What Works Best</p>
        <h2 class="ess-h2">The Ones We <span>Always Use</span></h2>
        <p class="ess-p ab-lede" style="margin-bottom:2rem">No pressure &mdash; send whatever you have. But if you&rsquo;re choosing between a hundred, these are the ones that end up on the site.</p>
        <div class="job__wins">
%(shots)s
        </div>
      </div>
    </section>

    <section class="ess-body ab-more">
%(wm4)s
      <div class="container" style="max-width:66rem">
        <p class="ess-eyebrow">The Small Print</p>
        <h2 class="ess-h2">How The <span>Draw Works</span></h2>
        <div class="ab-prose ab-prose--base" style="margin-top:1.5rem;max-width:46rem">
          <p>Everyone who uploads goes into a draw for &pound;250 travel credit, drawn every three months. One entry per person per draw, however many photos you send.</p>
          <p>We may use what you send on the website, on social and in our emails, and we&rsquo;ll tag you where we can. We won&rsquo;t sell your photos or pass them to anyone else. If you change your mind, email <a href="mailto:hello@trutravels.com" style="color:var(--tru-pink)">hello@trutravels.com</a> and we&rsquo;ll take them down.</p>
          <p>Make sure everyone in the shot is happy to be in it &mdash; that&rsquo;s the one thing we can&rsquo;t check for you. Full <a href="terms-conditions.html" style="color:var(--tru-pink)">terms and conditions</a>.</p>
        </div>
      </div>
    </section>
  </main>

%(footer)s

%(scripts)s

%(uplscript)s
</body>
</html>
""" % {
        "head": HEAD,
        "nav": NAV_SOLID,
        "wm1": watermarks([("sun", "right:-4rem;top:-2rem;width:clamp(260px,34vw,560px);opacity:0.06"),
                           ("good-vibes", "left:-4rem;top:38%;width:clamp(220px,28vw,460px);opacity:0.05")]),
        "wm2": watermarks([("mask", "left:-4rem;top:-2rem;width:clamp(240px,30vw,500px);opacity:0.05"),
                           ("peru-bird", "right:-3rem;bottom:-2rem;width:clamp(200px,26vw,420px);opacity:0.05")]),
        "wm3": watermarks([("bali-flower", "right:-4rem;top:0;width:clamp(240px,30vw,500px);opacity:0.06")]),
        "wm4": watermarks([("tru-logo", "left:-4rem;bottom:-2rem;width:clamp(240px,30vw,500px);opacity:0.05")]),
        "strip": strip,
        "form": form,
        "shots": shots,
        "footer": FOOTER,
        "scripts": SCRIPTS,
        "uplscript": script,
    }


if __name__ == "__main__":
    out = page()
    open(os.path.join(BASE, "share-your-photos.html"), "w", encoding="utf-8").write(out)
    print("  wrote share-your-photos.html  (%d lines)" % len(out.splitlines()))
