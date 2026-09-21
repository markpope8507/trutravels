import Breadcrumbs from "@/components/breadcrumbs";
import { aboutCrumbs } from "@/lib/breadcrumbs";

export const metadata = {
  title: "Our Story — TruTravels",
  description: "How TruTravels started — the honest version, straight from the founders.",
};

export default function OurStoryPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[540px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1920&q=80"
          alt="Two backpackers on a beach at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tru-navy/30 via-tru-navy/50 to-tru-navy/95" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="max-w-xl text-right">
            <p className="text-tru-pink text-xs font-bold uppercase tracking-[0.3em] mb-5 font-heading">
              Our Story
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase font-heading leading-[0.95] mb-6">
              How We<br />Started
            </h1>
            <div className="ml-auto h-px w-16 bg-tru-pink mb-6" />
            <p className="text-gray-200 text-base sm:text-lg italic leading-relaxed font-light max-w-md ml-auto">
              &ldquo;No timelines, no awards reels, no polished press kit. Just the honest version of how this whole thing started.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={aboutCrumbs("Our Story")} />

      {/* ========================================================
          STORY CONTENT
          ======================================================== */}
      {/* No border-t: the breadcrumb bar above already draws that line, and
          two hairlines a row apart read as a mistake. */}
      <section className="relative overflow-hidden pt-24 pb-24">
        {/* Line-art watermarks behind the column, spread down the length of the
            story — same treatment as the Essentials and account pages. */}
        <img src="/bg-assets/sun.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -top-8 w-[260px] sm:w-[400px] lg:w-[560px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/bali-flower.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[14%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/eyes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-12 sm:-right-20 lg:-right-24 top-[32%] w-[200px] sm:w-[320px] lg:w-[420px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/komodo-dragon.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-32 top-[50%] w-[240px] sm:w-[380px] lg:w-[520px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/good-vibes.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-28 top-[68%] w-[220px] sm:w-[340px] lg:w-[460px] opacity-[0.06] brightness-0 invert" />
        <img src="/bg-assets/peru-bird.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -left-16 sm:-left-24 lg:-left-28 top-[84%] w-[200px] sm:w-[320px] lg:w-[440px] opacity-[0.05] brightness-0 invert" />
        <img src="/bg-assets/tru-logo.svg" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -right-16 sm:-right-24 lg:-right-32 -bottom-8 w-[200px] sm:w-[300px] lg:w-[420px] opacity-[0.04] brightness-0 invert" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Back in 2006, I was saving for a house in London.
          </p>

          <p>That was the plan. Work hard. Save money. Follow the path.</p>

          <p>
            And it was all coming together. I&apos;d found a house, had an offer agreed and was
            getting ready to move in.
          </p>

          <p>Then, at the eleventh hour, it fell through.</p>

          <p>
            After all that saving and planning, I was back where I&apos;d started. Only now, I
            wasn&apos;t so sure I wanted the same thing anymore.
          </p>

          <p>
            So instead of finding another house, I booked a one-way ticket to Australia. What I
            thought would be a few months away became three years. During that time, I discovered
            something that would change my life forever.
          </p>

          <p>
            Travel isn&apos;t really about the places you visit. It&apos;s about the person you become because of them. The confidence you build. The people you meet. The perspectives you gain. The moments that remind you there&apos;s a bigger world beyond your comfort zone.
          </p>

          <p>It&apos;s also about the connections you make.</p>

          <div className="flex justify-center my-10">
            <img
              src="/images/mark-joe-story-2025.png"
              alt="Mark and Joe on the road, 2007"
              className="w-full sm:w-[640px] max-w-full rotate-[-2deg] shadow-2xl shadow-black/40"
            />
          </div>

          <p>
            Whilst travelling, I met a guy called Joe. At the time, neither of us knew how important that friendship would become. Eventually our travels came to an end and we both returned to the UK. Life moved on, careers happened and, like so many friendships made on the road, we lost touch.
          </p>

          <p>Then, a few years later, we randomly met up for a beer.</p>

          <p>
            As travellers often do, we started talking about old stories, old adventures and some of the best years of our lives. And one question kept coming up: Why did travel have such a profound impact on us?
          </p>

          <p>
            The answer was simple.<br />
            Travel had changed us.<br />
            It had given us confidence.<br />
            Perspective.<br />
            Friendships.<br />
            Experiences we&apos;d carry with us forever.
          </p>

          <p>
            And it made us wonder: What if we could create experiences that gave other people that same feeling? That conversation became TruTravels.
          </p>

          <p>Today, we&apos;re driven by the same belief that inspired us from the very beginning:</p>

          {/* Break after "power" so this sits on two lines — "power to" on the
              first wrapped to three. The pink stays on "change lives". */}
          <p className="border-l-2 border-tru-pink pl-6 my-8 text-4xl sm:text-5xl font-black uppercase font-heading leading-[0.95]">
            <span className="block text-white">Travel has the power</span>
            <span className="block text-white">
              to <span className="text-tru-pink">change lives.</span>
            </span>
          </p>

          <p>
            We&apos;ve seen it happen thousands of times. We&apos;ve watched strangers become lifelong friends.<br />
            We&apos;ve seen people discover confidence they didn&apos;t know they had. We&apos;ve seen journeys become turning points.
          </p>

          <p>Because sometimes all it takes is one decision.</p>

          <p>
            A decision to ignore the script.<br />
            To step outside your comfort zone.<br />
            To choose possibility over predictability.
          </p>

          <p className="text-white text-xl sm:text-2xl font-bold font-heading leading-tight pt-6">
            I never got the house.
          </p>

          <p>
            But by taking a chance on something different, I found friendships, purpose, perspective and experiences that shaped the rest of my life.
          </p>

          <p className="text-white font-bold">That&apos;s what travel gave me.</p>

          <p className="text-tru-pink text-xl sm:text-2xl font-black uppercase tracking-wide font-heading">
            And that&apos;s what we&apos;ve spent the last decade trying to give others.
          </p>

          <p className="text-white text-3xl sm:text-4xl font-handwriting pt-8">Mark x</p>
        </div>
      </section>
    </>
  );
}

