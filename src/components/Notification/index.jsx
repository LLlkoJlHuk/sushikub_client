import React, { useEffect } from 'react'
import styles from './index.module.scss'

const Notification = ({ 
  message, 
  type = 'success', // 'success' или 'error'
  isVisible, 
  onClose, 
  autoClose = false,
  duration = 2000 
}) => {
  useEffect(() => {
    let timer = null
    
    if (autoClose && isVisible) {
      timer = setTimeout(() => {
        onClose()
      }, duration)
    }
    
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isVisible, autoClose, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`${styles.notification} ${styles[`notification--${type}`]}`}>
      <div className={styles.notification__content}>
        <span className={styles.notification__message}>{message}</span>
        {!autoClose && (
          <button 
            className={styles.notification__close}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default Notification 