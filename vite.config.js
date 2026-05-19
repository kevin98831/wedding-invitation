import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['Android >= 8', 'Chrome >= 61', 'iOS >= 12'],
      modernPolyfills: true,
    }),
  ],
  build: {
    target: 'es2015',
    cssTarget: 'chrome61',
  },
})
