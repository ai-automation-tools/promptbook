import matter from 'gray-matter';

// gray-matter passes front matter that opens with `---js` or `---javascript` to
// eval(). Library files come from third-party collections, so that engine is
// switched off here and such a file fails to parse instead of running.
// Every parse in site/ goes through this module, never gray-matter directly.
const refuse = () => {
  throw new Error('JavaScript front matter is not allowed');
};
const SAFE = { engines: { js: refuse, javascript: refuse } };

/** gray-matter with the JavaScript front-matter engine disabled. */
export default function parseFrontmatter(input) {
  return matter(input, SAFE);
}
parseFrontmatter.stringify = matter.stringify;
