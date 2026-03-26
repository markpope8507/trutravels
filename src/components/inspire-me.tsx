"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trips, Trip, experienceTypes, travelStyleConfig } from "@/lib/data";
import TravelStyleBadge from "@/components/travel-style-badge";

// ============================================================
// QUIZ DATA
// ============================================================

type QuizStep = {
  id: string;
  question: string;
  subtitle: string;
  type: "single" | "multi";
  options: { label: string; value: string; emoji: string }[];
};

const quizSteps: QuizStep[] = [
  {
    id: "region",
    question: "Where's calling you?",
    subtitle: "Pick the region that excites you most.",
    type: "single",
    options: [
      { label: "Southeast Asia", value: "Southeast Asia", emoji: "🌴" },
      { label: "South Asia", value: "South Asia", emoji: "🐘" },
      { label: "Central America", value: "Central America", emoji: "🌋" },
      { label: "Africa", value: "Africa", emoji: "🏜️" },
      { label: "Surprise Me", value: "any", emoji: "✨" },
    ],
  },
  {
    id: "vibe",
    question: "What's your travel vibe?",
    subtitle: "Choose as many as you like.",
    type: "multi",
    options: [
      { label: "Adventure & Adrenaline", value: "adventure", emoji: "⚡" },
      { label: "Culture & History", value: "culture", emoji: "🏛️" },
      { label: "Beach & Island Life", value: "beach", emoji: "🏝️" },
      { label: "Food & Street Eats", value: "food", emoji: "🍜" },
      { label: "Nightlife & Parties", value: "nightlife", emoji: "🎉" },
      { label: "Wellness & Yoga", value: "wellness", emoji: "🧘" },
    ],
  },
  {
    id: "energy",
    question: "What's your social energy?",
    subtitle: "There's no wrong answer.",
    type: "single",
    options: [
      { label: "Life of the party", value: "high", emoji: "🔥" },
      { label: "Down for anything", value: "medium", emoji: "🤙" },
      { label: "Chill & go with the flow", value: "low", emoji: "🌊" },
    ],
  },
  {
    id: "comfort",
    question: "How far outside your comfort zone?",
    subtitle: "Be honest — we won't judge.",
    type: "single",
    options: [
      { label: "Push me to the limit", value: "extreme", emoji: "🚀" },
      { label: "Challenge me a little", value: "moderate", emoji: "💪" },
      { label: "Keep it comfortable", value: "easy", emoji: "😌" },
    ],
  },
  {
    id: "duration",
    question: "How long have you got?",
    subtitle: "Pick your ideal trip length.",
    type: "single",
    options: [
      { label: "Under 10 days", value: "short", emoji: "⏱️" },
      { label: "10–12 days", value: "medium", emoji: "📅" },
      { label: "2 weeks+", value: "long", emoji: "🗓️" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget vibe?",
    subtitle: "All our trips are incredible value.",
    type: "single",
    options: [
      { label: "Ballin' on a budget", value: "low", emoji: "💰" },
      { label: "Mid-range & flexible", value: "mid", emoji: "💳" },
      { label: "Treat myself", value: "high", emoji: "✨" },
    ],
  },
];

// ============================================================
// MATCHING LOGIC
// ============================================================

function scoreTrip(trip: Trip, answers: Record<string, string | string[]>): number {
  let score = 0;

  // Region match
  const region = answers.region as string;
  if (region === "any" || trip.region === region) score += 30;

  // Duration match
  const duration = answers.duration as string;
  const days = parseInt(trip.duration);
  if (duration === "short" && days <= 10) score += 15;
  if (duration === "medium" && days >= 10 && days <= 12) score += 15;
  if (duration === "long" && days >= 13) score += 15;

  // Budget match
  const budget = answers.budget as string;
  if (budget === "low" && trip.price < 850) score += 10;
  if (budget === "mid" && trip.price >= 800 && trip.price <= 1000) score += 10;
  if (budget === "high" && trip.price > 950) score += 10;

  // Vibe match (keyword matching against trip content)
  const vibes = (answers.vibe as string[]) || [];
  const tripText = `${trip.title} ${trip.tagline} ${trip.description} ${trip.highlights.join(" ")}`.toLowerCase();
  const vibeKeywords: Record<string, string[]> = {
    adventure: ["hike", "trek", "surf", "zip", "raft", "climb", "kayak"],
    culture: ["temple", "palace", "history", "ancient", "local", "tradition", "museum"],
    beach: ["beach", "island", "snorkel", "coast", "marine", "bay", "lagoon"],
    food: ["food", "cook", "market", "street food", "eat", "cuisine", "pad thai"],
    nightlife: ["party", "full moon", "rooftop", "bar", "nightlife", "buzz"],
    wellness: ["yoga", "wellness", "retreat", "spa", "breathwork", "sunrise"],
  };
  vibes.forEach((vibe) => {
    const keywords = vibeKeywords[vibe] || [];
    if (keywords.some((kw) => tripText.includes(kw))) score += 10;
  });

  // Experience type match
  const expType = answers.experience as string;
  const expKeywords: Record<string, string[]> = {
    "local-lens": ["local", "cook", "family", "neighborhood", "artisan", "village"],
    "rise-up": ["summit", "hike", "climb", "challenge", "trek", "raft"],
    "bucket-list": ["iconic", "famous", "legendary", "must-see", "ha long", "angkor"],
    "tru-ly-unique": ["exclusive", "private", "secret", "hidden", "vip"],
    unplugged: ["sunrise", "sunset", "nature", "peaceful", "detox", "stargazing"],
  };
  const expKws = expKeywords[expType] || [];
  if (expKws.some((kw) => tripText.includes(kw))) score += 15;

  return score;
}

function getRecommendations(answers: Record<string, string | string[]>): Trip[] {
  const scored = trips.map((trip) => ({
    trip,
    score: scoreTrip(trip, answers),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.trip);
}

// ============================================================
// COMPONENTS
// ============================================================

function InspireMeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[10px] bg-tru-pink px-8 py-3.5 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 w-56"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      Inspire Me
    </button>
  );
}

function InspireMeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Trip[]>([]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(0);
        setAnswers({});
        setShowResults(false);
        setResults([]);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = quizSteps[step];
  const totalSteps = quizSteps.length;
  const progress = showResults ? 100 : ((step + 1) / totalSteps) * 100;

  const handleSelect = (value: string) => {
    if (currentStep.type === "multi") {
      const current = (answers[currentStep.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentStep.id]: updated });
    } else {
      const newAnswers = { ...answers, [currentStep.id]: value };
      setAnswers(newAnswers);

      // Auto-advance on single select
      setTimeout(() => {
        if (step < totalSteps - 1) {
          setStep(step + 1);
        } else {
          setResults(getRecommendations(newAnswers));
          setShowResults(true);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setResults(getRecommendations(answers));
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentStep?.id];
    if (Array.isArray(answer)) return answer.includes(value);
    return answer === value;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-tru-navy rounded-[10px] border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {(step > 0 || showResults) && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <p className="text-tru-pink text-[10px] font-bold uppercase tracking-[0.2em] font-heading">
                Inspire Me
              </p>
              <p className="text-gray-500 text-xs">
                {showResults
                  ? "Your recommendations"
                  : `Step ${step + 1} of ${totalSteps}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-tru-pink transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showResults ? (
            /* ============ RESULTS ============ */
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading mb-2">
                Your <span className="text-tru-pink">Perfect</span> Trips
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Based on your answers, here&apos;s what we&apos;d recommend. These aren&apos;t just trips — they&apos;re your kind of extraordinary.
              </p>

              <div className="space-y-4">
                {results.map((trip, i) => (
                  <Link
                    key={trip.id}
                    href={`/destinations/${trip.id}`}
                    onClick={onClose}
                    className="group flex gap-4 bg-white/5 rounded-[10px] border border-white/5 hover:border-tru-pink/20 transition-all duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Match badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-tru-pink text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-heading">
                          {i === 0 ? "Top Match" : i === 1 ? "Great Fit" : "You'd Love"}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="py-4 pr-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TravelStyleBadge style={trip.travelStyle} size="small" />
                      </div>
                      <h3 className="text-white font-bold font-heading text-sm group-hover:text-tru-pink transition-colors mb-1">
                        {trip.title} &mdash; {trip.duration}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                        {trip.tagline}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-tru-pink text-[10px] font-bold uppercase tracking-wider font-heading">
                          {trip.region}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          {trip.originalPrice && (
                            <span className="text-gray-500 text-xs line-through">
                              &pound;{trip.originalPrice}
                            </span>
                          )}
                          <span className="text-tru-green font-bold text-sm">
                            &pound;{trip.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/destinations"
                  onClick={onClose}
                  className="flex-1 rounded-[10px] bg-tru-green px-6 py-3 text-sm font-semibold text-tru-navy hover:bg-tru-green-light transition-all duration-300 uppercase tracking-wider text-center"
                >
                  Browse All Trips
                </Link>
                <button
                  onClick={() => {
                    setStep(0);
                    setAnswers({});
                    setShowResults(false);
                    setResults([]);
                  }}
                  className="flex-1 rounded-[10px] border border-tru-pink px-6 py-3 text-sm font-semibold text-tru-pink hover:bg-tru-pink hover:text-white transition-all duration-300 uppercase tracking-wider text-center"
                >
                  Start Again
                </button>
              </div>
            </div>
          ) : (
            /* ============ QUIZ STEP ============ */
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-heading mb-1">
                {currentStep.question}
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                {currentStep.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center gap-3 rounded-[10px] border px-4 py-3.5 text-left transition-all duration-200 ${
                      isSelected(option.value)
                        ? "border-tru-pink bg-tru-pink/10 text-white"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                    {isSelected(option.value) && (
                      <svg className="h-4 w-4 text-tru-pink ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Next button for multi-select */}
              {currentStep.type === "multi" && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={
                      !answers[currentStep.id] ||
                      (Array.isArray(answers[currentStep.id]) &&
                        (answers[currentStep.id] as string[]).length === 0)
                    }
                    className="rounded-[10px] bg-tru-pink px-6 py-3 text-sm font-semibold text-white hover:bg-tru-pink-light transition-all duration-300 uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export { InspireMeButton, InspireMeModal };
