/**
 * Сервис для оптимизации изображений
 */

// Кэш для оптимизированных изображений
const imageCache = new Map()

/**
 * Оптимизирует размер изображения в зависимости от экрана
 * @param {string} imageUrl - URL изображения
 * @param {number} maxWidth - Максимальная ширина
 * @param {number} quality - Качество (0-100)
 * @returns {string} - Оптимизированный URL
 */
export const optimizeImage = (imageUrl, maxWidth = 800, quality = 80) => {
  if (!imageUrl) return ''
  
  // Проверяем кэш
  const cacheKey = `${imageUrl}_${maxWidth}_${quality}`
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)
  }

  // Для внешних изображений возвращаем оригинальный URL
  if (imageUrl.startsWith('http')) {
    imageCache.set(cacheKey, imageUrl)
    return imageUrl
  }

  // Для локальных изображений можно добавить параметры оптимизации
  const optimizedUrl = imageUrl
  imageCache.set(cacheKey, optimizedUrl)
  
  return optimizedUrl
}

/**
 * Предзагружает изображение
 * @param {string} src - URL изображения
 */
export const preloadImage = (src) => {
  if (!src) return
  
  const img = new Image()
  img.src = src
}

/**
 * Предзагружает несколько изображений
 * @param {string[]} sources - Массив URL изображений
 */
export const preloadImages = (sources) => {
  if (!Array.isArray(sources)) return
  
  sources.forEach(src => {
    if (src) preloadImage(src)
  })
}

/**
 * Создает placeholder для изображения
 * @param {number} width - Ширина
 * @param {number} height - Высота
 * @param {string} text - Текст для placeholder
 * @returns {string} - Data URL для placeholder
 */
export const createPlaceholder = (width = 300, height = 200, text = 'Loading...') => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = width
  canvas.height = height
  
  // Рисуем фон
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, width, height)
  
  // Рисуем текст
  ctx.fillStyle = '#666'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toDataURL()
}

/**
 * Очищает кэш изображений
 */
export const clearImageCache = () => {
  imageCache.clear()
}
