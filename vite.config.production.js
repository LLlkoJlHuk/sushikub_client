import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Отключаем source maps в продакшене
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['swiper', 'react-transition-group'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          utils: ['axios', 'mobx', 'mobx-react-lite', 'jwt-decode']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Оптимизация для продакшена
    target: 'es2018'
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/mixins.scss";`
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
