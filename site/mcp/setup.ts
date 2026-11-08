/**
 * Imported first by mcp/server.ts, before anything that might log.
 *
 * A stdio MCP server owns stdout: every byte on it must be a JSON-RPC message.
 * Library code (and its dependencies) log with console.log in places, so those
 * calls are pointed at stderr here, where clients show them as server logs.
 * Then site/.env is loaded quietly. dotenv 18 announces itself on stderr, but
 * dotenv 17 did so on stdout, which alone broke the handshake; quiet stays on.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const toStderr = (...args: unknown[]) => console.error(...args);
console.log = toStderr;
console.info = toStderr;
console.debug = toStderr;

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'), quiet: true });
