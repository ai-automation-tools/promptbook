import { Github } from './ui/GithubIcon';

/** The org-wide source bar: required at the very top of every site on ai-automation-tools.dev. */
export default function SourceBar() {
  return (
    <div className="src-bar">
      <p className="src-note">
        <strong>Open source</strong> · prompts, agents and skills for AI coding tools.
      </p>
      <a
        href="https://github.com/ai-automation-tools/promptbook"
        target="_blank"
        rel="noopener noreferrer"
        className="src-link"
      >
        <Github className="h-3.5 w-3.5" aria-hidden="true" />
        View source
      </a>
    </div>
  );
}
