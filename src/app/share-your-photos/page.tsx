import Breadcrumbs from "@/components/breadcrumbs";
import { ESSENTIALS, sectionCrumbs } from "@/lib/breadcrumbs";
import Link from "next/link";
import UploadDropzone from "@/components/upload-dropzone";

export const metadata = {
  title: "Share Your Photos — TruTravels",
  description:
    "Upload your best photos and videos from tour — and go into the draw for £250 travel credit.",
};

/* Real traveller shots, standing in for the three on the live page. */
const STRIP = [
  ["https://cdn.trutravels.com/thailand/groupshot-in-the-sea-thailand.jpg", "The group in the sea, Thailand"],
  ["https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg", "Koh Nang Yuan viewpoint"],
  ["https://cdn.trutravels.com/images/peru-rainbow4.jpg", "Rainbow Mountain, Peru"],
];

const SHOTS = [
  ["Faces, Not Just Views", "A sunset is a sunset. A sunset with your group in it is the trip."],
  ["The Unposed Ones", "Mid-laugh on the boat beats everyone lined up and squinting."],
  ["Straight Off The Phone", "Don’t filter or crop — we’d rather have the original file."],
  ["Landscape And Portrait", "Both get used, in different places. Send whatever you have."],
];

/** Background icon — same treatment as the About and careers pages. */
function Wm({ src, className }: { src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/bg-assets/${src}.svg`}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none select-none absolute brightness-0 invert ${className}`}
    />
  );
}

const EYEBROW = "text-tru-pink text-[11px] font-bold uppercase tracking-[0.3em] mb-3 font-heading";
const H2 = "text-4xl sm:text-5xl font-black text-white uppercase font-heading tracking-tight leading-[0.95]";

export default function ShareYourPhotosPage() {
  return (
    <>
      <Breadcrumbs noHero crumbs={sectionCrumbs(ESSENTIALS, "Share Your Photos")} />
      {/* ========================================================
          STRIP + PITCH
          ======================================================== */}
      <section className="relative overflow-hidden pt-10 pb-16">
        <Wm src="sun" className="-right-16 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06]" />
        <Wm src="good-vibes" className="-left-16 top-[38%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 overflow-hidden rounded-[14px]">
            {STRIP.map(([src, alt], i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={alt}
                loading="lazy"
                className={`block w-full aspect-[4/3] object-cover ${i === 2 ? "hidden sm:block" : ""}`}
              />
            ))}
          </div>

          <div className="mt-10">
            <p className={EYEBROW}>TruTraveller Photo Uploads</p>
            <h1 className={H2}>
              Upload Your Best <span className="text-tru-pink">Photos From Tour</span>
            </h1>
            <p className="text-gray-300 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
              Got some amazing photos from your last Tru trip? We want to see them. Your selfies, your group pics, your
              10/10 content &mdash; the stuff that shows people what travelling with Tru is actually like.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          THE UPLOAD ITSELF
          ======================================================== */}
      <section id="upload" className="relative overflow-hidden border-t border-white/5 pt-14 pb-24">
        <Wm src="mask" className="-left-16 -top-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <Wm src="peru-bird" className="-right-12 -bottom-8 w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <UploadDropzone />
        </div>
      </section>

      {/* ========================================================
          WHAT WORKS BEST
          ======================================================== */}
      <section className="relative overflow-hidden border-t border-white/5 pt-20 pb-24">
        <Wm src="bali-flower" className="-right-16 top-0 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.06]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className={EYEBROW}>What Works Best</p>
          <h2 className={H2}>
            The Ones We <span className="text-tru-pink">Always Use</span>
          </h2>
          <p className="text-gray-300 mt-5 mb-8 text-base sm:text-lg leading-relaxed max-w-2xl">
            No pressure &mdash; send whatever you have. But if you&apos;re choosing between a hundred, these are the
            ones that end up on the site.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SHOTS.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-[1.1rem]">
                <p className="text-tru-pink font-heading text-[0.8125rem] font-black uppercase tracking-[0.03em] mb-1.5">
                  {t}
                </p>
                <p className="text-gray-400 text-[0.8125rem] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SMALL PRINT
          ======================================================== */}
      <section className="relative overflow-hidden border-t border-white/5 pt-20 pb-24">
        <Wm src="tru-logo" className="-left-16 -bottom-8 w-[240px] sm:w-[360px] lg:w-[500px] opacity-[0.05]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className={EYEBROW}>The Small Print</p>
          <h2 className={H2}>
            How The <span className="text-tru-pink">Draw Works</span>
          </h2>
          <div className="mt-6 max-w-[46rem] space-y-4 text-gray-300 text-base leading-relaxed">
            <p>
              Everyone who uploads goes into a draw for £250 travel credit, drawn every three months. One entry per
              person per draw, however many photos you send.
            </p>
            <p>
              We may use what you send on the website, on social and in our emails, and we&apos;ll tag you where we can.
              We won&apos;t sell your photos or pass them to anyone else. If you change your mind, email{" "}
              <a href="mailto:hello@trutravels.com" className="text-tru-pink">hello@trutravels.com</a> and we&apos;ll
              take them down.
            </p>
            <p>
              Make sure everyone in the shot is happy to be in it &mdash; that&apos;s the one thing we can&apos;t check
              for you. Full{" "}
              <Link href="/terms-conditions" className="text-tru-pink">terms and conditions</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
