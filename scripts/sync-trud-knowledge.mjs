#!/usr/bin/env node
// Pull the "Tru.D FAQ Knowledge Base" Google Sheet and regenerate
// src/data/trud-knowledge.json, which the Ask Tru.D assistant reads.
//
//   node scripts/sync-trud-knowledge.mjs
//
// The sheet must be shared as "Anyone with the link can view" (or set
// TRUD_SHEET_ID to a copy that is). Only rows whose Status column is empty or
// "Approved" are published, so the team can draft without going live.
//
// Sheet: https://docs.google.com/spreadsheets/d/1un5smrZ6OdwKSQi-ktMBHfHAtliBoLm49Inuaf6nWWo

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SHEET_ID = process.env.TRUD_SHEET_ID ?? "1un5smrZ6OdwKSQi-ktMBHfHAtliBoLm49Inuaf6nWWo";
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "data", "trud-knowledge.json");

async function fetchSheet(name) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet "${name}" fetch failed: ${res.status}. Is the sheet shared with 'Anyone with the link'?`);
  const text = await res.text();
  if (text.trim().startsWith("<")) throw new Error(`Sheet "${name}" returned HTML, not CSV. Check sharing settings.`);
  return parseCsv(text);
}

// Minimal RFC-4180 CSV parser (handles quoted fields with commas/newlines).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v && v.trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const slug = (s) => s.toLowerCase().replace(/ /g, "_").replace(/\//g, "_").replace(/[()]/g, "");

const master = await fetchSheet("FAQ – Master");
const faqs = master
  .filter((r) => r.ID && r.Question && !/^(draft|hold|rejected)$/i.test(r.Status ?? ""))
  .map((r) => ({
    id: r.ID,
    category: r.Category,
    topic: r.Topic,
    q: r.Question,
    a: r["Answer (Tru.D voice)"],
    applies: r["Applies to"],
    risk: r["Content risk"],
  }));

const tourRows = await fetchSheet("Tour quick facts");
const tours = tourRows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [slug(k), v])));

const voiceRows = await fetchSheet("Voice guide");
const voice = voiceRows.map((r) => ({ rule: r.Rule, detail: r["What it means for FAQ answers"] }));

const out = {
  generated: new Date().toISOString().slice(0, 10),
  source: `Tru.D FAQ Knowledge Base (Google Sheet ${SHEET_ID})`,
  faqs,
  tours,
  voice,
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${faqs.length} FAQs, ${tours.length} trips, ${voice.length} voice rules -> ${OUT}`);
