import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 9334;
const OUT = "/tmp/tt-search-verify";
await mkdir(OUT, { recursive: true });

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=/tmp/tt-chrome-profile-search",
    "--no-first-run",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitPort() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return;
    } catch {}
    await delay(150);
  }
  throw new Error("chrome debug port not ready");
}

await waitPort();

const created = await fetch(`http://127.0.0.1:${PORT}/json/new?http://localhost:3000`, { method: "PUT" });
const target = await created.json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
};

function send(method, params = {}) {
  const n = ++id;
  return new Promise((resolve, reject) => {
    pending.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000/" });
await delay(2000);

async function evalExpr(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails, null, 2));
  return r.result.value;
}

async function shot(name) {
  const r = await send("Page.captureScreenshot", { format: "png" });
  const path = `${OUT}/${name}.png`;
  await writeFile(path, Buffer.from(r.data, "base64"));
  return path;
}

const opened = await evalExpr(`
  const btn = document.querySelector('[aria-label="Search trips, destinations and stories"]');
  if (!btn) return "NO_BUTTON";
  btn.click();
  return "OPENED";
`);
await delay(400);

const emptyLabels = await evalExpr(`
  [...document.querySelectorAll('a')].map(a => a.textContent.trim()).filter(t =>
    ["Thailand", "Bali Experience", "Tours for solo travellers", "Best Places to Travel in August"].includes(t)
  );
`);
const emptyHrefs = await evalExpr(`
  [...document.querySelectorAll('a')].filter(a =>
    ["Thailand", "Bali Experience", "Tours for solo travellers", "Best Places to Travel in August"].includes(a.textContent.trim())
  ).map(a => ({ label: a.textContent.trim(), href: a.getAttribute("href") }));
`);
const emptyDesktop = await shot("empty-desktop");

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});
await delay(250);
const emptyMobile = await shot("empty-mobile-390");

await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await delay(200);

await evalExpr(`
  const input = document.querySelector('input[placeholder="Search trips, destinations, blog..."]');
  if (!input) throw new Error("no input");
  const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  native.call(input, "thailand");
  input.dispatchEvent(new Event("input", { bubbles: true }));
`);
await delay(400);

const overlayText = await evalExpr(`
  const overlay = [...document.querySelectorAll("div")].find(d => d.className.includes("z-[100]"));
  return overlay ? overlay.innerText : "NO_OVERLAY";
`);
const pills = await evalExpr(`
  const overlay = [...document.querySelectorAll("div")].find(d => d.className.includes("z-[100]"));
  if (!overlay) return [];
  return [...overlay.querySelectorAll("span")].map(s => s.textContent.trim()).filter(t =>
    ["Trip", "Destination", "Blog", "Travel Style", "Deal", "Page"].includes(t)
  );
`);
const destHref = await evalExpr(`
  const links = [...document.querySelectorAll("a")];
  const dest = links.find(a => a.getAttribute("href") === "/destinations/asia/thailand");
  return dest ? dest.getAttribute("href") : null;
`);
const headings = await evalExpr(`
  [...document.querySelectorAll("p")].filter(p =>
    p.className.includes("tracking-[0.2em]") && p.className.includes("text-tru-pink")
  ).map(p => p.textContent.trim());
`);
const thaiDesktop = await shot("thailand-desktop");

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
});
await delay(250);
const thaiMobile = await shot("thailand-mobile-390");

console.log(JSON.stringify({
  opened,
  emptyLabels,
  emptyHrefs,
  headings,
  destHref,
  pills,
  overlayText,
  shots: { emptyDesktop, emptyMobile, thaiDesktop, thaiMobile },
}, null, 2));

ws.close();
chrome.kill("SIGTERM");
process.exit(0);
