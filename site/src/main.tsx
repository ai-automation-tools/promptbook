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
// time. After the first frame, or 250 ms in a background tab, where frames don't run.
// ponytail: the app's chunks start downloading after the first paint, not with the CSS; preload
// them (a modulepreload per chunk) if time-to-interactive ever matters more than first paint.
let started = false;
const start = () => {
  if (started) return;
  started = true;
  void import('./app-entry.tsx');
};
requestAnimationFrame(() => setTimeout(start, 0));
setTimeout(start, 250);
