import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': import.meta.dirname + '/src',
    },
  },
  server: {
    watch: {
      // Exclude the raw source asset folders — Windows can lock these files
      ignored: ['**/images for logos/**', '**/add_later/**'],
    },
  },
})
