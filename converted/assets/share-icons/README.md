# Share icons

Standalone SVGs for the "Share this trip" feature, matching the buttons used in
the share modal on the tour page (`thailand-island-hopper.html`).

| File | Button | Colour |
|------|--------|--------|
| `share.svg` | Share trigger (nodes glyph) | `currentColor` |
| `copy-link.svg` | Copy link | `currentColor` |
| `email.svg` | Email | `currentColor` |
| `sms.svg` | SMS | `#34C759` |
| `whatsapp.svg` | WhatsApp | `#25D366` |
| `instagram.svg` | Instagram | `#E1306C` |
| `messenger.svg` | Messenger | `#0084FF` |

All are `24×24` on a `0 0 24 24` viewBox. The outline icons (`share`, `copy-link`,
`email`, `sms`) use `stroke`; the brand glyphs (`whatsapp`, `instagram`,
`messenger`) use `fill`. Icons set to `currentColor` inherit the surrounding text
colour — set `color:` (or `fill`/`stroke`) in CSS to recolour.

Share links used by the buttons:
- **Copy link** — copies the current page URL to the clipboard.
- **WhatsApp** — `https://wa.me/?text=<message>%20<url>`
- **Email** — `mailto:?subject=<subject>&body=<message>%20<url>`
- **SMS** — `sms:?&body=<message>%20<url>`
- **Instagram** — `https://www.instagram.com/` (Instagram has no web share-to URL)
- **Messenger** — `fb-messenger://share/?link=<url>`
