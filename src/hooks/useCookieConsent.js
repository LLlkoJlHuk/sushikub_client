import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cookieConsent'
const CONSENT_EXPIRY_MONTHS = 12

// Проверка истечения согласия (12 месяцев)
const isConsentExpired = (timestamp) => {
  if (!timestamp) return true
  const now = Date.now()
  const expiryTime = timestamp + (CONSENT_EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000) // 12 месяцев в миллисекундах
  return now > expiryTime
}

// Получение сохраненного согласия
const getSavedConsent = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const consent = JSON.parse(saved)
    
    // Проверяем срок действия
    if (!consent.timestamp || isConsentExpired(consent.timestamp)) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    
    return consent
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

// Сохранение согласия
const saveConsent = () => {
  try {
    const consentData = {
      accepted: true,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData))
    return true
  } catch {
    return false
  }
}

export const useCookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Инициализация при загрузке
  useEffect(() => {
    const savedConsent = getSavedConsent()
    
    if (savedConsent) {
      // Согласие найдено и не истекло
      setIsOpen(false)
    } else {
      // Согласия нет или оно истекло - показываем баннер
      setIsOpen(true)
    }
  }, [])

  // Закрытие баннера и сохранение согласия
  const onClose = useCallback(() => {
    if (saveConsent()) {
      setIsOpen(false)
    }
  }, [])

  return {
    isOpen,
    onClose
  }
}

export default useCookieConsent