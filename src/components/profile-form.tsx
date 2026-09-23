"use client";

import { useState } from "react";

/**
 * Modify Profile — the account details form.
 *
 * Field set and layout match the live account area: email across the top, then
 * four rows of two — first/middle name, surname/gender, nationality/country,
 * contact number/date of birth.
 *
 * REQUIRED: email, all three name fields, nationality and contact number.
 * The names and date of birth go on the booking and have to match a passport,
 * so a partial answer is worse than none — and the contact number is how the
 * trip leader reaches someone on the day.
 *
 * MIDDLE NAME IS REQUIRED TOO, matching the live form. Anyone without one has
 * nothing to type, so if that turns into support tickets the fix is a "no
 * middle name" tick rather than making the field optional again — an empty
 * optional field and a deliberate "none" look identical to whoever checks the
 * manifest.
 *
 * The fields that stay optional say "(optional)" rather than leaving the
 * absence of an asterisk to carry the meaning.
 *
 * THE HELP ICONS are on the four fields that go on a booking and have to match
 * a passport — that's what they're there to say, and it's the one thing people
 * get wrong.
 *
 * `name` arrives as one string, so it's split for the two fields: everything
 * before the last space is the first name, which keeps double-barrelled first
 * names intact and leaves surname blank for a single-word name rather than
 * guessing at one.
 *
 * LOCKED once there's a live booking — see the `locked` prop. The fields stay
 * visible and readable rather than disappearing; you can still check what's on
 * file, you just can't change it yourself.
 *
 * NO BACKEND — the page owns the save button. Wire it to a submit handler
 * around this when there's an endpoint.
 *
 * Mirrored by converted/components/account-details-form.html.
 */

/* Width is NOT in the base. Appending `w-14` after a string that already
   contains `w-full` does not win — Tailwind emits both utilities and the
   stylesheet order decides, not the order you wrote them in. The date row
   needs its own widths, so the base leaves width alone and everything that
   wants the full column asks for it. */
const INPUT_BASE =
  "rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-tru-pink transition " +
  "disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-white/5 disabled:bg-white/[0.02]";
const INPUT = `w-full ${INPUT_BASE}`;

const NATIONALITIES = ["British", "Irish", "Australian", "New Zealander", "Canadian", "American", "South African"];
const COUNTRIES = ["United Kingdom", "Ireland", "Australia", "New Zealand", "Canada", "United States", "South Africa"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** The "?" beside a label. Click to read it — a `title` alone never appears on
 *  a touch screen, which is where most of these get read. */
function Help({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-label={text}
        aria-expanded={open}
        className="text-gray-500 transition hover:text-tru-pink"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M9.5 9.5a2.5 2.5 0 1 1 3 2.45V14" />
          <path strokeLinecap="round" d="M12 17h.01" />
        </svg>
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-[calc(100%+8px)] right-0 z-20 w-56 rounded-[10px] border border-white/15 bg-tru-navy p-3 text-[11px] font-normal leading-relaxed text-gray-300 shadow-lg shadow-black/50"
        >
          {text}
        </span>
      )}
    </span>
  );
}

/** Label + optional help icon, sitting on one row like the live form. */
function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
  help,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  help?: string;
}) {
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-400">
        {children}
        {required && <span className="text-tru-pink"> *</span>}
        {optional && <span className="font-normal text-gray-600"> (optional)</span>}
      </label>
      {help && <Help text={help} />}
    </div>
  );
}

/** A text field with a clear button, as the live form has on the two
 *  type-ahead fields. Controlled so the × has something to clear. */
function ClearableField({
  id,
  label,
  listId,
  options,
  initial,
  required,
  disabled,
  autoComplete,
}: {
  id: string;
  label: string;
  listId: string;
  options: string[];
  initial: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mb-4">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          id={id}
          type="text"
          required={required}
          disabled={disabled}
          list={listId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start typing…"
          autoComplete={autoComplete}
          className={`${INPUT} ${value && !disabled ? "pr-11" : ""}`}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-tru-pink text-white transition hover:bg-tru-pink-light"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {/* Datalists, not <select>s: a fixed list is how this goes wrong for
          anyone whose answer isn't on it. Both were `list=`-ed before but only
          the nationalities datalist existed, so country type-ahead did
          nothing. */}
      <datalist id={listId}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </datalist>
    </div>
  );
}

