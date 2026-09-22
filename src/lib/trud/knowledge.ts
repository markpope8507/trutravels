// Tru.D knowledge base — loaded from src/data/trud-knowledge.json, which is
// generated from the "Tru.D FAQ Knowledge Base" Google Sheet by
// `node scripts/sync-trud-knowledge.mjs`. Edit the sheet, re-run the script,
// redeploy. Never hand-edit the JSON.
import knowledge from "@/data/trud-knowledge.json";

export type TrudFaq = {
  id: string;
  category: string;
  topic: string;
  q: string;
  a: string;
  applies: string;
  risk: string;
};

export type TrudTourFacts = {
  trip: string;
  country: string;
  days: string;
  starts: string;
  ends: string;
  style: string;
  transport_included: string;
  meals_included: string;
  key_moments_experience_type_where_tagged: string;
  not_included: string;
  entry___visa_note: string;
  other_notes: string;
};

export type TrudKnowledge = {
  generated: string;
  source: string;
  faqs: TrudFaq[];
  tours: TrudTourFacts[];
  voice: { rule: string; detail: string }[];
};

export const KNOWLEDGE = knowledge as TrudKnowledge;

/** Render the FAQ rows as compact text for the system prompt. */
export function renderFaqs(): string {
  const byCategory = new Map<string, TrudFaq[]>();
  for (const f of KNOWLEDGE.faqs) {
    if (!byCategory.has(f.category)) byCategory.set(f.category, []);
    byCategory.get(f.category)!.push(f);
  }
  const out: string[] = [];
  for (const [category, faqs] of byCategory) {
    out.push(`\n## ${category}`);
    for (const f of faqs) {
      const applies = f.applies && f.applies !== "All trips" ? ` (applies to: ${f.applies})` : "";
      out.push(`[${f.id}] Q: ${f.q}${applies}\nA: ${f.a}`);
    }
  }
  return out.join("\n");
}

/** Render the per-trip reference table (no hotels, times, dates or prices). */
export function renderTours(): string {
  return KNOWLEDGE.tours
    .map((t) =>
      [
        `### ${t.trip} (${t.country}, ${t.days} days, ${t.style}) — starts ${t.starts}, ends ${t.ends}`,
        `Transport: ${t.transport_included}`,
        `Meals: ${t.meals_included}`,
        `Key moments: ${t.key_moments_experience_type_where_tagged}`,
        `Not included: ${t.not_included}`,
        `Entry: ${t.entry___visa_note}`,
        t.other_notes ? `Notes: ${t.other_notes}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}

/** Cheap keyword fallback used by the UI when the API is not configured. */
export function keywordSearch(query: string, limit = 5): TrudFaq[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return [];
  return KNOWLEDGE.faqs
    .map((f) => {
      const text = `${f.q} ${f.a} ${f.topic} ${f.applies}`.toLowerCase();
      const score = words.reduce((s, w) => s + (f.q.toLowerCase().includes(w) ? 3 : text.includes(w) ? 1 : 0), 0);
      return { f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.f);
}
