import { defineConfig } from 'vite'
import path from 'path'
export default defineConfig({
  server: {
    port: 3030,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
