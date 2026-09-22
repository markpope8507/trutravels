import type Anthropic from "@anthropic-ai/sdk";
import { trips } from "@/lib/data";
import { tripUrl } from "@/lib/utils";
import { getAvailabilityTier } from "@/lib/availability";

// ---------------------------------------------------------------------------
// Tool definitions. `strict: true` means the API guarantees the input matches
// the schema, so the executors below can trust their arguments.
// ---------------------------------------------------------------------------

export const TRUD_TOOLS: Anthropic.Beta.BetaToolUnion[] = [
  {
    name: "get_departures",
    description:
      "Look up live departure dates, prices and availability for a TruTravels trip from the website's own data. Call this whenever the visitor asks when a trip runs, what it costs, whether a date has space, what the next departure is, or anything about specific dates or prices. Never answer those from memory.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        trip: {
          type: "string",
          description:
            "The trip the visitor is asking about, as they said it (e.g. 'Thailand Island Hopper', 'Bali', 'Morocco'). Partial names and country names are fine.",
        },
      },
      required: ["trip"],
      additionalProperties: false,
    },
  },
  {
    name: "join_waitlist",
    description:
      "Add the visitor to the priority waitlist for a sold-out departure, or to the 'new dates' list for a trip. Only call this once you have the visitor's email address. Call it when a departure is fully booked and they want a spot, or when they ask to be told when new dates are released.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        trip: { type: "string", description: "Trip name." },
        date: {
          type: "string",
          description: "The departure date they want, or 'new dates' if they are waiting for a release.",
        },
        email: { type: "string", description: "The visitor's email address." },
        name: { type: "string", description: "The visitor's first name, or an empty string if not given." },
      },
      required: ["trip", "date", "email", "name"],
      additionalProperties: false,
    },
  },
  {
    name: "handoff_to_human",
    description:
      "Hand the conversation to the TruTravels support team. Call this for anything about an existing booking (changes, refunds, payment problems, linking friends' bookings, complaints, medical or accessibility needs), when the visitor asks for a person, when they seem upset, or when the knowledge base genuinely does not cover the question. After calling it, tell the visitor in one or two sentences what happens next.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          enum: ["existing_booking", "payment_issue", "complaint", "not_in_knowledge_base", "visitor_requested", "other"],
          description: "Why a human is needed.",
        },
        summary: {
          type: "string",
          description: "One or two sentences summarising what the visitor needs, so the team doesn't ask them to repeat it.",
        },
      },
      required: ["reason", "summary"],
      additionalProperties: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Executors. Each returns the text that goes back to the model, plus an
// optional UI event the chat panel can render (handoff card, waitlist tick).
// ---------------------------------------------------------------------------

export type TrudUiEvent =
  | { t: "handoff"; reason: string; summary: string }
  | { t: "waitlist"; trip: string; date: string; email: string }
  | { t: "departures"; trip: string; url: string };

export type ToolOutcome = { result: string; event?: TrudUiEvent };

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Find the best-matching bookable trip for a free-text name. */
export function findTrips(query: string) {
  const q = normalise(query);
  const words = q.split(" ").filter((w) => w.length > 2);
  const bookable = trips.filter((t) => t.departures && t.departures.length > 0);
  return bookable
    .map((t) => {
      const title = normalise(t.title);
      const dest = normalise(t.destination);
      let score = 0;
      if (title === q) score += 100;
      if (title.includes(q)) score += 40;
      for (const w of words) {
        if (title.includes(w)) score += 10;
        if (dest.includes(w)) score += 6;
      }
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.t);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getDepartures(input: { trip: string }): ToolOutcome {
  const matches = findTrips(input.trip);
  if (matches.length === 0) {
    return {
      result: `No bookable trip matched "${input.trip}". Ask the visitor which trip they mean, or suggest they browse /explore.`,
    };
  }
  if (matches.length > 1 && normalise(matches[0].title) !== normalise(input.trip)) {
    const options = matches.slice(0, 6).map((t) => `${t.title} (${t.duration}, ${t.destination})`);
    return {
      result: `Several trips match "${input.trip}". Ask the visitor which one they mean:\n- ${options.join("\n- ")}`,
    };
  }
  const trip = matches[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = (trip.departures ?? [])
    .filter((d) => new Date(d.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const lines = upcoming.slice(0, 12).map((d) => {
    const tier = getAvailabilityTier(d.spotsLeft, d.status);
    const status = d.status === "full" ? "Fully booked (waitlist)" : tier.label;
    const price = d.originalPrice && d.originalPrice > d.price ? `£${d.price} (was £${d.originalPrice})` : `£${d.price}`;
    return `- ${formatDate(d.date)}: ${price} per person, ${status}`;
  });
  const url = tripUrl(trip);
  const result = [
    `${trip.title} — ${trip.duration}, ${trip.startLocation ?? "?"} to ${trip.endLocation ?? "?"}. Deposit £${trip.depositPrice ?? 200}.`,
    upcoming.length === 0
      ? "No upcoming departures are listed right now. Offer the 'new dates' waitlist."
      : `Upcoming departures (${upcoming.length} listed; showing up to 12):\n${lines.join("\n")}`,
    `Trip page: ${url} (tell the visitor they can book or check dates there).`,
    "Quote at most three dates unless asked for more, and always mention the trip page.",
  ].join("\n");
  return { result, event: { t: "departures", trip: trip.title, url } };
}

function joinWaitlist(input: { trip: string; date: string; email: string; name: string }): ToolOutcome {
  // Prototype: log server-side. Wire this to the CRM / booking system waitlist
  // when the real site's backend is chosen.
  console.log("[trud] waitlist", JSON.stringify(input));
  return {
    result: `Added ${input.email} to the waitlist for ${input.trip} (${input.date}). Confirm to the visitor and remind them a priority booking link holds a spot for 24 hours if one opens up.`,
    event: { t: "waitlist", trip: input.trip, date: input.date, email: input.email },
  };
}

function handoffToHuman(input: { reason: string; summary: string }): ToolOutcome {
  console.log("[trud] handoff", JSON.stringify(input));
  return {
    result:
      "Handoff recorded. The visitor now sees buttons for live chat (9:30am–5pm GMT, Mon–Sat), email and phone. Tell them briefly that the team will pick it up from here and that they don't need to repeat themselves.",
    event: { t: "handoff", reason: input.reason, summary: input.summary },
  };
}

export function runTool(name: string, input: unknown): ToolOutcome {
  switch (name) {
    case "get_departures":
      return getDepartures(input as { trip: string });
    case "join_waitlist":
      return joinWaitlist(input as { trip: string; date: string; email: string; name: string });
    case "handoff_to_human":
      return handoffToHuman(input as { reason: string; summary: string });
    default:
      return { result: `Unknown tool ${name}` };
  }
}
