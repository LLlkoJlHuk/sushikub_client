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
          await Promise.all([
            products.initializeData(),
            banners.fetchBanners()
          ])
        } catch (error) {
          console.error(error)
        }
      }
      initData()
    }
  }, [])

  return <AppRouter />
})

export default App

