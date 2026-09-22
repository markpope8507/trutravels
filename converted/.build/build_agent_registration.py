"""
Build the agent booking registration page.

  converted/agent-registration.html

Mirrors src/app/agent-registration/page.tsx and the form at
trutravels.com/agents: how a travel agent passes us a booking they've made for
a client.

NOT A LOGIN. Agents Login goes to G Adventures' Sherpa portal — a real
external system — so this page signposts it rather than carrying a second
sign-in form.

THE TOUR LIST IS THE PROTOTYPE'S OWN TRIP DATA, read from src/lib/data.ts at
build time and grouped by country, so the two builds can't offer different
tours.

Built on the shared form system (`.field`, `.form-submit`, `.form-done`) —
see components/form-fields.html.

Run:  python3 converted/.build/build_agent_registration.py
"""

import os
import re

from shell import BASE, NAV_OVER, FOOTER, SCRIPTS, HEAD
from crumbs import bar, section, PARTNERS

SRC = os.path.join(BASE, "..", "src")
AGENT_PORTAL_URL = "https://sherpa.gtravelcommunity.com/login/"
HERO = "https://cdn.trutravels.com/south-korea/seoul-day-4.jpg"

CHEV = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>')
TICK = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">'
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>')
OUT = ('<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">'
       '<path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5"/></svg>')


