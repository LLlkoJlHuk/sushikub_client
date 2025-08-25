import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
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
    target: 'es2018',
    // Дополнительные оптимизации для продакшена
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: false, // Отключаем source maps для CSS в dev режиме
  },
  // Оптимизации для dev режима
  server: {
    hmr: {
      overlay: false, // Отключаем overlay для HMR для улучшения производительности
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Предварительно бандлим основные зависимости
    exclude: ['swiper'], // Исключаем проблемные зависимости
  },
  // Улучшаем время загрузки в dev режиме
  esbuild: {
    target: 'es2020', // Используем современный target для лучшей производительности
    jsx: 'automatic', // Автоматический JSX для лучшей производительности
  },
  // Оптимизации для производительности
  define: {
    'process.env.NODE_ENV': '"development"'
  }
})
