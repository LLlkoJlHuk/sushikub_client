import { useCallback, useEffect, useRef } from 'react'

// Хук для оптимизации производительности
export const usePerformance = () => {
  const observerRef = useRef(null)
  const intersectionObserverRef = useRef(null)

  // Оптимизация скролла с throttling
  const throttle = useCallback((func, limit) => {
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
  }, [])

  // Оптимизация resize с debouncing
  const debounce = useCallback((func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }, [])

  // Intersection Observer для lazy loading
  const createIntersectionObserver = useCallback((callback, options = {}) => {
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect()
    }

    intersectionObserverRef.current = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })

    return intersectionObserverRef.current
  }, [])

  // Mutation Observer для отслеживания изменений DOM
  const createMutationObserver = useCallback((callback, options = {}) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new MutationObserver(callback)

    return observerRef.current
  }, [])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [])

  // Функция для измерения производительности
  const measurePerformance = useCallback((name, fn) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now()
      const result = fn()
      const end = performance.now()
      console.log(`${name} took ${end - start} milliseconds`)
      return result
    }
    return fn()
  }, [])

  // Функция для batch обновлений
  const batchUpdate = useCallback((updates) => {
    if ('queueMicrotask' in window) {
      queueMicrotask(() => {
        updates.forEach(update => update())
      })
    } else {
      setTimeout(() => {
        updates.forEach(update => update())
      }, 0)
    }
  }, [])

  return {
    throttle,
    debounce,
    createIntersectionObserver,
    createMutationObserver,
    measurePerformance,
    batchUpdate
  }
}

// Хук для оптимизации изображений
export const useImageOptimization = () => {
  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }, [])

  const preloadImages = useCallback(async (srcs) => {
    const promises = srcs.map(src => preloadImage(src))
    return Promise.allSettled(promises)
  }, [])

  return {
    preloadImage,
    preloadImages
  }
}

// Хук для оптимизации API запросов
export const useApiOptimization = () => {
  const cache = useRef(new Map())
  const pendingRequests = useRef(new Map())

  const cachedFetch = useCallback(async (url, options = {}) => {
    const cacheKey = `${url}-${JSON.stringify(options)}`
    
    // Проверяем кэш
    if (cache.current.has(cacheKey)) {
      const cached = cache.current.get(cacheKey)
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 минут
        return cached.data
      }
    }

    // Проверяем pending запросы
    if (pendingRequests.current.has(cacheKey)) {
      return pendingRequests.current.get(cacheKey)
    }

    // Выполняем запрос
    const requestPromise = fetch(url, options)
      .then(async (response) => {
        const data = await response.json()
        
        // Кэшируем результат
        cache.current.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        
        // Удаляем из pending
        pendingRequests.current.delete(cacheKey)
        
        return data
      })
      .catch((error) => {
        pendingRequests.current.delete(cacheKey)
        throw error
      })

    pendingRequests.current.set(cacheKey, requestPromise)
    return requestPromise
  }, [])

  const clearCache = useCallback(() => {
    cache.current.clear()
  }, [])

  return {
    cachedFetch,
    clearCache
  }
}
