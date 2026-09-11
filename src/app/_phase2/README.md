# Parked for a later stage

Next.js App Router treats a folder starting with `_` as **private** — nothing in
here is routed, so these pages are out of the build's URL space while staying in
the repo, fully readable, ready to move back.

To bring one back: move the folder into `src/app/my-account/` and restore the
links listed beside it below.

| Folder | Was | Links that pointed at it |
|---|---|---|
| `community/` | `/member/community` | Dashboard "Community" quick-action tile |
| `exclusive/` | `/member/exclusive` | Dashboard "Exclusive Content" section |
| `trip-hub/` | `/member/trip-hub/[bookingId]` (+ `/chat`) | `components/booking-history.tsx` — "Trip hub" buttons on confirmed bookings |

Also dropped at the same time, but they were sections rather than routes, so they
live behind a flag in `my-account/dashboard/page.tsx`:

- **Messages & Notifications** panel
- **Podcast Episodes** section

And member-gating was removed site-wide: stories no longer carry a members-only
lock, the "Member Exclusive" topic filter is gone from the stories hub, and
`memberOnly` in `lib/data.ts` is no longer read by any surface. The field is left
on the data so gating can be switched back on without re-tagging every story.
