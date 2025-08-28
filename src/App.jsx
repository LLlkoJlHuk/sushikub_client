import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import AppRouter from './components/AppRouter/AppRouter'
import Cookie from './components/Modals/Cookie'
import WeAreClosed from './components/Modals/WeAreClosed'
import { useClosedHoursPopup } from './hooks/useClosedHoursPopup'
import { useCookieConsent } from './hooks/useCookieConsent'
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
  const { isOpen: isCookieOpen, onClose: closeCookie } = useCookieConsent()

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

  useEffect(() => {
    if (isCookieOpen) {
      document.body.classList.add('modal-open-cookie')
    } else {
      document.body.classList.remove('modal-open-cookie')
    }
    
    return () => {
      document.body.classList.remove('modal-open-cookie')
    }
  }, [isCookieOpen])

  return (
    <>
      <WeAreClosed className='we-are-closed' isOpen={isClosedPopupOpen} onClose={closeClosedPopup} />
      <Cookie className='cookie' isOpen={isCookieOpen} onClose={closeCookie} />
      <AppRouter />
    </>
  )
})

export default App

