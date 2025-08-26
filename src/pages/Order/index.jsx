import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Notice from '../../components/Notice'
import OrderCart from '../../components/OrderCart'
import OrderForm from '../../components/OrderForm'
import { MAIN_ROUTE } from '../../constants'
import { formatPrice } from '../../hooks/formatPrice'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Context } from '../../main'
import styles from './index.module.scss'


/**
 * Страница оформления заказа
 */
const Order = observer(() => {
	const { basket, settings } = useContext(Context)
  const { width } = useWindowSize()

	const [settingsData, setSettingsData] = useState({
		globalMessage: '',
		minOrderPriceForDelivery: null,
		maxOrderPrice: null
	})

	useEffect(() => {
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		const minOrderPriceForDelivery = settings.getSettingValue('MIN_ORDER_PRICE_FOR_DELIVERY', '')
		const maxOrderPrice = settings.getSettingValue('MAX_ORDER_PRICE', '')

		setSettingsData({ 
			globalMessage: globalMessage,
			minOrderPriceForDelivery: minOrderPriceForDelivery,
			maxOrderPrice: maxOrderPrice
		})
	}, [settings.settingsObject])

	const { globalMessage, minOrderPriceForDelivery, maxOrderPrice } = settingsData

  const [order, setOrder] = useState({
    name: '',
    phone: '',
    typeIsDelivery: true,
    deliveryBranch: null,
    street: '',
    houseNumber: '',
    entrance: '',
    floor: '',
    apartmentNumber: '',
    deliveryNow: true,
    time: '',
    comment: '',
  })

  // Проверка ошибок суммы заказа
  const isOrderTooSmall = order.typeIsDelivery && basket.totalPrice < minOrderPriceForDelivery
  const isOrderTooLarge = basket.totalPrice > maxOrderPrice
  const hasOrderAmountErrors = isOrderTooSmall || isOrderTooLarge

  const handleSwitchChange = () => {
    setOrder(prev => ({
      ...prev,
      typeIsDelivery: !prev.typeIsDelivery
    }))
  }

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '')
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back')
	
	return (
		<div className={`page ${styles['order-page']}`}>
			{/* Секция с хедером */}
			<section className={`section section-with-header custom-bg border-bottom ${isScrolled ? 'header-visible' : ''}`}>
				<Header 
					isScrolled={isScrolled} 
					isTimedOut={isTimedOut} 
					isScrolledBack={isScrolledBack} 
					isTimedOutBack={isTimedOutBack} 
				/>
			</section>

			{basket.items.length > 0 ? (
        <>

          {/* Уведомления */}
          {(globalMessage || isOrderTooSmall || isOrderTooLarge) && (
            <section className={`section ${styles['section-notice']}`}>
              <div className={`${styles['container']} container`}>
                {/* Уведомление о возможности расчета наличными, онлайн на сайте и бонусами */}
                {globalMessage && (
                  <Notice type='info'>
                    {globalMessage}
                  </Notice>
                )}

                {/* Минимальная сумма заказа */}
                {isOrderTooSmall && (
                  <Notice type='error'>
                    Минимальная сумма заказа для доставки <span>{formatPrice(minOrderPriceForDelivery)}&nbsp;₽</span>
                  </Notice>
                )}

                {/* Максимальная сумма заказа */}
                {isOrderTooLarge && (
                  <Notice type='error'>
                    Максимальная сумма заказа <span>{formatPrice(maxOrderPrice)}&nbsp;₽</span>
                  </Notice>
                )}
              </div>
            </section>
          )}

          <section className={`section ${styles['section-order']}`}>
            {/* Оформление заказа */}
            <div className={`${styles['container']} container`}>
              <div className='section__title'>
                Оформление заказа
              </div>

              <div className={styles['order-container']}>
                {/* Форма заказа */}
                <OrderForm 
                  order={order}
                  onOrderChange={setOrder}
                  onSwitchChange={handleSwitchChange}
                  hasOrderAmountErrors={hasOrderAmountErrors}
                />

                {/* Корзина заказа */}
                {width > 1024 && (
                  <OrderCart 
                    basket={basket}
                    order={order}
                  />
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className={`section`}>
          {/* Корзина пуста */}
          <div className='container'>
            <div className={styles['empty-state']}>
              <p>В корзине пока нет товаров, чтобы оформить заказ</p>
            </div>

            <div className={`${styles['order-buttons']} ${styles['order-empty']}`}>
              <Button type='btnLink' href={MAIN_ROUTE} className={styles['order-return']}>
                Вернуться в меню
              </Button>
            </div>
          </div>
        </section>
      )}

			<section className={`section custom-bg border-top`}>
        <div className='container'>
          <Footer />
        </div>
			</section>
		</div>
	)
})

export default Order
