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
      // Exclude folders Windows may lock — prevents EBUSY crashes
      ignored: [
        '**/images for logos/**',
        '**/add_later/**',
        '**/public/images/**',
      ],
    },
  },
})
