import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        support: resolve(root, 'support/index.html'),
        privacy: resolve(root, 'privacy/index.html'),
      },
    },
  },
});
