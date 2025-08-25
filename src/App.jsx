import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import { Context } from './main'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  useEffect(() => {
    if (!products.initialized) {
      const initData = async () => {
        try {
          // Приоритизируем загрузку продуктов, так как они нужны для FCP
          await products.initializeData()
          
          // Загружаем баннеры в фоне (не критично для FCP)
          banners.fetchBanners().catch(console.error)
        } catch (error) {
          console.error(error)
        }
      }
      
      // Используем requestIdleCallback для неблокирующей загрузки
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initData(), { timeout: 1000 })
      } else {
        // Fallback для старых браузеров
        setTimeout(initData, 0)
      }
    }
  }, [])

  return <AppRouter />
})

export default App

