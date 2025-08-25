import React, { useEffect, useState } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    // Измеряем время загрузки страницы
    const measurePerformance = () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const navigationStart = timing.navigationStart
        
        const metrics = {
          // Время до первого байта
          ttfb: timing.responseStart - navigationStart,
          // Время до DOMContentLoaded
          domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
          // Время до полной загрузки
          loadComplete: timing.loadEventEnd - navigationStart,
          // Время до первого рендера
          firstPaint: 0,
          // Время до первого значимого рендера
          firstContentfulPaint: 0
        }

        // Получаем метрики Web Vitals если доступны
        if (window.performance.getEntriesByType) {
          const paintEntries = window.performance.getEntriesByType('paint')
          paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime
            }
            if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime
            }
          })
        }

        setMetrics(metrics)
      }
    }

    // Ждем полной загрузки страницы
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [])

  // Показываем метрики только в режиме разработки
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Performance Metrics</div>
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key}>
          {key}: {value > 0 ? `${Math.round(value)}ms` : 'N/A'}
        </div>
      ))}
    </div>
  )
}

export default PerformanceMonitor
