"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

function TrustpilotStars({ size = "md" }: { size?: "sm" | "md" }) {
  const tile = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const star = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${tile} bg-[#00B67A] flex items-center justify-center`}>
          <svg className={`${star} text-white`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

type TextReview = {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
};

const textReviews: TextReview[] = [
  {
    id: "tr1",
    title: "Memories for a lifetime",
    body: "Smile was the best tour guide and nurse! Always taking care of me and looking out for the whole group. Always had clear daily plans with timings on the WhatsApp chat and information about the local area. We had a mix of culture with the temples then beaches and nightlife. It was perfect for me and met the most amazing people.",
    author: "Emily",
    date: "Apr 2026",
  },
  {
    id: "tr2",
    title: "SMILE is the best",
    body: "Smile was a great tour guide on the Thailand island tour! Would always go out his way to help with everything!",
    author: "Hannah",
    date: "Apr 2026",
  },
  {
    id: "tr3",
    title: "Best trip of my life",
    body: "Honestly, this trip exceeded every expectation. From the boat parties to the floating bungalows in Khao Sok, every day was an absolute highlight. The group of strangers became my closest mates by day three. Worth every penny.",
    author: "Tom",
    date: "Mar 2026",
  },
  {
    id: "tr4",
    title: "Unforgettable two weeks",
    body: "I came solo and never felt alone for a second. The mix of structured days and free time was spot on. Koh Tao, Koh Phangan, Khao Sok — every stop felt different. Already looking at the next Tru trip.",
    author: "Priya",
    date: "Mar 2026",
  },
  {
    id: "tr5",
    title: "Couldn't recommend more",
    body: "Brilliant trip. Brilliant leaders. Brilliant group. The Full Moon Party was wild but the small moments — sunrise on the ferry, beach BBQs — are what I keep coming back to.",
    author: "Marcus",
    date: "Feb 2026",
  },
];

function TextReviewCard({ review }: { review: TextReview }) {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/5 p-5 sm:p-6 h-full flex flex-col">
      <TrustpilotStars size="sm" />
      <h4 className="text-white font-bold text-base sm:text-lg mt-4 mb-3 font-heading">
        {review.title}
      </h4>
      <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
        {review.body}
      </p>
      <p className="text-white font-bold text-sm">
        {review.author} <span className="text-gray-400 font-normal">— {review.date}</span>
      </p>
    </div>
  );
}

export default function TripReviews() {
  return (
    <div className="space-y-8">
      {/* Trustpilot widget */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <TrustpilotStars />
          <span className="text-white font-semibold text-sm">305 reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Rated</span>
          <span className="text-white font-bold text-sm">Excellent</span>
          <span className="text-gray-400 text-xs">on</span>
          <svg className="h-5" viewBox="0 0 120 30" fill="none">
            <path d="M16.5 0L20.2 11.4H32.1L22.5 18.4L26.1 29.8L16.5 22.8L6.9 29.8L10.5 18.4L0.9 11.4H12.8L16.5 0Z" fill="#00B67A" />
            <text x="38" y="21" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui">Trustpilot</text>
          </svg>
        </div>
      </div>

      {/* Text reviews carousel. No overflow-hidden here — Swiper clips its own
          slides internally, and clipping here would cut off the prev/next
          arrows that sit at the bleed edges (-left-5 / -right-5). */}
      <div className="text-review-carousel relative z-0 lg:w-[152%]">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          freeMode={{ enabled: true, sticky: false }}
          navigation={{
            nextEl: ".text-review-next",
            prevEl: ".text-review-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            1024: { slidesPerView: 2, spaceBetween: 24 },
          }}
          speed={600}
        >
          {textReviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <TextReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="text-review-prev absolute top-[calc(50%-20px)] -left-2 sm:-left-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="text-review-next absolute top-[calc(50%-20px)] -right-2 sm:-right-5 z-10 h-10 w-10 rounded-full bg-tru-navy/90 border border-white/10 flex items-center justify-center hover:border-tru-pink/40 transition-colors disabled:opacity-30 disabled:cursor-default">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
