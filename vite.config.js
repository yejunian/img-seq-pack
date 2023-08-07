import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['canvg', 'html2canvas', 'dompurify'],
    },
  },

  plugins: [ViteMinifyPlugin()],
})
