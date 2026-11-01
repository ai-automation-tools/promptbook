/**
 * Settings → My Library: export the folder as a ZIP, and import one. An import
 * is previewed first (POST without `apply` writes nothing); files that differ
 * from yours are listed, and replaced only by the button that names them.
 * Cancel just drops the preview, so nothing has changed.
 */

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button, Notice } from './ui/primitives';

interface ImportPlan {
  added: { id: string; title: string }[];
  unchanged: { id: string; title: string }[];
  conflicts: { id: string; title: string; currentTitle: string }[];
  skipped: { name: string; reason: string }[];
  token: string;
}

const send = async (file: Blob, query = '') => {
  const res = await fetch(`/api/my-library/import${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/zip' },
    body: file,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Import failed');
  return data;
};

export default function MyLibraryTransfer({ onImported }: { onImported: (message: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setFile(null);
    setPlan(null);
    if (input.current) input.current.value = '';
  };

  const preview = async (picked: File | undefined) => {
    if (!picked) return;
    setError('');
    setBusy(true);
    try {
      setPlan(await send(picked));
      setFile(picked);
    } catch (err) {
      reset();
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const apply = async (overwrite: boolean) => {
    if (!file || !plan) return;
    setBusy(true);
    try {
      const done = await send(file, `?apply=true${overwrite ? `&overwrite=${plan.token}` : ''}`);
      reset();
      onImported(done.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* A link, not a button: the server names the file, and nothing navigates */}
        <a className="btn btn-outline btn-sm" href="/api/my-library/export" download>
          <Download className="h-3.5 w-3.5" />
          Export .zip
        </a>
        <Button size="sm" disabled={busy} onClick={() => input.current?.click()} icon={<Upload className="h-3.5 w-3.5" />}>
          Import .zip
        </Button>
        <input
          ref={input}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={e => preview(e.target.files?.[0])}
        />
      </div>

      {error && <Notice>{error}</Notice>}

      {plan && (
        <div className="rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface)] p-3.5 text-[13px]">
          <p className="mono text-[12px] text-[var(--fg-3)]">
            {file?.name}: {plan.added.length} new · {plan.unchanged.length} already here · {plan.conflicts.length} differ
            from yours · {plan.skipped.length} skipped
          </p>

          {plan.conflicts.length > 0 && (
            <div className="mt-3">
              <p className="text-[var(--fg-2)]">These differ from the file you have. Kept as yours unless you replace them:</p>
              <ul className="mt-1.5 max-h-32 space-y-0.5 overflow-y-auto text-[var(--fg-3)]">
                {plan.conflicts.map(c => (
                  <li key={c.id}>
                    <span className="mono text-[12px] text-[var(--fg-4)]">{c.id}</span> {c.title}
                    {c.currentTitle !== c.title && <span className="text-[var(--fg-4)]"> (yours: {c.currentTitle})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.skipped.length > 0 && (
            <div className="mt-3">
              <p className="text-[var(--fg-2)]">Skipped:</p>
              <ul className="mt-1.5 max-h-24 space-y-0.5 overflow-y-auto text-[var(--fg-3)]">
                {plan.skipped.map(s => (
                  <li key={s.name}>
                    <span className="mono text-[12px] text-[var(--fg-4)]">{s.name}</span> {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3.5 flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="ghost" disabled={busy} onClick={reset}>
              Cancel
            </Button>
            {plan.conflicts.length > 0 && (
              <Button size="sm" variant="danger" disabled={busy} onClick={() => apply(true)}>
                Import and replace {plan.conflicts.length}
              </Button>
            )}
            <Button size="sm" variant="primary" disabled={busy || plan.added.length === 0} onClick={() => apply(false)}>
              {plan.added.length ? `Import ${plan.added.length} new` : 'Nothing new'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
