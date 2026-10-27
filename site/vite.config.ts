import 'dotenv/config'; // READ_ONLY in site/.env must reach a standalone `vite build` too
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Nothing in src/ reads GEMINI_API_KEY, and the @google/genai dependency it was
// added for is gone. The old `define` inlined the key into the client bundle,
// so it was a leak waiting for someone to set the variable.
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // Same rule as READ_ONLY in lib/my-library.ts: the hosted demo on Vercel
    // has no My Library, so the UI hides everything that would write to one.
    define: {
      __READ_ONLY__: JSON.stringify(process.env.READ_ONLY === 'true' || Boolean(process.env.VERCEL)),
    },
    build: {
      rollupOptions: {
        output: {
          // React and motion are ~475 kB of the entry chunk and change only
          // when we bump them, so keeping them out of the app chunk means a
          // content edit no longer invalidates them in anyone's cache. It also
          // puts every chunk under Vite's 500 kB warning threshold.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react-vendor';
            if (/[\/]node_modules[\/](motion|motion-dom|motion-utils|framer-motion)[\/]/.test(id)) return 'motion';
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
