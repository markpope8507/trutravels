"""
Build the agency registration page.

  converted/agent-registration.html

Mirrors src/app/agent-registration/page.tsx and gadventures.com/agents/register
in Tru voice. We're on the same Sherpa platform, so it's the same application
and the same approval route; only the words are ours.

IT REGISTERS AN AGENCY, NOT A PERSON — said in the intro, on the first group
of the form, and again above the manager fields, because an individual agent
filling it in gets rejected and loses a fortnight.

ONE REGISTRATION NUMBER, NOT FIVE FIELDS. The source page puts IATA, ABTA,
Business Registration, CLIA and TIDS side by side and asks for one. A type +
a number asks the same thing once, and needs no JavaScript — which matters,
because this page must behave exactly like the prototype.

THE COUNTRY LIST is read from src/lib/countries.ts at build time rather than
kept as a second copy of 249 rows.

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

REG_TYPES = ["IATA", "ABTA", "Business Registration", "CLIA", "TIDS"]


def countries():
    """[(code, name)] from the prototype's lib, not a second copy."""
    src = open(os.path.join(SRC, "lib", "countries.ts"), encoding="utf-8").read()
    return re.findall(r'\["([A-Z]{2})", "([^"]+)"\]', src)


# (name, label, type, required, placeholder, hint)
ADDRESS_HEAD = [("address", "Address", "text", True, "Street address", "")]
ADDRESS_TAIL = [
    ("state", "State Or Province", "text", False, "If your country uses them", ""),
    ("city", "City", "text", True, "", ""),
    ("postal_code", "Postal / Zip Code", "text", True, "", ""),
]
CONTACT_FIELDS = [
    ("email", "Email", "email", True, "bookings@agency.com",
     "The agency&rsquo;s address, not a personal one &mdash; this is where booking confirmations land."),
    ("public_phone", "Public Phone", "tel", True, "+44 20 7946 0000", "The number your customers call."),
    ("phone_number", "Private Phone", "tel", False, "The line we should use", ""),
    ("fax", "Fax", "tel", False, "", ""),
]
MANAGER_FIELDS = [
    ("manager_first_name", "First Name", "text", True, "", ""),
    ("manager_last_name", "Last Name", "text", True, "", ""),
    ("manager_email", "Email", "email", True, "manager@agency.com", ""),
]


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


def group(n, title, note, body):
    return f'''            <fieldset class="agr-g">
              <legend class="agr-g__h"><span class="agr-g__n">{n}</span>{title}</legend>
              <p class="agr-g__note">{note}</p>
{body}
            </fieldset>'''


def agency_group():
    types = "\n".join(f'                    <option value="{t}">{t}</option>' for t in REG_TYPES)
    name_f = field(("name", "Legal Company Name", "text", True, "As registered",
                    "The legal entity that will appear on commission payments."))
    group_f = field(("group", "Agency Group Or Chain", "text", False,
                     "Leave blank if you&rsquo;re independent", ""))
    return f'''{name_f}
{group_f}
              <div class="field-row agr-reg">
                <div class="field">
                  <label for="ag-reg_type">Registration Type <span>*</span></label>
                  <select id="ag-reg_type" name="reg_type" required>
                    <option value="" disabled selected>Please select</option>
{types}
                  </select>
                </div>
                <div class="field">
                  <label for="ag-reg_number">Registration Number <span>*</span></label>
                  <input id="ag-reg_number" name="reg_number" type="text" required />
                </div>
              </div>
              <p class="field__hint">One number is enough &mdash; IATA, ABTA, CLIA, TIDS or your business registration. We can&rsquo;t approve an agency without one.</p>'''


def country_select():
    opts = "\n".join(
        f'                  <option value="{code}">{name}</option>' for code, name in countries()
    )
    return f'''              <div class="field">
                <label for="ag-country">Country <span>*</span></label>
                <select id="ag-country" name="country" required autocomplete="country">
                  <option value="" disabled selected>Please select</option>
{opts}
                </select>
              </div>'''


