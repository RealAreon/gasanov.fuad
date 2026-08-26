import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  publicDir: 'public',
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    modulePreload: false,
  },
});
