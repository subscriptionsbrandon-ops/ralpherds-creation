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
  // Conservative JS target — Vite's default ('modules') assumes a fairly
  // recent baseline (~Safari 14+/Chrome 87+/native-ES-module support) and
  // this sandbox has no WebKit to verify against directly. If a visitor's
  // browser predates that baseline, the bundle can fail to parse with NO
  // visible error (the module script just never executes) — React never
  // mounts, and the page is a silent blank white screen. es2018 is broadly
  // supported by any iOS/Safari version from the last several years and by
  // every other evergreen browser, at the cost of slightly larger output
  // (some newer syntax gets transpiled down instead of shipped natively).
  build: {
    target: 'es2018',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
