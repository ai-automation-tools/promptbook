/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AlertCircle, Code2, Eye, Save, X } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutGroup, m } from 'motion/react';
import { cn } from '../lib/cn';
import { SECTIONS } from '../lib/sections';
import { Button, Modal, ModalFooter, ModalHeader, Notice } from './ui/primitives';

/** What the editor opens and saves: no `id` yet for a new prompt, no `lastModified`. */
export interface PromptDraft {
  id?: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  /** Where it stems from: a GitHub repo or a site. */
  sourceUrl?: string | null;
}

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: PromptDraft) => Promise<void>;
  editingPrompt?: PromptDraft | null;
  defaultSection?: string;
}

const LABEL = 'mb-1.5 block text-[13px] font-medium text-[var(--fg-2)]';

export default function PromptEditorModal({ isOpen, onClose, onSave, editingPrompt, defaultSection = '4_Prompts' }: PromptEditorModalProps) {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState(defaultSection);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingPrompt) {
      setTitle(editingPrompt.title);
      setSection(editingPrompt.section);
      setCategory(editingPrompt.category);
      setSubcategory(editingPrompt.subcategory || '');
      setTags(editingPrompt.tags || []);
      setSourceUrl(editingPrompt.sourceUrl || '');
      setContent(editingPrompt.content);
    } else {
      setTitle('');
      setSection(defaultSection);
      setCategory('');
      setSubcategory('');
      setTags([]);
      setTagInput('');
      setSourceUrl('');
      setContent('');
    }
    setMode('write');
    setError('');
  }, [editingPrompt, defaultSection, isOpen]);

  const commitTag = () => {
    const value = tagInput.trim().replace(/,+$/, '');
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setTagInput('');
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('Title is required');
    if (!category.trim()) return setError('Category is required');
    if (!content.trim()) return setError('Content is required');

    setSaving(true);
    try {
      await onSave({
        id: editingPrompt?.id,
        title: title.trim(),
        section,
        category: category.trim(),
        subcategory: subcategory.trim() || null,
        tags,
        sourceUrl: sourceUrl.trim() || null,
        content: content.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <Modal onClose={onClose} size="lg" labelledBy="editor-title">
      <ModalHeader
        id="editor-title"
        eyebrow={editingPrompt ? 'Editing' : 'My Library'}
        title={editingPrompt ? 'Edit item' : 'New item'}
        description="Markdown body, plus the metadata the library files on."
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {error && (
            <Notice>
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </Notice>
          )}

          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <div>
              <label htmlFor="prompt-title" className={LABEL}>
                Title <span className="text-[var(--danger)]">*</span>
              </label>
              <input id="prompt-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="A short, specific name" required data-autofocus />
            </div>
            <div>
              <label htmlFor="prompt-section" className={LABEL}>
                Section <span className="text-[var(--danger)]">*</span>
              </label>
              <select id="prompt-section" value={section} onChange={e => setSection(e.target.value)} className="input" disabled={!!editingPrompt}>
                {SECTIONS.filter(s => s.folder).map(s => (
                  <option key={s.id} value={s.folder}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prompt-category" className={LABEL}>
                Category <span className="text-[var(--danger)]">*</span>
              </label>
              <input id="prompt-category" type="text" value={category} onChange={e => setCategory(e.target.value)} className="input" placeholder="e.g. Development, Writing" disabled={!!editingPrompt} required />
            </div>
            <div>
              <label htmlFor="prompt-subcategory" className={LABEL}>
                Subcategory
              </label>
              <input id="prompt-subcategory" type="text" value={subcategory} onChange={e => setSubcategory(e.target.value)} className="input" placeholder="Optional" disabled={!!editingPrompt} />
            </div>
          </div>

          <div>
            <label htmlFor="prompt-source" className={LABEL}>
              Source link <span className="font-normal text-[var(--fg-4)]">· GitHub repo or site it stems from</span>
            </label>
            <input id="prompt-source" type="url" inputMode="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="input" placeholder="https://github.com/owner/repo" pattern="https?://.+" title="An http(s) link" />
          </div>

          <div>
            <label htmlFor="prompt-tags" className={LABEL}>
              Tags
            </label>
            <div
              className="input flex h-auto min-h-[38px] flex-wrap items-center gap-1.5 py-1.5 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--tint-2)]"
              onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement | null)?.focus()}
            >
              {tags.map(tag => (
                <span key={tag} className="chip chip-active h-[22px] pr-1">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} aria-label={`Remove tag ${tag}`} className="grid h-4 w-4 place-items-center rounded hover:bg-[color-mix(in_srgb,var(--fg)_12%,transparent)]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                id="prompt-tags"
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                onBlur={commitTag}
                placeholder={tags.length ? '' : 'Type a tag, press Enter'}
                className="min-w-[140px] flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[var(--fg-4)]"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="prompt-content" className={cn(LABEL, 'mb-0')}>
                Content <span className="text-[var(--danger)]">*</span> <span className="font-normal text-[var(--fg-4)]">· Markdown</span>
              </label>
              <LayoutGroup id="editor-mode">
                <div className="segmented" role="group" aria-label="Editor mode">
                  {(
                    [
                      { id: 'write', label: 'Write', icon: Code2 },
                      { id: 'preview', label: 'Preview', icon: Eye },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)} className="!h-7 !px-2.5 !text-[12px]">
                      {mode === id && <m.span layoutId="editor-mode-thumb" className="segmented-thumb" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {mode === 'preview' ? (
              <div className="surface min-h-[380px] p-5">
                {content.trim() ? (
                  <div className="markdown-body">
                    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                  </div>
                ) : (
                  <p className="text-[13.5px] text-[var(--fg-4)]">Nothing to preview yet.</p>
                )}
              </div>
            ) : (
              <textarea
                id="prompt-content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="input mono min-h-[380px] text-[13px] leading-relaxed"
                placeholder="# Role&#10;&#10;You are…"
                required
                spellCheck={false}
              />
            )}
            <p className="mono mt-1.5 text-right text-[10.5px] text-[var(--fg-5)]">
              {words.toLocaleString()} words · {content.length.toLocaleString()} chars
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving} icon={<Save className="h-4 w-4" />}>
            {saving ? 'Saving…' : editingPrompt ? 'Save changes' : 'Create item'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
