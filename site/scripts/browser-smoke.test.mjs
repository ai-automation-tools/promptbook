/**
 * Browser smoke test on the built app: what the contract tests can't see.
 * Serves dist/ with the real Express app (like `npm start`), drives the system
 * Chrome through playwright-core, and fails on any page error, console error
 * or failed request. Covers the listing, a prompt's detail page, the hero
 * counter naming its section, the Settings dialog's focus handling (F08), and
 * the CSP from vercel.json (F18).
 *
 * Needs `npm run build` first and Google Chrome installed (GitHub's runners
 * have it). CHROME_PATH points at another Chromium if you have no Chrome.
 * Runs against a throwaway MY_LIBRARY_DIR, never site/my-library.
 * Run: npm run test:browser   (from site/)
 */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { chromium } from "playwright-core";

const dist = path.resolve("dist");
if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("browser-smoke: no dist/index.html; run `npm run build` first");
  process.exit(1);
}

process.env.MY_LIBRARY_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "browser-smoke-"));
process.env.READ_ONLY = "false";
process.env.VERCEL = "";
const { app } = await import("../api/index.ts");
const { default: skillPacksHandler } = await import("../api/skill-packs.ts");
app.all(/^\/api\/skill-packs(\/|$)/, (req, res) => skillPacksHandler(req, res));

// The demo's page headers (CSP and friends) come from vercel.json. Serve the same
// ones here, so a policy that blocks the theme script, the fonts or consent.js
// fails this test: Chrome logs every violation as a console error.
const pageHeaders = JSON.parse(fs.readFileSync("vercel.json", "utf8"))
  .headers.find((h) => h.source === "/((?!api/).*)").headers;
const csp = pageHeaders.find((h) => h.key === "Content-Security-Policy").value;
for (const [, script] of fs.readFileSync(path.join(dist, "index.html"), "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `'sha256-${crypto.createHash("sha256").update(script).digest("base64")}'`;
  assert.ok(csp.includes(hash), `vercel.json's CSP must allow index.html's inline script: add ${hash}`);
}
app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) for (const { key, value } of pageHeaders) res.setHeader(key, value);
  next();
});
app.use(express.static(dist));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(dist, "index.html")));

const server = await new Promise((resolve) => {
  const s = app.listen(0, "127.0.0.1", () => resolve(s));
});
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);

const problems = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (err) => problems.push(`page error: ${err.message}`));
  page.on("console", (msg) => { if (msg.type() === "error") problems.push(`console: ${msg.text()}`); });
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url()}`); });
  page.on("requestfailed", (r) => problems.push(`failed: ${r.url()} ${r.failure()?.errorText}`));

  // Listing: cards render from the lightweight list, blurbs from /previews.
  await page.goto(`${base}/`);
  // Anchored: a card blurb can mention "10 results" too.
  await page.locator("main").getByText(/^[\d,]+ results$/).waitFor();

  // Detail: the full body loads and the hero counter names the section.
  await page.goto(`${base}/?section=mcp-servers&library=public`);
  await page.locator("main").getByText("Servers", { exact: true }).waitFor();
  const card = page.locator("main h3").first();
  const title = (await card.innerText()).trim();
  await card.click();
  await page.getByRole("button", { name: /Copy prompt/ }).waitFor();
  assert.match(page.url(), /[?&]prompt=/, `opening "${title}" puts it in the URL`);

  // Settings dialog (F08): focus moves in, Tab can't leave, Escape gives it back.
  const inDialog = () => page.evaluate(() => !!document.querySelector("[role=dialog]")?.contains(document.activeElement));
  await page.getByRole("button", { name: "Settings" }).first().focus();
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").waitFor();
  assert.ok(await inDialog(), "focus moves into the dialog");
  assert.ok(await page.evaluate(() => document.getElementById("root").hasAttribute("inert")), "page behind is inert");
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(i % 3 ? "Tab" : "Shift+Tab");
    assert.ok(await inDialog(), `focus stays in the dialog after ${i + 1} Tab presses`);
  }
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Settings", "focus returns to the trigger");
  assert.ok(!(await page.evaluate(() => document.getElementById("root").hasAttribute("inert"))), "inert is lifted on close");

  assert.deepEqual(problems, [], "no page errors, console errors or failed requests");
  console.log("browser-smoke: listing, detail, hero counter, Settings focus and the vercel.json CSP all pass on the built app");
} finally {
  await browser.close();
  server.close();
  fs.rmSync(process.env.MY_LIBRARY_DIR, { recursive: true, force: true });
}
