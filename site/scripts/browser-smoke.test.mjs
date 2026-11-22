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
  // ERR_ABORTED is the browser cancelling a request when the test navigates away (card
  // previews still in flight), not a failure; real errors still arrive as 4xx/5xx above.
  page.on("requestfailed", (r) => {
    if (r.failure()?.errorText !== "net::ERR_ABORTED") problems.push(`failed: ${r.url()} ${r.failure()?.errorText}`);
  });

  // Listing: cards render from the lightweight list, blurbs from /previews.
  await page.goto(`${base}/`);
  // Anchored: a card blurb can mention "10 results" too.
  await page.locator("main").getByText(/^[\d,]+ results$/).waitFor();

  // Detail: the full body loads and the hero counter names the section.
  await page.goto(`${base}/?section=mcp-servers&library=public`);
  await page.locator("main").getByText("Servers", { exact: true }).waitFor();
  const card = page.locator("main h3").first();
  const title = (await card.innerText()).trim();
  // Keyboard (PB-02): Enter on a card's action runs that action, not "open the card";
  // Enter on the title opens it.
  const keyedDownload = page.waitForEvent("download");
  await page.locator("main article").first().getByRole("button", { name: "Download as Markdown" }).focus();
  await page.keyboard.press("Enter");
  await keyedDownload;
  assert.doesNotMatch(page.url(), /[?&]prompt=/, "Enter on a card's action leaves the card closed");
  await card.getByRole("button").focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: /Copy prompt/ }).waitFor();
  assert.match(page.url(), /[?&]prompt=/, `opening "${title}" puts it in the URL`);
  assert.equal(await page.getByRole("button", { name: "Add to favorites" }).count(), 0, "Public Library items have no star");
  // Related (PB-03): leaving a prompt stays left; an old ?prompt= used to reopen it.
  await page.getByRole("button", { name: "Related" }).click();
  await page.getByRole("button", { name: /Copy prompt/ }).waitFor({ state: "detached" });
  await page.waitForTimeout(1000);
  assert.doesNotMatch(page.url(), /[?&]prompt=/, "Related leaves the prompt and does not bounce back");
  assert.equal(await page.getByRole("button", { name: /Copy prompt/ }).count(), 0, "still on the listing a second later");

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

  // Settings → My Library (O01): export, lose the file, preview the import (writes
  // nothing), import, and the file is back byte for byte.
  const { myLibrary } = await import("../lib/my-library.ts");
  const mine = myLibrary.create({ title: "Smoke export", section: "4_Prompts", category: "Dev", subcategory: null, tags: [], content: "smoke body\n" });
  const mineFile = path.join(process.env.MY_LIBRARY_DIR, `${mine.id}.md`);
  const mineBytes = fs.readFileSync(mineFile);
  await page.getByRole("button", { name: "Settings" }).first().click();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export .zip" }).click();
  const zipPath = await (await download).path();
  fs.unlinkSync(mineFile);
  await page.locator("input[type=file]").setInputFiles(zipPath);
  await page.getByText(/1 new · 0 already here · 0 differ/).waitFor();
  assert.ok(!fs.existsSync(mineFile), "the import preview writes nothing");
  await page.getByRole("button", { name: "Import 1 new" }).click();
  await page.getByText("Imported 1 file into My Library").waitFor();
  assert.ok(fs.readFileSync(mineFile).equals(mineBytes), "the exported file imports back byte for byte");
  await page.keyboard.press("Escape");

  // My Library: a ?prompt= link opens the item, which has the star; New item suggests its category.
  await page.goto(`${base}/?library=my&prompt=${mine.id}`);
  await page.getByRole("heading", { name: "Smoke export" }).waitFor();
  // A star is saved in My Library's favorites.json, not in the browser, so another
  // address or device sees it; a browser's old localStorage list moves up once.
  const favFile = path.join(process.env.MY_LIBRARY_DIR, "favorites.json");
  const starWritten = page.waitForResponse(r => r.url().endsWith("/api/my-library/favorites") && r.request().method() === "POST");
  await page.getByRole("button", { name: "Add to favorites" }).click();
  await starWritten;
  await page.getByRole("button", { name: "Remove from favorites" }).waitFor();
  assert.deepEqual(JSON.parse(fs.readFileSync(favFile, "utf-8")), [mine.id], "the star is saved on the server");
  const older = myLibrary.create({ title: "Starred elsewhere", section: "4_Prompts", category: "Dev", subcategory: null, tags: [], content: "x\n" });
  await page.evaluate(ids => localStorage.setItem("prompt-favorites", JSON.stringify(ids)), [older.id, "4_Prompts/old/public.md"]);
  const migrated = page.waitForResponse(r => r.url().endsWith("/api/my-library/favorites") && r.request().method() === "POST");
  await page.reload();
  await migrated;
  assert.deepEqual(JSON.parse(fs.readFileSync(favFile, "utf-8")), [mine.id, older.id], "the old browser list is merged in, Public Library ids left out");
  assert.equal(await page.evaluate(() => localStorage.getItem("prompt-favorites")), null, "and dropped from the browser");
  await page.locator("article", { has: page.getByRole("button", { name: "Starred elsewhere", exact: true }) })
    .getByRole("button", { name: "Remove from favorites" }).waitFor();

  await page.getByRole("button", { name: "New item" }).first().click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.locator('#prompt-category-options option[value="Dev"]').count(), 1, "Category suggests My Library's categories");
  // "Add to favorites" on New item stars the item as it is created.
  await page.locator("#prompt-title").fill("Starred at birth");
  await page.locator("#prompt-category").fill("Dev");
  await page.locator("#prompt-content").fill("x");
  await page.getByLabel("Add to favorites").check();
  const bornStarred = page.waitForResponse(r => r.url().endsWith("/api/my-library/favorites") && r.request().method() === "POST");
  await page.getByRole("button", { name: "Create item" }).click();
  await bornStarred;
  assert.ok(JSON.parse(fs.readFileSync(favFile, "utf-8")).some(id => id.startsWith("starred-at-birth-")), "the new item is starred on create");

  // Storage (PB-08): a bad saved value, then storage that throws, still render the library.
  await page.evaluate(() => localStorage.setItem("prompt-recently-viewed", "{}"));
  await page.goto(`${base}/`);
  await page.locator("main").getByText(/^[\d,]+ results$/).waitFor();
  const blocked = await browser.newPage();
  const blockedErrors = [];
  blocked.on("pageerror", (err) => blockedErrors.push(err.message));
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } });
  });
  await blocked.goto(`${base}/`);
  await blocked.locator("main").getByText(/^[\d,]+ results$/).waitFor();
  assert.deepEqual(blockedErrors, [], "blocked storage does not break the page");
  await blocked.close();

  // Suite embed contract: standalone, ?embed=1 changes nothing.
  await page.goto(`${base}/?embed=1`);
  await page.locator(".theme-sw").waitFor();

  // Framed as ?embed=1 (the suite shell, a Project Hub tab): the brand and the Light | Dark
  // switch are gone, `ready` and `route` reach the parent and the parent's theme applies.
  // vercel.json forbids framing, so the frame's document comes without those two headers.
  const shell = await browser.newPage();
  shell.on("pageerror", (err) => problems.push(`shell page error: ${err.message}`));
  await shell.route(`${base}/**`, async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const res = await route.fetch();
    const headers = { ...res.headers() };
    delete headers["x-frame-options"];
    delete headers["content-security-policy"];
    await route.fulfill({ response: res, headers });
  });
  await shell.route("http://shell.test/", (route) => route.fulfill({
    contentType: "text/html",
    body: `<script>window.msgs = []; addEventListener("message", (e) => msgs.push(e.data));</script><iframe src="${base}/?embed=1" width="1200" height="800"></iframe>`,
  }));
  await shell.goto("http://shell.test/");
  await shell.waitForFunction(() => msgs.some((m) => m.type === "route"));
  const msgs = await shell.evaluate(() => msgs);
  assert.deepEqual(msgs[0], { suite: 1, contract: 1, type: "ready", app: "promptbook" }, "ready comes first");
  assert.match(msgs.find((m) => m.type === "route").path, /^\/\?.*embed=1/, "the route keeps embed=1");
  const framed = shell.frame({ url: /embed=1/ });
  await framed.locator(".rail").waitFor();
  assert.equal(await framed.locator(".theme-sw, .rail-logo, .src-bar").count(), 0, "the shell's chrome is hidden");
  await shell.evaluate(() => document.querySelector("iframe").contentWindow.postMessage({ suite: 1, type: "theme", value: "light" }, "*"));
  await framed.waitForFunction(() => document.documentElement.classList.contains("light"));

  assert.deepEqual(problems, [], "no page errors, console errors or failed requests");
  console.log("browser-smoke: listing, card keyboard actions, detail, Related without a bounce, hero counter, Settings focus, My Library export and import, My Library links, server-side favorites (and the move from localStorage), category suggestions, bad or blocked storage, the suite embed contract and the vercel.json CSP all pass on the built app");
} finally {
  await browser.close();
  server.close();
  fs.rmSync(process.env.MY_LIBRARY_DIR, { recursive: true, force: true });
}
