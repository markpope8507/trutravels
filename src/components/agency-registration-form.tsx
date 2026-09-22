"use client";

import { useState } from "react";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, FORM_SUBMIT } from "@/lib/form-classes";
import { COUNTRIES } from "@/lib/countries";

/**
 * Agency registration.
 *
 * Mirrors gadventures.com/agents/register — the same form, in Tru voice. It
 * registers an AGENCY, not a person: once the agency is approved, its manager
 * grants logins to the individual agents there.
 *
 * WHY THAT DISTINCTION IS ALL OVER THIS FILE
 * It's the one thing people get wrong on this form, and getting it wrong
 * means a rejected application and a fortnight lost. The G Adventures page
 * says it three times; so does this one — in the intro, on the first group,
 * and above the manager fields.
 *
 * ONE REGISTRATION NUMBER, NOT FIVE FIELDS
 * The source page puts IATA, ABTA, Business Registration, CLIA and TIDS side
 * by side and asks you to fill one in. That reads as five required fields
 * that are somehow all optional. A type + a number is the same information
 * asked once, and it needs no JavaScript to reveal anything — which matters,
 * because converted/agent-registration.html has to behave identically.
 *
 * Mirrored by converted/.build/build_agent_registration.py.
 */

export const REG_TYPES = ["IATA", "ABTA", "Business Registration", "CLIA", "TIDS"];

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
};

const ADDRESS_HEAD: Field[] = [
  { name: "address", label: "Address", required: true, placeholder: "Street address", autoComplete: "street-address" },
];
const ADDRESS_TAIL: Field[] = [
  { name: "state", label: "State Or Province", placeholder: "If your country uses them", autoComplete: "address-level1" },
  { name: "city", label: "City", required: true, autoComplete: "address-level2" },
  { name: "postal_code", label: "Postal / Zip Code", required: true, autoComplete: "postal-code" },
];

const CONTACT_FIELDS: Field[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "bookings@agency.com",
    hint: "The agency's address, not a personal one — this is where booking confirmations land.",
  },
  {
    name: "public_phone",
    label: "Public Phone",
    type: "tel",
    required: true,
    placeholder: "+44 20 7946 0000",
    hint: "The number your customers call.",
  },
  { name: "phone_number", label: "Private Phone", type: "tel", placeholder: "The line we should use" },
  { name: "fax", label: "Fax", type: "tel" },
];

const MANAGER_FIELDS: Field[] = [
  { name: "manager_first_name", label: "First Name", required: true },
  { name: "manager_last_name", label: "Last Name", required: true },
  { name: "manager_email", label: "Email", type: "email", required: true, placeholder: "manager@agency.com" },
];

function Marker({ required }: { required?: boolean }) {
  return <span className="text-gray-500">{required ? " *" : " (optional)"}</span>;
}

function Text({ f }: { f: Field }) {
  return (
    <div className="mb-4">
      <label htmlFor={`ag-${f.name}`} className={FIELD_LABEL}>
        {f.label}
        <Marker required={f.required} />
      </label>
      <input
        id={`ag-${f.name}`}
        name={f.name}
        type={f.type ?? "text"}
        required={f.required}
        placeholder={f.placeholder}
        autoComplete={f.autoComplete}
        className={FIELD_INPUT}
      />
      {f.hint && <p className={FIELD_HINT}>{f.hint}</p>}
    </div>
  );
}

function Group({
  n,
  title,
  note,
  children,
}: {
  n: number;
  title: string;
  note: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mx-0 mb-8 border-0 p-0 last:mb-0">
      <legend className="mb-1 flex items-center gap-2.5">
        {/* Numbered because the form is a sequence — the agency, where it is,
            how to reach it, who runs it — not because numbers look tidy. */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tru-pink/15 font-heading text-[11px] font-bold text-tru-pink">
          {n}
        </span>
        <span className="font-heading text-sm font-black uppercase tracking-tight text-white">{title}</span>
      </legend>
      <div className="mb-5 pl-[34px] text-xs leading-relaxed text-gray-400">{note}</div>
      {children}
    </fieldset>
  );
}

export default function AgencyRegistrationForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-tru-navy p-6 text-center sm:p-8">
        <div className="py-8">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15">
            <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h3 className="mb-2 font-heading text-2xl font-black uppercase tracking-tight text-white">
            Application <span className="text-tru-pink">Received</span>
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
            We&rsquo;ll review it and come back to your manager by email. Once you&rsquo;re approved they can set up
            logins for everyone at the agency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-tru-navy p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <Group
          n={1}
          title="Your Agency"
          note={
            <>
              <strong className="font-semibold text-white">This registers an agency, not a person.</strong> If your
              agency already works with us, ask your manager for a Sherpa login instead.
            </>
          }
        >
          <Text
            f={{
              name: "name",
              label: "Legal Company Name",
              required: true,
              placeholder: "As registered",
              hint: "The legal entity that will appear on commission payments.",
            }}
          />
          <Text
            f={{ name: "group", label: "Agency Group Or Chain", placeholder: "Leave blank if you're independent" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-x-3">
            <div className="mb-4">
              <label htmlFor="ag-reg_type" className={FIELD_LABEL}>
                Registration Type
                <Marker required />
              </label>
              <select id="ag-reg_type" name="reg_type" required defaultValue="" className={FIELD_INPUT}>
                <option value="" disabled>
                  Please select
                </option>
                {REG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Text f={{ name: "reg_number", label: "Registration Number", required: true }} />
          </div>
          <p className={FIELD_HINT}>
            One number is enough — IATA, ABTA, CLIA, TIDS or your business registration. We can&rsquo;t approve an
            agency without one.
          </p>
        </Group>

        <Group n={2} title="Agency Address" note="Where the agency trades from.">
          {ADDRESS_HEAD.map((f) => (
            <Text key={f.name} f={f} />
          ))}
          <div className="mb-4">
            <label htmlFor="ag-country" className={FIELD_LABEL}>
              Country
              <Marker required />
            </label>
            <select id="ag-country" name="country" required defaultValue="" autoComplete="country" className={FIELD_INPUT}>
              <option value="" disabled>
                Please select
              </option>
              {COUNTRIES.map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {ADDRESS_TAIL.map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group n={3} title="Agency Contact Details" note="How we reach the agency, and how your customers do.">
          {CONTACT_FIELDS.map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group
          n={4}
          title="Agency Manager"
          note={
            <>
              <strong className="font-semibold text-white">Not you, unless you are the manager.</strong> Approval goes
              to whoever runs the agency, and they hand out the logins from there.
            </>
          }
        >
          {MANAGER_FIELDS.map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group n={5} title="Anything Else" note="Both optional.">
          <Text
            f={{
              name: "booking_number",
              label: "Active Booking Reference",
              placeholder: "If you already have one with us",
              hint: "Speeds things up — it tells us you're already trading with us.",
            }}
          />
          <div className="mb-4">
            <label htmlFor="ag-comment" className={FIELD_LABEL}>
              Comments
              <Marker />
            </label>
            <textarea
              id="ag-comment"
              name="comment"
              rows={3}
              placeholder="Anything we should know about the agency."
              className={`${FIELD_INPUT} resize-y`}
            />
          </div>
        </Group>

        <button type="submit" className={`${FORM_SUBMIT} mt-2`}>
          Register My Agency
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
