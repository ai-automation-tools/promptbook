/**
 * Settings: appearance (mode + theme), the local data this browser
 * keeps, and the keyboard shortcuts. Mounted only while open.
 */

import { Check, Moon, Sun, Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';
import { PALETTES, type Palette, type Theme } from '../hooks/useTheme';
import { Button, Kbd, MOD_KEY, Modal, ModalHeader } from './ui/primitives';

interface SettingsModalProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
  favoriteCount: number;
  recentCount: number;
  onClearLocalData: () => void;
  onClose: () => void;
}

const SHORTCUTS: { keys: string[]; does: string }[] = [
  { keys: [MOD_KEY, 'K'], does: 'Search prompts, sections and actions' },
  { keys: ['Esc'], does: 'Close a dialog or menu' },
  { keys: ['↑', '↓', '↵'], does: 'Move through and open palette results' },
];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--line)] px-6 py-5 first:border-t-0">
      <h3 className="eyebrow">{title}</h3>
      {hint && <p className="mt-1 text-[13px] text-[var(--fg-3)]">{hint}</p>}
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export default function SettingsModal({
  theme,
  setTheme,
  palette,
  setPalette,
  favoriteCount,
  recentCount,
  onClearLocalData,
  onClose,
}: SettingsModalProps) {
  const localCount = favoriteCount + recentCount;

  // Radio-group keys: the arrows move the choice (and focus) and wrap; Tab skips
  // the group's other options, since only the checked one is in the tab order.
  const onPaletteKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = PALETTES.findIndex(p => p.id === palette);
    const next = PALETTES[(i + step + PALETTES.length) % PALETTES.length];
    setPalette(next.id);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[PALETTES.indexOf(next)]?.focus();
  };

  return (
    <Modal onClose={onClose} labelledBy="settings-title">
      <ModalHeader id="settings-title" title="Settings" description="Remembered in this browser only." onClose={onClose} />

      <div className="max-h-[70vh] overflow-y-auto">
        <Section title="Appearance" hint="Dark is the default. A theme washes the whole page in its colour, in either mode.">
          <div className="flex flex-col gap-4">
            <div className="segmented w-full sm:w-72" role="group" aria-label="Mode">
              {(
                [
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" aria-pressed={theme === id} onClick={() => setTheme(id)}>
                  {theme === id && <span className="segmented-thumb" />}
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div role="radiogroup" aria-label="Theme" onKeyDown={onPaletteKey} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PALETTES.map(p => {
                const active = p.id === palette;
                const accent = theme === 'light' ? p.light : p.dark;
                // The same mixes index.css derives --bg from, so the swatch shows the real ground.
                const ground = p.tone
                  ? theme === 'light'
                    ? `color-mix(in srgb, ${p.tone} 9%, #fbfbfb)`
                    : `color-mix(in srgb, ${p.tone} 12%, #040404)`
                  : theme === 'light' ? '#fafafa' : '#060606';
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setPalette(p.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-[var(--r-md)] border p-2.5 text-left transition-colors',
                      active
                        ? 'border-[color-mix(in_srgb,var(--accent)_45%,var(--line-2))] bg-[var(--tint)]'
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-hover)] hover:bg-[var(--surface-2)]',
                    )}
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-[var(--line-2)]"
                      style={{ background: ground }}
                      aria-hidden="true"
                    >
                      <span
                        className="grid h-4 w-4 place-items-center rounded-full"
                        style={{ background: accent, color: theme === 'light' ? '#fff' : '#09090b' }}
                      >
                        {active && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium text-[var(--fg)]">{p.name}</span>
                      <span className="block truncate text-[11px] text-[var(--fg-4)]">{p.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Local data" hint="Favourites and recently viewed prompts are stored in this browser, not in My Library.">
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono text-[12px] text-[var(--fg-4)]">
              {favoriteCount} {favoriteCount === 1 ? 'favourite' : 'favourites'} · {recentCount} recent
            </p>
            <Button
              size="sm"
              variant="danger"
              className="ml-auto"
              disabled={localCount === 0}
              onClick={onClearLocalData}
              icon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Clear
            </Button>
          </div>
        </Section>

        <Section title="Keyboard">
          <dl className="space-y-2">
            {SHORTCUTS.map(s => (
              <div key={s.does} className="flex items-center gap-3 text-[13px]">
                <dt className="flex w-24 shrink-0 items-center gap-1">
                  {s.keys.map(k => (
                    <Kbd key={k}>{k}</Kbd>
                  ))}
                </dt>
                <dd className="text-[var(--fg-3)]">{s.does}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </Modal>
  );
}
