import { useEffect, useState } from 'react'

/**
 * Хук для управления состоянием DeliveryTimePicker
 * @returns {Object} Объект с состоянием и методами для управления пикером
 */
export const useDeliveryTimePicker = () => {
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null)
  const [showDeliveryTimePicker, setShowDeliveryTimePicker] = useState(false)
  const [pickerPosition, setPickerPosition] = useState(null)

  // Функция для определения позиции DeliveryTimePicker
  const calculatePickerPosition = () => {
    try {
      const container = document.querySelector('.delivery-time-container')
      if (!container) {
        return
      }
      
      const containerRect = container.getBoundingClientRect()
      if (containerRect.width === 0 || containerRect.height === 0) {
        return
      }
      
      const pickerWidth = 250 // Ширина пикера
      const pickerHeight = 700 // Примерная высота пикера
      const margin = 16 // Отступ от контейнера
      
      const spaceBelow = window.innerHeight - containerRect.bottom
      const spaceRight = window.innerWidth - containerRect.right
      
      // На мобильных устройствах (ширина экрана <= 768px) не используем позиционирование справа
      const isMobile = window.innerWidth <= 768
      
      // Проверяем, можно ли разместить справа (только на десктопе)
      if (!isMobile && spaceRight >= pickerWidth + margin) {
        setPickerPosition('right')
      } else if (spaceBelow < pickerHeight) {
        // Если места снизу мало, показываем сверху
        setPickerPosition('top')
      } else {
        // Иначе показываем снизу
        setPickerPosition('bottom')
      }
    } catch {
      setPickerPosition('bottom')
    }
  }

  // Обработчик для показа DeliveryTimePicker при клике на выбранное время
  const handleShowPicker = () => {
    calculatePickerPosition()
    setShowDeliveryTimePicker(true)
  }

  // Обработчик клика вне пикера
  const handleOutsideClick = (e) => {
    const picker = e.target.closest('.delivery-time-picker')
    const container = e.target.closest('.delivery-time-container')
    
    // Если клик был вне пикера и вне контейнера, закрываем пикер
    if (!picker && !container) {
      setShowDeliveryTimePicker(false)
      setSelectedDeliveryTime(null)
      setPickerPosition(null)
      return true // Возвращаем true, чтобы показать, что нужно переключить Switch
    }
    return false
  }

  // Обработчик выбора времени доставки
  const handleDeliveryTimeSelect = (timeData) => {
    // Форматируем дату из YYYY-MM-DD в DD.MM.YYYY
    const dateParts = timeData.date.split('-')
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
    
    setSelectedDeliveryTime({
      ...timeData,
      date: formattedDate
    })
    setShowDeliveryTimePicker(false)
  }

  // Сброс состояния пикера
  const resetPicker = () => {
    setSelectedDeliveryTime(null)
    setShowDeliveryTimePicker(false)
    setPickerPosition(null)
  }

  // Обновляем позицию DeliveryTimePicker при скролле и изменении размера окна
  useEffect(() => {
    if (showDeliveryTimePicker) {
      const handleScroll = () => calculatePickerPosition()
      const handleResize = () => calculatePickerPosition()
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setShowDeliveryTimePicker(false)
          setSelectedDeliveryTime(null)
          setPickerPosition(null)
          return true
        }
        return false
      }
      
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleResize)
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showDeliveryTimePicker])

  return {
    selectedDeliveryTime,
    showDeliveryTimePicker,
    pickerPosition,
    calculatePickerPosition,
    handleShowPicker,
    handleDeliveryTimeSelect: handleDeliveryTimeSelect,
    handleOutsideClick,
    resetPicker,
    setShowDeliveryTimePicker
  }
} 