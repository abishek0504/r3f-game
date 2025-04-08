import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/r3f-game/', // Add this line for GitHub Pages deployment
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})
