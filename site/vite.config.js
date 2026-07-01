import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages builds serve from the /off-menu-site/ subpath; Vercel (and dev)
// serve from root. Vercel sets process.env.VERCEL during its build.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' && !process.env.VERCEL ? '/off-menu-site/' : '/',
  server: { host: true },
}))
