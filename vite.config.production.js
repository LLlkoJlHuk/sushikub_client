import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks для основных библиотек
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router-dom')) {
              return 'router'
            }
            if (id.includes('swiper') || id.includes('react-transition-group')) {
              return 'ui-vendor'
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('yup')) {
              return 'forms-vendor'
            }
            if (id.includes('axios') || id.includes('mobx') || id.includes('jwt-decode')) {
              return 'utils-vendor'
            }
            return 'vendor'
          }
          
          // Разделение кода по функциональности
          if (id.includes('/pages/Admin') || id.includes('/components/Modals/CreateEdit')) {
            return 'admin'
          }
          if (id.includes('/pages/Auth')) {
            return 'auth'
          }
          if (id.includes('/components/Modals')) {
            return 'modals'
          }
        },
        // Оптимизация имен файлов
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    // Оптимизация сборки
    reportCompressedSize: false,
    cssCodeSplit: true
  },
  plugins: [
    react({
      // Оптимизации React
      babel: {
        plugins: [
          // Удаление PropTypes в продакшене
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
        ]
      }
    }),
    // Сжатие файлов
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$ /, /\.(gz)$/]
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$ /, /\.(gz)$/]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        // Оптимизация SCSS
        outputStyle: 'compressed'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  // Оптимизация dev сервера
  server: {
    hmr: {
      overlay: false
    }
  }
})
