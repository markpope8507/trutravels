import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import { PARTNERS, sectionCrumbs } from "@/lib/breadcrumbs";
import AgencyRegistrationForm from "@/components/agency-registration-form";
import { AGENT_PORTAL_URL, PARTNER_PAGES } from "@/lib/partner-pages";

export const metadata = {
  title: "Agent Registration — Register Your Travel Agency | TruTravels",
  description:
    "Register your travel agency to sell TruTravels. Once you're approved, your manager can set up Sherpa logins for everyone at the agency.",
};

/**
 * Agent Registration — a travel agency signing up to sell TruTravels.
 *
 * Mirrors gadventures.com/agents/register, in Tru voice. We're on the same
 * Sherpa platform, so this is the same application and the same approval
 * route; only the words are ours.
 *
 * IT REGISTERS AN AGENCY, NOT A PERSON. That distinction is the whole reason
 * the page needs prose around the form: an individual agent filling this in
 * gets rejected and loses a fortnight. It's said in the intro, on the first
 * group of the form, and again above the manager fields.
 *
 * NOT A LOGIN EITHER. Agents Login goes to Sherpa, which is where agents at
 * an already-approved agency go. The card on the left sends them there.
 *
 * Mirrored by converted/agent-registration.html.
 */

const HERO = PARTNER_PAGES.find((p) => p.href === "/agent-registration")!.image;

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
              Register Your <span className="text-tru-pink">Agency</span>
            </h1>
            <div className="mb-6 ml-auto h-px w-16 bg-tru-pink" />
            <p className="ml-auto max-w-md text-base font-light italic leading-relaxed text-gray-200 sm:text-lg">
              &ldquo;Thanks for your interest in Tru. We can&rsquo;t wait to work with you.&rdquo;
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
              Sell Tru <span className="text-tru-pink">Trips</span>
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-300">
              <p>
                Before we can start working together, your agency needs to be registered with us. If you manage a
                travel agency and you&rsquo;re not already working with TruTravels, fill in the form.
              </p>
              <p>
                Once you&rsquo;re approved you&rsquo;ll be set up on Sherpa, and you can give individual agents at your
                firm their own access from there.
              </p>
            </div>

            {/* Two wrong turns, both common enough to head off before the form.
                The first is an agent filling in an agency form; the second is
                a tour operator who wants to supply us, not sell us. */}
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-heading text-sm font-black uppercase tracking-tight text-white">
                  Already <span className="text-tru-pink">Registered?</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  If your agency is already with us, you don&rsquo;t need this form — sign in to Sherpa, or ask your
                  manager to set you up with a login.
                </p>
                <a
                  href={AGENT_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-tru-pink/40 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-tru-pink transition hover:bg-tru-pink hover:text-white"
                >
                  Log In To Sherpa
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5L10 14M18 14v5H5V6h5" />
                  </svg>
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-heading text-sm font-black uppercase tracking-tight text-white">
                  Not An <span className="text-tru-pink">Agency?</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  If you run your own trips, host a community, or have a partnership idea that isn&rsquo;t an agency
                  arrangement,{" "}
                  <Link href="/partners" className="text-gray-100 underline transition hover:text-tru-pink">
                    the other Partners routes
                  </Link>{" "}
                  are the ones you want.
                </p>
              </div>
            </div>
          </div>

          <AgencyRegistrationForm />
        </div>
      </section>
    </>
  );
}
