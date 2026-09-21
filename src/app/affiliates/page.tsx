import InlineVideo from "@/components/inline-video";
import PartnerForm, { type Field } from "@/components/partner-form";
import {
  Benefits,
  Eyebrow,
  H2,
  PartnerCrossLinks,
  PartnerHero,
  PartnerQuotes,
  Steps,
  Wm,
} from "@/components/partner-blocks";
import { AFFILIATE_BENEFITS, AFFILIATE_STEPS, PARTNER_CONTACT, PARTNER_HERO } from "@/lib/partners";

export const metadata = {
  title: "Tru Affiliates — TruTravels Affiliate Programme",
  description:
    "Your own bespoke URL, trackable links and a minimum 5% commission. Tru Affiliates is our internal affiliate programme for creators and communities who travel.",
};

/** Mirrored by converted/affiliates.html. */

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
    name: "fit",
    label: "Why is the affiliate programme a perfect fit for you?",
    required: true,
    placeholder: "How do you usually talk about travel with your community, and where would the links live?",
  },
];

export default function AffiliatesPage() {
  return (
    <>
      <PartnerHero
        image={PARTNER_HERO.affiliates}
        eyebrow="Tru Affiliates"
        title="Tru"
        accent="Affiliates"
        quote="“Your link, your numbers, your commission — with no third-party network in the middle.”"
      />

      {/* OPENING STATEMENT */}
      <section className="relative overflow-hidden pt-24 pb-24">
        <Wm src="sun" className="-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]" />
        <Wm src="brazil" className="-left-16 top-[48%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Build brand awareness and brand loyalty{" "}
            <em className="not-italic text-tru-pink">with the people who already trust you.</em>
          </p>
          <p>
            Tru Affiliates is our own internal affiliates system, built around personalised trackable links. Your
            community books through you, we can see exactly which bookings came from where, and you get paid on every
            one of them.
          </p>
          <p>
            No third-party network taking a cut, no waiting to find out whether a booking counted. Your link, your
            numbers, your commission.
          </p>
          <InlineVideo
            className="!mt-10"
            src="https://videos.pexels.com/video-files/1093661/1093661-uhd_2560_1440_30fps.mp4"
            poster="https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg"
            caption="A minute on what travelling with Tru actually looks like — the thing your community would be booking."
          />
        </div>
      </section>

      {/* WHAT YOU'LL RECEIVE */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="good-vibes" className="-left-16 -top-4 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>The Deal</Eyebrow>
          <H2 accent="Receive">What You’ll</H2>
          <Benefits items={AFFILIATE_BENEFITS} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="ramen" className="-right-12 top-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>How It Works</Eyebrow>
          <H2 accent="To Commission">From Application</H2>
          <Steps items={AFFILIATE_STEPS} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="eyes" className="-right-12 -bottom-8 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Testimonials</Eyebrow>
          <H2 accent="We’ve Worked With">Insight From Partners</H2>
          <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            Communities, clubs and creators who have already run this with us.
          </p>
          <PartnerQuotes />
        </div>
      </section>

      {/* THE FORM */}
      <section id="apply" className="relative overflow-hidden pb-24 border-t border-white/5 pt-20">
        <Wm src="lantern" className="-left-12 top-0 w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Join The Programme</Eyebrow>
          <H2 accent="Tru Affiliates">Apply To</H2>
          <p className="text-gray-300 mt-5 mb-8 text-base sm:text-lg leading-relaxed">
            There’s no minimum following. We’d rather work with 3,000 people who actually listen to you than 300,000 who
            scroll past.
          </p>
          <PartnerForm
            heading="Affiliate"
            headingAccent="Application"
            sub="Nine questions. Rough numbers are fine — we’re reading for fit, not for a spreadsheet."
            extra={EXTRA}
            submit="Apply To The Programme"
            doneTitle="Application"
            doneAccent="Received"
            doneBody={
              <>
                We’ll come back to you within a few days with next steps. If you want to add anything in the meantime,{" "}
                <a href={`mailto:${PARTNER_CONTACT}`} className="text-tru-pink">
                  email the partnerships team
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
            href: "/host-a-trip",
            image: PARTNER_HERO.host,
            title: "Host A Trip",
            desc: "Bring your community with you instead of sending them",
          },
          {
            href: "/about/our-community",
            image: "https://cdn.trutravels.com/thailand/full-moon-party.jpg",
            title: "Our Community",
            desc: "The people you’d be sending somewhere",
          },
        ]}
      />
    </>
  );
}
