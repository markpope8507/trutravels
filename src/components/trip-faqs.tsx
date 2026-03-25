"use client";

import { useState } from "react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Where does the trip start & finish?",
    answer: "The trip begins in Bangkok and finishes in Phuket.",
  },
  {
    question: "Which airport do I need to fly into?",
    answer: "You should arrive at Suvarnabhumi (BKK) which is the main international airport, or alternatively you can fly into Don Muang (DMK).",
  },
  {
    question: "Are airport transfers included in the price?",
    answer: "Airport pickup on arrival day is included. If you need additional transfers, these can be arranged through your account or by contacting the sales team at info@trutravels.com up to 30 days before departure.",
  },
  {
    question: "What is the closest airport to the end destination?",
    answer: "The closest airport is Phuket International Airport (HKT).",
  },
  {
    question: "How do I return to Bangkok and what's the cost?",
    answer: "Return transportation isn't included. A ferry and bus combination costs around $40 USD (approximately 12 hours). Flying from Phuket costs roughly $80 USD but takes much less time.",
  },
  {
    question: "What accommodation is provided?",
    answer: "The accommodation for this trip is all twin share private rooms across a mix of hotels, floating bungalows, and beach bungalows.",
  },
  {
    question: "What currency is used?",
    answer: "The currency in Thailand is Thai Baht (THB). ATMs are widely available and most places accept card payments in tourist areas.",
  },
  {
    question: "Is my money protected?",
    answer: "Yes. TruTravels is both ABTA and ATOL registered, ensuring your money is fully financially protected.",
  },
  {
    question: "Do you have age limits?",
    answer: "The maximum age for this trip is 45. Our Backpacker trips are exclusively for ages 18–29. Classic trips welcome anyone 18–45.",
  },
  {
    question: "Can you accommodate dietary requirements?",
    answer: "Absolutely. Just let us know about any dietary requirements when you book and we'll make sure everything is sorted.",
  },
  {
    question: "Do many travellers go solo?",
    answer: "Roughly 65% of our TruTravellers come solo! Our trips are specifically designed with solo travellers in mind — you'll make lifelong friends from day one.",
  },
  {
    question: "Are there any visa requirements?",
    answer: "Visitors must register for a Digital Arrival Card online within 3 days of arrival. Check the latest visa requirements for your nationality before travelling.",
  },
];

export default function TripFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-[10px] border border-white/10 bg-white/5 overflow-hidden"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors duration-200"
          >
            <span className="text-white text-sm font-semibold pr-4">{faq.question}</span>
            <svg
              className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-5 pb-4">
              <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
