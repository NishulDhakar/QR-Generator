import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['qr-icon.svg', 'qr-icon-192.png', 'qr-icon-512.png'],
      manifest: {
        name: 'Smart QR Generator',
        short_name: 'QR Generator',
        description: 'Create beautiful, customized QR codes for any purpose',
        theme_color: '#4f46e5',
        icons: [
          {
            src: 'qr-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'qr-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          qrcode: ['qrcode.react'],
          colorpicker: ['react-color']
        }
      }
    }
  }
})