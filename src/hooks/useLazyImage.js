import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getImageUrl, getOptimalSize } from '../utils/imageUtils'
import { useWindowSize } from './useWindowSize'

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
    rootMargin = '50px',
    imageType = null // Тип изображения для адаптивной загрузки
  } = options
  
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!enableIntersectionObserver)
  
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  const { width: screenWidth } = useWindowSize()

  // Получаем оптимальный размер изображения для текущего экрана
  const optimalImageUrl = useMemo(() => {
    if (!src || !imageType || !screenWidth) return src
    
    const optimalSize = getOptimalSize(imageType, screenWidth)
    return optimalSize ? getImageUrl(src, optimalSize) : src
  }, [src, imageType, screenWidth])

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
    if (shouldLoad) {
      const imageUrl = optimalImageUrl || src
      if (imageUrl) {
        loadImage(imageUrl)
      }
    }
  }, [shouldLoad, optimalImageUrl, src, loadImage])

  return {
    imageSrc,
    isLoading,
    hasError,
    imgRef: enableIntersectionObserver ? imgRef : null
  }
}
