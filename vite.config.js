import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'vite-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'virtual': ['@tanstack/react-virtual']
        }
      }
    }
  }
})
