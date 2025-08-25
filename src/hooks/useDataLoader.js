import { useEffect, useState, useCallback } from 'react'

/**
 * Хук для оптимизированной загрузки данных с приоритизацией
 * @param {Function} criticalLoader - Функция загрузки критических данных
 * @param {Function[]} backgroundLoaders - Массив функций для фоновой загрузки
 * @param {Object} options - Опции загрузки
 * @returns {Object} - Состояние загрузки
 */
export const useDataLoader = (criticalLoader, backgroundLoaders = [], options = {}) => {
  const [isCriticalLoaded, setIsCriticalLoaded] = useState(false)
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const { 
    retryAttempts = 3, 
    retryDelay = 1000,
    onCriticalComplete,
    onBackgroundComplete 
  } = options

  const loadCriticalData = useCallback(async () => {
    try {
      setError(null)
      await criticalLoader()
      setIsCriticalLoaded(true)
      setProgress(50)
      onCriticalComplete?.()
    } catch (err) {
      setError(err)
      throw err
    }
  }, [criticalLoader, onCriticalComplete])

  const loadBackgroundData = useCallback(async () => {
    if (!isCriticalLoaded) return

    try {
      const loaders = backgroundLoaders.map(loader => 
        loader().catch(err => {
          console.warn('Background loader failed:', err)
          return null
        })
      )

      await Promise.allSettled(loaders)
      setIsBackgroundLoaded(true)
      setProgress(100)
      onBackgroundComplete?.()
    } catch (err) {
      console.warn('Some background loaders failed:', err)
    }
  }, [backgroundLoaders, isCriticalLoaded, onBackgroundComplete])

  const retry = useCallback(async () => {
    let attempts = 0
    while (attempts < retryAttempts) {
      try {
        await loadCriticalData()
        break
      } catch (err) {
        attempts++
        if (attempts >= retryAttempts) {
          setError(err)
          break
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
  }, [loadCriticalData, retryAttempts, retryDelay])

  useEffect(() => {
    loadCriticalData()
  }, [loadCriticalData])

  useEffect(() => {
    if (isCriticalLoaded) {
      loadBackgroundData()
    }
  }, [isCriticalLoaded, loadBackgroundData])

  return {
    isCriticalLoaded,
    isBackgroundLoaded,
    isLoading: !isCriticalLoaded,
    isFullyLoaded: isCriticalLoaded && isBackgroundLoaded,
    error,
    progress,
    retry
  }
}
