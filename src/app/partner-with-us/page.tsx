import Breadcrumbs from "@/components/breadcrumbs";
import { PARTNERS, sectionCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import TripVideoPlayer from "@/components/trip-video-player";
import PartnerForm, { type Field } from "@/components/partner-form";
import {
  Eyebrow,
  H2,
  PartnerCrossLinks,
  PartnerHero,
  PartnerLogos,
  Wm,
} from "@/components/partner-blocks";
import { PARTNER_CONTACT, PARTNER_HERO } from "@/lib/partners";

export const metadata = {
  title: "Partner With Us — TruTravels",
  description:
    "Host your own group trip, join the Tru Affiliates programme, or bring us a partnership idea nobody has tried yet. Tell us about your community.",
};

/**
 * Partner With Us — the "not sure which route fits" page.
 *
 * The three routes the brief covers are one proposition split by who's
 * asking, so this page carries the choice and the two specific pages carry
 * the detail. "Something else" has no page of its own — it's the form here.
 *
 * NOT the section landing page: /partners is, and this now sits under it
 * alongside Affiliates, Host A Trip and Agent Registration. This page was the
 * hub by default, back when Partners had no landing page at all.
 *
 * Mirrored by converted/partner-with-us.html.
 */

const ROUTES = [
  {
    href: "/host-a-trip",
    cta: "Host A Trip",
    title: "Host A Trip",
    desc: "You bring your community, we handle the planning, the guides, the logistics and the safety. You get your own page on this site and commission on every booking.",
    /* A planted flag drawn across the whole frame. The first version was a
       small pennant in the top-left corner, so next to the homepage's icons —
       which all fill their 24x24 box — it read as a weaker mark, not a
       quieter one. */
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 22V3m0 1.6c5.6-3 10.4 3 16 0v10.4c-5.6 3-10.4-3-16 0"
      />
    ),
  },
  {
    href: "/affiliates",
    cta: "See The Programme",
    title: "Tru Affiliates",
    desc: "Your own bespoke URL and trackable links, a minimum 5% commission, incentives through the year, and the assets and templates to post with.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
      />
    ),
  },
  {
    href: "#apply",
    cta: "Use The Form Below",
    title: "Something Else",
    desc: "A campaign, an event, a collaboration nobody has done yet. If it doesn’t fit either box above, it probably belongs here. Tell us what you had in mind.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8"
      />
    ),
  },
];

const EXTRA: Field[] = [
  {
    kind: "pills",
    name: "interest",
    legend: "I’m interested in",
    options: ["Hosting a trip", "Affiliates programme", "Something else"],
    multi: true,
    revealOn: "Something else",
    revealField: {
      kind: "area",
      name: "interest-detail",
      label: "Tell us about it",
      rows: 3,
      placeholder: "A collaboration, an event, a campaign — whatever you had in mind.",
    },
  },
];

export default function PartnerWithUsPage() {
  return (
    <>
      <PartnerHero
        image={PARTNER_HERO.hub}
        eyebrow="Partners"
        title="Partner"
        accent="With Us"
        quote="“Do you have a community that loves to travel? Have you ever thought about travelling together?”"
      />

      <Breadcrumbs crumbs={sectionCrumbs(PARTNERS, "Partner With Us")} />

      {/* OPENING STATEMENT */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <Wm src="sun" className="-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]" />
        <Wm src="good-vibes" className="-left-16 top-[46%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Do you have a community that{" "}
            <em className="not-italic text-tru-pink">loves to travel?</em>
          </p>
          <p>
            Have you ever thought about travelling together? Whether you want to host your own group trip, be part of
            our tailor-made Tru Affiliates programme, or have a totally unique partnership idea, we’d love to hear from
            you.
          </p>
          {/* The tour pages' "Watch The Trip" block — same component, so this
              page and a trip page behave identically. */}
          <div className="!mt-10">
            <TripVideoPlayer
              video="https://videos.pexels.com/video-files/36218992/15359210_2560_1440_24fps.mp4"
              poster="https://cdn.trutravels.com/morocco-images/morocco-uncovered-desert-group-picture.jpg"
              title="What a Tru trip looks like"
            />
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-gray-500">
              Whichever of the three routes fits you, this is the thing your community would be getting — worth a
              minute before you fill the form in.
            </p>
          </div>
        </div>
      </section>

      {/* THREE ROUTES */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="community" className="-left-16 -top-4 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Three Ways In</Eyebrow>
          <H2 accent="Sounds Like You">Pick The One That</H2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Not sure which? Say so on the form below and we’ll work it out together — plenty of partners start in one
            and end up in both.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROUTES.map((r) => (
              <Link
                key={r.title}
                href={r.href}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-tru-pink/45 hover:bg-white/[0.05]"
              >
                {/* Bare, like the homepage stat icons — no chip. The chip that used
                    to sit here was a filled box inside a card that is already a box,
                    and it shrank the icon to fit, so the mark read smaller and weaker
                    than anything on the homepage. */}
                <span className="mb-[0.9rem] block h-7 w-7 sm:h-8 sm:w-8 text-tru-pink">
                  <svg className="block h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                    {r.icon}
                  </svg>
                </span>
                <p className="font-heading text-base font-black uppercase tracking-tight text-white mb-2">{r.title}</p>
                <p className="flex-1 text-sm leading-relaxed text-gray-400 mb-5">{r.desc}</p>
                <span className="inline-flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.1em] text-tru-pink">
                  {r.cta}
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THE FORM */}
      <section id="apply" className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="lantern" className="-right-12 top-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Get In Touch</Eyebrow>
          <H2 accent="Your Community">Tell Us About</H2>
          <p className="text-gray-300 mt-5 mb-8 text-base sm:text-lg leading-relaxed">
            A real person reads every one of these. If there’s something here, we’ll come back to you within a few days.
          </p>
          <PartnerForm
            heading="Partner"
            headingAccent="Application"
            sub="Seven questions and a couple of follow-ups. Nothing here commits you to anything."
            extra={EXTRA}
            submit="Send My Application"
            doneTitle="Thanks —"
            doneAccent="We’re On It"
            doneBody={
              <>
                Your application is with the partnerships team. We read every one properly, so give us a few days — and
                if you think of something you left out,{" "}
                <a href={`mailto:${PARTNER_CONTACT}`} className="text-tru-pink">
                  email us
                </a>
                .
              </>
            }
          />
        </div>
      </section>

      {/* LOGO WALL */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="eyes" className="-left-12 -bottom-8 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>In Good Company</Eyebrow>
          <H2 accent="Travelled With">Communities We’ve</H2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Groups, clubs and creators who have already brought their people out with us.
          </p>
          <PartnerLogos />
        </div>
      </section>

      <PartnerCrossLinks
        cards={[
          {
            href: "/host-a-trip",
            image: PARTNER_HERO.host,
            title: "Host A Trip",
            desc: "Bring your community somewhere brilliant — we do the logistics",
          },
          {
            href: "/affiliates",
            image: PARTNER_HERO.affiliates,
            title: "Tru Affiliates",
            desc: "Trackable links, 5% minimum commission, assets you can actually post",
          },
          {
            href: "/join-the-crew",
            image: "https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg",
            title: "Join The Crew",
            desc: "Not a partner — want a job? Open roles are here",
          },
        ]}
      />
    </>
  );
}
