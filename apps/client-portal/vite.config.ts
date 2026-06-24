import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const appDir = __dirname;
const root = resolve(appDir, '../..');

const libAlias = (name: string) =>
  ({ find: `@dev-team-cv/${name}`, replacement: resolve(root, `libs/${name}/src/index.ts`) });

export default defineConfig({
  root: appDir,
  cacheDir: '../../node_modules/.vite/apps/client-portal',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: resolve(appDir, 'tailwind.config.js') }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: [
      libAlias('ui'),
      libAlias('auth'),
      libAlias('supabase'),
      libAlias('shared-types'),
      libAlias('shared-utils'),
      libAlias('shared-hooks'),
      libAlias('features-team'),
      libAlias('features-projects'),
      libAlias('features-dashboard'),
      libAlias('features-media'),
      libAlias('theme'),
    ],
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
  },
});
