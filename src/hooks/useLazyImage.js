import { useEffect, useState } from 'react'

/**
 * Хук для lazy loading изображений с заглушкой
 * @param {string} src - URL изображения для загрузки
 * @param {string} placeholder - URL заглушки
 * @returns {Object} - объект с состояниями загрузки
 */
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder)
      setIsLoading(false)
      return
    }

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
  }, [src, placeholder])

  return {
    imageSrc,
    isLoading,
    hasError
  }
}
