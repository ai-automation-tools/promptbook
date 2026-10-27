import { useCallback, useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ArrowLeft, ArrowRight, Download, Info, Package, PackageMinus, PackagePlus, Star, Tag, Wrench } from 'lucide-react';
import { cn } from '../lib/cn';
import { humanize } from '../lib/sections';
import { Button, IconButton } from './ui/primitives';
import { LoadingSkeleton } from './PromptGrid';
import { READ_ONLY } from '../lib/mode';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface SkillPackSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  tags: string[];
  category: string;
  skillCount: number;
  author: string;
  created_at: string;
  updated_at: string;
}

interface SkillInPack {
  path: string;
  name: string;
  description: string;
  metadata: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    subcategory: string;
  } | null;
}

interface SkillPackDetail extends SkillPackSummary {
  skills: SkillInPack[];
  prerequisites: {
    required_tools: string[];
    optional_tools: string[];
    recommended_knowledge: string[];
  };
  installation_notes: string;
  use_cases: string[];
  related_packs: string[];
}

/** A pack's id in the favorites list, which it shares with items (library paths, My Library slugs). */
export const packFavoriteId = (packId: string) => `pack:${packId}`;

interface SkillPacksViewProps {
  libraryMode: 'public' | 'my';
  onToast: (type: ToastType, message: string) => void;
  favorites: string[];
  onToggleFavorite: (favoriteId: string, e?: ReactMouseEvent) => void;
  /** The sidebar's Favorites view: only the starred packs. */
  onlyFavorites?: boolean;
}

