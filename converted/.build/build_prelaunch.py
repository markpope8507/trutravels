"""
Build the pre-launch tour page.

  converted/tour-coming-soon.html

Mirrors the prototype's pre-launch treatment: a tour whose page is live but
whose dates aren't on sale yet gets a countdown and a notify-me CTA where the
price and Check Dates button normally sit, and the same countdown follows you
down the page in the sticky bar.

DERIVED FROM thailand-island-hopper.html, NOT COPIED. That page is the current
tour design and it's hand-maintained at 267KB; a second copy would be a
revision behind within a week. This reads it at build time and swaps exactly
three things — the two pricing cards and the sticky bar's right-hand side —
so everything else stays whatever the reference page says it is. If the swap
markers stop matching, the build fails loudly rather than writing a page with
the old booking box still in it.

SAME TRIP ON PURPOSE. It's Thailand Island Hopper in both states, so the two
pages diff down to the booking box — which is the thing being demonstrated.
Swap the copy for a real unlaunched tour when there is one.

ON-SALE DATE is read from the prototype's own example trip, so both builds
count down to the same moment.

Run:  python3 converted/.build/build_prelaunch.py
"""

import os
import re

from shell import BASE

SRC = os.path.join(BASE, "..", "src")
REFERENCE = "thailand-island-hopper.html"
OUT = "tour-coming-soon.html"


def on_sale() -> str:
    """The example trip's on-sale instant, from src/lib/data.ts."""
    data = open(os.path.join(SRC, "lib", "data.ts"), encoding="utf-8").read()
    m = re.search(r'onSale: "([^"]+)"', data)
    if not m:
        raise SystemExit("build_prelaunch: no `onSale` in src/lib/data.ts")
    return m.group(1)


LAUNCH_CARD = """<div class="pricing-card pricing-card--soon">
          <p class="soon__eyebrow"><span class="soon__dot"></span>Coming Soon</p>
          <h3 class="soon__h">Bookings Open In</h3>
          <p class="soon__sub">Dates go live <span data-onsale-label></span> &middot; first departure March 2027</p>
          <div class="soon__clock" data-countdown>
            <div><p class="soon__n" data-cd="days">&mdash;</p><p class="soon__l">Days</p></div>
            <div><p class="soon__n" data-cd="hours">&mdash;</p><p class="soon__l">Hrs</p></div>
            <div><p class="soon__n" data-cd="minutes">&mdash;</p><p class="soon__l">Mins</p></div>
            <div><p class="soon__n" data-cd="seconds">&mdash;</p><p class="soon__l">Secs</p></div>
          </div>
          <p class="soon__price">Prices are confirmed when dates go live. We&rsquo;ll send them with the launch email.</p>
          <button type="button" class="soon__cta" data-notify>Notify Me When It&rsquo;s Live</button>
          <p class="soon__note">We&rsquo;ll email you the morning dates open &mdash; before it goes out anywhere else.</p>
          <p class="soon__count">412 already waiting</p>
          <div class="pricing-card__seals">
            <img src="assets/pay/atol-logo.png" alt="ATOL Protected" />
            <img class="abta" src="assets/pay/abta-logo.png" alt="ABTA &mdash; Travel With Confidence" />
          </div>
        </div>"""

STICKY_RIGHT = """<div class="booking-bar__right">
            <span class="booking-bar__from">On sale in</span>
            <span class="booking-bar__now" data-countdown-inline>--:--:--</span>
            <button type="button" class="btn btn--notify" data-notify>Notify Me</button>
          </div>"""

