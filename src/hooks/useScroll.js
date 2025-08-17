import { useCallback, useEffect, useState } from 'react'

/**
 * Хук для отслеживания скролла страницы
 * @param {number} threshold - количество пикселей, при достижении которого состояние изменится на true
 * @returns {boolean} - состояние скролла (true если скролл больше threshold, false если меньше)
 */
const useScroll = (threshold = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);

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
  }, [threshold]);

  useEffect(() => {
    // Добавляем обработчик события скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Проверяем начальное состояние только один раз
    const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(initialScrollTop > threshold);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, threshold]);

  return isScrolled;
};

export default useScroll; 