/**
 * Self-check for fetchFullPrompt (src/hooks/usePromptContent.ts): a failed load
 * must throw, never hand back the listing's 200-character preview, because Edit,
 * Copy, Download and the detail page all act on what it returns.
 *
 * Run: npm run test:prompt-content   (from site/)
 */
import assert from "node:assert/strict";

const { fetchFullPrompt } = await import("../src/hooks/usePromptContent.ts");

const preview = "x".repeat(200);
const listing = { id: "my-prompt-abc123", title: "My Prompt", content: preview };
const fullBody = "y".repeat(5000);
const stub = (impl) => { globalThis.fetch = impl; };
const reply = (status, body) => async () => new Response(body, { status, headers: { "Content-Type": "application/json" } });

const failures = {
  "503": reply(503, JSON.stringify({ error: "down" })),
  "404": reply(404, JSON.stringify({ error: "Prompt not found" })),
  "rejected fetch": async () => { throw new TypeError("Failed to fetch"); },
  "invalid JSON": reply(200, "<!doctype html>"),
  "no content field": reply(200, JSON.stringify({ id: listing.id })),
};
for (const [name, impl] of Object.entries(failures)) {
  stub(impl);
  await assert.rejects(fetchFullPrompt(listing), `${name} throws instead of returning the preview`);
}

stub(reply(200, JSON.stringify({ ...listing, content: fullBody })));
const full = await fetchFullPrompt(listing);
assert.equal(full.content, fullBody, "a successful load returns the whole body");

let requested;
stub(async (url) => { requested = url; return new Response(JSON.stringify({ content: "" }), { status: 200 }); });
assert.equal((await fetchFullPrompt({ ...listing, id: "4_Prompts/A B/c.md" })).content, "", "an empty body is a body");
assert.equal(requested, "/api/prompts/4_Prompts%2FA%20B%2Fc.md", "the id is encoded as one path segment");

console.log("prompt-content: failed loads throw (503, 404, network, bad JSON, no content); full bodies come back whole");
