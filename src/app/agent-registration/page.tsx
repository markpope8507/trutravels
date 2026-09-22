import Breadcrumbs from "@/components/breadcrumbs";
import { PARTNERS, sectionCrumbs } from "@/lib/breadcrumbs";
import AgentBookingForm from "@/components/agent-booking-form";
import { AGENT_PORTAL_URL, PARTNER_PAGES } from "@/lib/partner-pages";

export const metadata = {
  title: "Agent Registration — Register A Booking | TruTravels",
  description:
    "Travel agents: register a TruTravels booking you've made for a client. Agent details, the departure, and everything we need to set the traveller up.",
};

/**
 * Agent Registration.
 *
 * One of the two Partners links that had never been built — it pointed at
 * /about, which is simply the wrong page.
 *
 * This is the trade side, not the consumer side: an agent has sold a
 * TruTravels departure to a client and is passing the booking to us. It
 * mirrors the form at trutravels.com/agents.
 *
 * NOT A LOGIN. Agents Login goes to G Adventures' Sherpa portal, which is a
 * real external system — so this page carries a signpost to it rather than a
 * second sign-in form. The two got confused often enough on the live site to
 * be worth saying out loud here.
 *
 * Mirrored by converted/agent-registration.html.
 */

const HERO = PARTNER_PAGES.find((p) => p.href === "/agent-registration")!.image;

const STEPS: [string, string][] = [
  ["Register the booking", "Fill in the form below — your details, the departure, and your client's."],
  ["We confirm within a day", "You'll get an email with the TruTravels booking reference and the balance due date."],
  ["Commission on departure", "Paid against your agency reference. Track it in Sherpa alongside your other bookings."],
];

export default function AgentRegistrationPage() {
  return (
    <>
      <section className="relative flex h-[60vh] min-h-[420px] items-center overflow-hidden">
        <img src={HERO} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/40 via-tru-navy/60 to-tru-navy/95" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl text-right">
            <p className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.3em] text-tru-pink">
              Travel Agents
            </p>
            <h1 className="mb-6 font-heading text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Agent <span className="text-tru-pink">Registration</span>
            </h1>
            <div className="mb-6 ml-auto h-px w-16 bg-tru-pink" />
            <p className="ml-auto max-w-md text-base font-light italic leading-relaxed text-gray-200 sm:text-lg">
              &ldquo;Sold a Tru trip? Send us the booking and we&rsquo;ll take it from there.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={sectionCrumbs(PARTNERS, "Agent Registration")} />

      <section className="relative overflow-hidden pt-16 pb-24">
        <img
          src="/bg-assets/sun.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-8 w-[260px] select-none brightness-0 invert opacity-[0.06] sm:w-[400px] lg:w-[520px]"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl">
              How It <span className="text-tru-pink">Works</span>
            </h2>

            <ol className="mt-8 space-y-7">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15 font-heading text-xs font-bold text-tru-pink">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-black uppercase tracking-tight text-white">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* The signpost, not a second login form — Sherpa is G Adventures'
                system and the sign-in lives there. */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-heading text-sm font-black uppercase tracking-tight text-white">
                Already An <span className="text-tru-pink">Agent?</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Live availability, your bookings and your commission all live in Sherpa. This form is only for passing
                us a new booking.
              </p>
              <a
                href={AGENT_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-tru-pink/40 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-tru-pink transition hover:bg-tru-pink hover:text-white"
              >
                Sign In To Sherpa
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5" />
                </svg>
              </a>
            </div>
          </div>

          <AgentBookingForm />
        </div>
      </section>
    </>
  );
}
