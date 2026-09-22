/**
 * The class strings every form on this site shares.
 *
 * They were copied into partner-form, booking-history and email-sign-up, and
 * a fourth copy was about to land with /agent-registration. The static build
 * has one definition of these — `.field` in converted/styles.css — and the
 * prototype should too, or the two builds drift a padding value at a time.
 *
 * Mirrored by `.field` / `.field__hint` in converted/styles.css.
 */

export const FIELD_LABEL =
  "block text-tru-pink font-heading text-[10px] font-bold uppercase tracking-[0.2em] mb-2";

export const FIELD_INPUT =
  "w-full rounded-[10px] bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white " +
  "placeholder:text-gray-500 focus:outline-none focus:border-tru-pink/50 transition-colors";

export const FIELD_HINT = "text-gray-500 text-xs leading-relaxed mt-1.5";

/** The pink full-width submit. */
export const FORM_SUBMIT =
  "inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-tru-pink px-8 py-3 " +
  "font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light";
