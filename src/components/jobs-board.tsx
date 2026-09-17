"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { JOBS, VALUES, APPLY_EMAIL, APPLY_CONTACT, EQUAL_OPPS, facetCounts, type Job } from "@/lib/jobs";

/**
 * The open-roles board.
 *
 * The live board this replaces is a bare accordion: a job title and nothing
 * else until you click, then one undifferentiated wall of text. Here the three
 * things a candidate filters on — where, which team, what kind of contract —
 * sit on the closed card as tags with a one-line hook, and the detail is typed
 * rather than run as prose.
 *
 * Collapse is native <details>, so it works before hydration. The state here
 * only drives the filter chips and the deep links.
 */

const Chevron = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const Arrow = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const Pin = () => (
  <svg className="h-3 w-3 shrink-0 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const Team = () => (
  <svg className="h-3 w-3 shrink-0 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const Clock = () => (
  <svg className="h-3 w-3 shrink-0 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
  </svg>
);

const TAG =
  "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-300 font-heading";
const SEC_H =
  "flex items-center gap-2.5 sm:gap-3 font-heading text-[0.9375rem] font-black uppercase tracking-[0.04em] text-white mb-4 before:content-[''] before:shrink-0 before:w-4 sm:before:w-6 before:h-0.5 before:bg-tru-pink";
const P = "text-gray-300 text-[0.9375rem] leading-[1.75] mb-4 last:mb-0 max-w-[46rem]";

/** **bold** → <strong>, so the copy stays readable in jobs.ts. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="text-white">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Ticks({ items, plain = false }: { items: string[]; plain?: boolean }) {
  return (
    <ul className="grid gap-2.5 max-w-[46rem]">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed">
          {plain ? (
            <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
          ) : (
            <span className="mt-[0.2rem] flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full bg-tru-pink/15">
              <svg className="h-2.5 w-2.5 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h4 className={SEC_H}>{heading}</h4>
      {children}
    </div>
  );
}

function JobDetail({ job }: { job: Job }) {
  const subject = encodeURIComponent(job.title);
  return (
    <div className="px-[1.125rem] pb-6 sm:px-6 sm:pb-7">
      <div className="h-px bg-white/10 mb-6 sm:mb-7" />

      {/* The facts the live page buries in a paragraph of "Label: value" lines */}
      <dl className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-4 gap-x-5 sm:gap-x-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 mb-7 sm:mb-8">
        {job.facts.map(([k, v]) => (
          <div key={k}>
            <dt className="text-tru-pink font-heading text-[10px] font-bold uppercase tracking-[0.18em] mb-1">{k}</dt>
            <dd className="text-white text-sm leading-snug">{v}</dd>
          </div>
        ))}
      </dl>

      <Section heading="The Role In A Nutshell">
        {job.nutshell.map((p, i) => (
          <p key={i} className={P}>{rich(p)}</p>
        ))}
      </Section>

      {job.wins && (
        <Section heading="What Success Looks Like">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {job.wins.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-[1.1rem]">
                <p className="text-tru-pink font-heading text-[0.8125rem] font-black uppercase tracking-[0.03em] mb-1.5">{t}</p>
                <p className="text-gray-400 text-[0.8125rem] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {job.responsibilities && (
        <Section heading="Key Responsibilities">
          {job.respIntro && <p className={P}>{job.respIntro}</p>}
          <Ticks items={job.responsibilities} />
        </Section>
      )}

      {job.groups && (
        <Section heading="What You'll Be Doing">
          {job.groups.map(([name, items]) => (
            <div key={name} className="mt-6 first:mt-0">
              <p className="text-white font-heading text-[0.8125rem] font-bold uppercase tracking-[0.08em] mb-3">{name}</p>
              <Ticks items={items} />
            </div>
          ))}
        </Section>
      )}

      {job.suits && (
        <Section heading="Who This Role Is Perfect For">
          {job.suitsIntro && <p className={P}>{job.suitsIntro}</p>}
          <Ticks items={job.suits} />
        </Section>
      )}

      {/* Essential beside Nice To Have — the live page runs them as two
          identical bullet lists, which hides which ones actually matter. */}
      {job.musts && (
        <Section heading="What You'll Need">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white font-heading text-[0.8125rem] font-bold uppercase tracking-[0.08em] mb-3.5">Essential</p>
              <Ticks items={job.musts} />
            </div>
            {job.nices && (
              <div>
                <p className="text-white font-heading text-[0.8125rem] font-bold uppercase tracking-[0.08em] mb-3.5">
                  Nice To Have{" "}
                  <span className="text-gray-500 font-semibold normal-case tracking-normal text-xs">
                    — don&apos;t let a gap stop you
                  </span>
                </p>
                <Ticks items={job.nices} plain />
              </div>
            )}
          </div>
        </Section>
      )}

      {job.matters && (
        <Section heading="Why This Role Matters At Tru">
          {job.matters.map((p, i) => (
            <p key={i} className={P}>{p}</p>
          ))}
          {job.mattersQuote && (
            <p className="border-l-2 border-tru-pink pl-5 text-white font-heading text-lg sm:text-xl font-bold leading-snug">
              {job.mattersQuote}
            </p>
          )}
        </Section>
      )}

      <Section heading="Our Values">
        <p className={P}>
          Our values shape how we work, lead and grow. If they resonate with you, you&apos;ll probably feel at home here.
        </p>
        {/* Two clean columns on a phone — the five lockups are different widths,
            so a wrapping row packed them 1/1/2/1 and read as a mistake. */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-x-7 mt-5">
          {VALUES.map((v) => (
            <Link key={v.asset} href="/about/our-values" className="block opacity-85 hover:opacity-100 transition">
              <img
                src={`/values/${v.asset}.png`}
                alt={v.name}
                width={v.w}
                height={v.h}
                className="block h-7 sm:h-10 w-auto max-w-full object-contain object-left"
              />
            </Link>
          ))}
        </div>
      </Section>

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-tru-navy via-tru-navy to-tru-pink/[0.08] p-5 sm:p-8">
        <h4 className="font-heading text-xl sm:text-2xl font-black uppercase text-white tracking-tight mb-2">
          Ready To Join <span className="text-tru-pink">The Adventure?</span>
        </h4>
        <p className="text-gray-300 text-sm leading-[1.7] mb-5">
          Send your application to {APPLY_CONTACT} at{" "}
          <a href={`mailto:${APPLY_EMAIL}?subject=${subject}`} className="text-tru-pink font-semibold">
            {APPLY_EMAIL}
          </a>{" "}
          and include your CV plus a short introduction about yourself and what excites you about this opportunity.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${APPLY_EMAIL}?subject=${subject}`}
            className="inline-flex flex-1 min-[480px]:flex-none items-center justify-center gap-2 rounded-[10px] bg-tru-pink hover:bg-tru-pink-light text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition"
          >
            Apply For This Role <Arrow />
          </a>
          <a
            href="#roles"
            className="inline-flex flex-1 min-[480px]:flex-none items-center justify-center gap-2 rounded-[10px] border border-white/25 hover:border-white/50 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider font-heading transition"
          >
            Back To All Roles
          </a>
        </div>
        <p className="text-gray-500 text-xs leading-[1.7] mt-5">
          We read every application carefully. If you haven&apos;t heard from us within three weeks, please assume your
          application hasn&apos;t been successful this time.
        </p>
        <p className="text-gray-500 text-xs leading-[1.7] mt-5">{EQUAL_OPPS}</p>
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
        active
          ? "border-tru-pink bg-tru-pink/[0.12] text-white"
          : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-tru-pink/40 hover:text-white"
      }`}
    >
      {label}
      <span className={active ? "text-tru-pink tabular-nums" : "text-gray-500 tabular-nums"}>{count}</span>
    </button>
  );
}

