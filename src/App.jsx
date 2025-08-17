import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import { Context } from './main'

const App = observer(() => {
  const { products, banners } = useContext(Context)

  useEffect(() => {
    // Инициализируем данные при загрузке приложения
    const initData = async () => {
      try {
        await Promise.all([
          products.initializeData(),
          banners.fetchBanners()
          // Настройки уже загружены в main.jsx при создании store
        ])
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }
    
    initData()
  }, [products, banners])

  return <AppRouter />
})

export default App

