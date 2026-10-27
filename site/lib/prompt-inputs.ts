/**
 * A prompt's declared fill-in fields (roadmap O03). A prompt opts in with an `inputs:` list in
 * its frontmatter, each entry naming a `[placeholder]` that appears in its body:
 *
 *   inputs: [topic, "target audience"]
 *   inputs:
 *     - name: topic
 *       description: The subject to research
 *
 * Nothing is guessed from the body: brackets that are not declared (`[N]`, `[dict]`, a markdown
 * link) stay as written, and filling is a literal text swap, never a template engine.
 */

export interface PromptInput {
  /** The text between the brackets, as declared. */
  name: string;
  /** The MCP argument name: lowercase letters, digits and `_`. */
  arg: string;
  description?: string;
}

const NAME = /^[\p{L}\p{N}][\p{L}\p{N} _-]{0,39}$/u;

/**
 * The valid declarations, plus a reason for each one dropped. A declaration is dropped when its
 * name is malformed, is not in the body as `[name]`, repeats another's argument, or would take
 * `input`, the free-text argument every prompt keeps.
 */
export function declaredInputs(frontmatter: Record<string, unknown> | undefined, body: string) {
  const inputs: PromptInput[] = [];
  const problems: string[] = [];
  const raw = frontmatter?.inputs;
  if (raw == null) return { inputs, problems };
  if (!Array.isArray(raw)) return { inputs, problems: ['inputs: must be a list'] };
  for (const entry of raw) {
    const name = typeof entry === 'string' ? entry : (entry as { name?: unknown })?.name;
    const description = typeof entry === 'object' && entry && typeof (entry as { description?: unknown }).description === 'string'
      ? (entry as { description: string }).description : undefined;
    if (typeof name !== 'string' || !NAME.test(name)) { problems.push(`inputs: ${JSON.stringify(name)} is not a valid name`); continue; }
    const arg = name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_');
    if (!body.includes(`[${name}]`)) { problems.push(`inputs: [${name}] is not in the body`); continue; }
    if (arg === 'input' || inputs.some(i => i.arg === arg)) { problems.push(`inputs: "${name}" clashes with another argument`); continue; }
    inputs.push({ name, arg, ...(description && { description }) });
  }
  return { inputs, problems };
}

/** Put each value in place of its `[name]`, in one pass, so a value is never itself filled. */
export function fillInputs(body: string, inputs: PromptInput[], values: Record<string, string | undefined>): string {
  if (!inputs.length) return body;
  const byName = new Map(inputs.map(i => [i.name, values[i.arg] ?? `[${i.name}]`]));
  const pattern = new RegExp(inputs.map(i => `\\[${i.name.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}\\]`).join('|'), 'g');
  return body.replace(pattern, m => byName.get(m.slice(1, -1)) ?? m);
}
