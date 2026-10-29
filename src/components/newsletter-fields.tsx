import Link from "next/link";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, FORM_SUBMIT } from "@/lib/form-classes";

/**
 * The newsletter's four fields, its submit and its consent line.
 *
 * Shared by the /email-sign-up page and the footer's sign-up popup, which ask
 * for exactly the same thing — two copies would drift a label at a time.
 *
 * `idPrefix` keeps the ids unique: the popup can open on top of the page.
 *
 * Mirrored by the form in converted/email-sign-up.html and
 * converted/components/mailing-list-modal.html.
 */
export default function NewsletterFields({
  idPrefix,
  autoFocusEmail,
}: {
  idPrefix: string;
  autoFocusEmail?: boolean;
}) {
  return (
    <>
      <div className="mb-4">
        <label htmlFor={`${idPrefix}-email`} className={FIELD_LABEL}>
          Email <span className="text-gray-500">*</span>
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          autoFocus={autoFocusEmail}
          placeholder="you@email.com"
          autoComplete="email"
          className={FIELD_INPUT}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3">
        <div className="mb-4">
          <label htmlFor={`${idPrefix}-first`} className={FIELD_LABEL}>
            First Name <span className="text-gray-500">*</span>
          </label>
          <input id={`${idPrefix}-first`} name="firstName" type="text" required placeholder="First name" autoComplete="given-name" className={FIELD_INPUT} />
        </div>
        <div className="mb-4">
          <label htmlFor={`${idPrefix}-last`} className={FIELD_LABEL}>
            Last Name <span className="text-gray-500">*</span>
          </label>
          <input id={`${idPrefix}-last`} name="lastName" type="text" required placeholder="Last name" autoComplete="family-name" className={FIELD_INPUT} />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor={`${idPrefix}-nationality`} className={FIELD_LABEL}>
          Nationality <span className="text-gray-500">(optional)</span>
        </label>
        <input id={`${idPrefix}-nationality`} name="nationality" type="text" placeholder="e.g. British" autoComplete="country-name" className={FIELD_INPUT} />
        <p className={FIELD_HINT}>So we can send you departures and prices that actually apply to you.</p>
      </div>

      <button type="submit" className={FORM_SUBMIT}>
        Sign Me Up
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        By subscribing you agree to receive marketing emails from TruTravels. Unsubscribe in one click, any time — see
        our{" "}
        <Link href="/terms-conditions" className="text-gray-300 underline hover:text-tru-pink">
          privacy policy
        </Link>
        .
      </p>
    </>
  );
}
