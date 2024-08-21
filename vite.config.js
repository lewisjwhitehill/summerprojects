import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/summerprojects/src/dist/',
  plugins: [react()],
  build: {
    outDir: 'dist' // This is the default value
  },
})
