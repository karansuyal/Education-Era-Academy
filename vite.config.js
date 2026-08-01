import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'sitemap.xml', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Education Era Academy',
        short_name: 'EEA',
        description: 'Coaching for Class 9-12, Government Exam Preparation, and Computer Applications & Coding.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F0E3',
        theme_color: '#1B3A2F',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cache the app shell + static assets for offline/repeat visits.
        // API calls (backend data) are intentionally left un-cached so the
        // site always shows fresh content, not stale offline data.
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico}'],
        navigateFallbackDenylist: [/^\/admin/],
      },
    }),
  ],
})