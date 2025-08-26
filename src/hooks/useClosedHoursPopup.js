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
    const year = d.getUTCFullYear()
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = d.getUTCDate().toString().padStart(2, '0')
    const hours = d.getUTCHours()
    const minutes = d.getUTCMinutes()

    if (!start || !end) return null

    const startMinus = new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate(), start.h, start.m))
    startMinus.setUTCMinutes(startMinus.getUTCMinutes() - 1)

    const inMorning = (
      hours < startMinus.getUTCHours() ||
      (hours === startMinus.getUTCHours() && minutes <= startMinus.getUTCMinutes())
    )
    if (inMorning) {
      return `${year}-${month}-${day}-morning`
    }

    const endPlus = new Date(Date.UTC(year, d.getUTCMonth(), d.getUTCDate(), end.h, end.m))
    endPlus.setUTCMinutes(endPlus.getUTCMinutes() + 1)

    const inEvening = (
      hours > endPlus.getUTCHours() ||
      (hours === endPlus.getUTCHours() && minutes >= endPlus.getUTCMinutes())
    )
    if (inEvening) {
      return `${year}-${month}-${day}-evening`
    }

    return null
  }
}

export const useClosedHoursPopup = ({ workingTimeStart, workingTimeEnd, gmtOffsetHours = 7 }) => {
  const [isOpen, setIsOpen] = useState(false)

  const resolveWindowKey = buildClosedWindowKeyResolver(workingTimeStart, workingTimeEnd, gmtOffsetHours)

  useEffect(() => {
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
  }, [resolveWindowKey])

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
  }, [isOpen, resolveWindowKey])

  return { isOpen, onClose }
}

export default useClosedHoursPopup


