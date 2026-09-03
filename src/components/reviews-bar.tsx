import { PlatformLogo } from "@/components/platform-logos";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const PLATFORMS = ["Google", "Trustpilot", "TourRadar"] as const;

function Star({ fill = "#FBBC05" }: { fill?: string }) {
  return (
    <svg className="h-4 w-4 max-w-none shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill={fill} d={STAR_PATH} />
    </svg>
  );
}

function PartialStar() {
  return (
    <svg className="h-4 w-4 max-w-none shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="reviews-bar-star-4-9" x1="0" y1="0" x2="1" y2="0">
          <stop offset="70%" stopColor="#FBBC05" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.28)" />
        </linearGradient>
      </defs>
      <path fill="url(#reviews-bar-star-4-9)" d={STAR_PATH} />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-tru-pink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

export default function ReviewsBar() {
  return (
    <section
      aria-label="Reviews and booking protection"
      className="reviews-bar border-y border-white/10 bg-tru-navy px-4 py-3 text-white"
    >
      <div className="reviews-bar__viewport">
        <div className="reviews-bar__slide reviews-bar__slide--a">
          <div className="flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6">
            <div className="flex items-center gap-x-2 font-heading text-sm font-bold leading-none text-white sm:text-base">
              <span>22,000+</span>
              <span className="uppercase">REVIEWS</span>
            </div>

            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />

            <div className="flex items-center gap-2 font-heading text-sm font-bold leading-none text-white sm:text-base">
              <span>4.9</span>
              <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                <Star />
                <Star />
                <Star />
                <Star />
                <PartialStar />
              </span>
            </div>

            <span className="h-4 w-px bg-white/20" aria-hidden="true" />

            <div className="flex items-center gap-3 sm:gap-4">
              {PLATFORMS.map((name) => (
                <PlatformLogo
                  key={name}
                  name={name}
                  markClassName="h-4 w-4"
                  textClassName="hidden font-heading text-base font-bold leading-none text-white md:inline"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-bar__slide reviews-bar__slide--b">
          <div className="flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6">
            <div className="flex items-center gap-2 font-heading text-sm font-bold leading-none text-white sm:text-base">
              <ShieldIcon />
              <span className="hidden uppercase md:inline">Fully Protected</span>
              <span className="whitespace-nowrap md:hidden">Book with Confidence</span>
            </div>

            <span className="hidden h-4 w-px bg-white/20 md:block" aria-hidden="true" />

            <p className="hidden font-heading text-sm font-bold leading-none text-white md:block sm:text-base">
              ABTA &amp; ATOL protected - Book with Confidence
            </p>

            <span className="hidden h-4 w-px bg-white/20 md:block" aria-hidden="true" />

            <div className="flex items-center gap-3 sm:gap-4">
              <img src="/images/atol-logo.png" alt="ATOL Protected" className="h-7 w-auto sm:h-8" />
              <img
                src="/images/abta-logo.png"
                alt="ABTA — Travel With Confidence"
                className="h-7 w-auto sm:h-8"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