def extras_group():
    booking = field(("booking_number", "Active Booking Reference", "text", False,
                     "If you already have one with us",
                     "Speeds things up &mdash; it tells us you&rsquo;re already trading with us."))
    return f'''{booking}
              <div class="field">
                <label for="ag-comment">Comments <span>(optional)</span></label>
                <textarea id="ag-comment" name="comment" rows="3" placeholder="Anything we should know about the agency."></textarea>
              </div>'''


def page():
    form = "\n\n".join([
        group(1, "Your Agency",
              "<strong>This registers an agency, not a person.</strong> If your agency already works with us, "
              "ask your manager for a Sherpa login instead.",
              agency_group()),
        group(2, "Agency Address", "Where the agency trades from.",
              fields(ADDRESS_HEAD) + "\n" + country_select() + "\n" + fields(ADDRESS_TAIL)),
        group(3, "Agency Contact Details", "How we reach the agency, and how your customers do.",
              fields(CONTACT_FIELDS)),
        group(4, "Agency Manager",
              "<strong>Not you, unless you are the manager.</strong> Approval goes to whoever runs the agency, "
              "and they hand out the logins from there.",
              fields(MANAGER_FIELDS)),
        group(5, "Anything Else", "Both optional.", extras_group()),
    ])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{HEAD}
  <title>Agent Registration &mdash; Register Your Travel Agency | TruTravels</title>
  <meta name="description" content="Register your travel agency to sell TruTravels. Once you're approved, your manager can set up Sherpa logins for everyone at the agency." />
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
          <h1 class="ess-hero__title">Register Your <span>Agency</span></h1>
          <div class="ess-hero__rule"></div>
          <p class="ess-hero__quote">&ldquo;Thanks for your interest in Tru. We can&rsquo;t wait to work with you.&rdquo;</p>
        </div>
      </div>
    </section>

{bar(section(PARTNERS, "Agent Registration"))}

    <section class="ess-body">
      <img class="ess-wm" style="right:-4rem;top:-2rem;width:clamp(260px,32vw,520px);opacity:0.06" src="assets/bg-assets/sun.svg" alt="" aria-hidden="true" />
      <div class="container">
        <div class="agr">

        <div class="agr__side">
          <h2 class="ess-h2">Sell Tru <span>Trips</span></h2>
          <div class="agr-copy">
            <p class="ess-p">Before we can start working together, your agency needs to be registered with us. If you manage a travel agency and you&rsquo;re not already working with TruTravels, fill in the form.</p>
            <p class="ess-p">Once you&rsquo;re approved you&rsquo;ll be set up on Sherpa, and you can give individual agents at your firm their own access from there.</p>
          </div>

          <!-- Two wrong turns, both common enough to head off before the form:
               an agent filling in an agency form, and a tour operator who
               wants to supply us rather than sell us. -->
          <div class="agr-notes">
            <div class="agr-portal">
              <h3 class="agr-portal__t">Already <span>Registered?</span></h3>
              <p class="agr-portal__d">If your agency is already with us, you don&rsquo;t need this form &mdash; sign in to Sherpa, or ask your manager to set you up with a login.</p>
              <a class="agr-portal__btn" href="{AGENT_PORTAL_URL}" target="_blank" rel="noopener noreferrer">Log In To Sherpa {OUT}</a>
            </div>

            <div class="agr-portal">
              <h3 class="agr-portal__t">Not An <span>Agency?</span></h3>
              <p class="agr-portal__d">If you run your own trips, host a community, or have a partnership idea that isn&rsquo;t an agency arrangement, <a href="partners.html">the other Partners routes</a> are the ones you want.</p>
            </div>
          </div>
        </div>

        <div class="agr__form" data-nl>
          <form data-nl-form novalidate>
{form}

            <button type="submit" class="form-submit">Register My Agency {CHEV}</button>
          </form>

          <div class="form-done" data-nl-done hidden>
            <span class="form-done__ico">{TICK}</span>
            <h3 class="form-done__t">Application <span>Received</span></h3>
            <p class="form-done__s">We&rsquo;ll review it and come back to your manager by email. Once you&rsquo;re approved they can set up logins for everyone at the agency.</p>
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
    print(f"  wrote agent-registration.html   ({len(out.splitlines())} lines, {len(countries())} countries)")
