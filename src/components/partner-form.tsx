"use client";

import { useId, useState } from "react";
import { AUDIENCE_BANDS, PARTNER_CONTACT } from "@/lib/partners";
import { FIELD_HINT as HINT, FIELD_INPUT as INPUT, FIELD_LABEL as LABEL } from "@/lib/form-classes";

/**
 * The partner application form — one component, three routes.
 *
 * All three Partners pages ask the same seven questions (name, email, over 18,
 * socials, travelled with us before, key audience, why Tru). `extra` carries
 * only the questions that differ:
 *
 *   /partner-with-us   "I'm interested in" + a reveal when Other is ticked
 *   /affiliates        followers and engagement; why the programme fits
 *   /host-a-trip       followers and engagement; why host; dream destination;
 *                      existing community
 *
 * Add a shared question HERE, not to a page. Three near-identical forms
 * drifting apart is what this component exists to prevent.
 *
 * CLOSED QUESTIONS ARE PILLS, NOT SELECTS
 * A <select> hides its options behind a tap, and on a form that is otherwise
 * open text that's the wrong trade — these are the quick questions. The
 * radio/checkbox is visually hidden (sr-only, not `hidden`) so it keeps
 * keyboard focus and draws a ring on the label beside it.
 *
 * Mirrored by the same markup in converted/components/partner-application-form.html.
 */

export type Field =
  | { kind: "text"; name: string; label: string; required?: boolean; placeholder?: string; hint?: string }
  | { kind: "area"; name: string; label: string; required?: boolean; placeholder?: string; rows?: number; hint?: string }
  | {
      kind: "pills";
      name: string;
      legend: string;
      options: string[];
      multi?: boolean;
      required?: boolean;
      hint?: string;
      /** Ticking this option reveals `revealField`. */
      revealOn?: string;
      revealField?: Extract<Field, { kind: "area" | "text" }>;
    };


function Marker({ required, note }: { required?: boolean; note?: string }) {
  if (note !== undefined) return note ? <span className="text-gray-500"> {note}</span> : null;
  return <span className="text-gray-500">{required ? " *" : " (optional)"}</span>;
}

