import Link from "next/link";

/**
 * Shown above the profile form once there's a live booking on file.
 *
 * WHY THE FIELDS STAY VISIBLE. Once a booking exists, the name and date of
 * birth have gone to airlines, hotels and local operators — changing them
 * here would silently disagree with what's on the ticket. So the details are
 * read-only rather than hidden: you can still check what's on file, which is
 * the thing people actually open this page to do.
 *
 * COPY IS PLACEHOLDER — written to the brief, not supplied. The reference
 * screenshot didn't come through, so the exact wording and the contact route
 * (this points at Help & Support) both need confirming before launch.
 */
export default function ProfileLockedNotice({ reference }: { reference?: string }) {
  return (
    <div className="mb-6 rounded-[10px] border border-tru-pink/30 bg-tru-pink/[0.07] p-5">
      <div className="flex gap-3.5">
        <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-tru-pink/15">
          <svg className="h-4 w-4 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
        <div>
          <h3 className="font-heading text-sm font-black uppercase tracking-tight text-white">
            Your Details Are <span className="text-tru-pink">Locked</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            You&rsquo;ve got a booking with us{reference ? ` (${reference})` : ""}, so your name, date of birth and
            passport details are now tied to it — they&rsquo;ve gone to airlines, accommodation and our local teams.
            To change anything, talk to us and we&rsquo;ll update it everywhere at once.
          </p>
          <Link
            href="/support"
            className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-tru-pink/40 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-tru-pink transition hover:bg-tru-pink hover:text-white"
          >
            Contact The Team
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
