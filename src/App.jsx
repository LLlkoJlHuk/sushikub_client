import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import PerformanceMonitor from './components/PerformanceMonitor'
import { Context } from './main'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  useEffect(() => {
    if (!products.initialized) {
      const initData = async () => {
        try {
          // Загружаем критически важные данные первыми
          await products.fetchCategories()
          
          // Устанавливаем флаг инициализации
          products._initialized = true
          
          // Загружаем остальные данные в фоне
          Promise.allSettled([
            products.fetchTypes(),
            products.fetchProducts(),
            banners.fetchBanners()
          ]).catch(console.error)
        } catch (error) {
          console.error('Error initializing data:', error)
        }
      }
      initData()
    }
  }, [products, banners])

  // Показываем индикатор загрузки только если данные не инициализированы
  if (!products.initialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Загрузка...</div>
        <div style={{ 
          width: '200px', 
          height: '4px', 
          backgroundColor: '#eee',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '50%',
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <AppRouter />
      <PerformanceMonitor />
    </>
  )
})

export default App

