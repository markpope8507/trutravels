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

      {/* ========================================================
          STORY CONTENT
          ======================================================== */}
      <section className="pt-24 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed">
          <p className="text-2xl sm:text-3xl text-white font-black uppercase font-heading leading-tight">
            Back in 2006, I was saving for a house in London.
          </p>

          <p className="text-lg sm:text-xl text-gray-200 italic leading-snug">
            That was the plan.
          </p>

          <p>
            Work hard.<br />
            Save money.<br />
            Follow the path.
          </p>

          <p>Then one day, the plan fell apart.</p>

          <p>
            And instead of finding another house, I booked a one-way ticket to Australia.<br />
            What I thought would be a few months away became three years.
          </p>

          <p>During that time, I discovered something that would change my life forever.</p>

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

          <p className="border-l-2 border-tru-pink pl-6 my-8 text-4xl sm:text-5xl font-black uppercase font-heading leading-[0.95]">
            <span className="block text-white">Travel has the power to</span>
            <span className="block text-tru-pink">change lives.</span>
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

