// Declares `*.css` side-effect imports, which TypeScript 7 checks
/// <reference types="vite/client" />
// Fonts ship with the app (PB-11): the Google Fonts stylesheet was a render-blocking request
// to a second origin, the biggest cost on a phone's first paint.
import '@fontsource-variable/inter/wght.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './index.css';

// The page paints index.html's "Loading the library…" first, then fetches and runs the app
// (PB-11). Downloading and evaluating React and the app was most of a slow phone's first-paint
// time, so the app starts once the browser reports that first paint. A hidden tab paints
// nothing, so it starts at once; the timer is a backstop for a browser that never reports.
// ponytail: the app's chunks download after the first paint, not alongside the CSS; preload
// them (a modulepreload per chunk) if time-to-interactive ever matters more than first paint.
let started = false;
const start = () => {
  if (started) return;
  started = true;
  void import('./app-entry.tsx');
};
if (document.visibilityState === 'hidden' || !('PerformanceObserver' in window)) start();
else {
  new PerformanceObserver((list, observer) => {
    if (list.getEntriesByName('first-contentful-paint').length) {
      observer.disconnect();
      start();
    }
  }).observe({ type: 'paint', buffered: true });
  setTimeout(start, 3000);
}
