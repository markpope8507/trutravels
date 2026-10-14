# Homepage fact icons

Standalone SVGs for the four stats under the headline on the homepage
(`index.html`, the `.wwd__facts` row) — and the same `group.svg` is used by the
"Find Your People" row in the Tru Way block below it.

| File | Stat | Shape |
|------|------|-------|
| `group.svg` | 10–20 · Per group | Two people |
| `person.svg` | 18–45 · Age range | One person |
| `globe.svg` | 35+ · Countries | Globe |
| `map.svg` | 65+ · Trips | Folded map |

All are outline icons, `24×24` on a `0 0 24 24` viewBox, `stroke-width="1.5"`,
stroked in the TruTravels pink **`#FF3F99`** (`--tru-pink`). Swap
`stroke="#FF3F99"` for `stroke="currentColor"` if you'd rather set the colour
from CSS — that is what the inline copies in `index.html` do.

## They are drawn to one optical height — keep them that way

`group.svg` is **new**: the original was drawn short and low, so it read as a
different size from its neighbours even though the SVG box was identical. The
box is never the problem; the artwork inside it is. Measured ink extents within
the viewBox:

| Icon | ink y | height | centre |
|------|-------|--------|--------|
| `group.svg` | 4.00 → 20.00 | 16.00 | 12.00 |
| `person.svg` | 3.00 → 21.00 | 18.00 | 12.00 |
| `globe.svg` | 3.00 → 21.00 | 18.00 | 12.00 |
| `map.svg` | 4.00 → 20.00 | 16.00 | 12.00 |

Every one shares a centre line at 12. The two circular icons are 18 against the
other two at 16 **on purpose** — a circle optically overshoots a flat-topped
shape at the same apparent size, so matching them numerically would make the
circles look too big.

If you add one, check it the same way rather than by eye:

```js
document.querySelector('.wwd__fact svg').getBBox()   // {y, height, ...}
```

## Changing one

The icons are inlined in `index.html`, not referenced as files — these are the
source of truth for anyone who needs the artwork on its own. `group.svg` is
also held in `.build/apply_home_seo.py`'s `ICONS` map, which writes that row:
change it in both, or the next run of that builder puts the old one back.
