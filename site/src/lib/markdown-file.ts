import type { Prompt } from '../components/PromptCard';

/**
 * A prompt as a standalone `.md` file that My Library (or any YAML reader) reads
 * back unchanged. Every value is written as JSON, which YAML accepts as-is, so a
 * title with ": ", quotes or a newline stays one string and tags stay a list.
 * Extra frontmatter (a skill's `name` and `description`) goes first, the way the
 * store writes it, so the downloaded SKILL.md still loads.
 */
export function toMarkdownFile(prompt: Prompt): string {
  const fields: Record<string, unknown> = {
    ...prompt.extra,
    title: prompt.title,
    section: prompt.section,
    category: prompt.category,
    subcategory: prompt.subcategory ?? null,
    tags: prompt.tags,
    source_url: prompt.sourceUrl,
    created: prompt.lastModified,
    source: 'Promptbook',
  };
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${/^[\w-]+$/.test(key) ? key : JSON.stringify(key)}: ${JSON.stringify(value)}`);
  return `---\n${lines.join('\n')}\n---\n${prompt.content}`;
}
