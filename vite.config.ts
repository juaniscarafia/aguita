import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Agüita',
        short_name: 'Agüita',
        start_url: '.',
        display: 'standalone',
        background_color: '#e0f7fa',
        theme_color: '#00bcd4',
        description: '¡Recordá tomar agua todos los días!',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})