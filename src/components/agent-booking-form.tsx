"use client";

import { useState } from "react";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, FORM_SUBMIT } from "@/lib/form-classes";
import { trips } from "@/lib/data";

/**
 * The agent booking registration form.
 *
 * Mirrors the form at trutravels.com/agents, which is how a travel agent
 * passes us a booking they've made for a client: who the agent is, which
 * trip, and everything we need to set the traveller up.
 *
 * GROUPED, UNLIKE THE LIVE ONE. Sixteen fields in a single column is a wall —
 * and half of them are about the agent while half are about somebody else
 * entirely. The fieldsets say whose details you're filling in, which is the
 * one thing the live form leaves you to work out.
 *
 * THE TOUR LIST IS THE REAL TRIP DATA, read from lib/data and grouped by
 * country, so a trip added there appears here. "Another trip" stays at the
 * bottom because agents sell departures that aren't on the site yet.
 *
 * Mirrored by converted/agent-registration.html.
 */

type TextField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
};

/* Used for twin-share rooming, which is the only reason we ask — so the
   options are the ones a person might actually pick, not the live form's
   Male/Female pair. */
const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];

const AGENT_FIELDS: TextField[] = [
  { name: "agent_name", label: "Agent Name", required: true, placeholder: "First and last" },
  {
    name: "agent_reference",
    label: "Agency Reference",
    required: true,
    placeholder: "Your booking reference",
    hint: "Whatever this booking is called in your system — it's how we match the two up.",
  },
  { name: "agent_email", label: "Agent Email Address", type: "email", required: true, placeholder: "you@agency.com" },
];

const CUSTOMER_FIELDS: TextField[] = [
  { name: "customer_name", label: "Customer Name", required: true, placeholder: "As it appears on their passport" },
  { name: "customer_email", label: "Email Address", type: "email", required: true, placeholder: "them@email.com" },
  { name: "customer_phone", label: "Phone Number", type: "tel", required: true, placeholder: "+44 7700 900000" },
  { name: "customer_dob", label: "Date Of Birth", type: "date", required: true },
  { name: "customer_nationality", label: "Nationality", required: true, placeholder: "e.g. British" },
];

const EMERGENCY_FIELDS: TextField[] = [
  { name: "emergency_name", label: "Emergency Contact Name", required: true, placeholder: "Full name" },
  { name: "emergency_number", label: "Emergency Contact Number", type: "tel", required: true, placeholder: "Including country code" },
];

const EXTRA_FIELDS: { name: string; label: string; placeholder: string; rows: number }[] = [
  {
    name: "dietary_medical",
    label: "Dietary Requirements / Medical Conditions",
    placeholder: "Allergies, medication, anything a trip leader should know before day one.",
    rows: 3,
  },
  {
    name: "flights",
    label: "Flight Details",
    placeholder: "Arrival airport, flight number and landing time, if they're booked.",
    rows: 3,
  },
  { name: "notes", label: "Notes", placeholder: "Anything else we should know.", rows: 3 },
];

/** Trips grouped by country, for the Tour select. */
const TOURS_BY_COUNTRY = trips.reduce<Record<string, typeof trips>>((acc, t) => {
  (acc[t.destination] ??= []).push(t);
  return acc;
}, {});

function Marker({ required }: { required?: boolean }) {
  return <span className="text-gray-500">{required ? " *" : " (optional)"}</span>;
}

function Text({ f }: { f: TextField }) {
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

function Group({ n, title, note, children }: { n: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <fieldset className="mx-0 mb-8 border-0 p-0 last:mb-0">
      <legend className="mb-1 flex items-center gap-2.5">
        {/* These are numbered because the form IS a sequence — you, then the
            trip, then them — not because numbers look tidy. */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tru-pink/15 font-heading text-[11px] font-bold text-tru-pink">
          {n}
        </span>
        <span className="font-heading text-sm font-black uppercase tracking-tight text-white">{title}</span>
      </legend>
      <p className="mb-5 pl-[34px] text-xs leading-relaxed text-gray-400">{note}</p>
      {children}
    </fieldset>
  );
}

export default function AgentBookingForm() {
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
            Booking <span className="text-tru-pink">Registered</span>
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">
            We&rsquo;ve got it. You&rsquo;ll have a confirmation by email within one working day, with the booking
            reference and what the traveller needs to do next.
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
        <Group n={1} title="Your Details" note="So we know who to confirm back to, and whose commission this is.">
          {AGENT_FIELDS.map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group n={2} title="The Trip" note="Which departure the booking is for.">
          <div className="mb-4">
            <label htmlFor="ag-tour" className={FIELD_LABEL}>
              Tour
              <Marker required />
            </label>
            <select id="ag-tour" name="tour" required defaultValue="" className={FIELD_INPUT}>
              <option value="" disabled>
                Please select
              </option>
              {Object.entries(TOURS_BY_COUNTRY).map(([country, list]) => (
                <optgroup key={country} label={country}>
                  {list.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.duration})
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="other">Another trip — I&rsquo;ll add it in Notes</option>
            </select>
          </div>
          <Text f={{ name: "start_date", label: "Start Date", type: "date", required: true }} />
        </Group>

        <Group
          n={3}
          title="Traveller Details"
          note="The person going. Names need to match their passport — it's what the trip manifest is built from."
        >
          {CUSTOMER_FIELDS.slice(0, 1).map((f) => (
            <Text key={f.name} f={f} />
          ))}
          <div className="mb-4">
            <label htmlFor="ag-customer_gender" className={FIELD_LABEL}>
              Gender
              <Marker required />
            </label>
            <select id="ag-customer_gender" name="customer_gender" required defaultValue="" className={FIELD_INPUT}>
              <option value="" disabled>
                Please select
              </option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <p className={FIELD_HINT}>Used for twin-share rooming only.</p>
          </div>
          {CUSTOMER_FIELDS.slice(1).map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group n={4} title="Emergency Contact" note="Someone not travelling with them.">
          {EMERGENCY_FIELDS.map((f) => (
            <Text key={f.name} f={f} />
          ))}
        </Group>

        <Group n={5} title="Anything Else" note="All optional, but the first one saves a phone call later.">
          {EXTRA_FIELDS.map((f) => (
            <div key={f.name} className="mb-4">
              <label htmlFor={`ag-${f.name}`} className={FIELD_LABEL}>
                {f.label}
                <Marker />
              </label>
              <textarea
                id={`ag-${f.name}`}
                name={f.name}
                rows={f.rows}
                placeholder={f.placeholder}
                className={`${FIELD_INPUT} resize-y`}
              />
            </div>
          ))}
        </Group>

        <button type="submit" className={`${FORM_SUBMIT} mt-2`}>
          Register This Booking
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p className={`${FIELD_HINT} mt-4`}>
          Registering a booking isn&rsquo;t a confirmation. We&rsquo;ll come back to you within one working day to
          confirm the place and the price.
        </p>
      </form>
    </div>
  );
}
