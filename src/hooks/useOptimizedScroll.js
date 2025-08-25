import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Хук для оптимизированного скролла с throttling
 * @param {number} threshold - Порог скролла для срабатывания
 * @param {string} direction - Направление скролла ('up', 'down', '')
 * @returns {Object} - Объект с состояниями скролла
 */
export const useOptimizedScroll = (threshold = 128, direction = '') => {
  const [isScrolled, setIsScrolled] = useState(false)
  const timeoutRef = useRef(null)

  // Throttled функция для обработки скролла
  const handleScroll = useCallback(() => {
    if (timeoutRef.current) return

    timeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY
      let shouldSetScrolled = false

      if (direction === '') {
        // Обычный скролл вниз
        shouldSetScrolled = currentScrollY > threshold
      } else if (direction === 'Back') {
        // Скролл назад вверх
        shouldSetScrolled = currentScrollY < threshold
      }

      setIsScrolled(shouldSetScrolled)
      
      // Сброс таймаута
      timeoutRef.current = null
    }, 16) // ~60fps
  }, [threshold, direction])

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Добавляем слушатель скролла с passive: true для лучшей производительности
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { isScrolled }
}
