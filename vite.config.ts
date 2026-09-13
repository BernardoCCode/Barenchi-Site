import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { seoPrerender } from './vite-plugin-seo.ts'

function stripSpaRedirects(): Plugin {
  return {
    name: 'strip-spa-redirects',
    apply: 'build',
    closeBundle() {
      const redirects = join(process.cwd(), 'dist', '_redirects')
      if (existsSync(redirects)) unlinkSync(redirects)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender(), stripSpaRedirects()],
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL('./src', import.meta.url))}/`,
      },
    ],
  },
})
