import { useCallback, useEffect, useState } from 'react'

/**
 * Хук для отслеживания скролла с таймером
 * @param {number} threshold - количество пикселей, при достижении которого состояние изменится на true
 * @param {number} timeout - время в миллисекундах, через которое установится isTimedOut
 * @param {string} suffix - суффикс для имен переменных (например, 'Back' для isScrolledBack)
 * @returns {object} - объект с состоянием скролла и таймера
 */
const useScrollTimeout = (threshold = 100, timeout = 3000, suffix = '') => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newIsScrolled = scrollTop > threshold;
    
    // Обновляем состояние только если оно действительно изменилось
    setIsScrolled(prev => {
      if (prev !== newIsScrolled) {
        return newIsScrolled;
      }
      return prev;
    });

    // Если скролл больше порога, запускаем таймер
    if (newIsScrolled) {
      // Очищаем предыдущий таймер
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Устанавливаем новый таймер
      const newTimeoutId = setTimeout(() => {
        setIsTimedOut(true);
      }, timeout);
      
      setTimeoutId(newTimeoutId);
    } else {
      // Если скролл меньше порога, очищаем таймер и сбрасываем флаг
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsTimedOut(false);
    }
  }, [threshold, timeout, timeoutId]);

  useEffect(() => {
    // Добавляем обработчик события скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Проверяем начальное состояние только один раз
    const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(initialScrollTop > threshold);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, threshold, timeoutId]);

  const result = {};
  result[`isScrolled${suffix}`] = isScrolled;
  result[`isTimedOut${suffix}`] = isTimedOut;
  
  return result;
};

export default useScrollTimeout; 