MODAL = """
  <!-- Register interest. Name, email and contact number are all required:
       this list is a sales list, and a row with an email and nothing else
       can't be phoned on launch day. -->
  <div class="ri-root" data-ri-root hidden>
    <div class="ri-back" data-ri-close></div>
    <div class="ri" role="dialog" aria-modal="true" aria-label="Register interest">
      <div class="ri__head">
        <div>
          <p class="ri__eyebrow">Coming Soon</p>
          <p class="ri__trip" data-ri-trip></p>
        </div>
        <button class="ri__x" type="button" data-ri-close aria-label="Close"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <div class="ri__body">
        <form data-ri-form novalidate>
          <p class="ri__intro">Dates go live on <strong data-onsale-label></strong>. Leave your details and we&rsquo;ll tell you the morning they do &mdash; before it goes out anywhere else.</p>
          <div class="field">
            <label for="ri-email">Email <span>*</span></label>
            <input id="ri-email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" />
          </div>
          <div class="field-row">
            <div class="field">
              <label for="ri-first">First Name <span>*</span></label>
              <input id="ri-first" name="firstName" type="text" required placeholder="First name" autocomplete="given-name" />
            </div>
            <div class="field">
              <label for="ri-last">Surname <span>*</span></label>
              <input id="ri-last" name="lastName" type="text" required placeholder="Surname" autocomplete="family-name" />
            </div>
          </div>
          <div class="field">
            <label for="ri-phone">Contact Number <span>*</span></label>
            <input id="ri-phone" name="phone" type="tel" required placeholder="+44 7700 900000" autocomplete="tel" />
          </div>
          <fieldset class="ri__months">
            <legend>When would you go? <span>(optional)</span></legend>
            <div class="ri__monthlist" data-ri-months></div>
            <p class="field__hint">Tells us which departures to open first &mdash; not a commitment to anything.</p>
          </fieldset>
          <button type="submit" class="form-submit">Notify Me <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
          <p class="field__hint" style="margin-top:1rem">One email about this trip when it launches. Unsubscribe in a click.</p>
        </form>
        <div class="form-done" data-ri-done hidden>
          <span class="form-done__ico"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>
          <h3 class="form-done__t">You&rsquo;re On The <span>List</span></h3>
          <p class="form-done__s">We&rsquo;ll email you on <span data-onsale-label></span> &mdash; the morning dates go live, before it goes out anywhere else.</p>
          <button type="button" class="form-submit form-submit--auto" data-ri-close>Done</button>
        </div>
      </div>
    </div>
  </div>
"""


def script(iso: str) -> str:
    return """
  <script>/* Pre-launch: one countdown, two renderings, and the notify modal.
     Mirrors src/components/trip-countdown.tsx and register-interest-modal.tsx. */
  (function () {
    var ON_SALE = new Date('%s').getTime();
    var MONTH = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    function pad(n) { return String(n).padStart(2, '0'); }

    /* Split the ISO string rather than formatting a parsed Date — the same
       timezone shift that showed every departure a day early on the bookings
       page. */
    var onSaleLabel = (function () {
      var p = '%s'.slice(0, 10).split('-');
      return parseInt(p[2], 10) + ' ' + MONTH[parseInt(p[1], 10) - 1] + ' ' + p[0];
    })();
    document.querySelectorAll('[data-onsale-label]').forEach(function (el) { el.textContent = onSaleLabel; });

    /* Two cards on the page — the mobile one and the sidebar one — so this
       has to be querySelectorAll. With querySelector the sidebar card sat on
       em-dashes forever while the mobile one ticked. */
    var boxes = [].slice.call(document.querySelectorAll('[data-countdown]'));
    var inline = document.querySelector('[data-countdown-inline]');

    function tick() {
      var ms = ON_SALE - Date.now();
      if (ms <= 0) {
        if (inline) inline.textContent = 'Live now';
        boxes.forEach(function (b) { b.querySelectorAll('[data-cd]').forEach(function (e) { e.textContent = '00'; }); });
        return true;
      }
      var s = Math.floor(ms / 1000);
      var d = Math.floor(s / 86400), h = Math.floor((s %% 86400) / 3600),
          m = Math.floor((s %% 3600) / 60), sec = s %% 60;
      boxes.forEach(function (b) {
        b.querySelector('[data-cd="days"]').textContent = d;
        b.querySelector('[data-cd="hours"]').textContent = pad(h);
        b.querySelector('[data-cd="minutes"]').textContent = pad(m);
        b.querySelector('[data-cd="seconds"]').textContent = pad(sec);
      });
      if (inline) inline.textContent = (d > 0 ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(sec);
      return false;
    }
    if (!tick()) {
      var id = setInterval(function () { if (tick()) clearInterval(id); }, 1000);
    }

    /* ---- notify modal ---- */
    var root = document.querySelector('[data-ri-root]');
    if (!root) return;
    var trip = document.querySelector('.booking-bar__title');
    var tripName = root.querySelector('[data-ri-trip]');
    if (trip && tripName) tripName.textContent = trip.textContent;

    /* Next twelve months, generated — a hardcoded list goes stale when the
       year turns. */
    var months = root.querySelector('[data-ri-months]');
    for (var i = 1; i <= 12; i++) {
      var dt = new Date(); dt.setDate(1); dt.setMonth(dt.getMonth() + i);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ri__month';
      b.setAttribute('aria-pressed', 'false');
      b.textContent = MONTH[dt.getMonth()] + ' ' + dt.getFullYear();
      b.addEventListener('click', function () {
        var on = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', on ? 'false' : 'true');
        this.classList.toggle('is-on', !on);
      });
      months.appendChild(b);
    }

    function open() { root.hidden = false; document.body.style.overflow = 'hidden'; }
    function close() { root.hidden = true; document.body.style.overflow = ''; }

    document.querySelectorAll('[data-notify]').forEach(function (b) { b.addEventListener('click', open); });
    root.querySelectorAll('[data-ri-close]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !root.hidden) close(); });

    var form = root.querySelector('[data-ri-form]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.hidden = true;
      root.querySelector('[data-ri-done]').hidden = false;
    });
  })();
  </script>
""" % (iso, iso)


