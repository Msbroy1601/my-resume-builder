import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // pdfjs-dist ships its own ESM build — exclude from Vite pre-bundling to avoid worker errors
    exclude: ['pdfjs-dist'],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  }
})