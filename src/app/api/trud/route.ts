import Anthropic from "@anthropic-ai/sdk";
import { TRUD_INSTRUCTIONS, TRUD_KNOWLEDGE_BLOCK } from "@/lib/trud/prompt";
import { TRUD_TOOLS, runTool, type TrudUiEvent } from "@/lib/trud/tools";
import { cleanPath, describePage } from "@/lib/trud/context";

// Ask Tru.D — streaming support assistant.
//
// POST { messages: [{ role: "user" | "assistant", content: string }], page?: string }
//   `page` is the path the visitor is on; it becomes a system note after the
//   last user turn so trip pages get trip-specific answers.
// Responds with newline-delimited JSON events:
//   { t: "text", v: string }            streamed answer text
//   { t: "tool", name, status }         "start" | "done"
//   { t: "handoff" | "waitlist" | "departures", ... }   UI events from tools
//   { t: "done", usage }                end of turn
//   { t: "error", code, message }
//
// The knowledge base lives in the system prompt and is prompt-cached, so a
// turn only pays full price for the conversation itself.

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-opus-5";
const MAX_HISTORY = 20; // user+assistant turns kept per request
const MAX_TOOL_ROUNDS = 4;

type ClientMessage = { role: "user" | "assistant"; content: string };

// Very small in-memory rate limit: 30 turns per IP per 10 minutes. Enough for
// the prototype; replace with a shared store before a real launch.
const buckets = new Map<string, { n: number; reset: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { n: 1, reset: now + 10 * 60_000 });
    return false;
  }
  b.n += 1;
  return b.n > 30;
}

function line(obj: object) {
  return JSON.stringify(obj) + "\n";
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "not_configured", message: "Tru.D is not configured on this deployment." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited", message: "Slow down a touch — try again in a few minutes." }, { status: 429 });
  }

  let body: { messages?: ClientMessage[]; page?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request", message: "Invalid JSON." }, { status: 400 });
  }

  const incoming = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-MAX_HISTORY);

  if (incoming.length === 0 || incoming[incoming.length - 1].role !== "user") {
    return Response.json({ error: "bad_request", message: "Send at least one user message." }, { status: 400 });
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = incoming.map((m) => ({ role: m.role, content: m.content }));

  // Page context goes in the messages array (not the system prompt) so the
  // cached knowledge-base prefix stays byte-identical across pages.
  const pageNote = describePage(cleanPath(body.page));
  if (pageNote) messages.push({ role: "system", content: pageNote });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: object) => controller.enqueue(encoder.encode(line(obj)));
      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const msgStream = client.beta.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" },
            system: [
              { type: "text", text: TRUD_INSTRUCTIONS },
              { type: "text", text: TRUD_KNOWLEDGE_BLOCK, cache_control: { type: "ephemeral" } },
            ],
            tools: TRUD_TOOLS,
            messages,
          });

          msgStream.on("text", (delta) => send({ t: "text", v: delta }));

          const message = await msgStream.finalMessage();

          const usage = {
            input: message.usage.input_tokens,
            output: message.usage.output_tokens,
            cache_read: message.usage.cache_read_input_tokens ?? 0,
            cache_write: message.usage.cache_creation_input_tokens ?? 0,
          };
          console.log(`[trud] turn ${round} stop=${message.stop_reason} usage=${JSON.stringify(usage)}`);

          if (message.stop_reason === "refusal") {
            send({ t: "text", v: "That's one for the team rather than me. " });
            send({ t: "handoff", reason: "other", summary: "Tru.D declined to answer." } satisfies TrudUiEvent);
            send({ t: "done", usage });
            break;
          }

          const toolUses = message.content.filter(
            (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
          );

          // A tool input cut off at max_tokens can still parse as a valid
          // partial object; never run a tool from a truncated turn.
          if (message.stop_reason === "max_tokens" && toolUses.length > 0) {
            throw new Error("tool input truncated (max_tokens)");
          }

          if (message.stop_reason !== "tool_use" || toolUses.length === 0) {
            send({ t: "done", usage });
            break;
          }

          messages.push({ role: "assistant", content: message.content });

          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            send({ t: "tool", name: tu.name, status: "start" });
            const outcome = runTool(tu.name, tu.input);
            if (outcome.event) send(outcome.event);
            send({ t: "tool", name: tu.name, status: "done" });
            results.push({ type: "tool_result", tool_use_id: tu.id, content: outcome.result });
          }
          messages.push({ role: "user", content: results });

          if (round === MAX_TOOL_ROUNDS) {
            send({ t: "text", v: "I've got a bit tangled up there. Let me get a human to help." });
            send({ t: "handoff", reason: "other", summary: "Tool loop limit reached." } satisfies TrudUiEvent);
            send({ t: "done", usage });
          }
        }
      } catch (err) {
        let code = "error";
        let msg = "Something went wrong on my end. Try again, or reach the team below.";
        if (err instanceof Anthropic.RateLimitError) {
          code = "rate_limited";
          msg = "I'm a bit busy right now. Give it a minute and try again.";
        } else if (err instanceof Anthropic.AuthenticationError) {
          code = "not_configured";
          msg = "Tru.D isn't configured on this deployment yet.";
        } else if (err instanceof Anthropic.APIError) {
          console.error("[trud] API error", err.status, err.message);
        } else {
          console.error("[trud] error", err);
        }
        send({ t: "error", code, message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
