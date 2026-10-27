/**
 * The Skills section's three kinds: single skills, libraries (one card per repo
 * that publishes many skills, linking out to it rather than copying each skill)
 * and Skill Packs (our own bundles, their own section). SkillKindSwitch moves
 * between them; SkillLibrariesView is the Libraries grid.
 */

import { Library, Package, Wrench } from 'lucide-react';
import { type Prompt } from './PromptCard';
import { PromptCardGrid, type PromptCardActions } from './PromptGrid';

export type SkillKind = 'skills' | 'libraries' | 'packs';

/**
 * Tag on a library card: a public `library/3_Skills/Libraries/*.md`, or a My Library
 * item. It shows under Libraries, not in the Skills grid or its category tree.
 */
export const SKILL_LIBRARY_TAG = 'skill-library';

export const isLibraryItem = (p: Prompt) => p.tags.includes(SKILL_LIBRARY_TAG);

export const SKILL_KINDS: { id: SkillKind; label: string; icon: typeof Wrench }[] = [
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'libraries', label: 'Libraries', icon: Library },
  { id: 'packs', label: 'Packs', icon: Package },
];

/** Phones only: from md up the Sidebar carries this switch, and here the sidebar is a drawer. */
export function SkillKindSwitch({ value, onChange }: { value: SkillKind; onChange: (kind: SkillKind) => void }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2 md:hidden" role="group" aria-label="Skill kind">
      {SKILL_KINDS.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className="pill gap-1.5" aria-pressed={value === id} onClick={() => onChange(id)}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

interface SkillLibrariesViewProps {
  /** The section's items; the library cards among them are shown. */
  prompts: Prompt[];
  actions: PromptCardActions;
}

export function SkillLibrariesView({ prompts, actions }: SkillLibrariesViewProps) {
  const libraries = prompts.filter(isLibraryItem).sort((a, b) => a.title.localeCompare(b.title));

  if (libraries.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <span className="glyph mb-4 h-12 w-12 rounded-[12px]">
          <Library className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-[var(--fg)]">No skill libraries here</h3>
        <p className="mt-1.5 max-w-sm text-[14px] text-[var(--fg-3)]">
          A library is one card for a repo of skills: tag it <span className="mono">{SKILL_LIBRARY_TAG}</span> and link the repo.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-[13px] text-[var(--fg-3)]">
        Repos that publish many skills, one card each. Open one for the link to install its skills from GitHub.
      </p>
      <PromptCardGrid prompts={libraries} actions={actions} />
    </>
  );
}
