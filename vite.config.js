import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
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
  },
  // Улучшаем время загрузки в dev режиме
  esbuild: {
    target: 'es2020', // Используем современный target для лучшей производительности
  },
})
