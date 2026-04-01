import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // FAKTA: Tanpa ini, layar websitemu akan blank putih saat di-hosting
  base: '/panser-badak/' 
})