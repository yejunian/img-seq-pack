import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  build: {
    outDir: './public/template',

    rollupOptions: {
      input: resolve(__dirname, 'template.html'),
    },
  },

  plugins: [viteSingleFile()],
})
