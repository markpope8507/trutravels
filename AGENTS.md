<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Contributor workflow

Follow this on every change:

- **Commit and push to GitHub.** Stage with `git add`, make one commit per logical change with a clear message, and `git push` the branch. Don't batch unrelated changes into a single commit.
- **Keep the static `converted/` deliverable in sync.** The React/Next.js app in `src/` is the design source of truth; `converted/` is the hand-written static HTML deliverable. When you change the look, copy, or behaviour of the prototype in `src/`, mirror the same change into the matching `converted/*.html` page(s) (and `converted/components/*.html` where a shared block is affected).
- **Match the conversion conventions.** Reuse the single shared `converted/styles.css`, use semantic HTML, add no framework and no build step, and reproduce interactivity with the static patterns (carousels via `scroll-snap`, accordions via `<details>`, tabs via radio + `:checked`, modals via `:target`).
- **See the guides for the how-to:** `converted/DEVELOPERS.md` (conversion guide + checklist) and `converted/components/README.md` (copy-in component library).
