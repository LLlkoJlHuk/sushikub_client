import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import { Context } from './main'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  // Оптимизированная инициализация данных
  const initData = useCallback(async () => {
    try {
      // Приоритизируем загрузку продуктов, так как они нужны для FCP
      await products.initializeData()
      
      // Загружаем баннеры в фоне (не критично для FCP)
      banners.fetchBanners().catch(console.error)
    } catch (error) {
      console.error(error)
    }
  }, [products, banners])

  useEffect(() => {
    if (!products.initialized) {
      // Используем requestIdleCallback для неблокирующей загрузки
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initData(), { timeout: 1000 })
      } else {
        // Fallback для старых браузеров
        setTimeout(initData, 0)
      }
    }
  }, [products.initialized, initData])

  return <AppRouter />
})

export default App

