/// <reference types="vite/client" />

// Vite has no built-in asset type for .glb — `?url` always resolves to a
// fingerprinted asset URL regardless of extension, this just tells
// TypeScript what that import's shape is (see src/data/models.ts).
declare module '*.glb?url' {
  const src: string
  export default src
}
