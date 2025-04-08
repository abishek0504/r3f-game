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
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          three: ['three'],
          fiber: ['@react-three/fiber'],
          drei: ['@react-three/drei'],
          rapier: ['@react-three/rapier'],
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
})
