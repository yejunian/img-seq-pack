import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

export default defineConfig({
  base: '/img-seq-pack/',

  build: {
    rolldownOptions: {
      external: ['canvg', 'html2canvas', 'dompurify'],
    },
  },

  plugins: [ViteMinifyPlugin()],
})
