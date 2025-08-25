/**
 * Утилиты для оптимизации производительности
 */

// Функция для измерения производительности
export const measurePerformance = (name, fn) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`${name} took ${end - start} milliseconds`)
    return result
  }
  return fn()
}

// Функция для batch обновлений
export const batchUpdate = (updates) => {
  if ('queueMicrotask' in window) {
    queueMicrotask(() => {
      updates.forEach(update => update())
    })
  } else {
    setTimeout(() => {
      updates.forEach(update => update())
    }, 0)
  }
}

// Функция для throttling
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Функция для debouncing
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Функция для предзагрузки изображений
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Функция для предзагрузки нескольких изображений
export const preloadImages = async (srcs) => {
  const promises = srcs.map(src => preloadImage(src))
  return Promise.allSettled(promises)
}

// Функция для проверки поддержки WebP
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// Функция для оптимизации изображений
export const getOptimizedImageUrl = (src, format = 'webp') => {
  if (!src) return src
  
  // Если изображение уже в нужном формате, возвращаем как есть
  if (src.includes(`.${format}`)) return src
  
  // Для статических изображений можно добавить параметры оптимизации
  if (src.includes('/static/')) {
    return `${src}?format=${format}&quality=85`
  }
  
  return src
}

// Функция для очистки кэша
export const clearCache = () => {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name)
      })
    })
  }
}

// Функция для проверки онлайн статуса
export const isOnline = () => {
  return navigator.onLine
}

// Функция для оптимизации загрузки шрифтов
export const loadFonts = (fontUrls) => {
  if ('fonts' in document) {
    return Promise.all(
      fontUrls.map(url => 
        document.fonts.load(`1em ${url}`)
      )
    )
  }
  return Promise.resolve()
}
