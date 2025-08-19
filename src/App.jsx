import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import { Context } from './main'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  useEffect(() => {
    // Загружаем только если еще не инициализировано
    if (!products.initialized) {
      console.log('🏁 App.jsx: Starting data initialization')
      const initStart = performance.now()
      
      const initData = async () => {
        try {
          await Promise.all([
            products.initializeData(),
            banners.fetchBanners()
            // Настройки уже загружены в main.jsx при создании store
          ])
          
          const initEnd = performance.now()
          console.log(`🎉 App.jsx: Initialization completed in ${(initEnd - initStart).toFixed(2)}ms`)
        } catch (error) {
          const initEnd = performance.now()
          console.error(`💥 App.jsx: Initialization failed in ${(initEnd - initStart).toFixed(2)}ms:`, error)
        }
      }
      initData()
    } else {
      console.log('✅ App.jsx: Data already initialized, skipping')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AppRouter />
})

export default App

