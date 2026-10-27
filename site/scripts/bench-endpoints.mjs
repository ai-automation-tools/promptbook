/**
 * Latency and size of the expensive endpoints, under a small concurrency load.
 * Not a pass/fail test: it prints the table docs/development/PERFORMANCE.md
 * records, so a change can be compared against the baseline there.
 *
 * The server runs in a child process (this file with --server) so the client's
 * own work, like parsing a 10 MB body, can't pollute the server's numbers.
 * - Cold: the first request, before any cache is warm.
 * - p50/p95: RUNS more requests, CONCURRENCY at a time.
 * - Stall: the longest the server's event loop went without a turn during the
 *   row. While it is stalled the server answers nothing else.
 * The last row is detail reads fired while a cold full listing is being built:
 * "a full export must not block ordinary reads".
 * Runs against a throwaway MY_LIBRARY_DIR.
 * Run: npm run bench   (from site/)
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";

if (process.argv.includes("--server")) {
  process.env.READ_ONLY = "false";
  process.env.VERCEL = "";
  const { app } = await import("../api/index.ts");
  const { default: skillPacksHandler } = await import("../api/skill-packs.ts");
  app.all(/^\/api\/skill-packs(\/|$)/, (req, res) => skillPacksHandler(req, res));
  let lag = monitorEventLoopDelay({ resolution: 1 });
  lag.enable();
  app.get("/__bench/lag", (_req, res) => {
    res.json({ maxMs: lag.max / 1e6 });
    lag.disable();
    lag = monitorEventLoopDelay({ resolution: 1 });
    lag.enable();
  });
  console.log = () => {}; // the API logs every request
  const server = app.listen(0, "127.0.0.1", () => process.stdout.write(`PORT ${server.address().port}\n`));
} else {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bench-"));
  const child = spawn(process.execPath, ["--import", "tsx", new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "--server"], {
    env: { ...process.env, MY_LIBRARY_DIR: dir },
    stdio: ["ignore", "pipe", "inherit"],
  });
  const port = await new Promise((resolve, reject) => {
    child.stdout.on("data", (d) => { const m = /PORT (\d+)/.exec(String(d)); if (m) resolve(m[1]); });
    child.on("exit", (code) => reject(new Error(`server exited (${code})`)));
  });
  const base = `http://127.0.0.1:${port}`;

  const RUNS = Number(process.env.RUNS || 20);
  const CONCURRENCY = Number(process.env.CONCURRENCY || 5);
  const index = JSON.parse(fs.readFileSync("api/prompt-index.json", "utf8"));
  const detailId = index.prompts.find((p) => p.section === "4_Prompts").id;
  const previewIds = index.prompts.slice(0, 50).map((p) => p.id);

  async function hit({ url, init }) {
    const t = performance.now();
    const res = await fetch(base + url, init);
    const bytes = (await res.arrayBuffer()).byteLength;
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return { ms: performance.now() - t, bytes };
  }
  const stall = async () => (await (await fetch(`${base}/__bench/lag`)).json()).maxMs;

  const pct = (xs, p) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.ceil((p / 100) * xs.length) - 1)];
  const kb = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(1)} KB`);
  const ms = (x) => x.toFixed(0);

  // Detail reads during a cold full listing: before anything else, so no cache is warm.
  await hit({ url: `/api/prompts/${encodeURIComponent(detailId)}` });
  await stall();
  const exportRun = hit({ url: "/api/prompts?library=public" });
  await new Promise((r) => setTimeout(r, 100)); // let the listing get going
  const during = [];
  for (let i = 0; i < 10; i++) during.push((await hit({ url: `/api/prompts/${encodeURIComponent(detailId)}` })).ms);
  const exportCold = await exportRun;
  const blocking = `| Detail read during a cold full listing (listing took ${ms(exportCold.ms)} ms) | – | ${ms(pct(during, 50))} | ${ms(pct(during, 95))} | ${ms(await stall())} | 0.9 KB |`;

  async function row(label, req, runs = RUNS) {
    const cold = await hit(req);
    const times = [];
    let bytes = cold.bytes;
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, runs) }, async () => {
      while (next++ < runs) { const r = await hit(req); times.push(r.ms); bytes = r.bytes; }
    }));
    return `| ${label} | ${ms(cold.ms)} | ${ms(pct(times, 50))} | ${ms(pct(times, 95))} | ${ms(await stall())} | ${kb(bytes)} |`;
  }

  const json = (body) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const rows = [
    await row("List, lightweight (what the UI loads)", { url: "/api/prompts?library=public&lightweight=true" }),
    await row("List, full bodies (the export; cold row above)", { url: "/api/prompts?library=public" }, Math.min(RUNS, 10)),
    await row("Detail read", { url: `/api/prompts/${encodeURIComponent(detailId)}` }),
    await row("Card previews (50 ids)", { url: "/api/prompts/previews", init: json({ ids: previewIds }) }),
    await row("Skill ZIP, small (copy-editing, 16 KB)", { url: "/api/skills/download/3_Skills/Business/copy-editing" }),
    await row("Skill ZIP, largest (diagram-design, 0.9 MB)", { url: "/api/skills/download/3_Skills/Design/diagram-design" }, Math.min(RUNS, 10)),
    await row("Pack ZIP, median (finance-investing-pack, 10 skills)", { url: "/api/skill-packs/finance-investing-pack/download" }, Math.min(RUNS, 10)),
    await row("Pack ZIP, largest (finance-portfolio-management-pack, 34 skills)", { url: "/api/skill-packs/finance-portfolio-management-pack/download" }, Math.min(RUNS, 10)),
    blocking,
  ];

  child.kill();
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Node ${process.version}, ${os.cpus()[0].model.trim()}, ${RUNS} runs at concurrency ${CONCURRENCY} (10 for the heavy rows)\n`);
  console.log("| Endpoint | Cold ms | p50 ms | p95 ms | Stall ms | Bytes |\n|:--|--:|--:|--:|--:|--:|");
  console.log(rows.join("\n"));
}
