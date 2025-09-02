import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'weAreClosedLastWindowKey'

const getNowInGmtOffset = (offsetHours) => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + offsetHours * 3600000)
}

const parseTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null
  const [hh, mm] = timeStr.split(':').map(Number)
  if (
    Number.isNaN(hh) || Number.isNaN(mm) ||
    hh < 0 || hh > 23 || mm < 0 || mm > 59
  ) return null
  return { h: hh, m: mm }
}

const buildClosedWindowKeyResolver = (startStr, endStr, offsetHours) => {
  const start = parseTime(startStr)
  const end = parseTime(endStr)
  return () => {
    const d = getNowInGmtOffset(offsetHours)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hours = d.getHours()
    const minutes = d.getMinutes()

    if (!start || !end) return null

    // Создаем время в минутах для более простого сравнения
    const currentTimeInMinutes = hours * 60 + minutes
    const startTimeInMinutes = start.h * 60 + start.m
    const endTimeInMinutes = end.h * 60 + end.m

    // Если текущее время до начала работы (включая буфер в 1 минуту)
    if (currentTimeInMinutes < startTimeInMinutes) {
      return `${year}-${month}-${day}-morning`
    }

    // Если текущее время после окончания работы (включая буфер в 1 минуту)
    if (currentTimeInMinutes > endTimeInMinutes) {
      return `${year}-${month}-${day}-evening`
    }

    // Если время в рабочих часах, возвращаем null (окно не показываем)
    return null
  }
}

export const useClosedHoursPopup = ({ workingTimeStart, workingTimeEnd, gmtOffsetHours = 7 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const resolveWindowKey = buildClosedWindowKeyResolver(workingTimeStart, workingTimeEnd, gmtOffsetHours)

  useEffect(() => {
    // Проверяем, что настройки загружены (не дефолтные значения)
    const hasLoadedSettings = workingTimeStart !== '10:00' || workingTimeEnd !== '22:30'
    
    if (!hasLoadedSettings && !isInitialized) {
      // Если настройки еще не загружены, не показываем попап
      return
    }
    
    setIsInitialized(true)
    
    const key = resolveWindowKey()
    if (!key) {
      setIsOpen(false)
      return
    }
    try {
      const lastShownKey = localStorage.getItem(STORAGE_KEY)
      if (lastShownKey === key) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    } catch {
      setIsOpen(true)
    }
  }, [resolveWindowKey, workingTimeStart, workingTimeEnd, isInitialized])

  const onClose = useCallback(() => {
    const key = resolveWindowKey()
    if (key) {
      try {
        localStorage.setItem(STORAGE_KEY, key)
      } catch {
        /* ignore storage errors */
      }
    }
    setIsOpen(false)
  }, [resolveWindowKey])

  useEffect(() => {
    if (!isInitialized) return
    
    const interval = setInterval(() => {
      const key = resolveWindowKey()
      if (!key) {
        if (isOpen) setIsOpen(false)
        return
      }
      try {
        const last = localStorage.getItem(STORAGE_KEY)
        if (last !== key) {
          setIsOpen(true)
        }
      } catch {
        setIsOpen(true)
      }
    }, 15000) 

    return () => clearInterval(interval)
  }, [isOpen, resolveWindowKey, isInitialized])

  return { isOpen, onClose }
}

export default useClosedHoursPopup


