import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* IMPORTANT: This proxy ONLY works in local development (npm run dev)
It does NOT work in production builds (Vercel deployment)
For production, you must use the full API_URL in your axios calls
 */

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})