function Pill({
  name,
  value,
  multi,
  onChange,
}: {
  name: string;
  value: string;
  multi?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  /* .ptn-opt is real CSS in globals.css rather than peer-checked: utilities,
     so this pill and .ptn-opt in converted/styles.css are one definition
     rather than two descriptions of the same object. */
  return (
    <label className="ptn-opt">
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
      />
      <span>{value}</span>
    </label>
  );
}

function Control({ f, idPrefix }: { f: Extract<Field, { kind: "text" | "area" }>; idPrefix: string }) {
  const id = `${idPrefix}-${f.name}`;
  return (
    <div className="mb-4">
      <label htmlFor={id} className={LABEL}>
        {f.label}
        <Marker required={f.required} />
      </label>
      {f.kind === "area" ? (
        <textarea
          id={id}
          name={f.name}
          rows={f.rows ?? 4}
          required={f.required}
          placeholder={f.placeholder}
          className={`${INPUT} resize-y`}
        />
      ) : (
        <input id={id} name={f.name} type="text" required={f.required} placeholder={f.placeholder} className={INPUT} />
      )}
      {f.hint && <p className={HINT}>{f.hint}</p>}
    </div>
  );
}

function Pills({ f, idPrefix }: { f: Extract<Field, { kind: "pills" }>; idPrefix: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <fieldset className="mb-5 border-0 p-0 mx-0">
      <legend className={LABEL}>
        {f.legend}
        {/* A pill group is answered by clicking one, so "(optional)" adds
            nothing — say the useful thing (required, or multi) or nothing. */}
        <Marker required={f.required} note={f.multi ? "(select all that apply)" : f.required ? undefined : ""} />
      </legend>
      <div className="flex flex-wrap gap-2">
        {f.options.map((o) => (
          <Pill
            key={o}
            name={`${idPrefix}-${f.name}`}
            value={o}
            multi={f.multi}
            onChange={f.revealOn === o ? setRevealed : undefined}
          />
        ))}
      </div>
      {f.hint && <p className={HINT}>{f.hint}</p>}
      {/* `required` rides the reveal rather than sitting in the markup — a
          hidden required field blocks submission on a control nobody can see,
          so the label's * is only true while the field is showing. */}
      {f.revealField && revealed && (
        <div className="mt-4">
          <Control f={{ ...f.revealField, required: true }} idPrefix={idPrefix} />
        </div>
      )}
    </fieldset>
  );
}

export default function PartnerForm({
  heading,
  headingAccent,
  sub,
  extra,
  submit,
  doneTitle,
  doneAccent,
  doneBody,
}: {
  heading: string;
  headingAccent: string;
  sub: string;
  extra: Field[];
  submit: string;
  doneTitle: string;
  doneAccent: string;
  doneBody: React.ReactNode;
}) {
  const idPrefix = useId().replace(/:/g, "");
  const [done, setDone] = useState(false);

  const base: Field[] = [
    {
      kind: "pills",
      name: "over18",
      legend: "Are you over 18?",
      options: ["Yes", "No"],
      required: true,
      hint: "Every TruTravels trip is 18+, so we can only work with partners who are too.",
    },
    {
      kind: "pills",
      name: "travelled",
      legend: "Have you travelled with TruTravels before?",
      options: ["Yes", "No"],
      hint: "Not a requirement — it just tells us how much of the pitch you already know.",
    },
    {
      kind: "pills",
      name: "audience",
      legend: "Who is your key audience?",
      options: AUDIENCE_BANDS,
      multi: true,
    },
    {
      kind: "area",
      name: "why",
      label: "Why do you want to work with Tru?",
      required: true,
      placeholder: "What is it about how we travel that fits what you’ve built?",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-tru-navy p-6 sm:p-8">
      {done ? (
        <div className="text-center py-8">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tru-pink/15 border border-tru-pink/30">
            <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h3 className="font-heading text-2xl font-black uppercase tracking-tight text-white mb-2">
            {doneTitle} <span className="text-tru-pink">{doneAccent}</span>
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-300">{doneBody}</p>
        </div>
      ) : (
        <>
          <h3 className="font-heading text-lg font-black uppercase tracking-tight text-white mb-1.5">
            {heading} <span className="text-tru-pink">{headingAccent}</span>
          </h3>
          <p className="text-sm leading-relaxed text-gray-400 mb-7">{sub}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3">
              <Control
                f={{ kind: "text", name: "name", label: "Your Name", required: true, placeholder: "First and last" }}
                idPrefix={idPrefix}
              />
              <Control
                f={{ kind: "text", name: "email", label: "Email", required: true, placeholder: "you@email.com" }}
                idPrefix={idPrefix}
              />
            </div>

            <Pills f={base[0] as Extract<Field, { kind: "pills" }>} idPrefix={idPrefix} />

            {/* Said once on the legend, so the row isn't three (optional)s wide. */}
            <fieldset className="mb-5 border-0 p-0 mx-0">
              <legend className={LABEL}>
                Socials<span className="text-gray-500"> — wherever your community lives, all optional</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-x-3">
                {[
                  ["instagram", "Instagram", "@handle"],
                  ["tiktok", "TikTok", "@handle"],
                  ["youtube", "YouTube", "@channel"],
                ].map(([name, label, ph]) => (
                  <div key={name} className="mb-4 last:mb-0 sm:mb-0">
                    <label htmlFor={`${idPrefix}-${name}`} className={LABEL}>
                      {label}
                    </label>
                    <input id={`${idPrefix}-${name}`} name={name} type="text" placeholder={ph} className={INPUT} />
                  </div>
                ))}
              </div>
            </fieldset>

            {base.slice(1).map((f) =>
              f.kind === "pills" ? (
                <Pills key={f.name} f={f} idPrefix={idPrefix} />
              ) : (
                <Control key={f.name} f={f} idPrefix={idPrefix} />
              ),
            )}

            {extra.map((f) =>
              f.kind === "pills" ? (
                <Pills key={f.name} f={f} idPrefix={idPrefix} />
              ) : (
                <Control key={f.name} f={f} idPrefix={idPrefix} />
              ),
            )}

            <button
              type="submit"
              className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-tru-pink px-8 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light"
            >
              {submit}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export { PARTNER_CONTACT };
