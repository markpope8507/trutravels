# Shared components

Reusable HTML/JS building blocks used across multiple pages. Because the static
site has no build step, these are copy-in snippets: drop the marked block (and
its `<script>`) into a page. All styling lives in the shared `../styles.css`.

Each file is also a **standalone demo** — open it in a browser to see the
component working. Note the stylesheet link uses `../styles.css` (this folder is
one level below the site root).

| File | Component |
|------|-----------|
| `auth-modal.html` | Log in / Create account popup (Google · Facebook · Apple + email/password, "Remember me", switchable views) |

## Using the auth modal

1. Copy the `<div class="auth-modal" data-auth-modal> … </div>` block **and** the
   `<script>` from `auth-modal.html` into your page (once).
2. Give any trigger a `data-auth-open` attribute:
   - `data-auth-open="login"` → opens the Log In view
   - `data-auth-open="signup"` → opens the Create Account view

   e.g. the nav button: `<a class="site-nav__join" data-auth-open="login">Join / Log in</a>`
3. The modal closes on the backdrop, the ✕, or Escape; the two views switch via
   their in-modal links.
