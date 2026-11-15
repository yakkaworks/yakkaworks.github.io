import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // Relative assets keep this app portable if it is later mounted under MkDocs.
  base: './',
});