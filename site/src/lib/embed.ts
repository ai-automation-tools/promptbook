import type { Theme } from '../hooks/useTheme';

/**
 * The suite embed contract, v1: opened as `?embed=1` inside a frame (a Project
 * Hub tab, the suite shell), the app hides the chrome the shell replaces (brand
 * mark, source bar, Light | Dark switch), tells the shell when it's ready and
 * where it is, and takes the shell's theme. Standalone, `?embed=1` does nothing.
 *
 * Messages carry `suite: 1` and `contract: 1`. Which pages may be the parent at
 * all is decided by the server (FRAME_ANCESTORS → CSP frame-ancestors), so the
 * app talks only to `window.parent`: it posts with `'*'` and accepts nothing but
 * messages whose source is its parent.
 */
const CONTRACT = 1;

export const EMBED: boolean =
  window.parent !== window && new URLSearchParams(window.location.search).get('embed') === '1';

type ShellMessage =
  | { type: 'ready'; app: 'promptbook' }
  | { type: 'route'; path: string };

export function tellShell(msg: ShellMessage) {
  if (EMBED) window.parent.postMessage({ suite: 1, contract: CONTRACT, ...msg }, '*');
}

/** Calls `apply` with each theme the shell sends; returns the unsubscribe. */
export function onShellTheme(apply: (theme: Theme) => void) {
  if (!EMBED) return () => {};
  const listener = (e: MessageEvent) => {
    const d = e.data as { suite?: unknown; type?: unknown; value?: unknown } | null;
    if (e.source !== window.parent || d?.suite !== 1 || d.type !== 'theme') return;
    if (d.value === 'light' || d.value === 'dark') apply(d.value);
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
