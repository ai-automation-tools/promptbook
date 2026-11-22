import 'dotenv/config'; // READ_ONLY in site/.env must reach a standalone `vite build` too
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Nothing in src/ reads GEMINI_API_KEY, and the @google/genai dependency it was
// added for is gone. The old `define` inlined the key into the client bundle,
// so it was a leak waiting for someone to set the variable.
export default defineConfig(() => {
  const readOnly = process.env.READ_ONLY === 'true' || Boolean(process.env.VERCEL);
  return {
    plugins: [
      react(),
      tailwindcss(),
      // The org's cookie-consent script belongs to the hosted demo; a local copy has no
      // analytics to ask about and shouldn't call out to ai-automation-tools.dev (PB-15).
      {
        name: 'consent-on-demo-only',
        transformIndexHtml: (html: string) => (readOnly ? html : html.replace(/\n\s*<script src="https:\/\/ai-automation-tools\.dev\/consent\.js" defer><\/script>/, '')),
      },
    ],
    // Same rule as READ_ONLY in lib/my-library.ts: the hosted demo on Vercel
    // has no My Library, so the UI hides everything that would write to one.
    define: {
      __READ_ONLY__: JSON.stringify(readOnly),
    },
    build: {
      // Fonts stay files: a small subset inlined as base64 would sit in the render-blocking CSS
      // for every visitor, and the CSP's font-src has no data: either.
      assetsInlineLimit: (file: string) => (/\.(woff2?|ttf)$/.test(file) ? false : undefined),
      rollupOptions: {
        output: {
          // React is most of the entry and changes only when we bump it, so
          // keeping it out of the app chunk means a content edit no longer
          // invalidates it in anyone's cache. It also keeps every chunk under
          // Vite's 500 kB warning threshold.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react-vendor';
            // motion is not pinned to one chunk: LazyMotion loads its animation features after
            // first paint (src/lib/motion-features.ts), and a single chunk would pull them in up front.
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3010,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      // server.ts runs Vite in middleware mode, which opens the HMR WebSocket on its own
      // port. Pinned to Vite's default, 24678, so it can't drift; edge-spectrum uses 24679.
      hmr: process.env.DISABLE_HMR === 'true' ? false : { port: 24678 },
      // Vite answers 403 to any Host but localhost, middleware mode included. ALLOWED_HOSTS
      // (site/.env) lets in the names a proxy such as `tailscale serve` forwards unchanged.
      allowedHosts: process.env.ALLOWED_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean),
    },
  };
});
