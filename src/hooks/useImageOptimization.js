import { useEffect, useState } from 'react'

/**
 * Хук для оптимизации изображений
 * @param {string} src - URL изображения
 * @param {Object} options - Опции оптимизации
 * @returns {Object} - Оптимизированное изображение
 */
export const useImageOptimization = (src, options = {}) => {
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const [isWebPSupported, setIsWebPSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    quality = 80,
    maxWidth = 800,
    format = 'auto'
  } = options

  useEffect(() => {
    // Проверяем поддержку WebP
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }

    setIsWebPSupported(checkWebPSupport())
  }, [])

  useEffect(() => {
    if (!src) return

    setIsLoading(true)

    const optimizeImage = async () => {
      try {
        // Если поддерживается WebP и формат auto, конвертируем
        if (isWebPSupported && format === 'auto') {
          const webpSrc = await convertToWebP(src, quality, maxWidth)
          setOptimizedSrc(webpSrc)
        } else {
          // Иначе используем оригинальное изображение
          setOptimizedSrc(src)
        }
      } catch (error) {
        console.warn('Ошибка оптимизации изображения:', error)
        setOptimizedSrc(src)
      } finally {
        setIsLoading(false)
      }
    }

    optimizeImage()
  }, [src, isWebPSupported, quality, maxWidth, format])

  return {
    src: optimizedSrc,
    isLoading,
    isWebPSupported
  }
}

/**
 * Конвертирует изображение в WebP
 * @param {string} src - URL изображения
 * @param {number} quality - Качество (0-100)
 * @param {number} maxWidth - Максимальная ширина
 * @returns {Promise<string>} - Data URL WebP изображения
 */
const convertToWebP = (src, quality, maxWidth) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Вычисляем новые размеры
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Рисуем изображение
        ctx.drawImage(img, 0, 0, width, height)

        // Конвертируем в WebP
        const webpDataUrl = canvas.toDataURL('image/webp', quality / 100)
        resolve(webpDataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = reject
    img.src = src
  })
}

/**
 * Создает placeholder для изображения
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string} text - Текст
 * @returns {string} - Data URL placeholder
 */
export const createImagePlaceholder = (width = 300, height = 200, text = '') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = width
  canvas.height = height
  
  // Градиентный фон
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f0f0f0')
  gradient.addColorStop(1, '#e0e0e0')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Добавляем текст если указан
  if (text) {
    ctx.fillStyle = '#666'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
  }
  
  return canvas.toDataURL()
}
