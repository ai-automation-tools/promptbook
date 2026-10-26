/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, type ReactNode } from 'react';

/**
 * Last line of defence: an uncaught render error (or a lazy chunk that still fails after
 * lazyReload's one reload) would otherwise unmount the tree and leave a black page.
 * In dev that almost always means the server's Vite dep cache is stale — restart it.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div role="alert" className="flex min-h-dvh items-center justify-center bg-[var(--bg)] p-4">
        <div className="surface max-w-lg p-6">
          <h1 className="mb-2 text-[17px] font-semibold text-[var(--fg)]">Something failed to load</h1>
          <p className="mb-3 text-[13.5px] text-[var(--fg-3)]">
            Running it locally? The dev server is probably stale (dependencies or the library changed
            under it): stop it, run <code className="mono">npm run dev</code> in <code className="mono">site/</code>, then reload.
            On the hosted demo, a newer version was likely just deployed; reload the page.
          </p>
          <pre className="mono mb-4 overflow-x-auto whitespace-pre-wrap text-[11.5px] text-[var(--fg-4)]">{error.message}</pre>
          <button type="button" className="btn btn-primary" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}