export default function ProfileForm({
  name,
  email,
  locked = false,
}: {
  name?: string;
  email?: string;
  /** A live booking is on file — details are the sales team's to change. */
  locked?: boolean;
}) {
  const parts = (name ?? "").trim().split(/\s+/);
  const surname = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? "";

  const PASSPORT_HELP = "Must match your passport exactly — this is the name that goes on your booking and your flights.";

  return (
    <>
      {!locked && (
        <p className="mb-5 text-sm text-gray-400">
          The name and date of birth here have to match your passport — they go on your booking.
        </p>
      )}

      <div className="mb-4">
        <FieldLabel htmlFor="pf-email" required>
          Email Address
        </FieldLabel>
        <input
          id="pf-email"
          type="email"
          required
          disabled={locked}
          defaultValue={email}
          autoComplete="email"
          className={INPUT}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <div className="mb-4">
          <FieldLabel htmlFor="pf-first" required help={PASSPORT_HELP}>
            First Name
          </FieldLabel>
          <input
            id="pf-first"
            type="text"
            required
            disabled={locked}
            defaultValue={first}
            autoComplete="given-name"
            className={INPUT}
          />
        </div>
        <div className="mb-4">
          <FieldLabel htmlFor="pf-middle" required help={PASSPORT_HELP}>
            Middle Name
          </FieldLabel>
          <input
            id="pf-middle"
            type="text"
            required
            disabled={locked}
            placeholder="As shown on passport"
            autoComplete="additional-name"
            className={INPUT}
          />
        </div>

        <div className="mb-4">
          <FieldLabel htmlFor="pf-surname" required help={PASSPORT_HELP}>
            Surname
          </FieldLabel>
          <input
            id="pf-surname"
            type="text"
            required
            disabled={locked}
            defaultValue={surname}
            autoComplete="family-name"
            className={INPUT}
          />
        </div>
        <div className="mb-4">
          <FieldLabel htmlFor="pf-gender" optional help="Used for twin-share rooming only.">
            Gender
          </FieldLabel>
          <select id="pf-gender" disabled={locked} className={INPUT}>
            <option value="">Prefer not to say</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Self-describe</option>
          </select>
        </div>

        <ClearableField
          id="pf-nat"
          label="Nationality"
          listId="pf-nationalities"
          options={NATIONALITIES}
          initial="British"
          required
          disabled={locked}
        />
        <ClearableField
          id="pf-country"
          label="Country"
          listId="pf-countries"
          options={COUNTRIES}
          initial="United Kingdom"
          disabled={locked}
          autoComplete="country-name"
        />

        <div className="mb-4">
          <FieldLabel htmlFor="pf-phone" required>
            Contact Number
          </FieldLabel>
          <input
            id="pf-phone"
            type="tel"
            required
            disabled={locked}
            defaultValue="+44 7700 900000"
            autoComplete="tel"
            className={INPUT}
          />
        </div>
        {/* min-w-0: a grid item defaults to min-width:auto, so without it the
            three-part row below refuses to shrink and spills out of the card. */}
        <div className="mb-4 min-w-0">
          {/* Day / month / year, as the live form does it. A single date input
              opens a calendar you have to page back through decades of —
              fine for a departure date, wrong for a birthday. */}
          <FieldLabel htmlFor="pf-dob-day">Date Of Birth</FieldLabel>
          <div className="flex min-w-0 items-center gap-2">
            {/* text + inputMode, not type="number": the spinner arrows eat
                the content box on a field this narrow, and "22" rendered as
                "2". Numeric keypad on mobile either way. */}
            <input
              id="pf-dob-day"
              type="text"
              inputMode="numeric"
              pattern="\\d{1,2}"
              maxLength={2}
              disabled={locked}
              defaultValue="22"
              aria-label="Day of birth"
              className={`${INPUT_BASE} w-14 flex-none px-2 text-center`}
            />
            <span className="text-gray-600">/</span>
            <select
              id="pf-dob-month"
              disabled={locked}
              defaultValue="July"
              aria-label="Month of birth"
              className={`${INPUT_BASE} min-w-0 flex-1 px-3`}
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <span className="text-gray-600">/</span>
            <input
              id="pf-dob-year"
              type="text"
              inputMode="numeric"
              pattern="\\d{4}"
              maxLength={4}
              disabled={locked}
              defaultValue="1998"
              aria-label="Year of birth"
              className={`${INPUT_BASE} w-[4.75rem] flex-none px-2 text-center`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
