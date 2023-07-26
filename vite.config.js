import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['canvg', 'html2canvas', 'dompurify'],
    },
  },
})