function FilterBar({
  label,
  options,
  total,
  active,
  onPick,
}: {
  label: string;
  options: [string, number][];
  total: number;
  active: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Inline on a phone the chips wrap around the label in a ragged block,
          so it takes its own line until there's room for the row. */}
      <p className="basis-full sm:basis-auto text-gray-500 font-heading text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-0 sm:mr-1">
        {label}
      </p>
      <Chip label={`All ${label === "Team" ? "Teams" : "Locations"}`} count={total} active={active === ""} onClick={() => onPick("")} />
      {options.map(([v, n]) => (
        <Chip key={v} label={v} count={n} active={active === v} onClick={() => onPick(v)} />
      ))}
    </div>
  );
}

export default function JobsBoard() {
  const [dept, setDept] = useState("");
  const [loc, setLoc] = useState("");
  const boardRef = useRef<HTMLDivElement>(null);

  const shown = JOBS.filter((j) => (!dept || j.department === dept) && (!loc || j.location === loc));

  /* Deep link: #slug opens that role and scrolls to it, the way the live
     site's anchors do. <details> is uncontrolled, so this reaches for the
     element rather than holding open state. */
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.replace(/^#_?/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  /* Align the card head on toggle. Without this the panel expands above the
     reader's position and they land at the end of what they just opened —
     `[overflow-anchor:none]` stops the browser compensating, and this puts the
     start of the role where they can see it. */
  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const el = e.currentTarget;
    if (el.open && typeof history.replaceState === "function") {
      history.replaceState(null, "", `#${el.id}`);
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="mt-10">
      <FilterBar label="Team" options={facetCounts("department")} total={JOBS.length} active={dept} onPick={setDept} />
      <FilterBar label="Where" options={facetCounts("location")} total={JOBS.length} active={loc} onPick={setLoc} />

      <div ref={boardRef} className="flex flex-col gap-3 [overflow-anchor:none]">
        {shown.map((job) => (
          <details
            key={job.slug}
            id={job.slug}
            onToggle={onToggle}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-tru-pink/30 open:border-tru-pink/45 open:bg-white/[0.05] scroll-mt-24"
          >
            <summary className="block cursor-pointer list-none p-[1.125rem] sm:p-6 [&::-webkit-details-marker]:hidden">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-heading text-lg sm:text-[1.375rem] font-black uppercase leading-tight text-white transition-colors group-hover:text-tru-pink m-0">
                  {job.title}
                  {job.suffix && <span className="block text-tru-pink text-[0.75em] mt-0.5">{job.suffix}</span>}
                </h3>
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition group-hover:text-white group-hover:border-tru-pink/40 group-open:rotate-180 group-open:bg-tru-pink group-open:border-tru-pink group-open:text-white"
                >
                  <Chevron />
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-[46rem]">{job.hook}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={TAG}><Pin />{job.location}</span>
                <span className={TAG}><Team />{job.department}</span>
                <span className={TAG}><Clock />{job.type}</span>
              </div>
            </summary>
            <JobDetail job={job} />
          </details>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-gray-400 text-[0.9375rem] leading-[1.7] py-8">
          No roles match that combination right now. Clear a filter, or send us a speculative application at{" "}
          <a href={`mailto:${APPLY_EMAIL}`} className="text-tru-pink">{APPLY_EMAIL}</a>{" "}
          — we keep good people on file.
        </p>
      )}
    </div>
  );
}
