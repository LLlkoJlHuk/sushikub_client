import { useCallback, useEffect, useRef, useState } from 'react'

// Кэш для загруженных изображений
const imageCache = new Map()

/**
 * Хук для lazy loading изображений с заглушкой и кэшированием
 * @param {string} src - URL изображения для загрузки
 * @param {string} placeholder - URL заглушки
 * @param {Object} options - дополнительные опции
 * @returns {Object} - объект с состояниями загрузки
 */
export const useLazyImage = (src, placeholder, options = {}) => {
  const { 
    enableCache = true, 
    enableIntersectionObserver = false,
    rootMargin = '50px'
  } = options
  
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!enableIntersectionObserver)
  
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Функция загрузки изображения с кэшированием
  const loadImage = useCallback(async (imageUrl) => {
    if (!imageUrl) {
      setImageSrc(placeholder)
      setIsLoading(false)
      return
    }

    // Проверяем кэш
    if (enableCache && imageCache.has(imageUrl)) {
      const cachedResult = imageCache.get(imageUrl)
      setImageSrc(cachedResult.success ? imageUrl : placeholder)
      setIsLoading(false)
      setHasError(!cachedResult.success)
      return
    }

    setIsLoading(true)
    setHasError(false)

    try {
      await new Promise((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => {
          if (enableCache) {
            imageCache.set(imageUrl, { success: true })
          }
          resolve()
        }
        
        img.onerror = () => {
          if (enableCache) {
            imageCache.set(imageUrl, { success: false })
          }
          reject(new Error('Failed to load image'))
        }
        
        img.src = imageUrl
      })

      setImageSrc(imageUrl)
      setHasError(false)
    } catch {
      setImageSrc(placeholder)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [placeholder, enableCache])

  // Intersection Observer для ленивой загрузки
  useEffect(() => {
    if (!enableIntersectionObserver || !imgRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin,
        threshold: 0.1
      }
    )

    observer.observe(imgRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enableIntersectionObserver, rootMargin])

  // Загрузка изображения
  useEffect(() => {
    if (shouldLoad && src) {
      loadImage(src)
    }
  }, [src, shouldLoad, loadImage])

  return {
    imageSrc,
    isLoading,
    hasError,
    imgRef: enableIntersectionObserver ? imgRef : null
  }
}
