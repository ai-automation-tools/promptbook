/**
 * Self-check for FRAME_ANCESTORS: the listed origins may frame the app, through
 * CSP frame-ancestors, and X-Frame-Options (which has no allowlist) is dropped.
 * An entry that isn't an http(s) origin never reaches the header.
 *
 * FRAME_ANCESTORS is read once at import, which is why this is its own process.
 * Run: npm run test:frame-ancestors   (from site/)
 */
import assert from "node:assert/strict";

process.env.FRAME_ANCESTORS = " http://localhost:4273/ , *, javascript:alert(1);x, http://127.0.0.1:4273";
const { app, FRAME_ANCESTORS } = await import("../api/index.ts");
assert.deepEqual(FRAME_ANCESTORS, ["http://localhost:4273", "http://127.0.0.1:4273"]);

const server = app.listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
try {
  // A route of ours: Express's own 404 page replaces the CSP with its own.
  const res = await fetch(`http://127.0.0.1:${server.address().port}/api/prompts/no-such-prompt`);
  assert.equal(res.headers.get("x-frame-options"), null, "X-Frame-Options dropped");
  assert.equal(res.headers.get("content-security-policy"), "frame-ancestors 'self' http://localhost:4273 http://127.0.0.1:4273");
  console.log("frame-ancestors: ok");
} finally {
  server.close();
}