function trackSpotlight(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

export default function SkillPacksView({ libraryMode, onToast, favorites, onToggleFavorite, onlyFavorites }: SkillPacksViewProps) {
  const [packs, setPacks] = useState<SkillPackSummary[]>([]);
  const [selectedPack, setSelectedPack] = useState<SkillPackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingPackId, setAddingPackId] = useState<string | null>(null);
  const [removingPackId, setRemovingPackId] = useState<string | null>(null);

  const fetchPacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/skill-packs?library=${libraryMode}`);
      if (!response.ok) throw new Error(`Failed to fetch skill packs (${response.status})`);
      const data = await response.json();
      setPacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load packs');
    } finally {
      setLoading(false);
    }
  }, [libraryMode]);

  useEffect(() => {
    void fetchPacks();
  }, [fetchPacks]);

  const handleAddPackToLibrary = async (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!window.confirm(`Add skill pack${pack ? ` "${pack.name}"` : ''} to My Library?`)) return;

    try {
      setAddingPackId(packId);
      const response = await fetch(`/api/skill-packs/${encodeURIComponent(packId)}/add-to-library`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to add pack to library');
      onToast('success', data?.message || 'Skill pack added to My Library');
      void fetchPacks();
    } catch (err) {
      onToast('error', err instanceof Error ? err.message : 'Failed to add pack to library');
    } finally {
      setAddingPackId(null);
    }
  };

  const handleRemovePackFromLibrary = async (packId: string) => {
    const pack = packs.find(p => p.id === packId);
    if (!window.confirm(`Remove skill pack${pack ? ` "${pack.name}"` : ''} from My Library?`)) return;

    try {
      setRemovingPackId(packId);
      const response = await fetch(`/api/skill-packs/${encodeURIComponent(packId)}/remove-from-library`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to remove pack from library');
      onToast('success', data?.message || 'Skill pack removed from My Library');
      if (selectedPack?.id === packId) setSelectedPack(null);
      void fetchPacks();
    } catch (err) {
      onToast('error', err instanceof Error ? err.message : 'Failed to remove pack from library');
    } finally {
      setRemovingPackId(null);
    }
  };

  const fetchPackDetail = async (packId: string) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/skill-packs/${encodeURIComponent(packId)}`);
      if (!response.ok) throw new Error('Failed to fetch pack details');
      // Generated packs (scripts/build-skill-packs.mjs) carry no use_cases or
      // prerequisites; only the hand-written ones do. Default them so the view can't crash.
      const pack = await response.json();
      setSelectedPack({
        ...pack,
        tags: pack.tags ?? [],
        skills: pack.skills ?? [],
        use_cases: pack.use_cases ?? [],
        related_packs: pack.related_packs ?? [],
        prerequisites: {
          required_tools: pack.prerequisites?.required_tools ?? [],
          optional_tools: pack.prerequisites?.optional_tools ?? [],
          recommended_knowledge: pack.prerequisites?.recommended_knowledge ?? [],
        },
      });
    } catch (err) {
      onToast('error', err instanceof Error ? err.message : 'Failed to load pack details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownloadPack = async (packId: string) => {
    try {
      const response = await fetch(`/api/skill-packs/${encodeURIComponent(packId)}/download`);
      if (!response.ok) throw new Error('Failed to download pack');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onToast('success', 'Skill pack downloaded');
    } catch (err) {
      console.error('Download error:', err);
      onToast('error', 'Failed to download pack. Please try again.');
    }
  };

  const isFavorite = (packId: string) => favorites.includes(packFavoriteId(packId));
  const favoriteButton = (packId: string, framed = false) => (
    <IconButton
      label={isFavorite(packId) ? 'Remove from favorites' : 'Add to favorites'}
      framed={framed}
      onClick={e => onToggleFavorite(packFavoriteId(packId), e)}
      className={cn(framed ? 'h-9 w-9' : 'h-7 w-7', isFavorite(packId) && 'text-[var(--warn)]')}
    >
      <Star className={cn('h-3.5 w-3.5', isFavorite(packId) && 'fill-current')} />
    </IconButton>
  );
  const shown = onlyFavorites ? packs.filter(p => isFavorite(p.id)) : packs;

  const libraryAction = (packId: string, size: 'sm' | 'md' = 'sm') =>
    READ_ONLY ? null : libraryMode === 'public' ? (
      <Button size={size} variant="tonal" onClick={e => { e.stopPropagation(); void handleAddPackToLibrary(packId); }} disabled={addingPackId === packId} icon={<PackagePlus className="h-3.5 w-3.5" />}>
        {addingPackId === packId ? 'Adding…' : 'Add to My Library'}
      </Button>
    ) : (
      <Button size={size} variant="danger" onClick={e => { e.stopPropagation(); void handleRemovePackFromLibrary(packId); }} disabled={removingPackId === packId} icon={<PackageMinus className="h-3.5 w-3.5" />}>
        {removingPackId === packId ? 'Removing…' : 'Remove'}
      </Button>
    );

  if (loading) return <LoadingSkeleton count={6} />;

  if (error) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-[14px] text-[var(--danger)]">{error}</p>
        <Button className="mt-4" onClick={() => void fetchPacks()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {selectedPack ? (
        <m.div
          key={`pack-${selectedPack.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto max-w-5xl pt-2"
        >
          <button type="button" onClick={() => setSelectedPack(null)} className="btn btn-ghost btn-sm -ml-2 mb-5">
            <ArrowLeft className="h-3.5 w-3.5" />
            All skill packs
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <span className="glyph h-16 w-16 rounded-[14px] text-[2rem]">{selectedPack.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="eyebrow mb-1.5">{humanize(selectedPack.category)}</p>
              <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--fg)]">{selectedPack.name}</h1>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-[var(--fg-3)]">{selectedPack.description}</p>
              <div className="mono mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-[var(--fg-4)]">
                <span className="inline-flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  {selectedPack.skillCount} skills
                </span>
                <span>v{selectedPack.version}</span>
                <span>{selectedPack.author}</span>
              </div>
              {selectedPack.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedPack.tags.map(tag => (
                    <span key={tag} className="chip">
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Download panel */}
          <div className="surface mt-7 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--fg)]">Get this pack</h3>
              <p className="mt-0.5 text-[13.5px] text-[var(--fg-3)]">
                All {selectedPack.skillCount} skills as one zip, with their sample code and docs.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {favoriteButton(selectedPack.id, true)}
              {libraryAction(selectedPack.id, 'md')}
              <Button variant="primary" onClick={() => void handleDownloadPack(selectedPack.id)} icon={<Download className="h-4 w-4" />}>
                Download zip
              </Button>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-8">
              {selectedPack.use_cases.length > 0 && (
                <section>
                  <h2 className="eyebrow mb-3">Use cases</h2>
                  <ul className="space-y-2">
                    {selectedPack.use_cases.map((useCase, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] text-[var(--fg-2)]">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c)]" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="eyebrow mb-3">Included skills · {selectedPack.skillCount}</h2>
                <ol className="space-y-2">
                  {selectedPack.skills.map((skill, idx) => (
                    <li key={skill.path || idx} className="surface flex items-start gap-3.5 p-4">
                      <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[11px] text-[var(--c)]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold text-[var(--fg)]">{skill.metadata?.name || skill.name}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-[var(--fg-3)]">{skill.metadata?.description || skill.description}</p>
                        {skill.metadata?.tags && skill.metadata.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {skill.metadata.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="chip h-[20px] text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="space-y-4 lg:col-span-4">
              {(selectedPack.prerequisites.required_tools.length > 0 ||
                selectedPack.prerequisites.optional_tools.length > 0 ||
                selectedPack.prerequisites.recommended_knowledge.length > 0) && (
                <div className="surface p-5">
                  <h2 className="eyebrow mb-3">Prerequisites</h2>
                  {selectedPack.prerequisites.required_tools.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-1.5 text-[12.5px] font-medium text-[var(--fg-2)]">Required tools</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPack.prerequisites.required_tools.map(tool => (
                          <span key={tool} className="chip" style={{ color: 'var(--warn)', borderColor: 'color-mix(in srgb, var(--warn) 35%, transparent)' }}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPack.prerequisites.optional_tools.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-1.5 text-[12.5px] font-medium text-[var(--fg-2)]">Optional tools</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPack.prerequisites.optional_tools.map(tool => (
                          <span key={tool} className="chip">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPack.prerequisites.recommended_knowledge.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-[12.5px] font-medium text-[var(--fg-2)]">Good to know</p>
                      <ul className="space-y-1 text-[13px] text-[var(--fg-3)]">
                        {selectedPack.prerequisites.recommended_knowledge.map((k, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-[var(--fg-5)]">·</span>
                            {k}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedPack.installation_notes && (
                <div className="surface p-5" style={{ borderColor: 'color-mix(in srgb, var(--warn) 30%, var(--line))' }}>
                  <h2 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--fg)]">
                    <Info className="h-4 w-4 text-[var(--warn)]" />
                    Installation notes
                  </h2>
                  <p className="text-[13px] leading-relaxed text-[var(--fg-3)]">{selectedPack.installation_notes}</p>
                </div>
              )}
            </aside>
          </div>
        </m.div>
      ) : (
        <m.div key="packs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {detailLoading && (
            <div className="mb-4 flex items-center gap-2 text-[13px] text-[var(--fg-4)]">
              <span className="spinner h-4 w-4 border" /> Loading pack…
            </div>
          )}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((pack, i) => (
              <m.article
                key={pack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4), ease: [0.2, 0.7, 0.2, 1] }}
                onMouseMove={trackSpotlight}
                onClick={() => void fetchPackDetail(pack.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    void fetchPackDetail(pack.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${pack.name}`}
                className="spot group flex cursor-pointer flex-col"
              >
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    <span className="glyph h-11 w-11 rounded-[11px] text-[22px]">{pack.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[var(--fg)] transition-colors group-hover:text-[color-mix(in_srgb,var(--c)_70%,var(--fg))]">
                        {pack.name}
                      </h3>
                      <p className="mono mt-1 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-4)]">
                        <Wrench className="h-3 w-3" />
                        {pack.skillCount} skills · v{pack.version}
                      </p>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--fg-3)]">{pack.description}</p>
                  {pack.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                      {pack.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="chip h-[22px]">
                          {tag}
                        </span>
                      ))}
                      {pack.tags.length > 3 && <span className="chip h-[22px] border-dashed">+{pack.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] px-3 py-2">
                  <span className="flex items-center gap-1">
                    {favoriteButton(pack.id)}
                    {libraryAction(pack.id)}
                  </span>
                  <span className={cn('inline-flex items-center gap-1 text-[12px] text-[var(--fg-4)] transition-all group-hover:text-[var(--c)]')}>
                    Details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </m.article>
            ))}
          </div>

          {onlyFavorites && packs.length > 0 && shown.length === 0 && (
            <p className="py-16 text-center text-[14px] text-[var(--fg-3)]">
              No favorite packs yet. Star a pack to pin it here.
            </p>
          )}

          {packs.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <span className="glyph mb-4 h-12 w-12 rounded-[12px]">
                <Package className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-[var(--fg)]">
                {libraryMode === 'my' ? 'No skill packs in My Library yet' : 'No skill packs available'}
              </h3>
              <p className="mt-1.5 max-w-sm text-[14px] text-[var(--fg-3)]">
                {libraryMode === 'my' ? 'Add one from the public library and it will show up here.' : 'Check back soon.'}
              </p>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
