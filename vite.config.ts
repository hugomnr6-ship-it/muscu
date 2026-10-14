/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages sert l'appli sous /<nom-du-depot>/ : le workflow passe BASE_PATH.
const base = process.env.BASE_PATH ?? '/'

/** CSP ajoutée seulement au build (le serveur de dev de Vite injecte des scripts inline). */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https://i.ytimg.com",
  "frame-src https://www.youtube-nocookie.com",
  "connect-src 'self' https://i.ytimg.com",
  "manifest-src 'self'",
  "worker-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

function cspProduction(): Plugin {
  return {
    name: 'csp-production',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      ),
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    cspProduction(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon.png'],
      manifest: {
        name: 'Muscu — mon programme',
        short_name: 'Muscu',
        description: 'Programme de musculation Fitness Park et suivi de progression',
        lang: 'fr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#EEF1F6',
        theme_color: '#EEF1F6',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Seules les polices latines sont mises en cache (les autres alphabets ne servent pas).
        globPatterns: ['**/*.{js,css,html,png,svg}', '**/geist-latin-[4-7]00-normal-*.woff2'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://i.ytimg.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'miniatures-videos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/logic/**', 'src/storage/**'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
