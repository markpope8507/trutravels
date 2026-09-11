/**
 * Full-width watermark layer — the scattered line-art stickers the site sits
 * behind its pages, spread across the whole viewport rather than trapped inside
 * a content column.
 *
 * Same treatment as the checkout's `.co-bg`: an absolutely positioned layer
 * pinned to the page, stickers at percentage positions with a little rotation
 * and 4–7% opacity, knocked out to white. Put it inside a `relative` page
 * wrapper and give the content beside it `relative` so it stacks above.
 */

type Sticker = {
  icon: string;
  /** Percentage offsets, so they spread with the viewport. */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  rotate: number;
  opacity: number;
};

const STICKERS: Sticker[] = [
  { icon: "sun", top: "2%", right: "3%", width: "clamp(160px, 18vw, 300px)", rotate: -8, opacity: 0.07 },
  { icon: "bali-flower", top: "12%", left: "2%", width: "clamp(140px, 15vw, 260px)", rotate: 10, opacity: 0.06 },
  { icon: "komodo-dragon", top: "26%", right: "6%", width: "clamp(170px, 20vw, 340px)", rotate: -6, opacity: 0.055 },
  { icon: "peru-bird", top: "38%", left: "5%", width: "clamp(130px, 14vw, 240px)", rotate: -12, opacity: 0.06 },
  { icon: "good-vibes", top: "50%", right: "4%", width: "clamp(150px, 17vw, 300px)", rotate: 8, opacity: 0.06 },
  { icon: "lantern", top: "62%", left: "3%", width: "clamp(120px, 12vw, 220px)", rotate: 6, opacity: 0.05 },
  { icon: "mask", top: "74%", right: "8%", width: "clamp(150px, 16vw, 280px)", rotate: 10, opacity: 0.05 },
  { icon: "eyes", top: "84%", left: "6%", width: "clamp(140px, 15vw, 250px)", rotate: -8, opacity: 0.05 },
  { icon: "ramen", bottom: "2%", right: "5%", width: "clamp(150px, 16vw, 280px)", rotate: -10, opacity: 0.05 },
  // a couple mid-page so the middle of wide screens isn't empty
  { icon: "tru-logo", top: "20%", left: "44%", width: "clamp(110px, 11vw, 190px)", rotate: -10, opacity: 0.04 },
  { icon: "brazil", top: "56%", left: "48%", width: "clamp(120px, 12vw, 210px)", rotate: 6, opacity: 0.04 },
  { icon: "community", top: "90%", left: "40%", width: "clamp(130px, 13vw, 230px)", rotate: 8, opacity: 0.04 },
];

export default function PageStickers() {
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {STICKERS.map((s, i) => (
        <img
          key={`${s.icon}-${i}`}
          src={`/bg-assets/${s.icon}.svg`}
          alt=""
          className="absolute brightness-0 invert"
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            width: s.width,
            transform: `rotate(${s.rotate}deg)`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
