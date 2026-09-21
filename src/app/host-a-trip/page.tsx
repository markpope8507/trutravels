import Breadcrumbs from "@/components/breadcrumbs";
import { PARTNERS, sectionCrumbs } from "@/lib/breadcrumbs";
import TripVideoPlayer from "@/components/trip-video-player";
import PartnerForm, { type Field } from "@/components/partner-form";
import { Benefits, Eyebrow, H2, PartnerCrossLinks, PartnerHero, Steps, Wm } from "@/components/partner-blocks";
import { HOST_BENEFITS, HOST_STEPS, PARTNER_CONTACT, PARTNER_HERO } from "@/lib/partners";

export const metadata = {
  title: "Host A Trip — TruTravels",
  description:
    "Turn your online community into an in-person one. You bring the people and the hype; we handle planning, guides, communication and safety — and you travel too.",
};

/** Mirrored by converted/host-a-trip.html. */

const EXTRA: Field[] = [
  {
    kind: "text",
    name: "reach",
    label: "Followers and engagement",
    required: true,
    placeholder: "e.g. 42k on Instagram, ~6% engagement",
    hint: "Rough numbers are fine. We care far more about how engaged your community is than how big it is.",
  },
  {
    kind: "area",
    name: "why-host",
    label: "Why do you want to host a trip?",
    required: true,
    placeholder: "What would this trip mean for you and for the people who’d come on it?",
  },
  {
    kind: "text",
    name: "dream",
    label: "Do you have a dream destination?",
    placeholder: "Somewhere specific, or a rough region",
    hint: "We run trips in 35+ countries, so there’s a good chance we’re already there.",
  },
  {
    kind: "area",
    name: "community",
    label: "Do you have a pre-existing in-person or virtual community?",
    required: true,
    rows: 3,
    placeholder: "A Discord, a run club, a group chat, a following, a class you teach — anything counts.",
  },
];

export default function HostATripPage() {
  return (
    <>
      <PartnerHero
        image={PARTNER_HERO.host}
        eyebrow="Host A Trip"
        title="Host"
        accent="A Trip"
        quote="“We handle the logistics. You focus on building hype and bringing your community together.”"
      />

      <Breadcrumbs crumbs={sectionCrumbs(PARTNERS, "Host A Trip")} />

      {/* OPENING STATEMENT */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <Wm src="sun" className="-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]" />
        <Wm src="komodo-dragon" className="-left-16 top-[48%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Are you looking to transform your virtual community into{" "}
            <em className="not-italic text-tru-pink">an in-person connection?</em>
          </p>
          <p>Why not host a once-in-a-lifetime trip!</p>
          <p>
            We handle the logistics stuff — planning, customer communication, local guides and safety — while you focus
            on building hype for your trip and bringing your community together.
          </p>
          {/* The tour pages' "Watch The Trip" block — same component, so this
              page and a trip page behave identically. */}
          <div className="!mt-10">
            <TripVideoPlayer
              video="https://zfxhmfjtkhpuo90l.public.blob.vercel-storage.com/hero-15-second.mp4"
              poster="https://cdn.trutravels.com/thailand/full-moon-party.jpg"
              title="A Tru group on the road"
              label="See A Trip In Motion"
            />
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-gray-500">
              What a Tru group actually looks like on the ground — your people, a Local Legend, and none of the
              logistics landing on you.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL RECEIVE */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="mask" className="-left-16 -top-4 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>The Deal</Eyebrow>
          <H2 accent="Receive">What You’ll</H2>
          <Benefits items={HOST_BENEFITS} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="peru-bird" className="-right-12 top-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>How It Works</Eyebrow>
          <H2 accent="Happens Next">What Actually</H2>
          <Steps items={HOST_STEPS} />
        </div>
      </section>

      {/* THE FORM */}
      <section id="apply" className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="lantern" className="-left-12 top-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Start The Conversation</Eyebrow>
          <H2 accent="Your Trip">Pitch Us</H2>
          <p className="text-gray-300 mt-5 mb-8 text-base sm:text-lg leading-relaxed">
            You don’t need a finished plan, a date or a destination. A community and an idea is enough to start.
          </p>
          <PartnerForm
            heading="Host A Trip"
            headingAccent="Application"
            sub="Ten questions. The last four are the ones we’ll actually want to talk about."
            extra={EXTRA}
            submit="Pitch My Trip"
            doneTitle="Pitch"
            doneAccent="Received"
            doneBody={
              <>
                Someone from the partnerships team will be in touch within a few days to talk it through. Anything to
                add in the meantime?{" "}
                <a href={`mailto:${PARTNER_CONTACT}`} className="text-tru-pink">
                  Email us
                </a>
                .
              </>
            }
          />
        </div>
      </section>

      <PartnerCrossLinks
        cards={[
          {
            href: "/partner-with-us",
            image: PARTNER_HERO.hub,
            title: "Partner With Us",
            desc: "Not sure which route fits? Start here",
          },
          {
            href: "/affiliates",
            image: PARTNER_HERO.affiliates,
            title: "Tru Affiliates",
            desc: "Send your community rather than travel with them",
          },
          {
            href: "/about/our-story",
            image: "https://cdn.trutravels.com/thailand/longtail-boat.jpg",
            title: "Our Story",
            desc: "Who you’d be handing your community to",
          },
        ]}
      />
    </>
  );
}
