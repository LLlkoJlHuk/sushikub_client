/**
 * Простой кэш для API запросов с TTL (Time To Live)
 */
class ApiCache {
  constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 минут по умолчанию
  }

  /**
   * Генерирует ключ для кэша на основе URL и параметров
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {})
    
    return `${url}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Получить данные из кэша
   */
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Проверяем TTL
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * Сохранить данные в кэш
   */
  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl
    this.cache.set(key, {
      data,
      expiry,
      timestamp: Date.now()
    })
  }

  /**
   * Удалить данные из кэша
   */
  delete(key) {
    this.cache.delete(key)
  }

  /**
   * Очистить весь кэш
   */
  clear() {
    this.cache.clear()
  }

  /**
   * Очистить устаревшие записи
   */
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Получить статистику кэша
   */
  getStats() {
    const now = Date.now()
    let valid = 0
    let expired = 0

    for (const [, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired
    }
  }

  /**
   * Инвалидировать кэш по паттерну
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern)
    const keysToDelete = []

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
    return keysToDelete.length
  }
}

// Создаем глобальный экземпляр кэша
export const apiCache = new ApiCache()

// Автоматическая очистка каждые 10 минут
setInterval(() => {
  apiCache.cleanup()
}, 10 * 60 * 1000)

/**
 * Декоратор для кэширования API функций
 */
export const withCache = (fn, ttl = 5 * 60 * 1000) => {
  return async (...args) => {
    // Генерируем ключ на основе имени функции и аргументов
    const key = `${fn.name}:${JSON.stringify(args)}`
    
    // Проверяем кэш
    const cached = apiCache.get(key)
    if (cached) {
      return cached
    }

    // Выполняем запрос
    const result = await fn(...args)
    // Сохраняем в кэш только при успехе
    apiCache.set(key, result, ttl)
    return result
  }
}

export default ApiCache
