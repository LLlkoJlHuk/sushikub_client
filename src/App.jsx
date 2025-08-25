import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import { Context } from './main'
import { useDataLoader } from './hooks/useDataLoader'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  // Используем оптимизированный загрузчик данных
  const { isLoading, error, progress } = useDataLoader(
    // Критические данные - только категории для первого рендера
    () => products.fetchCategories(),
    // Фоновые данные - остальные данные загружаются после критических
    [
      () => products.fetchTypes(),
      () => products.fetchProducts(),
      () => banners.fetchBanners()
    ],
    {
      onCriticalComplete: () => {
        products._initialized = true
      },
      onBackgroundComplete: () => {
        console.log('All data loaded successfully')
      }
    }
  )

  // Показываем индикатор загрузки только для критических данных
  if (isLoading) {
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
        {progress > 0 && (
          <div style={{ 
            width: '200px', 
            height: '4px', 
            backgroundColor: '#eee',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
      </div>
    )
  }

  // Показываем ошибку если критическая загрузка не удалась
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Ошибка загрузки данных: {error.message}</div>
        <button onClick={() => window.location.reload()}>
          Перезагрузить страницу
        </button>
      </div>
    )
  }

  return <AppRouter />
})

export default App

