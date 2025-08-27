import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import ArrowIcon from '../../assets/images/icon-arrow.webp'
import { Context } from '../../main'
import styles from './index.module.scss'

const DeliveryTimePicker = observer(({ 
  onSelect, 
  className = '',
  onClose,
  isVisible = true
}) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoursInput, setHoursInput] = useState('')
  const [minutesInput, setMinutesInput] = useState('')
  const [timeError, setTimeError] = useState('')
  const [timeInfo, setTimeInfo] = useState('')
  const [timeWarning, setTimeWarning] = useState('')
  const [isWorkingHoursError, setIsWorkingHoursError] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const hoursInputRef = useRef(null)
  const minutesInputRef = useRef(null)
  const pickerRef = useRef(null)

  const { settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		workingTimeStart: '',
		workingTimeEnd: '',
		minDeliveryDelay: null,
		maxDeliveryDays: null
	})

	useEffect(() => {
		const workingTimeStart = settings.getSettingValue('WORKING_TIME_START', '')
		const workingTimeEnd = settings.getSettingValue('WORKING_TIME_END', '')
		const minDeliveryDelay = settings.getSettingValue('MIN_DELIVERY_DELAY_MINUTES', '')
		const maxDeliveryDays = settings.getSettingValue('MAX_DELIVERY_DAYS', '')
		
		setSettingsData({ 
			workingTimeStart: workingTimeStart, 
			workingTimeEnd: workingTimeEnd, 
			minDeliveryDelay: minDeliveryDelay,
			maxDeliveryDays: maxDeliveryDays
		})
	}, [settings, settings.settingsObject])

	const { workingTimeStart, workingTimeEnd, minDeliveryDelay, maxDeliveryDays } = settingsData
  
	

  // Парсим рабочие часы из настроек
  const workingHours = useMemo(() => {
    if (!workingTimeStart || !workingTimeEnd) {
      return { start: 0, end: 23 } // Значения по умолчанию
    }
    
    const startHour = parseInt(workingTimeStart.split(':')[0])
    const endHour = parseInt(workingTimeEnd.split(':')[0])
    
    if (isNaN(startHour) || isNaN(endHour)) {
      return { start: 0, end: 23 } // Значения по умолчанию
    }
    
    return { start: startHour, end: endHour }
  }, [workingTimeStart, workingTimeEnd])
  

  // Генерируем календарь для текущего месяца
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1)
    // Последний день месяца
    const lastDay = new Date(year, month + 1, 0)
    
    // День недели первого дня (0 = воскресенье, 1 = понедельник, и т.д.)
    const firstDayOfWeek = firstDay.getDay()
    // Преобразуем в понедельник = 0, воскресенье = 6
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    const days = []
    
    // Добавляем пустые ячейки для выравнивания
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null)
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push(date)
    }
    
    return days
  }, [currentMonth])

  // Проверяем, можно ли заказать на сегодня
  const canOrderToday = useCallback(() => {
    const now = new Date()
    const earliestTime = new Date(now.getTime() + minDeliveryDelay * 60000)
    
    // Проверяем, не поздно ли уже для заказа на сегодня
    // Если самое раннее время доставки выходит за рамки рабочего дня, то сегодня заказать нельзя
    const earliestHour = earliestTime.getHours()
    

    
    // Если самое раннее время доставки после закрытия магазина, то сегодня заказать нельзя
    if (earliestHour > workingHours.end) {
      return false
    }
    
    // Дополнительная проверка: если самое раннее время доставки на следующий день, то сегодня заказать нельзя
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const earliestDate = new Date(earliestTime.getFullYear(), earliestTime.getMonth(), earliestTime.getDate())
    
    if (earliestDate.getTime() > today.getTime()) {
      return false
    }
    
    return true
  }, [minDeliveryDelay, workingHours.end])

  // Проверяем, доступна ли дата для выбора
  const isDateAvailable = (date) => {
    if (!date) return false
    
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    // Дата должна быть сегодня или в будущем
    if (selectedDay < today) return false
    
    // Если выбранная дата - сегодня, проверяем, можно ли заказать на сегодня
    if (selectedDay.getTime() === today.getTime()) {
      return canOrderToday()
    }
    
    // Проверяем, что дата в пределах maxDays
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + maxDeliveryDays - 1)
    
    return selectedDay <= maxDate
  }



  // Проверяем, закрыт ли магазин
  const isStoreClosed = useCallback((timeString) => {
    if (!timeString) return false
    
    const [hours, minutes] = timeString.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes)) return false

    // Проверяем, что время находится в рабочих часах
    // Включаем время до конца рабочего дня включительно
    return hours < workingHours.start || hours > workingHours.end
  }, [workingHours.start, workingHours.end])

  // Форматируем дату для отображения
  const formatDate = (date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    return date.getDate().toString()
  }

  // Форматируем месяц и год для заголовка календаря
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    }).toLowerCase()
  }

  // Обработчик выбора даты в календаре
  const handleDateSelect = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date)
    }
  }

  // Обработчик переключения месяца
  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Обработчик изменения часов
  const handleHoursChange = (value) => {
    // Удаляем все символы кроме цифр
    const numbers = value.replace(/\D/g, '')
    
    // Если поле пустое, оставляем пустым
    if (numbers === '') {
      setHoursInput('')
      setTimeError('')
      setTimeWarning('')
      setIsWorkingHoursError(false)
      return
    }
    
    // Ограничиваем до 2 цифр и максимум 23
    let hours = parseInt(numbers) || 0
    if (hours > 23) hours = 23
    
    // Устанавливаем значение как есть (сохраняем ведущие нули)
    setHoursInput(numbers)
    
    // Если введено 2 цифры, автоматически переключаемся на минуты
    if (numbers.length === 2) {
      minutesInputRef.current?.focus()
    }
    
    validateTime()
  }

  // Обработчик изменения минут
  const handleMinutesChange = (value) => {
    // Удаляем все символы кроме цифр
    const numbers = value.replace(/\D/g, '')
    
    // Если поле пустое, оставляем пустым
    if (numbers === '') {
      setMinutesInput('')
      setTimeError('')
      setTimeWarning('')
      setIsWorkingHoursError(false)
      return
    }
    
    // Ограничиваем до 2 цифр и максимум 59
    let minutes = parseInt(numbers) || 0
    if (minutes > 59) minutes = 59
    
    // Устанавливаем значение как есть (сохраняем ведущие нули)
    setMinutesInput(numbers)
    validateTime()
  }



  // Обработчик клавиш для часов
  const handleHoursKeyDown = (e) => {
    // Разрешаем только цифры, Backspace, Delete, Tab, Escape, Enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    const isNumber = /^[0-9]$/.test(e.key)
    const isAllowedKey = allowedKeys.includes(e.key)
    
    if (!isNumber && !isAllowedKey) {
      e.preventDefault()
    }
    
    // При нажатии Enter, переключаемся на минуты или подтверждаем
    if (e.key === 'Enter') {
      e.preventDefault()
      if (hoursInput && minutesInput) {
        handleConfirm()
      } else {
        minutesInputRef.current?.focus()
      }
    }
  }

  // Обработчик клавиш для минут
  const handleMinutesKeyDown = (e) => {
    // Разрешаем только цифры, Backspace, Delete, Tab, Escape, Enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    const isNumber = /^[0-9]$/.test(e.key)
    const isAllowedKey = allowedKeys.includes(e.key)
    
    if (!isNumber && !isAllowedKey) {
      e.preventDefault()
    }
    
    // При нажатии Backspace на пустом поле, переключаемся на часы
    if (e.key === 'Backspace' && minutesInput === '') {
      e.preventDefault()
      hoursInputRef.current?.focus()
    }
    
    // При нажатии Enter, подтверждаем выбор
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    }
  }

    // Валидация времени
  const validateTime = useCallback(() => {
    // Проверяем, что оба поля заполнены
    if (!hoursInput || !minutesInput) {
      setTimeError('') // Сбрасываем ошибку только если поля не заполнены
      setTimeWarning('')
      setIsWorkingHoursError(false)
      return
    }

    // Ждем полного ввода: оба поля должны содержать по 2 цифры
    if (hoursInput.length < 2 || minutesInput.length < 2) {
      setTimeWarning('')
      // Не показываем ошибок, пока пользователь допечатывает
      return
    }
    
    // Если дата не выбрана, не валидируем время
    if (!selectedDate) return
    
    // Создаем отформатированную строку времени для валидации
    const formattedHours = hoursInput.padStart(2, '0')
    const formattedMinutes = minutesInput.padStart(2, '0')
    const timeString = `${formattedHours}:${formattedMinutes}`
    
    // Валидация формата времени
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      setTimeError('Введите корректное время')
      setTimeWarning('')
      setIsWorkingHoursError(false)
      return
    }
    
    // Дополнительная проверка на корректность часов и минут
    const hours = parseInt(hoursInput)
    const minutes = parseInt(minutesInput)
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setTimeError('Введите корректное время')
      setTimeWarning('')
      setIsWorkingHoursError(false)
      return
    }
    
    // Проверяем, закрыт ли наш сервис
    if (isStoreClosed(timeString)) {
      setTimeError('')
      setTimeWarning('')
      setIsWorkingHoursError(true)
      return
    }
    
    // Проверяем доступность времени для выбранной даты
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    const isToday = selectedDay.getTime() === today.getTime()
    
         if (isToday) {
       // Если сегодня, проверяем минимальную задержку
       const earliestTime = new Date(now.getTime() + minDeliveryDelay * 60000)
       const selectedTime = new Date(today)
       selectedTime.setHours(hours, minutes, 0, 0)
       
       // Проверяем, не переходит ли earliestTime на следующий день
       const earliestDate = new Date(earliestTime.getFullYear(), earliestTime.getMonth(), earliestTime.getDate())
       
       // Если earliestTime переходит на следующий день, то сегодня заказ недоступен
       if (earliestDate.getTime() > today.getTime()) {
         setTimeError('Сегодня заказ недоступен - слишком поздно для доставки')
         setTimeWarning('')
         setIsWorkingHoursError(false)
         return
       }
       
       // Округляем earliestTime вниз до минут (убираем секунды)
       const earliestTimeRounded = new Date(earliestTime)
       earliestTimeRounded.setSeconds(0, 0)
       
       // Проверяем самое раннее доступное время с учетом рабочих часов
       let actualEarliestTime = earliestTimeRounded
       const earliestHour = earliestTimeRounded.getHours()
       
       if (earliestHour < workingHours.start) {
         // Если раньше начала работы, устанавливаем время открытия
         actualEarliestTime = new Date(today)
         actualEarliestTime.setHours(workingHours.start, 0, 0, 0)
       } else if (earliestHour > workingHours.end) {
         // Если позже закрытия, заказ на сегодня недоступен
         setTimeError('Сегодня заказ недоступен - слишком поздно для доставки')
         setTimeWarning('')
         setIsWorkingHoursError(false)
         return
       }
       
       if (selectedTime < actualEarliestTime) {
         const earliestTimeString = `${actualEarliestTime.getHours().toString().padStart(2, '0')}:${actualEarliestTime.getMinutes().toString().padStart(2, '0')}`
         setTimeError(`Самое раннее доступное время: ${earliestTimeString}`)
         setTimeWarning('')
         setIsWorkingHoursError(false)
         return
       }
       // Предупреждение: если выбранное время ближе, чем на 90 минут от текущего
       const ninetyMinutesMs = 90 * 60 * 1000
       if (selectedTime.getTime() - now.getTime() < ninetyMinutesMs) {
         setTimeWarning('В зависимости от загрузки время может измениться, актуальную информацию уточняйте у оператора')
       } else {
         setTimeWarning('')
       }
                  } else {
      // Для других дней проверяем только рабочие часы
      if (hours < workingHours.start || hours > workingHours.end) {
        setTimeError('')
        setTimeWarning('')
        setIsWorkingHoursError(true)
        return
      }
      setTimeWarning('')
    }
    
    // Если все проверки пройдены, очищаем ошибку
    setTimeError('')
    setIsWorkingHoursError(false)
  }, [hoursInput, minutesInput, selectedDate, workingHours.start, workingHours.end, minDeliveryDelay, isStoreClosed])

  // Обработчик подтверждения выбора
  const handleConfirm = () => {
    if (!selectedDate) {
      setTimeError('Выберите дату доставки')
      setTimeWarning('')
      return
    }
    
    if (!hoursInput || !minutesInput) {
      setTimeError('Введите время доставки')
      setTimeWarning('')
      return
    }

    // Проверяем, что поля заполнены полностью (2 цифры)
    if (hoursInput.length < 2 || minutesInput.length < 2) {
      setTimeError('Введите время в формате ЧЧ:ММ')
      setTimeWarning('')
      return
    }
    
    // Парсим время
    const hours = parseInt(hoursInput)
    const minutes = parseInt(minutesInput)
    
    // Проверяем корректность значений
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setTimeError('Введите корректное время')
      setTimeWarning('')
      return
    }
    
    // Проверяем рабочие часы
    if (hours < workingHours.start || hours > workingHours.end) {
      setTimeError('')
      setTimeWarning('')
      setIsWorkingHoursError(true)
      return
    }
    
    const formattedHours = hoursInput.padStart(2, '0')
    const formattedMinutes = minutesInput.padStart(2, '0')
    const timeString = `${formattedHours}:${formattedMinutes}`
    
    // Дополнительная проверка для сегодняшней даты
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    const isToday = selectedDay.getTime() === today.getTime()
    
    if (isToday) {
      const earliestTime = new Date(now.getTime() + minDeliveryDelay * 60000)
      const selectedTime = new Date(today)
      selectedTime.setHours(hours, minutes, 0, 0)
      
      // Проверяем минимальное время с учетом рабочих часов
      let actualEarliestTime = earliestTime
      const earliestHour = earliestTime.getHours()
      
      if (earliestHour < workingHours.start) {
        actualEarliestTime = new Date(today)
        actualEarliestTime.setHours(workingHours.start, 0, 0, 0)
      } else if (earliestHour > workingHours.end) {
        setTimeError('Сегодня заказ недоступен - слишком поздно для доставки')
        setTimeWarning('')
        return
      }
      
      if (selectedTime < actualEarliestTime) {
        const earliestTimeString = `${actualEarliestTime.getHours().toString().padStart(2, '0')}:${actualEarliestTime.getMinutes().toString().padStart(2, '0')}`
        setTimeError(`Самое раннее доступное время: ${earliestTimeString}`)
        setTimeWarning('')
        return
      }
    }
    
    if (timeError || isWorkingHoursError) {
      setTimeWarning('')
      return
    }
    
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(hours, minutes, 0, 0)
    
    onSelect({
      date: selectedDateTime.toISOString().split('T')[0], // YYYY-MM-DD
      time: timeString, // HH:MM
      datetime: selectedDateTime
    })
    
    // Закрываем модальное окно после выбора
    onClose()
  }

  // Устанавливаем текущий месяц при монтировании компонента
  useEffect(() => {
    setCurrentMonth(new Date())
  }, [])

  // Валидируем время при изменении выбранной даты
  useEffect(() => {
    if (selectedDate) {
      if (hoursInput && minutesInput) {
        validateTime()
        setTimeInfo('') // Очищаем информационное сообщение при вводе времени
      } else {
        // Если время не введено, показываем только информационное сообщение (не ошибку)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        const isToday = selectedDay.getTime() === today.getTime()
        
        setTimeError('') // Очищаем ошибку времени
        setIsWorkingHoursError(false) // Очищаем ошибку рабочих часов
        
        if (isToday) {
          // Если выбрана сегодняшняя дата, показываем информацию о доступности
          if (!canOrderToday()) {
            setTimeInfo('Сегодня заказ недоступен - мы закрыты')
                    } else {
            // Показываем самое раннее время доставки для сегодня
            const earliestTime = new Date(now.getTime() + minDeliveryDelay * 60000)
            // Округляем вниз до минут для отображения
            const earliestTimeRounded = new Date(earliestTime)
            earliestTimeRounded.setSeconds(0, 0)
            
            // Проверяем, что время находится в рабочих часах
            const earliestHour = earliestTimeRounded.getHours()
            if (earliestHour < workingHours.start) {
              // Если раньше начала работы, показываем время открытия
              const workingStartTime = `${workingHours.start.toString().padStart(2, '0')}:00`
              setTimeInfo(`Самое раннее доступное время: ${workingStartTime}`)
            } else if (earliestHour > workingHours.end) {
              // Если позже закрытия, заказ на сегодня недоступен
              setTimeInfo('Сегодня заказ недоступен - слишком поздно для доставки')
            } else {
              // Время в рабочих часах
              const earliestTimeString = `${earliestTimeRounded.getHours().toString().padStart(2, '0')}:${earliestTimeRounded.getMinutes().toString().padStart(2, '0')}`
              setTimeInfo(`Самое раннее доступное время: ${earliestTimeString}`)
            }
          }
        } else {
          // Если выбрана НЕ сегодняшняя дата, очищаем информационное сообщение
          setTimeInfo('')
        }
      }
    } else {
      // Если дата не выбрана, очищаем ошибку времени и информационное сообщение
      setTimeError('')
      setTimeInfo('')
      setTimeWarning('')
      setIsWorkingHoursError(false)
    }
  }, [selectedDate, hoursInput, minutesInput, canOrderToday, minDeliveryDelay, validateTime, workingHours.start, workingHours.end])





  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames='picker'
      unmountOnExit
      appear
      nodeRef={pickerRef}
    >
      <div ref={pickerRef} className={`${styles.deliveryTimePicker} ${className}`}>
        <div className={styles.calendarHeader}>
        <button 
          className={styles.monthButton}
          onClick={() => handleMonthChange('prev')}
        >
          <img src={ArrowIcon} alt="Arrow" />
        </button>
        <div className={styles.monthTitle}>
          {formatMonthYear(currentMonth)}
        </div>
        <button 
          className={styles.monthButton}
          onClick={() => handleMonthChange('next')}
        >
          <img src={ArrowIcon} alt="Arrow" />
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {/* Дни недели */}
        <div className={styles.weekDays}>
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>

        {/* Дни месяца */}
        <div className={styles.daysGrid}>
          {calendarDays.map((date, index) => (
            <div
              key={index}
              className={`${styles.dayCell} ${
                date && isDateAvailable(date) ? styles.available : ''
              } ${
                date && selectedDate && date.toDateString() === selectedDate.toDateString() 
                  ? styles.selected 
                  : ''
              }`}
              onClick={() => date && handleDateSelect(date)}
            >
              {date ? formatDate(date) : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Поле ввода времени */}
      <div className={styles.timeInputSection}>
        <div className={styles.timeInputLabel}>
          Время доставки
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
          <input
                ref={hoursInputRef}
                type="text"
                className={`${styles.timeInput} ${timeError ? styles.error : ''}`}
                placeholder="ЧЧ"
                value={hoursInput}
                onChange={(e) => handleHoursChange(e.target.value)}
                onKeyDown={handleHoursKeyDown}
                maxLength={2}
                inputMode="numeric"
                style={{ width: '35px', height: '30px', textAlign: 'center' }}
              />
          <span style={{ color: 'white', fontSize: '16px' }}>:</span>
          <input
                ref={minutesInputRef}
                type="text"
                className={`${styles.timeInput} ${timeError ? styles.error : ''}`}
                placeholder="ММ"
                value={minutesInput}
                onChange={(e) => handleMinutesChange(e.target.value)}
                onKeyDown={handleMinutesKeyDown}
                maxLength={2}
                inputMode="numeric"
                style={{ width: '35px', height: '30px', textAlign: 'center' }}
              />
           </div>
                 {timeError && (
           <div className={styles.errorMessage}>
             {timeError}
           </div>
         )}
         {timeInfo && !timeError && (
           <div className={styles.infoMessage}>
             {timeInfo}
           </div>
         )}
         {timeWarning && !timeError && !isWorkingHoursError && (
          <div className={styles.infoMessage}>
            {timeWarning}
          </div>
        )}
        <div className={`${styles.timeInfo} ${isWorkingHoursError ? styles.error : ''}`}>
          Мы работаем с {workingTimeStart} до {workingTimeEnd}
        </div>
        {selectedDate && !canOrderToday() && (() => {
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
          const isToday = selectedDay.getTime() === today.getTime()
          
          return isToday ? (
            <div className={styles.timeInfo} style={{ color: '#ff6b6b', marginTop: '4px' }}>
              Сегодня заказ недоступен - слишком поздно для доставки
            </div>
          ) : null
        })()}
      </div>

      {/* Кнопка подтверждения */}
      <div className={styles.confirmSection}>
        <button 
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={
            !selectedDate || 
            !hoursInput || 
            !minutesInput || 
            hoursInput.length < 2 || 
            minutesInput.length < 2 || 
            !!timeError || 
            isWorkingHoursError
          }
        >
          Подтвердить
        </button>
      </div>
      </div>
    </CSSTransition>
  )
})  

export default DeliveryTimePicker 