def _objects(seg):
    """Top-level { ... } objects in a TS array literal. Brace counting, but
    string-aware — trip descriptions contain braces and the array is a mix of
    one-per-line and one-line entries, so neither a line regex nor a naive
    depth count gets all 36."""
    # `= [`, not the first "[" — that one is the `Trip[]` in the declaration,
    # and starting there hits the closing "]" at depth 0 and yields nothing.
    depth, start, i, quote = 0, None, seg.index("= [") + 3, None
    while i < len(seg):
        c = seg[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            if depth == 0:
                start = i
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                yield seg[start:i + 1]
        elif c == "]" and depth == 0:
            return
        i += 1


def tours():
    """Trip id, title, duration and country, grouped by country — read from
    the prototype's lib rather than retyped."""
    src = open(os.path.join(SRC, "lib", "data.ts"), encoding="utf-8").read()
    seg = src[src.index("export const trips: Trip[]"):src.index("export const stories: Story[]")]
    out = {}
    for obj in _objects(seg):
        def get(k):
            m = re.search(rf'\b{k}: "([^"]*)"', obj)
            return m.group(1) if m else None
        tid, title, country, dur = get("id"), get("title"), get("destination"), get("duration")
        if not (tid and title and country):
            continue
        out.setdefault(country, []).append((tid, title, dur or ""))
    return out


STEPS = [
    ("Register the booking", "Fill in the form below &mdash; your details, the departure, and your client&rsquo;s."),
    ("We confirm within a day", "You&rsquo;ll get an email with the TruTravels booking reference and the balance due date."),
    ("Commission on departure", "Paid against your agency reference. Track it in Sherpa alongside your other bookings."),
]

# (name, label, type, required, placeholder, hint)
AGENT_FIELDS = [
    ("agent_name", "Agent Name", "text", True, "First and last", ""),
    ("agent_reference", "Agency Reference", "text", True, "Your booking reference",
     "Whatever this booking is called in your system &mdash; it&rsquo;s how we match the two up."),
    ("agent_email", "Agent Email Address", "email", True, "you@agency.com", ""),
]
CUSTOMER_HEAD = [("customer_name", "Customer Name", "text", True, "As it appears on their passport", "")]
CUSTOMER_TAIL = [
    ("customer_email", "Email Address", "email", True, "them@email.com", ""),
    ("customer_phone", "Phone Number", "tel", True, "+44 7700 900000", ""),
    ("customer_dob", "Date Of Birth", "date", True, "", ""),
    ("customer_nationality", "Nationality", "text", True, "e.g. British", ""),
]
EMERGENCY_FIELDS = [
    ("emergency_name", "Emergency Contact Name", "text", True, "Full name", ""),
    ("emergency_number", "Emergency Contact Number", "tel", True, "Including country code", ""),
]
EXTRA_FIELDS = [
    ("dietary_medical", "Dietary Requirements / Medical Conditions",
     "Allergies, medication, anything a trip leader should know before day one."),
    ("flights", "Flight Details", "Arrival airport, flight number and landing time, if they&rsquo;re booked."),
    ("notes", "Notes", "Anything else we should know."),
]

# Used for twin-share rooming, which is the only reason we ask — so the options
# are the ones a person might actually pick, not the live form's Male/Female.
GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"]


def field(f):
    name, label, typ, req, ph, hint = f
    mark = ' <span>*</span>' if req else ' <span>(optional)</span>'
    attrs = ' required' if req else ""
    if ph:
        attrs += f' placeholder="{ph}"'
    hint_html = f'\n                <p class="field__hint">{hint}</p>' if hint else ""
    return f'''              <div class="field">
                <label for="ag-{name}">{label}{mark}</label>
                <input id="ag-{name}" name="{name}" type="{typ}"{attrs} />{hint_html}
              </div>'''


def fields(fs):
    return "\n".join(field(f) for f in fs)


def area(name, label, ph):
    return f'''              <div class="field">
                <label for="ag-{name}">{label} <span>(optional)</span></label>
                <textarea id="ag-{name}" name="{name}" rows="3" placeholder="{ph}"></textarea>
              </div>'''


def group(n, title, note, body):
    return f'''            <fieldset class="agr-g">
              <legend class="agr-g__h"><span class="agr-g__n">{n}</span>{title}</legend>
              <p class="agr-g__note">{note}</p>
{body}
            </fieldset>'''


def tour_select():
    opts = ['                  <option value="" disabled selected>Please select</option>']
    for country, list_ in tours().items():
        opts.append(f'                  <optgroup label="{country}">')
        for tid, title, dur in list_:
            opts.append(f'                    <option value="{tid}">{title} ({dur})</option>')
        opts.append("                  </optgroup>")
    opts.append('                  <option value="other">Another trip &mdash; I&rsquo;ll add it in Notes</option>')
    body = "\n".join(opts)
    return f'''              <div class="field">
                <label for="ag-tour">Tour <span>*</span></label>
                <select id="ag-tour" name="tour" required>
{body}
                </select>
              </div>
{field(("start_date", "Start Date", "date", True, "", ""))}'''


def gender_select():
    opts = "\n".join(f'                  <option value="{g}">{g}</option>' for g in GENDERS)
    return f'''              <div class="field">
                <label for="ag-customer_gender">Gender <span>*</span></label>
                <select id="ag-customer_gender" name="customer_gender" required>
                  <option value="" disabled selected>Please select</option>
{opts}
                </select>
                <p class="field__hint">Used for twin-share rooming only.</p>
              </div>'''


def page():
    steps = "\n".join(
        f'''          <li class="agr-step">
            <span class="agr-step__n">{i + 1}</span>
            <div>
              <h3 class="agr-step__t">{t}</h3>
              <p class="agr-step__d">{d}</p>
            </div>
          </li>'''
        for i, (t, d) in enumerate(STEPS)
    )

    form = "\n\n".join([
        group(1, "Your Details", "So we know who to confirm back to, and whose commission this is.", fields(AGENT_FIELDS)),
        group(2, "The Trip", "Which departure the booking is for.", tour_select()),
        group(3, "Traveller Details",
              "The person going. Names need to match their passport &mdash; it&rsquo;s what the trip manifest is built from.",
              fields(CUSTOMER_HEAD) + "\n" + gender_select() + "\n" + fields(CUSTOMER_TAIL)),
        group(4, "Emergency Contact", "Someone not travelling with them.", fields(EMERGENCY_FIELDS)),
        group(5, "Anything Else", "All optional, but the first one saves a phone call later.",
              "\n".join(area(*e) for e in EXTRA_FIELDS)),
    ])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Agent Registration &mdash; Register A Booking | TruTravels</title>
  <meta name="description" content="Travel agents: register a TruTravels booking you've made for a client." />
</head>
<body>

{NAV_OVER}

  <main>
    <section class="ess-hero agr-hero">
      <img class="ess-hero__img" src="{HERO}" alt="" aria-hidden="true" />
      <div class="ess-hero__grad"></div>
      <div class="container ess-hero__inner">
        <div class="ess-hero__text">
          <p class="ess-hero__eyebrow">Travel Agents</p>
          <h1 class="ess-hero__title">Agent <span>Registration</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;Sold a Tru trip? Send us the booking and we&rsquo;ll take it from there.&rdquo;</p>
        </div>
      </div>
    </section>

{bar(section(PARTNERS, "Agent Registration"))}

    <section class="ess-body">
      <img class="ess-wm" style="right:-4rem;top:-2rem;width:clamp(260px,32vw,520px);opacity:0.06" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
      <div class="container">
        <div class="agr">

        <div class="agr__side">
          <h2 class="ess-h2">How It <span>Works</span></h2>
          <ol class="agr-steps">
{steps}
          </ol>

          <!-- The signpost, not a second login form — Sherpa is G Adventures'
               system and the sign-in lives there. -->
          <div class="agr-portal">
            <h3 class="agr-portal__t">Already An <span>Agent?</span></h3>
            <p class="agr-portal__d">Live availability, your bookings and your commission all live in Sherpa. This form is only for passing us a new booking.</p>
            <a class="agr-portal__btn" href="{AGENT_PORTAL_URL}" target="_blank" rel="noopener noreferrer">Sign In To Sherpa {OUT}</a>
          </div>
        </div>

        <div class="agr__form" data-nl>
          <form data-nl-form novalidate>
{form}

            <button type="submit" class="form-submit">Register This Booking {CHEV}</button>
            <p class="field__hint" style="margin-top:1rem">Registering a booking isn&rsquo;t a confirmation. We&rsquo;ll come back to you within one working day to confirm the place and the price.</p>
          </form>

          <div class="form-done" data-nl-done hidden>
            <span class="form-done__ico">{TICK}</span>
            <h3 class="form-done__t">Booking <span>Registered</span></h3>
            <p class="form-done__s">We&rsquo;ve got it. You&rsquo;ll have a confirmation by email within one working day, with the booking reference and what the traveller needs to do next.</p>
          </div>
        </div>

        </div>
      </div>
    </section>
  </main>

{FOOTER}

{SCRIPTS}

  <script>/* form -> success panel. Same [data-nl] hook the newsletter strip
     and the email sign-up page use — one behaviour, one implementation. */
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
    open(os.path.join(BASE, "agent-registration.html"), "w", encoding="utf-8").write(out)
    n = sum(len(v) for v in tours().values())
    print(f"  wrote agent-registration.html   ({len(out.splitlines())} lines, {n} tours in the dropdown)")
