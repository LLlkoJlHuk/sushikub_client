import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import WeAreClosed from './components/Modals/WeAreClosed'
import { useClosedHoursPopup } from './hooks/useClosedHoursPopup'
import { Context } from './main'

const App = observer(() => {
  const { products, banners, settings } = useContext(Context)
  const workingTimeStart = settings.getSettingValue('WORKING_TIME_START', '10:00')
  const workingTimeEnd = settings.getSettingValue('WORKING_TIME_END', '22:30')
  const { isOpen: isClosedPopupOpen, onClose: closeClosedPopup } = useClosedHoursPopup({
    workingTimeStart,
    workingTimeEnd,
    gmtOffsetHours: 7
  })

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

  return (
    <>
      <WeAreClosed className='we-are-closed' isOpen={isClosedPopupOpen} onClose={closeClosedPopup} />
      <AppRouter />
    </>
  )
})

export default App

