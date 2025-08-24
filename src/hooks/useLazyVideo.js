import { useEffect, useState } from 'react'

/**
 * Хук для lazy loading видео с заглушкой
 * @param {string} src - URL видео для загрузки
 * @param {string} placeholder - URL заглушки (статичное изображение)
 * @returns {Object} - объект с состояниями загрузки
 */
export const useLazyVideo = (src, placeholder) => {
  const [videoSrc, setVideoSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  useEffect(() => {
    if (!src) {
      setVideoSrc(null)
      setIsLoading(false)
      setShowPlaceholder(true)
      return
    }

    setIsLoading(true)
    setHasError(false)
    setShowPlaceholder(true)

    const video = document.createElement('video')
    video.preload = 'metadata'
    
    const handleLoadedData = () => {
      setVideoSrc(src)
      setIsLoading(false)
      setHasError(false)
      // Небольшая задержка перед скрытием заглушки для плавного перехода
      setTimeout(() => {
        setShowPlaceholder(false)
      }, 100)
    }

    const handleError = () => {
      setVideoSrc(null)
      setIsLoading(false)
      setHasError(true)
      setShowPlaceholder(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    
    video.src = src

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [src])

  return {
    videoSrc,
    placeholderSrc: placeholder,
    isLoading,
    hasError,
    showPlaceholder
  }
}