def drop_block(html: str, start: str) -> str:
    """Remove one <div> and everything inside it, by tag depth."""
    i = html.find(start)
    if i == -1:
        raise SystemExit(f"build_prelaunch: couldn't find {start!r} to remove")
    depth, j = 0, i
    while True:
        m = re.compile(r"</?div\b").search(html, j)
        if not m:
            raise SystemExit(f"build_prelaunch: {start!r} never closes")
        depth += 1 if m.group(0) == "<div" else -1
        j = m.end()
        if depth == 0:
            j = html.index(">", j) + 1
            break
    # take the comment line above it with the block
    start_of_line = html.rfind("\n", 0, i)
    prev = html.rfind("\n", 0, start_of_line)
    if "<!--" in html[prev:start_of_line]:
        start_of_line = prev
    return html[:start_of_line] + html[j:]


def swap_one(html: str, start: str, end_marker: str, replacement: str, label: str) -> str:
    """Replace the block from `start` through the end of `end_marker`."""
    i = html.find(start)
    if i == -1:
        raise SystemExit(f"build_prelaunch: couldn't find the {label} block — has {REFERENCE} changed?")
    j = html.find(end_marker, i)
    if j == -1:
        raise SystemExit(f"build_prelaunch: {label} block has no end marker")
    return html[:i] + replacement + html[j + len(end_marker):]


def build() -> str:
    html = open(os.path.join(BASE, REFERENCE), encoding="utf-8").read()
    iso = on_sale()

    # Both pricing cards — the mobile one and the sticky sidebar one.
    swapped = 0
    while '<div class="pricing-card">' in html:
        html = swap_one(html, '<div class="pricing-card">', "</div>\n        </div>", LAUNCH_CARD, "pricing card")
        swapped += 1
        if swapped > 4:
            raise SystemExit("build_prelaunch: runaway pricing-card swap")
    if swapped != 2:
        raise SystemExit(f"build_prelaunch: expected 2 pricing cards, swapped {swapped}")

    # The sticky bar's right-hand side: price + Check Dates -> countdown + Notify Me.
    html = swap_one(html, '<div class="booking-bar__right">', "</div>", STICKY_RIGHT, "sticky bar")

    # The FOMO toast announces "only 4 spots left on 12 Apr" — there are no
    # spots and no departures until this goes on sale. Removed by matching
    # </div> depth: the block nests three deep, so a non-greedy regex cuts it
    # in the middle and leaves the opening tag behind.
    html = drop_block(html, '<div class="fomo"')
    html = html.replace("<title>", "<title>Coming Soon &mdash; ", 1)
    html = html.replace("</body>", MODAL + script(iso) + "</body>")
    return html


if __name__ == "__main__":
    out = build()
    open(os.path.join(BASE, OUT), "w", encoding="utf-8").write(out)
    print(f"  wrote {OUT}   ({len(out.splitlines())} lines, counting down to {on_sale()})")
