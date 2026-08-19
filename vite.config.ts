import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths — this deploys to a GitHub Pages *project* page
  // (https://<user>.github.io/ralpherds-creation/, not the domain root), so
  // an absolute base of "/" would 404 every JS/CSS asset (browser requests
  // https://<user>.github.io/assets/... instead of .../ralpherds-creation/assets/...)
  // and the page renders blank. "./" resolves assets relative to index.html
  // wherever it's served from, so it works at any subpath.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
