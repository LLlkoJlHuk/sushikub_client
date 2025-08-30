/**
 * Утилиты для работы с адаптивными изображениями
 */

import { API_BASE_URL } from '../constants'

// Определяем размеры изображений для разных контекстов
export const IMAGE_SIZES = {
  // Размеры для карточек продуктов
  PRODUCT_CARD: {
    small: { width: 120, height: 70 },    // мобильные устройства
    medium: { width: 180, height: 105 },  // планшеты
    large: { width: 240, height: 140 },   // десктоп
    original: { width: 1024, height: 600 } // оригинал (fallback)
  },
  
  // Размеры для карточек меню/категорий
  MENU_CARD: {
    small: { width: 100, height: 58 },    // мобильные устройства
    medium: { width: 150, height: 88 },   // планшеты
    large: { width: 220, height: 128 },   // десктоп
    original: { width: 1024, height: 600 } // оригинал (fallback)
  },
  
  // Размеры для баннеров
  BANNER: {
    mobile: { width: 320, height: 400 },   // мобильные баннеры
    tablet: { width: 480, height: 600 },   // планшеты
    desktop: { width: 1035, height: 450 }, // десктоп
    original: { width: 1024, height: 600 } // оригинал (fallback)
  },
  
  // Размеры для корзины
  BASKET_ITEM: {
    small: { width: 80, height: 47 },     // мобильные устройства
    medium: { width: 100, height: 58 },   // планшеты
    large: { width: 120, height: 70 },    // десктоп
    original: { width: 1024, height: 600 } // оригинал (fallback)
  },
  
  // Размеры для логотипа
  LOGO: {
    small: { width: 45, height: 45 },     // мобильные устройства
    medium: { width: 60, height: 60 },    // планшеты
    large: { width: 80, height: 80 },     // десктоп
    original: { width: 994, height: 994 } // оригинал (fallback)
  },
  
  // Размеры для модального окна продукта
  PRODUCT_MODAL: {
    small: { width: 280, height: 164 },   // мобильные устройства
    medium: { width: 350, height: 205 },  // планшеты
    large: { width: 400, height: 234 },   // десктоп
    original: { width: 1024, height: 600 } // оригинал (fallback)
  }
}

/**
 * Генерирует URL для изображения с указанными размерами
 * @param {string} imagePath - путь к изображению
 * @param {object} size - объект с шириной и высотой
 * @returns {string} URL изображения
 */
export const getImageUrl = (imagePath, size = null) => {
  if (!imagePath) return null
  
  const baseUrl = `${API_BASE_URL}/${imagePath}`
  
  // Если размер не указан, возвращаем оригинальный URL
  if (!size) return baseUrl
  
  // Если размер слишком большой, возвращаем оригинал
  if (size.width >= 1024 || size.height >= 600) {
    return baseUrl
  }
  
  // Добавляем параметры размера для сжатия на сервере
  return `${baseUrl}?w=${size.width}&h=${size.height}&q=85&f=webp`
}

/**
 * Генерирует srcset для адаптивных изображений
 * @param {string} imagePath - путь к изображению
 * @param {object} sizes - объект с размерами (small, medium, large, original)
 * @returns {string} строка srcset
 */
export const generateSrcSet = (imagePath, sizes) => {
  if (!imagePath || !sizes) return ''
  
  const srcsetParts = []
  
  // Добавляем каждый размер в srcset
  Object.entries(sizes).forEach(([, size]) => {
    const url = getImageUrl(imagePath, size)
    if (url) {
      // Добавляем дескриптор ширины
      srcsetParts.push(`${url} ${size.width}w`)
    }
  })
  
  return srcsetParts.join(', ')
}

/**
 * Генерирует строку sizes для адаптивных изображений
 * @param {string} type - тип изображения (PRODUCT_CARD, MENU_CARD, etc.)
 * @returns {string} строка sizes
 */
export const generateSizes = (type) => {
  switch (type) {
    case 'PRODUCT_CARD':
      return '(max-width: 480px) 120px, (max-width: 768px) 160px, (max-width: 1400px) 180px, 180px'
    
    case 'MENU_CARD':
      return '(max-width: 480px) 80px, (max-width: 576px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 150px, 140px'
    
    case 'BANNER':
      return '(max-width: 370px) 300px, (max-width: 480px) 320px, (max-width: 576px) 380px, (max-width: 768px) 480px, (max-width: 1024px) 750px, (max-width: 1250px) 900px, 1035px'
    
    case 'BASKET_ITEM':
      return '(max-width: 480px) 80px, (max-width: 768px) 100px, 120px'
    
    case 'LOGO':
      return '(max-width: 768px) 45px, (max-width: 1024px) 60px, 80px'
    
    case 'PRODUCT_MODAL':
      return '(max-width: 480px) 280px, (max-width: 768px) 350px, 400px'
    
    default:
      return '100vw'
  }
}

/**
 * Получает оптимальный размер изображения в зависимости от ширины экрана
 * @param {string} type - тип изображения
 * @param {number} screenWidth - ширина экрана
 * @returns {object} размер изображения
 */
export const getOptimalSize = (type, screenWidth) => {
  const sizes = IMAGE_SIZES[type]
  if (!sizes) return null
  
  if (screenWidth <= 480) {
    return sizes.small
  } else if (screenWidth <= 768) {
    return sizes.medium
  } else if (screenWidth <= 1400) {
    return sizes.large
  } else {
    return sizes.large // Используем large вместо original для экономии трафика
  }
}

/**
 * Создает объект с адаптивными изображениями для компонента
 * @param {string} imagePath - путь к изображению
 * @param {string} type - тип изображения
 * @returns {object} объект с src, srcset и sizes
 */
export const createResponsiveImage = (imagePath, type) => {
  if (!imagePath || !IMAGE_SIZES[type]) {
    return {
      src: imagePath ? `${API_BASE_URL}/${imagePath}` : null,
      srcset: '',
      sizes: ''
    }
  }
  
  const sizes = IMAGE_SIZES[type]
  
  return {
    src: getImageUrl(imagePath, sizes.medium), // Используем medium как fallback
    srcset: generateSrcSet(imagePath, sizes),
    sizes: generateSizes(type)
  }
}

/**
 * Предзагрузка критических изображений
 * @param {Array} imagePaths - массив путей к изображениям
 * @param {string} type - тип изображений
 */
export const preloadCriticalImages = (imagePaths, type) => {
  if (!Array.isArray(imagePaths)) return
  
  const screenWidth = window.innerWidth
  const optimalSize = getOptimalSize(type, screenWidth)
  
  imagePaths.forEach(imagePath => {
    if (imagePath) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = getImageUrl(imagePath, optimalSize)
      document.head.appendChild(link)
    }
  })
}

/**
 * Проверяет, поддерживает ли браузер формат WebP
 * @returns {Promise<boolean>}
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}
