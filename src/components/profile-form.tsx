"use client";

/**
 * Modify Profile — the account details form.
 *
 * Mirrors the field set on the live account area, with one deliberate change:
 * MIDDLE NAME IS NOT REQUIRED here, though it is on the live form. Plenty of
 * people don't have one, and a required field you can't satisfy is a dead end.
 * The optional fields say "(optional)" rather than leaving the asterisk's
 * absence to carry the meaning — that's easy to miss when scanning.
 *
 * `name` arrives as one string, so it's split for the two fields: everything
 * before the last space is the first name, which keeps double-barrelled first
 * names intact and leaves surname blank for a single-word name rather than
 * guessing at one.
 *
 * Nationality and country are datalist-backed, so they type-ahead but still
 * accept anything typed — a fixed <select> of countries is the usual way this
 * goes wrong for anyone whose answer isn't on the list.
 *
 * NO BACKEND — the page owns the save button. Wire it to a submit handler
 * around this when there's an endpoint.
 *
 * Mirrored by converted/components/account-details-form.html.
 */

const LABEL = "block text-sm font-medium text-gray-400 mb-2";
const INPUT =
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-tru-pink transition";

const NATIONALITIES = ["British", "Irish", "Australian", "New Zealander", "Canadian", "American", "South African"];
const COUNTRIES = ["United Kingdom", "Ireland", "Australia", "New Zealand", "Canada", "United States", "South Africa"];

export default function ProfileForm({ name, email }: { name?: string; email?: string }) {
  const parts = (name ?? "").trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? "";

  return (
    <>
        {/* Modify Profile. Mirrors the fields on the live account area, with one
            change: middle name is NOT required there, which it is on the live
            form — plenty of people don't have one, and a required field you
            can't satisfy is a dead end. Optional fields say so rather than
            leaving the asterisk to carry the whole meaning. */}
        <p className="text-gray-400 text-sm mb-5">
          The name and date of birth here have to match your passport — they go on your booking.
        </p>

        <div className="mb-4">
          <label htmlFor="pf-email" className={LABEL}>
            Email Address <span className="text-tru-pink">*</span>
          </label>
          <input id="pf-email" type="email" required defaultValue={email} autoComplete="email" className={INPUT} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div className="mb-4">
            <label htmlFor="pf-first" className={LABEL}>
              First Name <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-first" type="text" required defaultValue={first} autoComplete="given-name" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-middle" className={LABEL}>
              Middle Name <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <input id="pf-middle" type="text" placeholder="As shown on passport" autoComplete="additional-name" className={INPUT} />
          </div>

          <div className="mb-4">
            <label htmlFor="pf-surname" className={LABEL}>
              Surname <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-surname" type="text" required defaultValue={surname} autoComplete="family-name" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-gender" className={LABEL}>
              Gender <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <select id="pf-gender" className={INPUT}>
              <option value="">Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Self-describe</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="pf-nat" className={LABEL}>
              Nationality <span className="text-tru-pink">*</span>
            </label>
            <input id="pf-nat" type="text" required list="pf-nationalities" defaultValue="British" placeholder="Start typing…" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-country" className={LABEL}>Country Of Residence</label>
            <input id="pf-country" type="text" list="pf-countries" defaultValue="United Kingdom" placeholder="Start typing…" autoComplete="country-name" className={INPUT} />
          </div>

          <div className="mb-4">
            <label htmlFor="pf-phone" className={LABEL}>Contact Number</label>
            <input id="pf-phone" type="tel" defaultValue="+44 7700 900000" autoComplete="tel" className={INPUT} />
          </div>
          <div className="mb-4">
            <label htmlFor="pf-dob" className={LABEL}>Date Of Birth</label>
            <input id="pf-dob" type="date" defaultValue="1998-07-22" autoComplete="bday" className={`${INPUT} [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50`} />
          </div>
        </div>

        <datalist id="pf-nationalities">
          {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
        </datalist>
    </>
  );
}
