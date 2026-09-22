"""
Build the standalone email sign-up page.

  converted/email-sign-up.html

Mirrors trutravels.com/email-sign-up and src/app/email-sign-up/page.tsx: the
newsletter as a PAGE rather than a popup, so it can be linked to directly —
from a social bio, a QR code, an email footer — instead of only being reachable
by triggering the popup.

Fields are the live page's four: email, first name, last name, nationality.
The footer strip on this site takes an email only, which is right for a strip;
a page can reasonably ask for a little more.

Built on the shared form system — `.field` labels, `.form-submit`,
`.form-done` — so it reads like every other form here rather than a one-off.
See components/form-fields.html.

Run:  python3 converted/.build/build_email_signup.py
"""

import os

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD
from crumbs import bar, top

HERO = "https://cdn.trutravels.com/thailand/full-moon-party.jpg"

CHEV = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
TICK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')


def page():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Join The TruCrew &mdash; Email Sign Up | TruTravels</title>
  <meta name="description" content="Be the first to hear about new tours, deals and new destinations. Discounts, deals and destinations — positive vibes and travel inspo only." />
</head>
<body>

{NAV_OVER}

  <main>
    <section class="ess-hero">
      <img class="ess-hero__img" src="{HERO}" alt="" aria-hidden="true" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">Newsletter</p>
          <h1 class="ess-hero__title">Join The <span>TruCrew</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;Be the first to hear about new tours, deals and more.&rdquo;</p>
        </div>
      </div>
    </section>

{bar(top("Email Sign Up"))}

    <section class="ess-body">
      <img class="ess-wm" style="right:-4rem;top:-2rem;width:clamp(260px,32vw,520px);opacity:0.06" src="assets/bg-assets/good-vibes.svg" alt="" aria-hidden="true" />
      <img class="ess-wm" style="left:-4rem;bottom:0;width:clamp(220px,28vw,460px);opacity:0.05" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
      <div class="container">
        <div class="esign">

          <div class="esign__pitch">
            <h2 class="ess-h2">Discounts, Deals <span>&amp; Destinations</span></h2>
            <div class="esign__copy">
              <p class="ess-p">Because we know you only really wanna hear the good stuff. The exciting news, the pack-your-bags I&rsquo;m-going-on-holiday news.</p>
              <p class="ess-p"><strong>You&rsquo;ll be the first to know about big discounts launching and new destinations.</strong> Positive vibes and travel inspo only.</p>
              <p class="ess-p">If you&rsquo;re looking to stay in the loop, and want to see that email drop in your inbox and instantly smile &mdash; sign up. We&rsquo;d hate for you to miss out.</p>
            </div>
          </div>

          <div class="esign__form" data-nl>
            <form data-nl-form novalidate>
              <h3 class="esign__h">Sign Up <span>Below</span></h3>
              <p class="esign__s">Four fields. Takes about ten seconds.</p>

              <div class="field">
                <label for="es-email">Email <span>*</span></label>
                <input id="es-email" name="email" type="email" required placeholder="you@email.com" autocomplete="email" />
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="es-first">First Name <span>*</span></label>
                  <input id="es-first" name="firstName" type="text" required placeholder="First name" autocomplete="given-name" />
                </div>
                <div class="field">
                  <label for="es-last">Last Name <span>*</span></label>
                  <input id="es-last" name="lastName" type="text" required placeholder="Last name" autocomplete="family-name" />
                </div>
              </div>

              <div class="field">
                <label for="es-nationality">Nationality <span>(optional)</span></label>
                <input id="es-nationality" name="nationality" type="text" placeholder="e.g. British" autocomplete="country-name" />
                <p class="field__hint">So we can send you departures and prices that actually apply to you.</p>
              </div>

              <button type="submit" class="form-submit">Sign Me Up {CHEV}</button>
              <p class="field__hint" style="margin-top:1rem">By subscribing you agree to receive marketing emails from TruTravels. Unsubscribe in one click, any time &mdash; see our <a href="terms-conditions.html">privacy policy</a>.</p>
            </form>

            <div class="form-done" data-nl-done hidden>
              <span class="form-done__ico">{TICK}</span>
              <h3 class="form-done__t">You&rsquo;re In The <span>TruCrew</span></h3>
              <p class="form-done__s">Check your inbox &mdash; there&rsquo;s a welcome email on its way, and the next drop lands there first.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}

  <script>/* form -> success panel. The same [data-nl] hook the newsletter strip
     uses, so a page carrying both needs only one copy of this. */
  (function () {{
    document.querySelectorAll('[data-nl]').forEach(function (wrap) {{
      var form = wrap.querySelector('[data-nl-form]');
      var done = wrap.querySelector('[data-nl-done]');
      if (!form || !done) return;
      form.addEventListener('submit', function (e) {{
        e.preventDefault();
        if (!form.checkValidity()) {{ form.reportValidity(); return; }}
        form.hidden = true;
        done.hidden = false;
      }});
    }});
  }})();
  </script>
</body>
</html>
"""


if __name__ == "__main__":
    out = page()
    open(os.path.join(BASE, "email-sign-up.html"), "w", encoding="utf-8").write(out)
    print(f"  wrote email-sign-up.html   ({len(out.splitlines())} lines)")
