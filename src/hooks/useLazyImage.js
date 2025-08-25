import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Хук для lazy loading изображений с заглушкой и Intersection Observer
 * @param {string} src - URL изображения для загрузки
 * @param {string} placeholder - URL заглушки
 * @returns {Object} - объект с состояниями загрузки
 */
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Функция загрузки изображения
  const loadImage = useCallback(() => {
    if (!src || !isInView) return

    setIsLoading(true)
    setHasError(false)

    const img = new Image()
    
    const handleLoad = () => {
      setImageSrc(src)
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = () => {
      setImageSrc(placeholder)
      setIsLoading(false)
      setHasError(true)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    
    img.src = src

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, placeholder, isInView])

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!imgRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin: '50px', // Начинаем загрузку за 50px до появления
        threshold: 0.1
      }
    )

    observerRef.current.observe(imgRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  // Загружаем изображение когда оно в поле зрения
  useEffect(() => {
    if (isInView) {
      loadImage()
    }
  }, [isInView, loadImage])

  // Fallback для случаев без Intersection Observer
  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder)
      setIsLoading(false)
      return
    }

    // Если Intersection Observer не поддерживается, загружаем сразу
    if (!('IntersectionObserver' in window)) {
      loadImage()
    }
  }, [src, placeholder, loadImage])

  return {
    imageSrc,
    isLoading,
    hasError,
    imgRef // Возвращаем ref для привязки к DOM элементу
  }
}
