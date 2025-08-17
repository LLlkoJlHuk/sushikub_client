import React, { useContext, useEffect, useState } from 'react'
import { formatPrice } from '../../hooks/formatPrice'
import { Context } from '../../main'
import styles from './index.module.scss'

/**
 * Компонент корзины заказа
 */
const OrderCart = ({ basket, order }) => {
  const { settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		deliveryDiscount: null
	})

	useEffect(() => {
		// Настройки уже загружены в App.jsx при старте приложения
		// Получаем значения напрямую из store
		const deliveryDiscount = settings.getSettingValue('DELIVERY_DISCOUNT', '')
		
		setSettingsData({ 
			deliveryDiscount: deliveryDiscount
		})
	}, [settings.settingsObject]) // Реагируем на изменения в настройках

	const { deliveryDiscount } = settingsData

  return (
    <div className={styles['order-cart']}>
      <div className={styles['order-cart__title']}>
        Ваш заказ
      </div>

      {/* Список товаров в корзине */}
      <div className={styles['order-cart__items']}>
        {basket.items.map(item => (
          <div className={`${styles['order-cart__item']} ${!order.typeIsDelivery ? styles['order-cart__item-delivery'] : ''}`} key={item.id}>
            {/* Название товара */}
            <div className={styles['order-cart__item-name']}>
              {item.name}
            </div>

            {/* Количество товара */}
            <div className={styles['order-cart__item-quantity']}>
              {item.quantity} шт.
            </div>

            {/* Цена товара */}
            <div className={styles['order-cart__item-price']}>
              {order.typeIsDelivery ? (
                <>{formatPrice(item.price * item.quantity)}&nbsp;₽</>
              ) : (
                <>
                  <span className={styles['order-cart__item-price__old']}>
                    {formatPrice(item.price * item.quantity)}&nbsp;₽
                  </span>
                  <span className={styles['order-cart__item-price__new']}>
                    {formatPrice(item.price * item.quantity * (1 - deliveryDiscount / 100), true)}&nbsp;₽
                  </span>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Итоговая стоимость заказа */}
        <div className={styles['order-cart__total']}>
          {/* Итоговая стоимость заказа */}
          <div className={styles['order-cart__total-title']}>
            Итого:
          </div>

          <div className={styles['order-cart__total-price']}>
            {order.typeIsDelivery ? (
              <>{formatPrice(basket.totalPrice)}&nbsp;₽</>
            ) : (
              <>
                <span className={styles['order-cart__item-price__old']}>
                  {formatPrice(basket.totalPrice)}&nbsp;₽
                </span>
                <span className={styles['order-cart__item-price__new']}>
                  {formatPrice(basket.totalPrice * (1 - deliveryDiscount / 100), true)}&nbsp;₽
                </span>
              </>
            )}
          </div>

          {/* Дополнительная скидка за самовывоз */}
          {!order.typeIsDelivery && (
            <div className={styles['order-cart__total-discount']}>
              Дополнительная скидка за самовывоз {deliveryDiscount}%
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCart 